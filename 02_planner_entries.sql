-- Create table for flexible planner text entries (priorities, schedule slots)
create table public.planner_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  key text not null, -- e.g., 'priority_1', 'schedule_05'
  value text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date, key) -- Ensures one entry per key per day for a user
);

-- Enable RLS
alter table public.planner_entries enable row level security;

-- Policies
create policy "Users can CRUD their own planner entries" on public.planner_entries
  for all using (auth.uid() = user_id);
