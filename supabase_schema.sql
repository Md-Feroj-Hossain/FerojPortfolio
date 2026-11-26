-- Md Feroj Hossain portfolio: database and storage security
-- Run this script in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.portfolio (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.portfolio enable row level security;

-- Public visitors can read the published portfolio.
drop policy if exists "Portfolio is publicly readable" on public.portfolio;
create policy "Portfolio is publicly readable"
on public.portfolio for select
to anon, authenticated
using (true);

-- A signed-in owner can create their own row.
drop policy if exists "Owner can insert portfolio" on public.portfolio;
create policy "Owner can insert portfolio"
on public.portfolio for insert
to authenticated
with check (auth.uid() = owner_id);

-- Only the row owner can update their content.
drop policy if exists "Owner can update portfolio" on public.portfolio;
create policy "Owner can update portfolio"
on public.portfolio for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

-- Only the row owner can delete their content.
drop policy if exists "Owner can delete portfolio" on public.portfolio;
create policy "Owner can delete portfolio"
on public.portfolio for delete
to authenticated
using (auth.uid() = owner_id);

-- Keep updated_at current.
create or replace function public.set_portfolio_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolio_updated_at on public.portfolio;
create trigger portfolio_updated_at
before update on public.portfolio
for each row execute function public.set_portfolio_updated_at();

-- Create a public bucket for portfolio images, logos, CVs and project media.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  10485760,
  array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public visitors can view files in this bucket.
drop policy if exists "Public can view portfolio media" on storage.objects;
create policy "Public can view portfolio media"
on storage.objects for select
to public
using (bucket_id = 'portfolio-media');

-- Uploads must be placed in a folder named with the authenticated user's UUID.
-- Example object path: <auth-user-uuid>/profile-photo.png
drop policy if exists "Owner can upload portfolio media" on storage.objects;
create policy "Owner can upload portfolio media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'portfolio-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Owner can update portfolio media" on storage.objects;
create policy "Owner can update portfolio media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'portfolio-media'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'portfolio-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Owner can delete portfolio media" on storage.objects;
create policy "Owner can delete portfolio media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'portfolio-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);
