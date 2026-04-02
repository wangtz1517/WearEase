create extension if not exists pgcrypto;

create table if not exists public.garments (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'top',
  state text not null default 'pending',
  name text not null default '',
  category_text text not null default '',
  location text not null default '',
  seasons text not null default '',
  frequency text not null default '',
  last_worn text not null default '',
  note text not null default '',
  status text not null default '',
  footer text not null default '',
  image_url text not null default '',
  color text not null default '',
  purchase_date text not null default '',
  price text not null default '',
  brand text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists garments_user_id_updated_at_idx
  on public.garments (user_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists garments_set_updated_at on public.garments;
create trigger garments_set_updated_at
before update on public.garments
for each row
execute function public.set_updated_at();

alter table public.garments enable row level security;

drop policy if exists "Users can read their own garments" on public.garments;
create policy "Users can read their own garments"
on public.garments
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own garments" on public.garments;
create policy "Users can insert their own garments"
on public.garments
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own garments" on public.garments;
create policy "Users can update their own garments"
on public.garments
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own garments" on public.garments;
create policy "Users can delete their own garments"
on public.garments
for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('garment-images', 'garment-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view garment images" on storage.objects;
create policy "Public can view garment images"
on storage.objects
for select
to public
using (bucket_id = 'garment-images');

drop policy if exists "Users can upload their own garment images" on storage.objects;
create policy "Users can upload their own garment images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'garment-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update their own garment images" on storage.objects;
create policy "Users can update their own garment images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'garment-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'garment-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete their own garment images" on storage.objects;
create policy "Users can delete their own garment images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'garment-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
