import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Planner from '@/pages/Planner';
import Habits from '@/pages/Habits';
import Finance from '@/pages/Finance';
import Meals from '@/pages/Meals';
import Login from '@/pages/Login';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { session, loading } = useAuth();

    if (loading) return <div className="h-screen flex items-center justify-center bg-paper text-text-muted">Cargando...</div>;
    if (!session) return <Navigate to="/login" replace />;

    return <>{children}</>;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Dashboard />
                            </AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/planner" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Planner />
                            </AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/habits" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Habits />
                            </AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/finance" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Finance />
                            </AppLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/meals" element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Meals />
                            </AppLayout>
                        </ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
