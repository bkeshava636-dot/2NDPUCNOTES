-- Run this in Supabase → SQL Editor → New Query
-- Creates all 5 tables for the 2PUC Notes Store schema.

create table if not exists sections (
  id          serial primary key,
  name        text not null,
  slug        text not null unique,
  description text,
  is_visible  boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists customers (
  id         serial primary key,
  full_name  text not null,
  phone      text not null unique,
  email      text,
  created_at timestamptz not null default now()
);

create table if not exists cards (
  id                   serial primary key,
  section_id           integer not null references sections(id),
  title                text not null,
  description          text,
  subject              text,
  chapter              text,
  semester             text,
  board                text not null default 'Karnataka',
  class_level          text not null default '2nd PUC',
  resource_type        text not null default 'Notes',
  is_free              boolean not null default false,
  price_paise          integer not null default 0,
  discount_price_paise integer,
  telegram_link        text,
  is_new               boolean not null default false,
  thumbnail_url        text,
  preview_image_urls   text[] not null default '{}',
  pdf_file_key         text,
  page_count           integer,
  file_size_kb         integer,
  is_featured          boolean not null default false,
  is_visible           boolean not null default true,
  is_deleted           boolean not null default false,
  sort_order           integer not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table if not exists orders (
  id                  text primary key,
  card_id             integer not null references cards(id),
  customer_id         integer references customers(id),
  customer_name       text not null,
  customer_phone      text not null,
  customer_email      text,
  amount_paise        integer not null,
  status              text not null default 'pending',
  paid_at             timestamptz,
  razorpay_order_id   text,
  razorpay_payment_id text,
  razorpay_signature  text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create table if not exists downloads (
  id            serial primary key,
  order_id      text not null references orders(id),
  card_id       integer not null references cards(id),
  downloaded_at timestamptz not null default now(),
  ip_address    text,
  device_info   text
);

-- Useful indexes
create index if not exists idx_cards_section_id  on cards(section_id);
create index if not exists idx_cards_is_deleted  on cards(is_deleted);
create index if not exists idx_orders_card_id    on orders(card_id);
create index if not exists idx_orders_phone      on orders(customer_phone);
create index if not exists idx_orders_status     on orders(status);
create index if not exists idx_downloads_order   on downloads(order_id);
