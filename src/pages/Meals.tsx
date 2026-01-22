import { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Coffee, Utensils, Moon, Croissant, Plus, ShoppingCart } from 'lucide-react';
import { clsx } from 'clsx';



export default function Meals() {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

    const [shoppingList, setShoppingList] = useState([
        { id: '1', text: 'Aguacates', done: false },
        { id: '2', text: 'Leche de avena', done: false },
    ]);

    const toggleShoppingItem = (id: string) => {
        setShoppingList(prev => prev.map(item =>
            item.id === id ? { ...item, done: !item.done } : item
        ));
    };

    return (
        <div className="px-4 pb-24 max-w-md mx-auto space-y-6 animate-fade-in">

            {/* Header */}
            <header className="pt-6 pb-2">
                <h1 className="text-3xl font-serif text-text-main">
                    Planificador
                </h1>
                <p className="text-text-muted text-sm">Tu alimentación es parte de tu bienestar.</p>
            </header>

            {/* Weekly Menu */}
            <div className="space-y-4">
                {weekDays.map((date) => {
                    const isToday = isSameDay(date, today);
                    return (
                        <div
                            key={date.toString()}
                            className={clsx(
                                "bg-surface p-5 rounded-2xl shadow-sm transition-all duration-300",
                                isToday ? "border-l-4 border-primary ring-1 ring-primary/5" : "border-l-4 border-transparent hover:border-text-muted/20"
                            )}
                        >
                            <h3 className={clsx(
                                "font-serif text-lg mb-4 capitalize",
                                isToday ? "text-primary font-semibold" : "text-text-main"
                            )}>
                                {format(date, "EEEE d", { locale: es })}
                            </h3>

                            <div className="space-y-3">
                                <MealRow
                                    icon={Coffee}
                                    label="Desayuno"
                                    content="Tostadas con aguacate"
                                    isToday={isToday}
                                />
                                <MealRow
                                    icon={Utensils}
                                    label="Almuerzo"
                                    placeholder="+ Planificar almuerzo"
                                    isToday={isToday}
                                />
                                <MealRow
                                    icon={Croissant}
                                    label="Merienda"
                                    placeholder="+ Añadir merienda"
                                    isToday={isToday}
                                />
                                <MealRow
                                    icon={Moon}
                                    label="Cena"
                                    content="Crema de calabaza"
                                    isToday={isToday}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Shopping List Widget */}
            <section className="bg-paper border border-stone-200 p-5 rounded-2xl relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4 text-text-main">
                    <ShoppingCart size={18} />
                    <h3 className="font-serif text-lg font-medium">Lista del Súper</h3>
                </div>

                <div className="space-y-2">
                    {shoppingList.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => toggleShoppingItem(item.id)}
                            className="flex items-center gap-3 w-full text-left group"
                        >
                            <div className={clsx(
                                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                item.done ? "bg-text-muted border-text-muted" : "border-text-muted/40 group-hover:border-primary"
                            )}>
                                {item.done && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <span className={clsx(
                                "text-sm",
                                item.done ? "text-text-muted line-through" : "text-text-main"
                            )}>
                                {item.text}
                            </span>
                        </button>
                    ))}
                    <button className="flex items-center gap-3 w-full text-left text-text-muted hover:text-primary mt-2">
                        <Plus size={16} />
                        <span className="text-sm italic">Añadir ingrediente...</span>
                    </button>
                </div>
            </section>

        </div>
    );
}

function MealRow({ icon: Icon, label, content, placeholder, isToday }: { icon: any, label: string, content?: string, placeholder?: string, isToday: boolean }) {
    return (
        <div className="flex items-center gap-3">
            <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                isToday ? "bg-primary/10 text-primary" : "bg-gray-50 text-text-muted"
            )}>
                <Icon size={14} strokeWidth={2} />
            </div>
            <div className="flex-1 border-b border-gray-50 pb-2">
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-0.5">
                    {label}
                </p>
                {content ? (
                    <p className="text-sm text-text-main font-medium">{content}</p>
                ) : (
                    <p className="text-sm text-text-muted/60 italic cursor-pointer hover:text-primary">
                        {placeholder}
                    </p>
                )}
            </div>
        </div>
    )
}
