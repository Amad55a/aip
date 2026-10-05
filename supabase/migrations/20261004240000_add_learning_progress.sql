alter table public.lessons
  add column if not exists quiz_questions jsonb not null default '[]'::jsonb
  check (jsonb_typeof(quiz_questions) = 'array');

update public.lessons
set quiz_questions = $html_quiz$[
  {
    "id": "doctype-purpose",
    "type": "multiple_choice",
    "prompt": "What does the DOCTYPE declaration tell the browser?",
    "options": [
      "Which HTML standard the document uses",
      "What color the page background should be",
      "Where the page images are stored",
      "Which JavaScript file to run"
    ],
    "correctAnswer": "Which HTML standard the document uses",
    "explanation": "The DOCTYPE declaration tells the browser to parse the document using modern HTML standards."
  },
  {
    "id": "heading-main-purpose",
    "type": "multiple_choice",
    "prompt": "What does <h1> represent?",
    "options": ["A paragraph", "The main heading", "An image", "A link"],
    "correctAnswer": "The main heading",
    "explanation": "The h1 element represents the main heading and the highest-level heading in its content context."
  },
  {
    "id": "html-structure-short-answer",
    "type": "short_answer",
    "prompt": "What is the name of the tree browsers build from an HTML document?",
    "correctAnswer": "DOM",
    "acceptableAnswers": ["document object model", "the DOM", "document tree"],
    "explanation": "Browsers parse HTML into the Document Object Model, commonly called the DOM."
  }
]$html_quiz$::jsonb
where slug = 'what-is-html'
  and quiz_questions = '[]'::jsonb;

update public.lessons
set quiz_questions = $html_basics_quiz$[
  {
    "id": "html-quiz-doctype",
    "type": "multiple_choice",
    "prompt": "Which declaration belongs at the beginning of a modern HTML document?",
    "options": ["<!DOCTYPE html>", "<html5>", "<head>", "<meta>"],
    "correctAnswer": "<!DOCTYPE html>",
    "explanation": "The HTML5 doctype is written as <!DOCTYPE html> and appears before the html element."
  },
  {
    "id": "html-quiz-alt",
    "type": "true_false",
    "prompt": "Alternative text helps communicate an image's meaning when the image cannot be seen.",
    "options": ["True", "False"],
    "correctAnswer": "True",
    "explanation": "Useful alt text provides an accessible text alternative for an image."
  }
]$html_basics_quiz$::jsonb
where slug = 'html-basics-knowledge-check'
  and quiz_questions = '[]'::jsonb;

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  learning_path_id uuid not null references public.learning_paths (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, learning_path_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  started_at timestamptz,
  completed_at timestamptz,
  last_accessed_at timestamptz,
  quiz_score numeric(5, 2) check (quiz_score is null or quiz_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index if not exists enrollments_user_status_idx
  on public.enrollments (user_id, status);
create index if not exists lesson_progress_user_accessed_idx
  on public.lesson_progress (user_id, last_accessed_at desc);
create index if not exists lesson_progress_lesson_status_idx
  on public.lesson_progress (lesson_id, status);

drop trigger if exists enrollments_set_updated_at on public.enrollments;
create trigger enrollments_set_updated_at
before update on public.enrollments
for each row execute function public.set_updated_at();

drop trigger if exists lesson_progress_set_updated_at on public.lesson_progress;
create trigger lesson_progress_set_updated_at
before update on public.lesson_progress
for each row execute function public.set_updated_at();

alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

drop policy if exists "Users can view their own enrollments" on public.enrollments;
create policy "Users can view their own enrollments"
on public.enrollments for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Users can create their own enrollments" on public.enrollments;
create policy "Users can create their own enrollments"
on public.enrollments for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "Users can update their own enrollments" on public.enrollments;
create policy "Users can update their own enrollments"
on public.enrollments for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists "Users can view their own lesson progress" on public.lesson_progress;
create policy "Users can view their own lesson progress"
on public.lesson_progress for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Users can create their own lesson progress" on public.lesson_progress;
create policy "Users can create their own lesson progress"
on public.lesson_progress for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "Users can update their own lesson progress" on public.lesson_progress;
create policy "Users can update their own lesson progress"
on public.lesson_progress for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

revoke all on public.enrollments, public.lesson_progress from anon, authenticated;
grant select, insert, update on public.enrollments, public.lesson_progress to authenticated;

revoke all on public.lessons from anon, authenticated;
grant select (
  id, module_id, title, slug, description, content, explanation, examples,
  code_examples, notes, common_mistakes, practice, quiz_questions, lesson_type,
  order_index, estimated_minutes, is_published, created_at, updated_at
) on public.lessons to authenticated;

notify pgrst, 'reload schema';
