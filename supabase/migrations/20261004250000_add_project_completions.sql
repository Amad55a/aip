create table if not exists public.project_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  project_id text not null,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, project_id)
);

alter table public.project_completions
  add column if not exists completed_at timestamptz not null default now();

create index if not exists project_completions_user_id_idx
  on public.project_completions (user_id);

create index if not exists project_completions_project_id_idx
  on public.project_completions (project_id);

alter table public.project_completions enable row level security;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists project_completions_set_updated_at on public.project_completions;
create trigger project_completions_set_updated_at
before update on public.project_completions
for each row execute function public.set_updated_at();

drop policy if exists "Users can manage their own project completions" on public.project_completions;
create policy "Users can manage their own project completions"
on public.project_completions for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

revoke all on public.project_completions from anon, authenticated;
grant select, insert, update, delete on public.project_completions to authenticated;
