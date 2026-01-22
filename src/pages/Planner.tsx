import { useState } from 'react';
import { format, addHours, startOfDay } from 'date-fns';
import { Plus, CheckSquare, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import DateStrip from '@/components/planner/DateStrip';
import { usePlanner } from '@/hooks/usePlanner';

export default function Planner() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const {
        tasks,
        entries,
        loading,
        addTask,
        toggleTask,
        deleteTask,
        updateEntry
    } = usePlanner(selectedDate);

    const [newTask, setNewTask] = useState('');

    // Generate time slots 05:00 to 22:00
    const startHour = 5;
    const endHour = 22;
    const schedule = Array.from({ length: endHour - startHour + 1 }, (_, i) => {
        const date = addHours(startOfDay(new Date()), startHour + i);
        return {
            timeLabel: format(date, 'h a'),
            hourKey: `schedule_${String(startHour + i).padStart(2, '0')}` // e.g., schedule_05
        };
    });

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        addTask(newTask);
        setNewTask('');
    };

    return (
        <div className="px-4 pb-24 max-w-md mx-auto space-y-8 animate-fade-in">

            {/* Header / Date Strip */}
            <div className="pt-6">
                <h1 className="text-3xl font-serif text-text-main mb-4 flex items-center gap-2">
                    Agenda
                    {loading && <span className="text-xs font-sans text-primary animate-pulse">(Sync...)</span>}
                </h1>
                <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </div>

            {/* Top 3 Priorities */}
            <section className="space-y-3">
                <h3 className="font-serif text-lg font-medium text-text-main">Prioridades del Día</h3>
                <div className="space-y-2">
                    {[1, 2, 3].map((num) => (
                        <div key={num} className="flex gap-2">
                            <div className="font-serif text-accent font-bold text-xl opacity-50 w-6 text-right">
                                {num}.
                            </div>
                            <input
                                type="text"
                                value={entries[`priority_${num}`] || ''}
                                onChange={(e) => updateEntry(`priority_${num}`, e.target.value)}
                                placeholder="Escribe tu prioridad..."
                                className="flex-1 bg-accent/5 border-b-2 border-accent/20 focus:border-accent px-2 py-1 outline-none transition-colors text-text-main"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Time Blocking (05:00 - 22:00) */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg font-medium text-text-main">
                        Horario
                    </h3>
                    <span className="text-xs text-text-muted">05:00 - 22:00</span>
                </div>

                <div className="bg-surface rounded-2xl shadow-sm p-4 space-y-4">
                    {schedule.map(({ timeLabel, hourKey }) => (
                        <div key={hourKey} className="flex items-start gap-4 group">
                            <span className="text-xs font-bold text-text-muted w-10 pt-2 text-right">
                                {timeLabel}
                            </span>
                            <div className="flex-1 border-l-2 border-gray-100 pl-3 py-1 group-focus-within:border-primary/50 transition-colors">
                                <input
                                    type="text"
                                    value={entries[hourKey] || ''}
                                    onChange={(e) => updateEntry(hourKey, e.target.value)}
                                    placeholder=""
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm placeholder-gray-300"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* To-Do List */}
            <section>
                <h3 className="font-serif text-lg font-medium text-text-main mb-4">
                    Tareas Pendientes
                </h3>

                <form onSubmit={handleAddTask} className="flex items-center gap-2 mb-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
                    <button type="submit" className="text-primary hover:bg-primary/10 p-1 rounded-full transition-colors">
                        <Plus size={20} />
                    </button>
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Nueva tarea..."
                        className="flex-1 bg-transparent border-none outline-none text-sm placeholder-text-muted"
                    />
                </form>

                <div className="space-y-2">
                    {tasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 group">
                            <button
                                onClick={() => toggleTask(task.id, task.is_completed)}
                                className={clsx(
                                    "mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer",
                                    task.is_completed ? "bg-primary border-primary text-white" : "border-gray-300 hover:border-primary"
                                )}
                            >
                                {task.is_completed && <CheckSquare size={14} />}
                            </button>
                            <div className="flex-1 border-b border-gray-50 pb-2 flex justify-between">
                                <span className={clsx(
                                    "text-sm transition-all text-text-main",
                                    task.is_completed && "line-through text-text-muted decoration-text-muted/50"
                                )}>
                                    {task.title}
                                </span>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="text-text-muted opacity-0 group-hover:opacity-100 hover:text-red-400 text-xs transition-opacity px-2"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {tasks.length === 0 && (
                        <p className="text-center text-xs text-text-muted/50 py-4 italic">
                            No hay tareas para hoy.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}
