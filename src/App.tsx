import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Planner from '@/pages/Planner';
import Habits from '@/pages/Habits';
import Finance from '@/pages/Finance';
import Meals from '@/pages/Meals';




function App() {
    return (
        <BrowserRouter>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/planner" element={<Planner />} />
                    <Route path="/habits" element={<Habits />} />
                    <Route path="/finance" element={<Finance />} />
                    <Route path="/meals" element={<Meals />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AppLayout>
        </BrowserRouter>
    );
}

export default App;
