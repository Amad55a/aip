create table if not exists public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  usage_date date not null default (timezone('utc', now())::date),
  question_count integer not null default 0 check (question_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, usage_date)
);

create index if not exists ai_usage_user_date_idx
  on public.ai_usage (user_id, usage_date desc);

drop trigger if exists ai_usage_set_updated_at on public.ai_usage;
create trigger ai_usage_set_updated_at
before update on public.ai_usage
for each row execute function public.set_updated_at();

alter table public.ai_usage enable row level security;
drop policy if exists "Users can view their own AI usage" on public.ai_usage;
create policy "Users can view their own AI usage"
on public.ai_usage for select to authenticated
using (user_id = (select auth.uid()));

revoke all on public.ai_usage from anon, authenticated;
grant select on public.ai_usage to authenticated;

create or replace function public.get_ai_usage(p_daily_limit integer)
returns table (usage_date date, question_count integer, daily_limit integer, remaining_count integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  today_utc date := timezone('utc', now())::date;
  used_count integer := 0;
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_daily_limit < 1 or p_daily_limit > 1000 then
    raise exception 'Invalid AI daily limit' using errcode = '22023';
  end if;

  select coalesce((
    select usage.question_count
    from public.ai_usage as usage
    where usage.user_id = current_user_id
      and usage.usage_date = today_utc
  ), 0) into used_count;

  return query
  select today_utc, used_count, p_daily_limit, greatest(p_daily_limit - used_count, 0);
end;
$$;

create or replace function public.reserve_ai_question(p_daily_limit integer)
returns table (usage_date date, question_count integer, daily_limit integer, remaining_count integer, allowed boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  today_utc date := timezone('utc', now())::date;
  used_count integer;
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '28000';
  end if;
  if p_daily_limit < 1 or p_daily_limit > 1000 then
    raise exception 'Invalid AI daily limit' using errcode = '22023';
  end if;

  insert into public.ai_usage as usage (user_id, usage_date, question_count)
  values (current_user_id, today_utc, 1)
  on conflict (user_id, usage_date) do update
    set question_count = usage.question_count + 1,
        updated_at = now()
    where usage.question_count < p_daily_limit
  returning question_count into used_count;

  if used_count is not null then
    return query
    select today_utc, used_count, p_daily_limit, greatest(p_daily_limit - used_count, 0), true;
    return;
  end if;

  select usage.question_count into used_count
  from public.ai_usage as usage
  where usage.user_id = current_user_id
    and usage.usage_date = today_utc;

  return query
  select today_utc, used_count, p_daily_limit, greatest(p_daily_limit - used_count, 0), false;
end;
$$;

revoke all on function public.get_ai_usage(integer) from public, anon;
revoke all on function public.reserve_ai_question(integer) from public, anon;
grant execute on function public.get_ai_usage(integer) to authenticated;
grant execute on function public.reserve_ai_question(integer) to authenticated;

create index if not exists lesson_progress_user_status_lesson_idx
  on public.lesson_progress (user_id, status, lesson_id);
create index if not exists learning_paths_published_idx
  on public.learning_paths (slug) where is_published;
create index if not exists courses_published_path_order_idx
  on public.courses (learning_path_id, order_index) where is_published;
create index if not exists modules_published_course_order_idx
  on public.modules (course_id, order_index) where is_published;
create index if not exists lessons_published_module_order_idx
  on public.lessons (module_id, order_index) where is_published;

create index if not exists learning_paths_search_idx
  on public.learning_paths using gin (
    to_tsvector(
      'simple'::regconfig,
      coalesce(title, '') || ' ' || coalesce(description, '') || ' ' ||
      coalesce(short_description, '') || ' ' || translations::text
    )
  ) where is_published;
create index if not exists courses_search_idx
  on public.courses using gin (
    to_tsvector(
      'simple'::regconfig,
      coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || translations::text
    )
  ) where is_published;
create index if not exists modules_search_idx
  on public.modules using gin (
    to_tsvector(
      'simple'::regconfig,
      coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || translations::text
    )
  ) where is_published;
create index if not exists lessons_search_idx
  on public.lessons using gin (
    to_tsvector(
      'simple'::regconfig,
      coalesce(title, '') || ' ' || coalesce(description, '') || ' ' ||
      content || ' ' || explanation || ' ' || examples::text || ' ' ||
      notes::text || ' ' || practice::text || ' ' || common_mistakes::text || ' ' ||
      quiz_questions::text || ' ' || translations::text
    )
  ) where is_published;

create or replace function public.search_learning_content(p_query text, p_language text)
returns table (
  id text,
  result_type text,
  title text,
  description text,
  href text,
  context text,
  used_english_fallback boolean
)
language sql
stable
security invoker
set search_path = public
as $$
  with query_terms as (
    select websearch_to_tsquery('simple'::regconfig, left(trim(p_query), 100)) as terms
  ),
  path_hits as (
    select
      path.id::text,
      'learningPath'::text as result_type,
      coalesce(path.translations -> p_language ->> 'title', path.title) as title,
      coalesce(path.translations -> p_language ->> 'description', path.description, '') as description,
      '/learn/paths/' || path.slug as href,
      ''::text as context,
      (p_language <> 'en' and path.translations -> p_language ->> 'title' is null) as used_english_fallback,
      ts_rank(
        to_tsvector(
          'simple'::regconfig,
          coalesce(path.title, '') || ' ' || coalesce(path.description, '') || ' ' ||
          coalesce(path.short_description, '') || ' ' || path.translations::text
        ),
        query_terms.terms
      ) as score
    from public.learning_paths as path
    cross join query_terms
    where path.is_published
      and to_tsvector(
        'simple'::regconfig,
        coalesce(path.title, '') || ' ' || coalesce(path.description, '') || ' ' ||
        coalesce(path.short_description, '') || ' ' || path.translations::text
      ) @@ query_terms.terms
    order by score desc, title
    limit 5
  ),
  course_hits as (
    select
      course.id::text,
      'course'::text as result_type,
      coalesce(course.translations -> p_language ->> 'title', course.title) as title,
      coalesce(course.translations -> p_language ->> 'description', course.description, '') as description,
      '/learn/' || course.slug as href,
      ''::text as context,
      (p_language <> 'en' and course.translations -> p_language ->> 'title' is null) as used_english_fallback,
      ts_rank(
        to_tsvector(
          'simple'::regconfig,
          coalesce(course.title, '') || ' ' || coalesce(course.description, '') || ' ' || course.translations::text
        ),
        query_terms.terms
      ) as score
    from public.courses as course
    join public.learning_paths as path
      on path.id = course.learning_path_id and path.is_published
    cross join query_terms
    where course.is_published
      and to_tsvector(
        'simple'::regconfig,
        coalesce(course.title, '') || ' ' || coalesce(course.description, '') || ' ' || course.translations::text
      ) @@ query_terms.terms
    order by score desc, title
    limit 5
  ),
  module_hits as (
    select
      module.id::text,
      'module'::text as result_type,
      coalesce(module.translations -> p_language ->> 'title', module.title) as title,
      coalesce(module.translations -> p_language ->> 'description', module.description, '') as description,
      '/learn/' || course.slug || '#module-' || module.slug as href,
      coalesce(course.translations -> p_language ->> 'title', course.title) as context,
      (p_language <> 'en' and module.translations -> p_language ->> 'title' is null) as used_english_fallback,
      ts_rank(
        to_tsvector(
          'simple'::regconfig,
          coalesce(module.title, '') || ' ' || coalesce(module.description, '') || ' ' || module.translations::text
        ),
        query_terms.terms
      ) as score
    from public.modules as module
    join public.courses as course
      on course.id = module.course_id and course.is_published
    join public.learning_paths as path
      on path.id = course.learning_path_id and path.is_published
    cross join query_terms
    where module.is_published
      and to_tsvector(
        'simple'::regconfig,
        coalesce(module.title, '') || ' ' || coalesce(module.description, '') || ' ' || module.translations::text
      ) @@ query_terms.terms
    order by score desc, title
    limit 5
  ),
  lesson_hits as (
    select
      lesson.id::text,
      'lesson'::text as result_type,
      coalesce(lesson.translations -> p_language ->> 'title', lesson.title) as title,
      coalesce(lesson.translations -> p_language ->> 'description', lesson.description, '') as description,
      '/learn/' || course.slug || '/' || module.slug || '/' || lesson.slug as href,
      coalesce(course.translations -> p_language ->> 'title', course.title) || ' · ' ||
        coalesce(module.translations -> p_language ->> 'title', module.title) as context,
      (p_language <> 'en' and lesson.translations -> p_language ->> 'title' is null) as used_english_fallback,
      ts_rank(
        to_tsvector(
          'simple'::regconfig,
          coalesce(lesson.title, '') || ' ' || coalesce(lesson.description, '') || ' ' ||
          lesson.content || ' ' || lesson.explanation || ' ' || lesson.examples::text || ' ' ||
          lesson.notes::text || ' ' || lesson.practice::text || ' ' ||
          lesson.common_mistakes::text || ' ' || lesson.quiz_questions::text || ' ' ||
          lesson.translations::text
        ),
        query_terms.terms
      ) as score
    from public.lessons as lesson
    join public.modules as module
      on module.id = lesson.module_id and module.is_published
    join public.courses as course
      on course.id = module.course_id and course.is_published
    join public.learning_paths as path
      on path.id = course.learning_path_id and path.is_published
    cross join query_terms
    where lesson.is_published
      and to_tsvector(
        'simple'::regconfig,
        coalesce(lesson.title, '') || ' ' || coalesce(lesson.description, '') || ' ' ||
        lesson.content || ' ' || lesson.explanation || ' ' || lesson.examples::text || ' ' ||
        lesson.notes::text || ' ' || lesson.practice::text || ' ' ||
        lesson.common_mistakes::text || ' ' || lesson.quiz_questions::text || ' ' ||
        lesson.translations::text
      ) @@ query_terms.terms
    order by score desc, title
    limit 8
  )
  select
    hits.id,
    hits.result_type,
    hits.title,
    hits.description,
    hits.href,
    hits.context,
    hits.used_english_fallback
  from (
    select * from path_hits
    union all select * from course_hits
    union all select * from module_hits
    union all select * from lesson_hits
  ) as hits
  where (select auth.uid()) is not null
  order by hits.result_type, hits.title;
$$;

revoke all on function public.search_learning_content(text, text) from public, anon;
grant execute on function public.search_learning_content(text, text) to authenticated;

create or replace function public.get_learning_path_progress(p_learning_path_id uuid)
returns table (total_lessons bigint, completed_lessons bigint)
language sql
stable
security invoker
set search_path = public
as $$
  select
    count(lesson.id),
    count(lesson.id) filter (where progress.status = 'completed')
  from public.learning_paths as path
  join public.courses as course
    on course.learning_path_id = path.id and course.is_published
  join public.modules as module
    on module.course_id = course.id and module.is_published
  join public.lessons as lesson
    on lesson.module_id = module.id and lesson.is_published
  left join public.lesson_progress as progress
    on progress.lesson_id = lesson.id
    and progress.user_id = (select auth.uid())
  where path.id = p_learning_path_id
    and path.is_published
    and (select auth.uid()) is not null;
$$;

revoke all on function public.get_learning_path_progress(uuid) from public, anon;
grant execute on function public.get_learning_path_progress(uuid) to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.project_completions'::regclass
      and conname = 'project_completions_user_id_fkey'
  ) then
    alter table public.project_completions
      add constraint project_completions_user_id_fkey
      foreign key (user_id) references auth.users (id) on delete cascade;
  end if;
end;
$$;

notify pgrst, 'reload schema';
