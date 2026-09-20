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
