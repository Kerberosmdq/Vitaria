import { useState } from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Meh, Heart, Sun, Cloud, CloudRain } from 'lucide-react';
import { clsx } from 'clsx';

interface Habit {
    id: string;
    name: string;
    completedDates: string[]; // ISO date strings
}

export default function Habits() {
    const today = new Date();

    // Weekly Streak Setup
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

    const [habits, setHabits] = useState<Habit[]>([
        { id: '1', name: 'Leer 15 min', completedDates: [today.toISOString()] },
        { id: '2', name: 'Skincare', completedDates: [] },
        { id: '3', name: 'Beber agua', completedDates: [] },
        { id: '4', name: 'Yoga', completedDates: [] },
    ]);

    const [mood, setMood] = useState<number | null>(null);
    const [gratitude, setGratitude] = useState('');

    const [selfCareItems, setSelfCareItems] = useState([
        { id: '1', label: 'Mascarilla', done: false },
        { id: '2', label: 'Caminar 30min', done: false },
        { id: '3', label: 'Desconexión digital', done: false },
        { id: '4', label: 'Té relajante', done: false },
        { id: '5', label: 'Estiramientos', done: false },
    ]);

    const toggleHabit = (habitId: string, date: Date) => {
        // Only allow toggling for today for simplicity in this mock
        if (!isSameDay(date, today)) return;

        setHabits(habits.map(h => {
            if (h.id !== habitId) return h;

            const dateStr = date.toISOString();
            const isCompleted = h.completedDates.some(d => isSameDay(new Date(d), date));

            return {
                ...h,
                completedDates: isCompleted
                    ? h.completedDates.filter(d => !isSameDay(new Date(d), date))
                    : [...h.completedDates, dateStr]
            };
        }));
    };

    const toggleSelfCare = (id: string) => {
        setSelfCareItems(items => items.map(item =>
            item.id === id ? { ...item, done: !item.done } : item
        ));
    };

    return (
        <div className="px-4 pb-4 max-w-md mx-auto space-y-8 animate-fade-in">

            {/* Header */}
            <header className="pt-6 pb-2">
                <h1 className="text-3xl font-serif text-text-main">
                    Bienestar
                </h1>
                <p className="text-text-muted text-sm">Pequeños pasos, grandes cambios.</p>
            </header>

            {/* Weekly Streak View */}
            <section className="bg-surface p-5 rounded-2xl shadow-sm">
                <h3 className="font-serif text-lg font-medium text-text-main mb-4">
                    Racha Semanal
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[300px]">
                        <thead>
                            <tr>
                                <th className="w-24 text-left text-xs font-normal text-text-muted pb-4">Hábito</th>
                                {last7Days.map((date) => (
                                    <th key={date.toString()} className="text-center pb-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] text-text-muted uppercase">
                                                {format(date, 'EEEEE', { locale: es })}
                                            </span>
                                            <span className={clsx(
                                                "text-xs font-medium",
                                                isSameDay(date, today) ? "text-secondary font-bold" : "text-text-main"
                                            )}>
                                                {format(date, 'd')}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map((habit) => (
                                <tr key={habit.id} className="group">
                                    <td className="py-3 text-sm font-medium text-text-main pr-2">
                                        {habit.name}
                                    </td>
                                    {last7Days.map((date) => {
                                        const isCompleted = habit.completedDates.some(d => isSameDay(new Date(d), date));
                                        const isToday = isSameDay(date, today);

                                        return (
                                            <td key={date.toString()} className="text-center py-2">
                                                <button
                                                    disabled={!isToday}
                                                    onClick={() => toggleHabit(habit.id, date)}
                                                    className={clsx(
                                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                                        isCompleted
                                                            ? "bg-secondary text-white scale-100 shadow-sm"
                                                            : "border border-gray-100 text-transparent",
                                                        isToday && !isCompleted && "border-secondary/30 hover:bg-secondary/10 cursor-pointer",
                                                        !isToday && !isCompleted && "bg-gray-50 opacity-50"
                                                    )}
                                                >
                                                    {isCompleted && <CheckIcon size={14} strokeWidth={4} />}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Mood Tracker */}
            <section className="bg-surface p-5 rounded-2xl shadow-sm bg-gradient-to-br from-surface to-secondary/5">
                <h3 className="font-serif text-lg font-medium text-text-main mb-4 text-center">
                    ¿Cómo te sientes hoy?
                </h3>
                <div className="flex justify-between px-4">
                    {[
                        { val: 1, icon: CloudRain, label: 'Mal' },
                        { val: 2, icon: Cloud, label: 'Regular' },
                        { val: 3, icon: Meh, label: 'Normal' },
                        { val: 4, icon: Sun, label: 'Bien' }, // Using Sun as happy
                        { val: 5, icon: Heart, label: 'Genial' } // Heart as Very Good
                    ].map((m) => (
                        <button
                            key={m.val}
                            onClick={() => setMood(m.val)}
                            className={clsx(
                                "flex flex-col items-center gap-2 transition-all duration-300 transform",
                                mood === m.val ? "scale-125 text-primary" : "text-text-muted hover:text-primary/60 scale-100"
                            )}
                        >
                            <m.icon
                                size={32}
                                strokeWidth={1.5}
                                fill={mood === m.val ? "currentColor" : "none"}
                                className="bg-paper rounded-full p-1 shadow-sm"
                            />
                        </button>
                    ))}
                </div>
            </section>

            {/* Gratitude Journal */}
            <section className="bg-paper p-6 rounded-2xl shadow-inner border border-stone-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
                <h3 className="font-serif text-lg font-medium text-text-main mb-3">
                    Hoy agradezco por...
                </h3>
                <textarea
                    value={gratitude}
                    onChange={(e) => setGratitude(e.target.value)}
                    placeholder="Escribe algo positivo..."
                    className="w-full bg-transparent border-none resize-none focus:ring-0 text-text-main leading-relaxed placeholder-text-muted/50 h-24 text-base font-handwriting"
                    style={{ backgroundImage: 'linear-gradient(transparent 1.9rem, #E5E7EB 1.95rem)', backgroundSize: '100% 2rem', lineHeight: '2rem' }}
                />
            </section>

            {/* Self-Care Menu */}
            <section>
                <h3 className="font-serif text-lg font-medium text-text-main mb-4 px-1">
                    Ideas para cuidarme hoy
                </h3>
                <div className="flex flex-wrap gap-3">
                    {selfCareItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => toggleSelfCare(item.id)}
                            className={clsx(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                                item.done
                                    ? "bg-secondary/20 border-secondary/20 text-text-main shadow-inner"
                                    : "bg-surface border-transparent text-text-muted hover:bg-white hover:text-secondary shadow-sm"
                            )}
                        >
                            {item.label} {item.done && "✨"}
                        </button>
                    ))}
                </div>
            </section>

            {/* Spacer */}
            <div className="h-4" />
        </div>
    );
}

function CheckIcon({ size, strokeWidth }: { size?: number, strokeWidth?: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
    );
}
