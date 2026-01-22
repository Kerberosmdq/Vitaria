import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { Check, Star, Smile, Meh, Frown, Pencil } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
    const { user } = useAuth();
    const today = new Date();

    const [isEditing, setIsEditing] = useState(false);
    const [displayName, setDisplayName] = useState('Miga');

    useEffect(() => {
        if (user?.user_metadata?.full_name) {
            setDisplayName(user.user_metadata.full_name);
        }
    }, [user]);

    const handleUpdateName = async () => {
        if (!displayName.trim()) return;

        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: displayName }
            });
            if (error) throw error;
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating name:', error);
        }
    };

    // Mock Data
    const [habits, setHabits] = useState([
        { id: 1, name: 'Meditar', completed: false },
        { id: 2, name: 'Leer 20m', completed: true },
        { id: 3, name: 'Agua 2L', completed: false },
        { id: 4, name: 'Caminar', completed: false },
    ]);

    const [mood, setMood] = useState<number | null>(null);

    const toggleHabit = (id: number) => {
        setHabits(habits.map(h =>
            h.id === id ? { ...h, completed: !h.completed } : h
        ));
    };

    return (
        <div className="px-4 pt-8 max-w-md mx-auto space-y-6 animate-fade-in">

            {/* Header */}
            <header className="space-y-1">
                <h2 className="text-text-muted text-sm font-medium uppercase tracking-wider">
                    {format(today, "EEEE, d 'de' MMMM", { locale: es })}
                </h2>
                <div className="flex items-center gap-2 group">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-serif text-text-main flex items-center">
                                Hola,
                                <input
                                    autoFocus
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    onBlur={handleUpdateName}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
                                    className="ml-2 bg-transparent border-b border-primary outline-none w-32 font-serif text-text-main placeholder-text-muted/50"
                                />
                            </h1>
                            <button onClick={handleUpdateName} className="p-1 text-primary hover:bg-stone-100 rounded-full">
                                <Check size={20} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-serif text-text-main">
                                Hola, {displayName}
                            </h1>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-text-muted hover:text-primary hover:bg-stone-100 rounded-lg"
                            >
                                <Pencil size={16} />
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Daily Focus Widget */}
            <section className="bg-surface p-5 rounded-2xl shadow-sm border border-primary/5">
                <div className="flex items-center gap-2 mb-2 text-primary">
                    <Star size={18} fill="currentColor" className="opacity-80" />
                    <h3 className="text-sm font-bold tracking-wide uppercase">Foco del Día</h3>
                </div>
                <p className="text-xl font-medium text-text-main">
                    Planificar viaje a la costa
                </p>
            </section>

            {/* Habits Widget */}
            <section className="bg-surface p-5 rounded-2xl shadow-sm border border-primary/5">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wide mb-4">
                    Hábitos para hoy
                </h3>
                <div className="flex justify-between items-center">
                    {habits.map((habit) => (
                        <button
                            key={habit.id}
                            onClick={() => toggleHabit(habit.id)}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div
                                className={clsx(
                                    "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                    habit.completed
                                        ? "bg-secondary border-secondary text-white shadow-md scale-110"
                                        : "border-text-muted/30 text-transparent hover:border-secondary/50 group-active:scale-95"
                                )}
                            >
                                <Check size={20} strokeWidth={3} />
                            </div>
                            <span className="text-[10px] text-text-muted font-medium w-max">
                                {habit.name}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Mood Widget */}
            <section className="bg-surface p-5 rounded-2xl shadow-sm border border-primary/5">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wide mb-4">
                    ¿Cómo te sientes?
                </h3>
                <div className="flex justify-between px-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                        <button
                            key={score}
                            onClick={() => setMood(score)}
                            className={clsx(
                                "p-2 rounded-xl transition-all duration-300 hover:bg-paper",
                                mood === score ? "text-accent scale-125 bg-paper shadow-sm" : "text-text-muted"
                            )}
                        >
                            <Smile size={28} strokeWidth={1.5} className={score === 5 ? "block" : "hidden"} />
                            <Smile size={28} strokeWidth={1.5} className={score === 4 ? "block" : "hidden"} />
                            <Meh size={28} strokeWidth={1.5} className={score === 3 ? "block" : "hidden"} />
                            <Frown size={28} strokeWidth={1.5} className={score === 2 ? "block" : "hidden"} />
                            <Frown size={28} strokeWidth={1.5} className={score === 1 ? "block" : "hidden"} />
                        </button>
                    ))}
                </div>
            </section>

            {/* Next Meal Widget */}
            <section className="bg-surface p-5 rounded-2xl shadow-sm border border-primary/5">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wide mb-2">
                    Próxima Comida
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded-full">
                            Almuerzo
                        </span>
                        <p className="mt-2 text-lg font-medium">Bowls de Quinoa</p>
                    </div>
                    <div className="w-12 h-12 bg-paper rounded-full flex items-center justify-center text-accent">
                        {/* Placeholder for food icon/image */}
                        <UtensilsIcon size={20} />
                    </div>
                </div>
            </section>

            {/* Bottom Spacer for scroll */}
            <div className="h-4"></div>
        </div>
    );
}

function UtensilsIcon({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
    )
}
