-- 1. Fix Foreign Key Constraint (Link directly to auth.users like planner_entries)
alter table public.finance_transactions 
drop constraint if exists finance_transactions_user_id_fkey;

alter table public.finance_transactions 
add constraint finance_transactions_user_id_fkey 
foreign key (user_id) references auth.users(id) on delete cascade;

-- 2. Update 'type' check constraint to match our new logic
alter table public.finance_transactions 
drop constraint if exists finance_transactions_type_check;

alter table public.finance_transactions 
add constraint finance_transactions_type_check 
check (type in ('income', 'expense'));

-- 3. Update 'category' check constraint (Optional but good for data integrity)
-- We remove old constraints to avoid conflicts
alter table public.finance_transactions 
drop constraint if exists finance_transactions_category_check;
