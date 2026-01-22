-- Create table for storing user budget preferences
create table public.finance_settings (
    user_id uuid references auth.users(id) on delete cascade primary key,
    needs_percent integer not null default 50,
    wants_percent integer not null default 30,
    savings_percent integer not null default 20,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Ensure percentages sum to 100 roughly? 
    -- Actually, let's just enforce they are positive. Business logic can enforce sum 100.
    constraint positive_percents check (needs_percent >= 0 and wants_percent >= 0 and savings_percent >= 0)
);

-- Enable RLS
alter table public.finance_settings enable row level security;

-- Policies
create policy "Users can CRUD their own finance settings" on public.finance_settings
  for all using (auth.uid() = user_id);
