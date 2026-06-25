-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  theme_preference text default 'system',
  accent_color text default '#f472b6', -- Pastel pink default
  font_preference text default 'sans',
  daily_goal_words integer default 300,
  prompts_enabled boolean default true,
  reminder_time time,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Entries table
create table public.entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text,
  content text,
  mood text,
  date date not null default current_date,
  word_count integer default 0,
  reading_time integer default 0,
  is_favorite boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tags table
create table public.tags (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, name)
);

-- Entry_Tags table
create table public.entry_tags (
  entry_id uuid references public.entries(id) on delete cascade not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  primary key (entry_id, tag_id)
);

-- Row Level Security (RLS)

alter table public.profiles enable row level security;
alter table public.entries enable row level security;
alter table public.tags enable row level security;
alter table public.entry_tags enable row level security;

-- Policies

-- Profiles: Users can view and update their own profile.
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Entries: Users can view, insert, update, and delete their own entries.
create policy "Users can view own entries" on public.entries for select using (auth.uid() = user_id);
create policy "Users can insert own entries" on public.entries for insert with check (auth.uid() = user_id);
create policy "Users can update own entries" on public.entries for update using (auth.uid() = user_id);
create policy "Users can delete own entries" on public.entries for delete using (auth.uid() = user_id);

-- Tags
create policy "Users can view own tags" on public.tags for select using (auth.uid() = user_id);
create policy "Users can insert own tags" on public.tags for insert with check (auth.uid() = user_id);
create policy "Users can update own tags" on public.tags for update using (auth.uid() = user_id);
create policy "Users can delete own tags" on public.tags for delete using (auth.uid() = user_id);

-- Entry_Tags
create policy "Users can view own entry_tags" on public.entry_tags for select using (
  exists (select 1 from public.entries where id = entry_id and user_id = auth.uid())
);
create policy "Users can insert own entry_tags" on public.entry_tags for insert with check (
  exists (select 1 from public.entries where id = entry_id and user_id = auth.uid())
);
create policy "Users can delete own entry_tags" on public.entry_tags for delete using (
  exists (select 1 from public.entries where id = entry_id and user_id = auth.uid())
);

-- Triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.entries
  for each row
  execute procedure public.handle_updated_at();

-- Trigger for auto-creating profile on user sign up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
