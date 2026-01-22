import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Calendar, Sparkles, PieChart, Utensils } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-paper text-text-main font-sans">
            <main className="pb-28">
                {children}
            </main>
            <BottomNavigation />
        </div>
    );
}

function BottomNavigation() {
    const location = useLocation();

    const navItems = [
        { icon: LayoutGrid, label: 'Home', path: '/' },
        { icon: Calendar, label: 'Planner', path: '/planner' },
        { icon: Sparkles, label: 'Hábitos', path: '/habits' },
        { icon: PieChart, label: 'Finanzas', path: '/finance' },
        { icon: Utensils, label: 'Comidas', path: '/meals' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-paper border-t border-primary/20 pb-safe pt-2 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-50">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={twMerge(
                                "flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-300",
                                isActive ? "text-primary scale-105" : "text-text-muted hover:text-primary/60"
                            )}
                        >
                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 2}
                                className={clsx("mb-1 transition-transform", isActive && "animate-pulse-subtle")}
                            />
                            <span className="text-[10px] font-medium tracking-wide">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
