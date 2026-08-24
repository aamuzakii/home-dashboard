create table if not exists public.extension_flags (
  key text primary key,
  enabled boolean not null default false
);

alter table public.extension_flags enable row level security;

create policy "public can read extension flags"
on public.extension_flags
for select
to anon
using (true);

-- The dashboard uses the publishable key to keep this one flag in sync.
-- The WITH CHECK condition prevents it from creating or changing other keys.
create policy "public can update threads access"
on public.extension_flags
for update
to anon
using (key = 'threads_access')
with check (key = 'threads_access');

insert into public.extension_flags (key, enabled)
values ('threads_access', false)
on conflict (key) do nothing;
