create extension if not exists pgcrypto;

create table if not exists public.user_snapshots (
    user_id uuid primary key references auth.users (id) on delete cascade,
    snapshot jsonb not null default '{}'::jsonb,
    snapshot_hash text,
    updated_by text,
    app_version text,
    updated_at timestamptz not null default timezone('utc', now())
);

alter table public.user_snapshots enable row level security;

drop policy if exists "user_snapshots_select_own" on public.user_snapshots;
create policy "user_snapshots_select_own"
on public.user_snapshots
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "user_snapshots_insert_own" on public.user_snapshots;
create policy "user_snapshots_insert_own"
on public.user_snapshots
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "user_snapshots_update_own" on public.user_snapshots;
create policy "user_snapshots_update_own"
on public.user_snapshots
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "user_snapshots_delete_own" on public.user_snapshots;
create policy "user_snapshots_delete_own"
on public.user_snapshots
for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists user_snapshots_updated_at_idx
on public.user_snapshots (updated_at desc);

do $$
begin
    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'user_snapshots'
    ) then
        alter publication supabase_realtime add table public.user_snapshots;
    end if;
end
$$;

insert into storage.buckets (id, name, public, file_size_limit)
values ('app-assets', 'app-assets', false, 52428800)
on conflict (id) do nothing;

drop policy if exists "app_assets_select_own" on storage.objects;
create policy "app_assets_select_own"
on storage.objects
for select
to authenticated
using (
    bucket_id = 'app-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "app_assets_insert_own" on storage.objects;
create policy "app_assets_insert_own"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'app-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "app_assets_update_own" on storage.objects;
create policy "app_assets_update_own"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'app-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
    bucket_id = 'app-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "app_assets_delete_own" on storage.objects;
create policy "app_assets_delete_own"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'app-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
);