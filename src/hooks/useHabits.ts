import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays } from 'date-fns';

export interface Habit {
    id: string;
    name: string;
}

export interface HabitLog {
    habit_id: string;
    date: string; // YYYY-MM-DD
    status: 'completed' | 'skipped' | 'failed';
}

export function useHabits() {
    const { user } = useAuth();
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    const [habits, setHabits] = useState<Habit[]>([]);
    const [logs, setLogs] = useState<HabitLog[]>([]); // Flat list of logs for view window
    const [mood, setMood] = useState<number | null>(null);
    const [gratitude, setGratitude] = useState('');

    // Navigation State
    const [selectedDate, setSelectedDate] = useState(new Date());

    // For Debouncing Gratitude
    const gratitudeTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, selectedDate]); // Refetch when user or date changes

    const changeWeek = (weeks: number) => {
        setSelectedDate(prev => subDays(prev, weeks * -7));
    };

    const fetchData = async () => {
        // 1. Fetch Habits (Always same)
        const { data: habitsData } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', user!.id)
            .order('created_at');

        if (habitsData) setHabits(habitsData);

        // 2. Fetch Logs (Selected 7 days window)
        // Window: [selectedDate - 6 days] TO [selectedDate]
        const endDate = format(selectedDate, 'yyyy-MM-dd');
        const startDate = format(subDays(selectedDate, 6), 'yyyy-MM-dd');

        const { data: logsData } = await supabase
            .from('habit_logs')
            .select('*')
            .gte('date', startDate)
            .lte('date', endDate);

        if (logsData) setLogs(logsData);

        // 3. Fetch Today's Journal (Mood & Gratitude) - ALWAYS TODAY
        // User agreed to keep journal fixed to "Today"
        const { data: journalData } = await supabase
            .from('journal_entries')
            .select('mood_score, gratitude_text')
            .eq('user_id', user!.id)
            .eq('date', todayStr)
            .single();

        if (journalData) {
            setMood(journalData.mood_score);
            setGratitude(journalData.gratitude_text || '');
        } else {
            setMood(null);
            setGratitude('');
        }
    };

    const toggleHabit = async (habitId: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');

        // Optimistic Update
        const existingLogIndex = logs.findIndex(l => l.habit_id === habitId && l.date === dateStr);
        let newLogs = [...logs];
        let action: 'insert' | 'delete';

        if (existingLogIndex >= 0) {
            // Remove it
            newLogs.splice(existingLogIndex, 1);
            action = 'delete';
        } else {
            // Add it
            newLogs.push({ habit_id: habitId, date: dateStr, status: 'completed' });
            action = 'insert';
        }
        setLogs(newLogs);

        try {
            if (action === 'delete') {
                await supabase
                    .from('habit_logs')
                    .delete()
                    .eq('habit_id', habitId)
                    .eq('date', dateStr);
            } else {
                await supabase
                    .from('habit_logs')
                    .insert({
                        habit_id: habitId,
                        date: dateStr,
                        status: 'completed'
                    });
            }
        } catch (error) {
            console.error("Error toggling habit:", error);
            fetchData(); // Revert
        }
    };

    const updateMood = async (score: number) => {
        setMood(score);
        try {
            await supabase
                .from('journal_entries')
                .upsert({
                    user_id: user!.id,
                    date: todayStr,
                    mood_score: score
                }, { onConflict: 'user_id, date' });
        } catch (e) {
            console.error(e);
        }
    };

    const updateGratitude = (text: string) => {
        setGratitude(text);

        if (gratitudeTimeout.current) clearTimeout(gratitudeTimeout.current);

        gratitudeTimeout.current = setTimeout(async () => {
            try {
                await supabase
                    .from('journal_entries')
                    .upsert({
                        user_id: user!.id,
                        date: todayStr,
                        gratitude_text: text
                    }, { onConflict: 'user_id, date' });
            } catch (e) {
                console.error(e);
            }
        }, 1000); // 1s Debounce
    };

    const addHabit = async (name: string) => {
        // Optimistic? No need, fast enough usually, or we can just append.
        try {
            const { data, error } = await supabase
                .from('habits')
                .insert({ user_id: user!.id, name })
                .select()
                .single();

            if (data) setHabits(prev => [...prev, data]);
        } catch (e) {
            console.error(e);
        }
    };

    return {
        habits,
        logs,
        mood,
        gratitude,
        selectedDate,
        changeWeek,
        toggleHabit,
        updateMood,
        updateGratitude,
        addHabit
    };
}
