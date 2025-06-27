
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDriverAuth } from './useDriverAuth';
import { sampleWalletTransactions } from '@/utils/sampleData';

interface WalletTransaction {
  id: string;
  driver_phone_ref: string;
  type: 'topup' | 'commission' | 'promo_credit' | 'admin_credit' | 'ride_earning';
  source?: 'telebirr' | 'stripe' | 'bank' | 'admin' | 'ride';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  created_at: string | null;
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
    
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('driver_phone_ref', driver.phone)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions from database:', error);
        // Fallback to sample data for development
        console.log('Using sample wallet transactions for demo');
        const driverSampleTransactions = sampleWalletTransactions.map(txn => ({
          ...txn,
          driver_phone_ref: driver.phone
        }));
        setTransactions(driverSampleTransactions);
      } else if (data && data.length > 0) {
        // Use real database data
        const transactionsData: WalletTransaction[] = data.map(transaction => ({
          id: transaction.id,
          driver_phone_ref: transaction.driver_phone_ref,
          type: transaction.type as 'topup' | 'commission' | 'promo_credit' | 'admin_credit' | 'ride_earning',
          source: transaction.source as 'telebirr' | 'stripe' | 'bank' | 'admin' | 'ride' | undefined,
          amount: Number(transaction.amount),
          status: transaction.status as 'pending' | 'completed' | 'failed',
          description: transaction.description,
          created_at: transaction.created_at
        }));
        setTransactions(transactionsData);
      } else {
        // No data in database, use sample data for better UX
        console.log('No transactions in database, using sample data for demo');
        const driverSampleTransactions = sampleWalletTransactions.map(txn => ({
          ...txn,
          driver_phone_ref: driver.phone
        }));
        setTransactions(driverSampleTransactions);
      }
    } catch (err) {
      console.error('Unexpected error fetching transactions:', err);
      // Fallback to sample data
      const driverSampleTransactions = sampleWalletTransactions.map(txn => ({
        ...txn,
        driver_phone_ref: driver.phone
      }));
      setTransactions(driverSampleTransactions);
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
        driver_phone_ref: driver.phone,
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
