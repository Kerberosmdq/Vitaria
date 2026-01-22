import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { BudgetSettings } from '@/hooks/useFinance';

interface BudgetSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSettings: BudgetSettings;
    onSave: (settings: BudgetSettings) => Promise<boolean>;
}

export default function BudgetSettingsModal({ isOpen, onClose, currentSettings, onSave }: BudgetSettingsModalProps) {
    const [needs, setNeeds] = useState(currentSettings.needs);
    const [wants, setWants] = useState(currentSettings.wants);
    const [savings, setSavings] = useState(currentSettings.savings);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setNeeds(currentSettings.needs);
            setWants(currentSettings.wants);
            setSavings(currentSettings.savings);
        }
    }, [isOpen, currentSettings]);

    if (!isOpen) return null;

    const total = Number(needs) + Number(wants) + Number(savings);
    const isValid = total === 100;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setLoading(true);
        const success = await onSave({ needs, wants, savings });
        setLoading(false);
        if (success) onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in px-4">
            <div className="bg-paper w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-in">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-serif text-xl text-text-main">Configurar Presupuesto</h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                        <X size={20} className="text-text-muted" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-orange-50 p-4 rounded-xl flex items-start gap-3">
                        <AlertCircle size={20} className="text-orange-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-orange-800 leading-relaxed">
                            Ajusta los porcentajes de tu regla de presupuesto ideal.
                            Deben sumar exactamente 100%.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex justify-between text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                                <span>Necesidades</span>
                                <span className="text-text-main">{needs}%</span>
                            </label>
                            <input
                                type="range" min="0" max="100" step="5"
                                value={needs}
                                onChange={(e) => setNeeds(Number(e.target.value))}
                                className="w-full accent-blue-400"
                            />
                        </div>
                        <div>
                            <label className="flex justify-between text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                                <span>Deseos</span>
                                <span className="text-text-main">{wants}%</span>
                            </label>
                            <input
                                type="range" min="0" max="100" step="5"
                                value={wants}
                                onChange={(e) => setWants(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>
                        <div>
                            <label className="flex justify-between text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                                <span>Ahorro</span>
                                <span className="text-text-main">{savings}%</span>
                            </label>
                            <input
                                type="range" min="0" max="100" step="5"
                                value={savings}
                                onChange={(e) => setSavings(Number(e.target.value))}
                                className="w-full accent-secondary"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                        <span className="text-xs font-medium text-text-muted">Total</span>
                        <span className={`text-lg font-bold ${isValid ? 'text-green-600' : 'text-red-500'}`}>
                            {total}%
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !isValid}
                        className="w-full bg-text-main text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Guardando...' : (
                            <>
                                <Save size={18} /> Guardar Cambios
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
