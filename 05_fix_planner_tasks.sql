-- Fix Foreign Key Constraint for planner_tasks
-- Originally it pointed to public.users, but we want it to point to auth.users for direct integration

alter table public.planner_tasks 
drop constraint if exists planner_tasks_user_id_fkey;

alter table public.planner_tasks 
add constraint planner_tasks_user_id_fkey 
foreign key (user_id) references auth.users(id) on delete cascade;

-- Double check policies are working (they likely are if they use auth.uid() = user_id)
-- But let's refresh them just in case
drop policy if exists "Users can crud tasks" on public.planner_tasks;
create policy "Users can crud tasks" on public.planner_tasks for all using (auth.uid() = user_id);
