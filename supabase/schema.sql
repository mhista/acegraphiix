-- ─────────────────────────────────────────────────────────────────────
-- Acegraphiix site — database schema
-- Run once in Supabase → SQL Editor. Then run seed.sql.
-- Safe to re-run: everything is "if not exists" / "or replace".
-- ─────────────────────────────────────────────────────────────────────

-- Who may edit the site. Add Jeremiah's login email here (seed.sql does).
create table if not exists admins (
  email text primary key
);

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

-- Site-wide copy, contact details, images. One row, one JSON document.
create table if not exists settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null default 'Brand Essentials',
  client text, year text, industry text,
  summary text, body text,
  cover_url text,
  gallery text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  features text[] not null default '{}',
  price text not null default '',
  unit text not null default '/project',
  icon text not null default 'bag',
  published boolean not null default true,
  position int not null default 0
);

create table if not exists process_steps (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tags text[] not null default '{}',
  icon text not null default 'sparkles',
  position int not null default 0
);

create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null default '',
  period text not null default '',
  bullets text[] not null default '{}',
  position int not null default 0
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  quote text not null,
  tags text[] not null default '{}',
  rating int not null default 5 check (rating between 0 and 5),
  photo_url text,
  published boolean not null default false,
  position int not null default 0
);

create table if not exists tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  percent int not null default 80 check (percent between 0 and 100),
  icon text not null default '',
  position int not null default 0
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null default '',
  published boolean not null default true,
  position int not null default 0
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text, category text, cover_url text, body text,
  published_at timestamptz default now(),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Designs synced from Google Drive. id = the Drive file id.
create table if not exists gallery_items (
  id text primary key,
  name text not null,
  folder_id text,
  folder_name text not null default 'Designs',
  mime_type text,
  width int, height int,
  created_time timestamptz,
  visible boolean not null default true,
  featured boolean not null default false,
  position int not null default 0,
  -- which home-page sections he's hand-picked this design for: 'hero', 'projects', 'archive'
  sections text[] not null default '{}',
  section_order bigint not null default 0,
  synced_at timestamptz not null default now()
);
create index if not exists gallery_items_folder on gallery_items (folder_name);

-- The CRM: every message from the contact form.
create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text, service text, budget text, message text,
  status text not null default 'new'
    check (status in ('new','contacted','in_progress','won','lost','archived')),
  notes text,
  value text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists enquiries_status on enquiries (status, created_at desc);

-- ── Row level security ───────────────────────────────────────────────
-- Visitors can read what's published and send an enquiry. Nothing else.
-- Only emails in `admins` can change anything.

do $$
declare t text;
begin
  foreach t in array array['settings','projects','services','process_steps','experience','testimonials','tools','faqs','posts','gallery_items','enquiries','admins']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "admin all" on %I', t);
    execute format('create policy "admin all" on %I for all to authenticated using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

drop policy if exists "public read" on settings;
create policy "public read" on settings for select using (true);
drop policy if exists "public read" on process_steps;
create policy "public read" on process_steps for select using (true);
drop policy if exists "public read" on experience;
create policy "public read" on experience for select using (true);
drop policy if exists "public read" on tools;
create policy "public read" on tools for select using (true);

drop policy if exists "public read" on projects;
create policy "public read" on projects for select using (published);
drop policy if exists "public read" on services;
create policy "public read" on services for select using (published);
drop policy if exists "public read" on testimonials;
create policy "public read" on testimonials for select using (published);
drop policy if exists "public read" on faqs;
create policy "public read" on faqs for select using (published);
drop policy if exists "public read" on posts;
create policy "public read" on posts for select using (published and (published_at is null or published_at <= now()));
drop policy if exists "public read" on gallery_items;
create policy "public read" on gallery_items for select using (visible);

drop policy if exists "anyone can enquire" on enquiries;
create policy "anyone can enquire" on enquiries for insert to anon, authenticated with check (status = 'new' and notes is null);

-- ── Storage: one public bucket for uploads ───────────────────────────
insert into storage.buckets (id, name, public, file_size_limit)
values ('media', 'media', true, 15728640)
on conflict (id) do update set public = true;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media admin write" on storage.objects;
create policy "media admin write" on storage.objects for insert to authenticated with check (bucket_id = 'media' and is_admin());
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and is_admin());
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and is_admin());
