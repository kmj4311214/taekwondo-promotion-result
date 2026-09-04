create table if not exists public.promotion_reviews (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  promotion_level text not null check (promotion_level in ('1품', '2품', '3품', '4품')),
  result text not null check (result in ('pass', 'fail')),
  photo_data_url text,
  photo_filename text,
  created_at timestamptz not null default now()
);

alter table public.promotion_reviews enable row level security;

drop policy if exists "Allow public promotion review inserts" on public.promotion_reviews;
create policy "Allow public promotion review inserts"
on public.promotion_reviews
for insert
to anon
with check (true);
