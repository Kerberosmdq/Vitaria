import { useState } from 'react';
import { ArrowUp, ArrowDown, Plus, ShoppingCart, Home, Coffee, Wallet, Trash2, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useFinance } from '@/hooks/useFinance';
import AddTransactionModal from '@/components/finance/AddTransactionModal';
import BudgetSettingsModal from '@/components/finance/BudgetSettingsModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Finance() {
    const {
        transactions,
        stats,
        loading,
        selectedDate,
        changeMonth,
        budgetSettings,
        updateBudgetSettings,
        addTransaction,
        deleteTransaction
    } = useFinance();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    // Calculate percentages safely (avoid /0)
    const getPercent = (value: number) => {
        if (stats.totalIncome === 0) return 0;
        return Math.min(100, (value / stats.totalIncome) * 100);
    };

    const needsPercent = getPercent(stats.totalNeeds);
    const wantsPercent = getPercent(stats.totalWants);
    const savingsPercent = getPercent(stats.totalSavings);

    return (
        <div className="px-4 pb-24 max-w-md mx-auto space-y-6 animate-fade-in relative min-h-screen">

            <header className="pt-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-serif text-text-main leading-tight mb-1">Finanzas</h1>
                    <div className="flex items-center gap-2 bg-white/50 rounded-full px-2 py-1 -ml-2">
                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-stone-200 rounded-full text-text-muted">
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm font-medium text-text-main capitalize w-24 text-center">
                            {format(selectedDate, 'MMMM yyyy', { locale: es })}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-stone-200 rounded-full text-text-muted">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="p-2 text-text-muted hover:bg-stone-100 rounded-full transition-colors"
                    >
                        <Settings size={20} />
                    </button>
                    {loading && <span className="text-primary text-[10px] animate-pulse">Cargando...</span>}
                </div>
            </header>

            {/* Main Balance Card */}
            <div className="bg-text-main text-paper rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <p className="text-white/60 text-sm mb-1">Saldo Disponible</p>
                    <h2 className="text-4xl font-serif mb-6 text-white">${stats.balance.toLocaleString()}</h2>

                    <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-green-300">
                                <ArrowUp size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/50 uppercase tracking-wider">Ingresos</p>
                                <p className="font-medium text-white">${stats.totalIncome.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-red-300">
                                <ArrowDown size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/50 uppercase tracking-wider">Gastos</p>
                                <p className="font-medium text-white">${stats.totalExpenses.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Budget */}
            <section className="bg-surface p-5 rounded-2xl shadow-sm border border-stone-50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-lg text-text-main">
                        Presupuesto ({budgetSettings.needs}/{budgetSettings.wants}/{budgetSettings.savings})
                    </h3>
                    {stats.totalIncome === 0 && <span className="text-[10px] text-orange-400 bg-orange-50 px-2 py-1 rounded-full">Sin Ingresos</span>}
                </div>

                <div className="space-y-4">
                    {/* Needs */}
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-text-main">Necesidades ({budgetSettings.needs}%)</span>
                            <span className="text-text-muted">${stats.totalNeeds.toLocaleString()} ({Math.round(needsPercent)}%)</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-400/80 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${needsPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Wants */}
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-text-main">Deseos ({budgetSettings.wants}%)</span>
                            <span className="text-text-muted">${stats.totalWants.toLocaleString()} ({Math.round(wantsPercent)}%)</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary/80 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${wantsPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Savings */}
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-text-main">Ahorro ({budgetSettings.savings}%)</span>
                            <span className="text-text-muted">${stats.totalSavings.toLocaleString()} ({Math.round(savingsPercent)}%)</span>
                        </div>
                        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-secondary/80 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${savingsPercent}%` }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Transactions */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-lg text-text-main">Movimientos</h3>
                    <span className="text-xs text-text-muted capitalize">
                        {format(selectedDate, 'MMM yyyy', { locale: es })}
                    </span>
                </div>

                <div className="space-y-3">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="bg-surface p-4 rounded-2xl flex items-center justify-between shadow-sm border border-stone-50 group">
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "w-10 h-10 rounded-full flex items-center justify-center",
                                    tx.type === 'income' ? "bg-green-50 text-green-600" : "bg-stone-50 text-text-muted"
                                )}>
                                    {tx.type === 'income' ? <Wallet size={18} /> :
                                        tx.category === 'needs' ? <Home size={18} /> :
                                            tx.category === 'wants' ? <ShoppingBagIcon category={tx.category} /> : <Coffee size={18} />}
                                </div>
                                <div>
                                    <p className="font-medium text-text-main text-sm">{tx.description}</p>
                                    <p className="text-xs text-text-muted capitalize">
                                        {format(new Date(tx.date), "d MMM", { locale: es })} • {tx.category === 'general' ? 'Ingreso' : tx.category}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={clsx(
                                    "font-mono font-medium text-sm",
                                    tx.type === 'income' ? "text-green-600" : "text-text-main"
                                )}>
                                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                                </span>
                                <button
                                    onClick={() => deleteTransaction(tx.id)}
                                    className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all p-1"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {transactions.length === 0 && (
                        <div className="text-center py-8 text-text-muted/50 text-xs italic">
                            No hay movimientos en {format(selectedDate, 'MMMM', { locale: es })}.
                        </div>
                    )}
                </div>
            </section>

            {/* FAB */}
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="fixed bottom-24 right-4 w-14 h-14 bg-text-main text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-20"
            >
                <Plus size={24} />
            </button>

            <AddTransactionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={addTransaction}
            />

            <BudgetSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                currentSettings={budgetSettings}
                onSave={updateBudgetSettings}
            />
        </div>
    );
}

// Helper icon
function ShoppingBagIcon({ category }: { category: string }) {
    if (category === 'wants') return <ShoppingCart size={18} />;
    return <Wallet size={18} />;
}
