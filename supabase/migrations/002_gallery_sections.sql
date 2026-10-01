-- Lets each home-page section show designs Jeremiah picks himself.
-- Run once in Supabase → SQL Editor (safe to re-run). New installs get this from schema.sql.
alter table gallery_items add column if not exists sections text[] not null default '{}';
alter table gallery_items add column if not exists section_order bigint not null default 0;
create index if not exists gallery_items_sections on gallery_items using gin (sections);
