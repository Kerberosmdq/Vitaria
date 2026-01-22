import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export default function Login() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            },
        });

        if (error) {
            setError(error.message);
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md bg-surface p-8 rounded-3xl shadow-sm border border-stone-50 relative z-10 animate-fade-in-up">

                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 mb-4 relative">
                        <img src="/logo.png" alt="Vitaria Compass" className="w-full h-full object-contain drop-shadow-sm" />
                    </div>
                    <h1 className="font-serif text-3xl text-text-main mb-2">Vitaria</h1>
                    <p className="text-text-muted text-sm tracking-wide">Tu espacio de calma y organización</p>
                </div>

                {sent ? (
                    <div className="text-center py-8 animate-fade-in">
                        <div className="w-16 h-16 bg-green-50 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles size={32} />
                        </div>
                        <h3 className="font-serif text-xl text-text-main mb-2">¡Revisa tu correo!</h3>
                        <p className="text-text-muted text-sm">
                            Te hemos enviado un enlace mágico a <strong>{email}</strong> para entrar sin contraseña.
                        </p>
                        <button
                            onClick={() => setSent(false)}
                            className="mt-6 text-sm text-primary hover:underline"
                        >
                            Probar otro correo
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2 pl-1">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="hola@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-paper border border-stone-200 rounded-xl px-4 py-3 text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-text-muted/40"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-xs text-center p-2 bg-red-50 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={clsx(
                                "w-full bg-primary text-white font-medium py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98]",
                                loading && "opacity-70 cursor-not-allowed"
                            )}
                        >
                            {loading ? 'Enviando...' : 'Ingresar con Magic Link'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-text-muted/60">
                        Al ingresar aceptas nuestros Términos y Condiciones.
                    </p>
                </div>
            </div>
        </div>
    );
}
