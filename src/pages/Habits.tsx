import { useState } from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Meh, Heart, Sun, Cloud, CloudRain, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useHabits } from '@/hooks/useHabits'; // Hook import

export default function Habits() {
    const today = new Date();
    // Weekly Streak Setup
    // Weekly Streak Setup
    // last7Days defined below after hook call

    const {
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
    } = useHabits();

    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(selectedDate, 6 - i));
    const isCurrentWeek = isSameDay(selectedDate, today);

    const [isAdding, setIsAdding] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');

    const [selfCareItems, setSelfCareItems] = useState([
        { id: '1', label: 'Mascarilla', done: false },
        { id: '2', label: 'Caminar 30min', done: false },
        { id: '3', label: 'Desconexión digital', done: false },
        { id: '4', label: 'Té relajante', done: false },
        { id: '5', label: 'Estiramientos', done: false },
        { id: '6', label: 'Llamar a una amiga', done: false },
    ]);

    const handleAddHabit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newHabitName.trim()) {
            addHabit(newHabitName);
            setNewHabitName('');
            setIsAdding(false);
        }
    };

    const toggleSelfCare = (id: string) => {
        setSelfCareItems(items => items.map(item =>
            item.id === id ? { ...item, done: !item.done } : item
        ));
    };

    return (
        <div className="px-4 pb-24 max-w-md mx-auto space-y-8 animate-fade-in">

            {/* Header */}
            <header className="pt-6 pb-2">
                <h1 className="text-3xl font-serif text-text-main">
                    Bienestar
                </h1>
                <p className="text-text-muted text-sm">Pequeños pasos, grandes cambios.</p>
            </header>

            {/* Weekly Streak View */}
            <section className="bg-surface p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg font-medium text-text-main">
                            Racha
                        </h3>
                        <div className="flex items-center gap-1 bg-stone-100 rounded-lg px-1 py-0.5">
                            <button onClick={() => changeWeek(-1)} className="p-1 hover:bg-stone-200 rounded-md text-text-muted">
                                <ChevronLeft size={14} />
                            </button>
                            <span className="text-[10px] text-text-muted uppercase w-20 text-center font-medium">
                                {format(subDays(selectedDate, 6), 'd MMM', { locale: es })} - {format(selectedDate, 'd MMM', { locale: es })}
                            </span>
                            <button
                                onClick={() => changeWeek(1)}
                                disabled={isCurrentWeek}
                                className={clsx("p-1 rounded-md transition-colors", isCurrentWeek ? "text-stone-300" : "hover:bg-stone-200 text-text-muted")}
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="text-primary hover:bg-stone-100 p-1 rounded-full transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Add Habit Form */}
                {isAdding && (
                    <form onSubmit={handleAddHabit} className="mb-4 flex gap-2 animate-fade-in">
                        <input
                            autoFocus
                            type="text"
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            placeholder="Nuevo hábito..."
                            className="flex-1 bg-gray-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary/50"
                        />
                        <button type="submit" className="bg-primary text-white text-xs px-3 rounded-lg font-medium">
                            Crear
                        </button>
                    </form>
                )}

                <div className="overflow-x-auto no-scrollbar">
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
                                    <td className="py-3 text-sm font-medium text-text-main pr-2 whitespace-normal break-words max-w-[120px]">
                                        {habit.name}
                                    </td>
                                    {last7Days.map((date) => {
                                        const dateStr = format(date, 'yyyy-MM-dd');
                                        const isCompleted = logs.some(l => l.habit_id === habit.id && l.date === dateStr && l.status === 'completed');
                                        const isFuture = date > today;

                                        return (
                                            <td key={date.toString()} className="text-center py-2">
                                                <button
                                                    disabled={isFuture}
                                                    onClick={() => toggleHabit(habit.id, date)}
                                                    className={clsx(
                                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                                        isCompleted
                                                            ? "bg-secondary text-white scale-100 shadow-sm"
                                                            : "border border-gray-100 text-transparent hover:border-secondary/30",
                                                        isFuture && "opacity-20 cursor-not-allowed hover:border-transparent"
                                                    )}
                                                >
                                                    {isCompleted && <Check size={14} strokeWidth={4} />}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            {habits.length === 0 && !isAdding && (
                                <tr>
                                    <td colSpan={8} className="text-center py-8 text-xs text-text-muted italic">
                                        No tienes hábitos aún. ¡Crea el primero!
                                    </td>
                                </tr>
                            )}
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
                        { val: 4, icon: Sun, label: 'Bien' },
                        { val: 5, icon: Heart, label: 'Genial' }
                    ].map((m) => (
                        <button
                            key={m.val}
                            onClick={() => updateMood(m.val)}
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
                    onChange={(e) => updateGratitude(e.target.value)}
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
