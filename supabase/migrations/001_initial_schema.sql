create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  role text not null default 'reader' check (role in ('admin', 'reader')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category text,
  language text not null default 'es',
  cover_image text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  title text not null,
  slug text not null,
  order_index integer not null,
  file_path text not null,
  estimated_reading_minutes integer,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (book_id, slug),
  unique (book_id, order_index)
);

create table if not exists public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  progress_percent numeric(5,2) not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  last_scroll_position integer not null default 0,
  is_completed boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, chapter_id)
);

create table if not exists public.access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  access_type text not null check (access_type in ('manual', 'admin', 'subscription', 'trial')),
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, book_id, access_type)
);

create index if not exists idx_books_slug on public.books(slug);
create index if not exists idx_books_published on public.books(is_published);
create index if not exists idx_chapters_book on public.chapters(book_id);
create index if not exists idx_chapters_published on public.chapters(is_published);
create index if not exists idx_reading_progress_user on public.reading_progress(user_id);
create index if not exists idx_reading_progress_book on public.reading_progress(book_id);
create index if not exists idx_access_grants_user on public.access_grants(user_id);
create index if not exists idx_access_grants_book on public.access_grants(book_id);

create trigger trg_profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger trg_books_set_updated_at
before update on public.books
for each row
execute function public.set_updated_at();

create trigger trg_chapters_set_updated_at
before update on public.chapters
for each row
execute function public.set_updated_at();

create trigger trg_reading_progress_set_updated_at
before update on public.reading_progress
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (user_id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_auth_user();
