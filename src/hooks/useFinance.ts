import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { startOfMonth, endOfMonth, addMonths } from 'date-fns';

export interface Transaction {
    id: string;
    amount: number;
    type: 'income' | 'expense';
    category: 'needs' | 'wants' | 'savings' | 'general';
    description: string;
    date: string;
}

export interface BudgetSettings {
    needs: number;
    wants: number;
    savings: number;
}

export function useFinance() {
    const { user } = useAuth();

    // State for Transactions
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // State for Settings
    const [budgetSettings, setBudgetSettings] = useState<BudgetSettings>({ needs: 50, wants: 30, savings: 20 });
    const [loadingSettings, setLoadingSettings] = useState(true);

    // Stats
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        totalNeeds: 0,
        totalWants: 0,
        totalSavings: 0,
        balance: 0
    });

    // Load Settings on Mount
    useEffect(() => {
        if (user) {
            fetchSettings();
        }
    }, [user]);

    // Load Transactions when Date or Refresh changes
    useEffect(() => {
        if (user) {
            fetchMonthlyData();
        }
    }, [user, refreshKey, selectedDate]);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('finance_settings')
                .select('*')
                .eq('user_id', user!.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows found", allow default

            if (data) {
                setBudgetSettings({
                    needs: data.needs_percent,
                    wants: data.wants_percent,
                    savings: data.savings_percent
                });
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoadingSettings(false);
        }
    };

    const updateBudgetSettings = async (newSettings: BudgetSettings) => {
        // Optimistic update
        setBudgetSettings(newSettings);

        try {
            const { error } = await supabase
                .from('finance_settings')
                .upsert({
                    user_id: user!.id,
                    needs_percent: newSettings.needs,
                    wants_percent: newSettings.wants,
                    savings_percent: newSettings.savings
                });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error saving settings:", error);
            fetchSettings(); // Revert on error
            return false;
        }
    };

    const fetchMonthlyData = async () => {
        setLoading(true);
        const start = startOfMonth(selectedDate).toISOString();
        const end = endOfMonth(selectedDate).toISOString();

        try {
            const { data, error } = await supabase
                .from('finance_transactions')
                .select('*')
                .eq('user_id', user!.id)
                .gte('date', start)
                .lte('date', end)
                .order('date', { ascending: false });

            if (error) throw error;

            const txs = data as Transaction[];
            setTransactions(txs);
            calculateStats(txs);

        } catch (error) {
            console.error('Error loading finance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (txs: Transaction[]) => {
        let income = 0;
        let expense = 0;
        let needs = 0;
        let wants = 0;
        let savings = 0;

        txs.forEach(t => {
            const amt = Number(t.amount);
            if (t.type === 'income') {
                income += amt;
            } else {
                expense += amt;
                if (t.category === 'needs') needs += amt;
                if (t.category === 'wants') wants += amt;
                if (t.category === 'savings') savings += amt;
            }
        });

        setStats({
            totalIncome: income,
            totalExpenses: expense,
            totalNeeds: needs,
            totalWants: wants,
            totalSavings: savings,
            balance: income - expense
        });
    };

    const changeMonth = (increment: number) => {
        setSelectedDate(prev => addMonths(prev, increment));
    };

    const addTransaction = async (data: Omit<Transaction, 'id' | 'date'>) => {
        try {
            const { error } = await supabase
                .from('finance_transactions')
                .insert({
                    user_id: user!.id,
                    amount: data.amount,
                    type: data.type,
                    category: data.category,
                    description: data.description,
                    // Use current time but with selected month's date? 
                    // Actually, usually user adds txn for *today* or manual date. 
                    // For simplicity, let's stick to adding for "now", 
                    // but if user is viewing past month, maybe warn? 
                    // Let's just use "now" for this MVP.
                    date: new Date().toISOString()
                });

            if (error) throw error;
            setRefreshKey(prev => prev + 1); // Trigger refresh
            return true;
        } catch (error) {
            console.error('Error adding transaction:', error);
            return false;
        }
    };

    const deleteTransaction = async (id: string) => {
        try {
            const { error } = await supabase.from('finance_transactions').delete().eq('id', id);
            if (error) throw error;
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error(error);
        }
    }

    return {
        transactions,
        stats,
        loading,
        selectedDate,
        changeMonth,
        budgetSettings,
        loadingSettings,
        updateBudgetSettings,
        addTransaction,
        deleteTransaction
    };
}
