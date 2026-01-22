-- 1. Fix Habits Table
-- Ensure user_id references auth.users
alter table public.habits 
drop constraint if exists habits_user_id_fkey;

alter table public.habits 
add constraint habits_user_id_fkey 
foreign key (user_id) references auth.users(id) on delete cascade;

-- 2. Fix Habit Logs
-- Ensure habit_id references habits (already does, but worth checking unique constraint)
-- We need to ensure a habit can only be logged once per date.
alter table public.habit_logs 
drop constraint if exists habit_logs_habit_id_date_key;

alter table public.habit_logs 
add constraint habit_logs_habit_id_date_key 
unique (habit_id, date);

-- 3. Fix Journal Entries (Mood & Gratitude)
-- Ensure user_id references auth.users
alter table public.journal_entries 
drop constraint if exists journal_entries_user_id_fkey;

alter table public.journal_entries 
add constraint journal_entries_user_id_fkey 
foreign key (user_id) references auth.users(id) on delete cascade;

-- Ensure one journal entry per user per day for upserting mood/gratitude
alter table public.journal_entries 
drop constraint if exists journal_entries_user_id_date_key;

alter table public.journal_entries 
add constraint journal_entries_user_id_date_key 
unique (user_id, date);

-- 4. RLS Policies Refresh
-- Habits
drop policy if exists "Users can crud habits" on public.habits;
create policy "Users can crud habits" on public.habits for all using (auth.uid() = user_id);

-- Habit Logs
drop policy if exists "Users can crud habit_logs" on public.habit_logs;
create policy "Users can crud habit_logs" on public.habit_logs for all using (
    habit_id in (select id from public.habits where user_id = auth.uid())
);

-- Journal
drop policy if exists "Users can crud journal" on public.journal_entries;
create policy "Users can crud journal" on public.journal_entries for all using (auth.uid() = user_id);
