import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { clsx } from 'clsx';

interface DateStripProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export default function DateStrip({ selectedDate, onSelectDate }: DateStripProps) {
    // Start from current week's Monday
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });

    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));

    return (
        <div className="flex justify-between items-center py-4 px-2 overflow-x-auto no-scrollbar gap-2">
            {weekDays.map((date) => {
                const isSelected = isSameDay(date, selectedDate);
                const isToday = isSameDay(date, today);

                return (
                    <button
                        key={date.toString()}
                        onClick={() => onSelectDate(date)}
                        className={clsx(
                            "flex flex-col items-center justify-center min-w-[3rem] h-[4.5rem] rounded-full transition-all duration-300",
                            isSelected
                                ? "bg-primary text-white shadow-md scale-105"
                                : "bg-surface text-text-muted hover:bg-surface/80",
                            !isSelected && isToday && "border-2 border-primary/30"
                        )}
                    >
                        <span className="text-xs font-medium uppercase mb-1">
                            {format(date, 'EEEEE', { locale: es })}
                        </span>
                        <span className={clsx("text-lg font-bold", isSelected ? "text-white" : "text-text-main")}>
                            {format(date, 'd')}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
