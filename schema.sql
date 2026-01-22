-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users table (managed by Supabase Auth usually, but extending it here for profile info)
create table public.users (
  id uuid references auth.users not null primary key,
  email text unique,
  name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Goals table (Tu Año Ideal)
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  category text check (category in ('finance', 'wellness', 'personal')),
  year integer not null,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Habits table (Hábitos)
create table public.habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  frequency text, -- e.g., 'daily', 'weekly', 'mon,wed,fri'
  time_of_day text, -- e.g., 'morning', 'evening'
  color text, -- hex code for UI
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Habit Logs (Tracking diario)
create table public.habit_logs (
  id uuid default uuid_generate_v4() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  date date not null,
  status text check (status in ('completed', 'skipped', 'failed')) default 'completed',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(habit_id, date)
);

-- 5. Finance Transactions (Control Financiero)
create table public.finance_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  amount numeric(10, 2) not null,
  type text check (type in ('income', 'expense', 'saving')) not null,
  category text not null,
  date date default current_date not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Journal Entries (Mapas Mentales y Reflexión)
create table public.journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  date date default current_date not null,
  mood_score integer check (mood_score between 1 and 10),
  content text,
  gratitude_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Planner Tasks (Planificador Diario)
create table public.planner_tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  date date default current_date not null,
  is_completed boolean default false,
  priority text check (priority in ('high', 'medium', 'low')) default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Meal Plans (Planificador de Comidas)
create table public.meal_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  date date not null,
  meal_type text check (meal_type in ('desayuno', 'almuerzo', 'merienda', 'cena')) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.goals enable row level security;
alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.finance_transactions enable row level security;
alter table public.journal_entries enable row level security;
alter table public.planner_tasks enable row level security;
alter table public.meal_plans enable row level security;

-- Create policies (simplified for initial setup: users see their own data)
create policy "Users can view own data" on public.users for select using (auth.uid() = id);
create policy "Users can update own data" on public.users for update using (auth.uid() = id);

create policy "Users can view own goals" on public.goals for select using (auth.uid() = user_id);
create policy "Users can insert own goals" on public.goals for insert with check (auth.uid() = user_id);
create policy "Users can update own goals" on public.goals for update using (auth.uid() = user_id);
create policy "Users can delete own goals" on public.goals for delete using (auth.uid() = user_id);

-- (Repeat similar policies for other tables or use a function to simplify, but keeping explicit for now)
create policy "Users can crud habits" on public.habits for all using (auth.uid() = user_id);
create policy "Users can crud habit_logs" on public.habit_logs for all using (habit_id in (select id from public.habits where user_id = auth.uid()));
create policy "Users can crud finance" on public.finance_transactions for all using (auth.uid() = user_id);
create policy "Users can crud journal" on public.journal_entries for all using (auth.uid() = user_id);
create policy "Users can crud tasks" on public.planner_tasks for all using (auth.uid() = user_id);
create policy "Users can crud meals" on public.meal_plans for all using (auth.uid() = user_id);
