import { ArrowUp, ArrowDown, ShoppingCart, Home, Coffee, Plus, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Transaction {
    id: string;
    name: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
    date: Date;
}

export default function Finance() {
    // Mock Data
    const income = 2850.00;
    const expenses = 1240.50;
    const balance = income - expenses;

    // Budget Data (50/30/20)
    const budget = {
        needs: { limit: 1500, spent: 850 }, // 50%
        wants: { limit: 900, spent: 390 },  // 30%
        savings: { limit: 600, saved: 400 }, // 20%
    };

    const transactions: Transaction[] = [
        { id: '1', name: 'Supermercado', category: 'necesidad', amount: 125.50, type: 'expense', date: new Date() },
        { id: '2', name: 'Alquiler', category: 'necesidad', amount: 600.00, type: 'expense', date: new Date() },
        { id: '3', name: 'Freelance Design', category: 'income', amount: 850.00, type: 'income', date: new Date() },
        { id: '4', name: 'Café & Brunch', category: 'deseo', amount: 45.00, type: 'expense', date: new Date() },
    ];

    return (
        <div className="px-4 pb-24 max-w-md mx-auto space-y-6 animate-fade-in relative">

            {/* Header */}
            <header className="pt-6 pb-2">
                <h1 className="text-3xl font-serif text-text-main">
                    Finanzas
                </h1>
                <p className="text-text-muted text-sm">Control consciente, sin estrés.</p>
            </header>

            {/* Balance Card */}
            <section className="bg-surface p-6 rounded-2xl shadow-sm border border-primary/5">
                <div className="text-center mb-6">
                    <p className="text-sm text-text-muted uppercase tracking-wider mb-1">Saldo del Mes</p>
                    <h2 className="text-4xl font-sans font-semibold text-text-main tracking-tight">
                        $ {balance.toFixed(2)}
                    </h2>
                </div>

                <div className="flex justify-between items-center px-4">
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-secondary font-medium bg-secondary/10 px-2 py-1 rounded-full text-xs">
                            <ArrowUp size={14} />
                            <span>Ingresos</span>
                        </div>
                        <span className="font-medium text-lg text-text-main">
                            $ {income.toFixed(0)}
                        </span>
                    </div>
                    <div className="w-[1px] h-10 bg-gray-100"></div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-1 text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full text-xs">
                            <ArrowDown size={14} />
                            <span>Gastos</span>
                        </div>
                        <span className="font-medium text-lg text-text-main">
                            $ {expenses.toFixed(0)}
                        </span>
                    </div>
                </div>
            </section>

            {/* 50/30/20 Budget Tracker */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-serif text-lg font-medium text-text-main">
                        Mi Presupuesto (50/30/20)
                    </h3>
                    <button className="text-text-muted opacity-50 hover:opacity-100">
                        <HelpCircle size={16} />
                    </button>
                </div>

                <div className="space-y-4 bg-surface p-5 rounded-2xl shadow-sm">
                    {/* Needs */}
                    <BudgetBar
                        label="Necesidades (50%)"
                        current={budget.needs.spent}
                        max={budget.needs.limit}
                        colorClass="bg-blue-400/80"
                    />
                    {/* Wants */}
                    <BudgetBar
                        label="Deseos (30%)"
                        current={budget.wants.spent}
                        max={budget.wants.limit}
                        colorClass="bg-primary"
                    />
                    {/* Savings */}
                    <BudgetBar
                        label="Ahorros (20%)"
                        current={budget.savings.saved}
                        max={budget.savings.limit}
                        colorClass="bg-secondary"
                    />
                </div>
            </section>

            {/* Recent Transactions */}
            <section>
                <h3 className="font-serif text-lg font-medium text-text-main mb-4 px-1">
                    Últimos Movimientos
                </h3>
                <div className="space-y-3">
                    {transactions.map((t) => (
                        <div key={t.id} className="bg-surface p-4 rounded-xl shadow-sm flex items-center justify-between border border-transparent hover:border-primary/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center text-text-muted">
                                    <CategoryIcon category={t.category} />
                                </div>
                                <div>
                                    <p className="font-medium text-text-main text-sm">{t.name}</p>
                                    <p className="text-xs text-text-muted first-letter:uppercase">
                                        {format(t.date, "d MMM", { locale: es })}
                                    </p>
                                </div>
                            </div>
                            <span className={clsx(
                                "font-mono font-medium",
                                t.type === 'income' ? "text-secondary" : "text-red-400"
                            )}>
                                {t.type === 'income' ? '+' : '-'} ${t.amount.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAB */}
            <button className="fixed bottom-24 right-5 w-14 h-14 bg-text-main text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-50">
                <Plus size={28} />
            </button>

        </div>
    );
}

function BudgetBar({ label, current, max, colorClass }: { label: string, current: number, max: number, colorClass: string }) {
    const percentage = Math.min((current / max) * 100, 100);

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-text-muted">{label}</span>
                <span className="text-text-main font-semibold">
                    ${current} <span className="text-text-muted font-normal">/ ${max}</span>
                </span>
            </div>
            <div className="h-2.5 w-full bg-paper rounded-full overflow-hidden">
                <div
                    className={clsx("h-full rounded-full transition-all duration-1000", colorClass)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

function CategoryIcon({ category }: { category: string }) {
    if (category.includes('necesidad') || category.includes('alquiler') || category.includes('casa')) return <Home size={18} />;
    if (category.includes('super')) return <ShoppingCart size={18} />;
    if (category.includes('deseo') || category.includes('café')) return <Coffee size={18} />;
    return <ShoppingBag size={18} />;
}

// Fallback icon
function ShoppingBag({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
    )
}
