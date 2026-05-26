-- ╔══════════════════════════════════════════════════════════════╗
-- ║  CodeNova AI — Supabase Schema                             ║
-- ║  Run this in Supabase SQL Editor                           ║
-- ╚══════════════════════════════════════════════════════════════╝

-- 1) Enable UUID extension if needed
create extension if not exists "uuid-ossp";

-- 2) Profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  username text unique not null,
  email text unique not null,
  avatar_url text,
  phone text,
  role text not null default 'student' check (role in ('student','teacher','admin')),
  provider text not null default 'local' check (provider in ('local','google','github')),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

-- 4) OTP Storage Table
create table if not exists public.otps (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  code text not null,
  purpose text not null check (purpose in ('verification', 'reset')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint otps_email_purpose unique (email, purpose)
);

-- Index for faster lookups
create index if not exists idx_otps_email on public.otps(email);
create index if not exists idx_otps_expires_at on public.otps(expires_at);

-- Auto-delete expired OTPs (cleanup)
create or replace function public.cleanup_expired_otps()
returns void as $$
begin
  delete from public.otps where expires_at < now();
end;
$$ language plpgsql;

-- 5) Automatically create a profile when auth.users gets a new user
create or replace function public.handle_new_user()
returns trigger as $$
declare
  desired_username text;
  username_to_use text;
  counter integer := 0;
begin
  desired_username := coalesce(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1)
  );

  username_to_use := desired_username;

  -- Handle username collisions by appending random digits
  while exists (select 1 from public.profiles where username = username_to_use) loop
    counter := counter + 1;
    username_to_use := desired_username || floor(random() * 1000)::text;
    if counter > 100 then
      raise exception 'Unable to generate unique username after 100 attempts';
    end if;
  end loop;

  insert into public.profiles (
    id,
    full_name,
    username,
    email,
    avatar_url,
    phone,
    role,
    provider,
    is_verified
  ) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    username_to_use,
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    coalesce(new.raw_user_meta_data->>'phone', null),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'provider', 'local'),
    new.email_confirmed_at is not null
  )
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 5) Row Level Security
alter table public.profiles enable row level security;

-- Policy: user can view own profile
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

-- Policy: user can update own profile
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id);

-- Policy: user can insert own profile (safe fallback)
create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

-- Optional: admins can read all profiles
create policy "Admins can read all profiles"
on public.profiles
for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- 6) Helpful indexes
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_username on public.profiles(username);
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_created_at on public.profiles(created_at desc);
