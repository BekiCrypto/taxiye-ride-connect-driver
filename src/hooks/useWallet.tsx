
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDriverAuth } from './useDriverAuth';

interface WalletTransaction {
  id: string;
  driver_id: string;
  type: 'topup' | 'commission' | 'promo_credit' | 'admin_credit' | 'ride_earning';
  source?: 'telebirr' | 'stripe' | 'bank' | 'admin' | 'ride';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  created_at: string;
}

export const useWallet = () => {
  const { driver, updateDriverProfile } = useDriverAuth();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (driver) {
      fetchTransactions();
    }
  }, [driver]);

  const fetchTransactions = async () => {
    if (!driver) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('driver_id', driver.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else if (data) {
      // Cast the data to ensure proper typing
      const transactionsData: WalletTransaction[] = data.map(transaction => ({
        ...transaction,
        type: transaction.type as 'topup' | 'commission' | 'promo_credit' | 'admin_credit' | 'ride_earning',
        source: transaction.source as 'telebirr' | 'stripe' | 'bank' | 'admin' | 'ride' | undefined,
        status: transaction.status as 'pending' | 'completed' | 'failed',
        amount: Number(transaction.amount)
      }));
      setTransactions(transactionsData);
    }
    setLoading(false);
  };

  const addTransaction = async (
    type: WalletTransaction['type'],
    amount: number,
    source?: WalletTransaction['source'],
    description?: string
  ) => {
    if (!driver) return null;

    const { data, error } = await supabase
      .from('wallet_transactions')
      .insert({
        driver_id: driver.id,
        type,
        amount,
        source,
        description,
        status: 'completed'
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      return null;
    }

    // Update wallet balance
    const newBalance = driver.wallet_balance + (type === 'commission' ? -amount : amount);
    await updateDriverProfile({ wallet_balance: newBalance });
    
    // Refresh transactions
    await fetchTransactions();
    return data;
  };

  const topUpWallet = async (amount: number, source: 'telebirr' | 'stripe' | 'bank') => {
    return await addTransaction('topup', amount, source, `Wallet top-up via ${source}`);
  };

  return {
    transactions,
    loading,
    addTransaction,
    topUpWallet,
    fetchTransactions
  };
};
