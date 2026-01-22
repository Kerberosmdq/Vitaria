import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { Transaction } from '@/hooks/useFinance';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Transaction, 'id' | 'date'>) => Promise<boolean>;
}

export default function AddTransactionModal({ isOpen, onClose, onSave }: AddTransactionModalProps) {
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'needs' | 'wants' | 'savings'>('needs');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description) return;

        setLoading(true);
        const success = await onSave({
            type,
            amount: parseFloat(amount),
            // If income, category is general, otherwise user selection
            category: type === 'income' ? 'general' : category,
            description
        });
        setLoading(false);

        if (success) {
            setAmount('');
            setDescription('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-paper w-full max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transform transition-transform animate-slide-up">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-xl text-text-main">Nuevo Movimiento</h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                        <X size={20} className="text-text-muted" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Type Toggle */}
                    <div className="flex bg-surface rounded-xl p-1 shadow-sm border border-stone-100">
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={clsx(
                                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                                type === 'expense' ? "bg-red-50 text-red-500 shadow-sm" : "text-text-muted"
                            )}
                        >
                            Gasto
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={clsx(
                                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                                type === 'income' ? "bg-green-50 text-green-600 shadow-sm" : "text-text-muted"
                            )}
                        >
                            Ingreso
                        </button>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                            Monto
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-main font-serif text-xl">$</span>
                            <input
                                type="number"
                                inputMode="decimal"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-surface border-none rounded-2xl py-4 pl-10 pr-4 text-3xl font-serif text-text-main placeholder-stone-200 focus:ring-2 focus:ring-primary/20 outline-none transition-shadow"
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descripción (ej: Supermercado)"
                            className="w-full bg-transparent border-b border-stone-200 py-2 text-text-main placeholder-stone-300 focus:border-primary outline-none transition-colors"
                        />

                        {type === 'expense' && (
                            <div className="pt-2">
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
                                    Categoría (50/30/20)
                                </label>
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    {[
                                        { id: 'needs', label: 'Necesidades (50%)', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                                        { id: 'wants', label: 'Deseos (30%)', color: 'bg-purple-100 text-purple-700 border-purple-200' },
                                        { id: 'savings', label: 'Ahorro (20%)', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                                    ].map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setCategory(cat.id as any)}
                                            className={clsx(
                                                "whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium border transition-all",
                                                category === cat.id ? cat.color : "bg-surface border-stone-100 text-text-muted"
                                            )}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-text-main text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : (
                            <>
                                <Check size={18} /> Guardar Movimiento
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}
