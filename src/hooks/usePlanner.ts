import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export interface Task {
    id: string;
    title: string;
    is_completed: boolean;
    user_id: string;
    date: string;
}

export interface PlannerEntry {
    key: string;
    value: string;
}

export function usePlanner(date: Date) {
    const { user } = useAuth();
    const dateStr = format(date, 'yyyy-MM-dd');

    const [tasks, setTasks] = useState<Task[]>([]);
    const [entries, setEntries] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Debounce refs to keep track of pending updates
    const pendingUpdates = useRef<Record<string, NodeJS.Timeout>>({});

    useEffect(() => {
        if (user) {
            fetchPlannerData();
        }
    }, [user, dateStr]);

    const fetchPlannerData = async () => {
        setLoading(true);
        try {
            // Fetch Tasks
            const { data: tasksData, error: tasksError } = await supabase
                .from('planner_tasks')
                .select('*')
                .eq('user_id', user!.id)
                .eq('date', dateStr)
                .order('created_at', { ascending: true });

            if (tasksError) throw tasksError;
            setTasks(tasksData || []);

            // Fetch Entries
            const { data: entriesData, error: entriesError } = await supabase
                .from('planner_entries')
                .select('key, value')
                .eq('user_id', user!.id)
                .eq('date', dateStr);

            if (entriesError) throw entriesError;

            const entriesMap: Record<string, string> = {};
            entriesData?.forEach((e) => {
                entriesMap[e.key] = e.value;
            });
            setEntries(entriesMap);

        } catch (error) {
            console.error('Error fetching planner data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (title: string) => {
        if (!title.trim()) return;

        // Optimistic update
        const tempId = crypto.randomUUID();
        const newTask: Task = {
            id: tempId,
            title,
            is_completed: false,
            user_id: user!.id,
            date: dateStr
        };

        setTasks(prev => [...prev, newTask]);

        try {
            const { data, error } = await supabase
                .from('planner_tasks')
                .insert({
                    user_id: user!.id,
                    date: dateStr,
                    title,
                    is_completed: false
                })
                .select()
                .single();

            if (error) throw error;

            // Replace optimistic task with real one
            setTasks(prev => prev.map(t => t.id === tempId ? data : t));
        } catch (error) {
            console.error('Error adding task:', error);
            // Revert on error
            setTasks(prev => prev.filter(t => t.id !== tempId));
        }
    };

    const toggleTask = async (taskId: string, currentStatus: boolean) => {
        // Optimistic update
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, is_completed: !currentStatus } : t
        ));

        try {
            const { error } = await supabase
                .from('planner_tasks')
                .update({ is_completed: !currentStatus })
                .eq('id', taskId);

            if (error) throw error;
        } catch (error) {
            console.error('Error toggling task:', error);
            // Revert
            setTasks(prev => prev.map(t =>
                t.id === taskId ? { ...t, is_completed: currentStatus } : t
            ));
        }
    };

    const deleteTask = async (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        try {
            await supabase.from('planner_tasks').delete().eq('id', taskId);
        } catch (e) {
            console.error(e);
        }
    }

    const updateEntry = (key: string, value: string) => {
        // Update local state immediately
        setEntries(prev => ({ ...prev, [key]: value }));

        // Clear existing timeout for this key
        if (pendingUpdates.current[key]) {
            clearTimeout(pendingUpdates.current[key]);
        }

        // Set new timeout (Debounce 500ms)
        pendingUpdates.current[key] = setTimeout(async () => {
            try {
                const { error } = await supabase
                    .from('planner_entries')
                    .upsert({
                        user_id: user!.id,
                        date: dateStr,
                        key,
                        value
                    }, { onConflict: 'user_id, date, key' }); // Requires unique constraint

                if (error) throw error;
            } catch (error) {
                console.error(`Error saving entry ${key}:`, error);
            }
            delete pendingUpdates.current[key];
        }, 1000);
    };

    return {
        tasks,
        entries,
        loading,
        addTask,
        toggleTask,
        deleteTask,
        updateEntry
    };
}
