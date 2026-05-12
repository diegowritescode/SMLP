alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.chapters enable row level security;
alter table public.reading_progress enable row level security;
alter table public.access_grants enable row level security;

create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.id
  from public.profiles p
  where p.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and p.role = 'admin'
  );
$$;

grant execute on function public.current_profile_id() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- PROFILES
create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (user_id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
on public.profiles
for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "profiles_insert_admin_only"
on public.profiles
for insert
with check (public.is_admin());

create policy "profiles_delete_admin_only"
on public.profiles
for delete
using (public.is_admin());

-- BOOKS
create policy "books_select_private_mvp"
on public.books
for select
using (auth.uid() is not null and (is_published = true or public.is_admin()));

create policy "books_admin_write"
on public.books
for all
using (public.is_admin())
with check (public.is_admin());

-- CHAPTERS
create policy "chapters_select_private_mvp"
on public.chapters
for select
using (
  auth.uid() is not null
  and (
    public.is_admin()
    or (
      is_published = true
      and exists (
        select 1
        from public.books b
        where b.id = chapters.book_id
          and b.is_published = true
      )
    )
  )
);

create policy "chapters_admin_write"
on public.chapters
for all
using (public.is_admin())
with check (public.is_admin());

-- READING PROGRESS
create policy "reading_progress_select_own_or_admin"
on public.reading_progress
for select
using (user_id = public.current_profile_id() or public.is_admin());

create policy "reading_progress_insert_own_or_admin"
on public.reading_progress
for insert
with check (user_id = public.current_profile_id() or public.is_admin());

create policy "reading_progress_update_own_or_admin"
on public.reading_progress
for update
using (user_id = public.current_profile_id() or public.is_admin())
with check (user_id = public.current_profile_id() or public.is_admin());

create policy "reading_progress_delete_admin_only"
on public.reading_progress
for delete
using (public.is_admin());

-- ACCESS GRANTS
create policy "access_grants_select_own_or_admin"
on public.access_grants
for select
using (user_id = public.current_profile_id() or public.is_admin());

create policy "access_grants_admin_write"
on public.access_grants
for all
using (public.is_admin())
with check (public.is_admin());
