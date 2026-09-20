create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'instructor', 'admin')),
  created_at timestamptz not null default now()
);

create schema if not exists private;

create or replace function private.is_admin()
returns boolean language sql security definer set search_path = public, private
as $ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $;

revoke execute on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create table if not exists public.lesson_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  lesson_slug text not null,
  completed_at timestamptz not null default now(),
  unique(user_id, course_slug, lesson_slug)
);

create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  lesson_slug text not null,
  score integer not null check (score >= 0 and score <= 100),
  attempted_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  certificate_id text not null unique,
  issued_at timestamptz not null default now(),
  unique(user_id, course_slug)
);
alter table public.certificates enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Admins can read profiles" on public.profiles for select to authenticated using (private.is_admin());

create policy "Users can manage own lesson progress" on public.lesson_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own quiz attempts" on public.quiz_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Admins can read lesson progress" on public.lesson_progress for select to authenticated using (private.is_admin());
create policy "Admins can read quiz attempts" on public.quiz_attempts for select to authenticated using (private.is_admin());
create policy "Users can read own certificates" on public.certificates for select to authenticated using (auth.uid() = user_id);
create policy "Admins can read certificates" on public.certificates for select to authenticated using (private.is_admin());
create policy "Public can verify certificates" on public.certificates for select to anon using (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();


-- Live course management
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  level text not null,
  duration text not null,
  published boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text not null,
  title text not null,
  summary text not null,
  points jsonb not null default '[]'::jsonb,
  quiz_question text not null,
  quiz_options jsonb not null default '[]'::jsonb,
  quiz_answer integer not null check (quiz_answer >= 0),
  position integer not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(course_id, slug),
  unique(course_id, position)
);

create index if not exists lessons_course_position_idx on public.lessons(course_id, position);

create or replace function private.is_staff()
returns boolean language sql security definer set search_path = public, private
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','instructor')); $$;
revoke execute on function private.is_staff() from public, anon;
grant execute on function private.is_staff() to authenticated;

alter table public.courses enable row level security;
alter table public.lessons enable row level security;

create policy "Public can read published courses" on public.courses for select to anon, authenticated
using (published = true or (select private.is_staff()));
create policy "Staff can insert courses" on public.courses for insert to authenticated with check ((select private.is_staff()));
create policy "Staff can update courses" on public.courses for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "Staff can delete courses" on public.courses for delete to authenticated using ((select private.is_staff()));

create policy "Public can read published lessons" on public.lessons for select to anon, authenticated
using (published = true or ((select private.is_staff()) and exists (select 1 from public.courses c where c.id = course_id)));
create policy "Staff can insert lessons" on public.lessons for insert to authenticated with check ((select private.is_staff()));
create policy "Staff can update lessons" on public.lessons for update to authenticated using ((select private.is_staff())) with check ((select private.is_staff()));
create policy "Staff can delete lessons" on public.lessons for delete to authenticated using ((select private.is_staff()));

grant select on public.courses to anon, authenticated;
grant select, insert, update, delete on public.courses to authenticated;
grant select on public.lessons to anon, authenticated;
grant select, insert, update, delete on public.lessons to authenticated;
