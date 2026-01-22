import { useState } from 'react';
import DateStrip from '@/components/planner/DateStrip';
import { Plus, Check, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

interface Task {
    id: string;
    text: string;
    completed: boolean;
}

export default function Planner() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Prioridades
    const [priorities, setPriorities] = useState(['', '', '']);

    // Time Blocking (5 AM - 10 PM)
    const hours = Array.from({ length: 18 }, (_, i) => i + 5); // 5 to 22 (10pm)
    const [schedule, setSchedule] = useState<Record<number, string>>({});

    // Tasks
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', text: 'Revisar correos', completed: false },
        { id: '2', text: 'Hacer ejercicio', completed: true },
    ]);
    const [newTaskText, setNewTaskText] = useState('');
    const [isAddingTask, setIsAddingTask] = useState(false);

    const handlePriorityChange = (index: number, value: string) => {
        const newPriorities = [...priorities];
        newPriorities[index] = value;
        setPriorities(newPriorities);
    };

    const handleScheduleChange = (hour: number, value: string) => {
        setSchedule(prev => ({ ...prev, [hour]: value }));
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const addTask = () => {
        if (newTaskText.trim()) {
            setTasks([...tasks, { id: crypto.randomUUID(), text: newTaskText, completed: false }]);
            setNewTaskText('');
            setIsAddingTask(false);
        }
    };

    return (
        <div className="px-4 pb-4 max-w-md mx-auto space-y-8 animate-fade-in">

            {/* Date Selector */}
            <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            {/* Priorities */}
            <section className="bg-accent/10 p-5 rounded-2xl border-l-4 border-accent">
                <h3 className="font-serif text-lg font-medium text-text-main mb-3">
                    Prioridades del Día
                </h3>
                <div className="space-y-3">
                    {priorities.map((priority, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <span className="text-accent font-bold text-lg">{index + 1}.</span>
                            <input
                                type="text"
                                value={priority}
                                onChange={(e) => handlePriorityChange(index, e.target.value)}
                                placeholder="Escribe una prioridad..."
                                className="w-full bg-transparent border-b border-accent/20 pb-1 text-text-main placeholder-text-muted/60 focus:outline-none focus:border-accent transition-colors"
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Time Blocking */}
            <section className="bg-surface p-5 rounded-2xl shadow-sm">
                <h3 className="font-serif text-lg font-medium text-text-main mb-4">
                    Agenda
                </h3>
                <div className="space-y-4">
                    {hours.map((hour) => (
                        <div key={hour} className="flex gap-4 items-baseline group">
                            <span className="w-12 text-sm text-text-muted font-medium text-right shrink-0">
                                {hour}:00
                            </span>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={schedule[hour] || ''}
                                    onChange={(e) => handleScheduleChange(hour, e.target.value)}
                                    placeholder="Escribe aquí..."
                                    className="w-full bg-transparent border-b border-gray-100 py-1 text-sm text-text-main placeholder-gray-200 focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* To-Do List */}
            <section className="bg-surface p-5 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-lg font-medium text-text-main">
                        Tareas
                    </h3>
                    <button
                        onClick={() => setIsAddingTask(true)}
                        className="text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="space-y-2">
                    {tasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 group">
                            <button
                                onClick={() => toggleTask(task.id)}
                                className={clsx(
                                    "shrink-0 w-5 h-5 rounded border transition-colors flex items-center justify-center",
                                    task.completed ? "bg-secondary border-secondary text-white" : "border-text-muted/40 text-transparent hover:border-secondary"
                                )}
                            >
                                <Check size={14} strokeWidth={3} />
                            </button>
                            <span className={clsx(
                                "flex-1 text-sm transition-all decoration-secondary/50",
                                task.completed ? "text-text-muted line-through" : "text-text-main"
                            )}>
                                {task.text}
                            </span>
                            <button
                                onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                                className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    {isAddingTask && (
                        <div className="flex items-center gap-3 animate-fade-in">
                            <div className="w-5 h-5 rounded border border-dashed border-text-muted/40 shrink-0" />
                            <input
                                autoFocus
                                type="text"
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                                onBlur={() => !newTaskText && setIsAddingTask(false)}
                                placeholder="Nueva tarea..."
                                className="flex-1 bg-transparent text-sm focus:outline-none placeholder-text-muted/50"
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom spacer handled by Layout, but extra safety */}
            <div className="h-4" />
        </div>
    );
}
