
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CreditCard, Smartphone, Building2, History } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/components/ui/use-toast';

const Wallet = () => {
  const { driver } = useDriverAuth();
  const { transactions, topUpWallet, loading } = useWallet();
  const [topUpAmount, setTopUpAmount] = useState('');

  const handleTopUp = async (source: 'telebirr' | 'stripe' | 'bank') => {
    const amount = parseFloat(topUpAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    const result = await topUpWallet(amount, source);
    if (result) {
      toast({
        title: "Top-up Successful",
        description: `${amount} ETB added to your wallet via ${source}`,
      });
      setTopUpAmount('');
    } else {
      toast({
        title: "Top-up Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  if (!driver) return null;

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Wallet</h1>
        <div className="text-4xl font-bold text-green-400">
          {driver.wallet_balance.toFixed(2)} ETB
        </div>
        <p className="text-gray-400">Current Balance</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Top Up Options</h2>
        
        <div className="grid gap-4">
          <Button 
            className="h-16 bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-3"
            onClick={() => handleTopUp('telebirr')}
            disabled={loading || !topUpAmount}
          >
            <Smartphone className="h-6 w-6" />
            <span>Telebirr</span>
          </Button>
          
          <Button 
            className="h-16 bg-purple-600 hover:bg-purple-700 flex items-center justify-center space-x-3"
            onClick={() => handleTopUp('bank')}
            disabled={loading || !topUpAmount}
          >
            <Building2 className="h-6 w-6" />
            <span>Bank Transfer</span>
          </Button>
          
          <Button 
            className="h-16 bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-3"
            onClick={() => handleTopUp('stripe')}
            disabled={loading || !topUpAmount}
          >
            <CreditCard className="h-6 w-6" />
            <span>Credit Card</span>
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Enter amount"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <History className="h-5 w-5 mr-2" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="text-gray-400">Loading transactions...</div>
          ) : transactions.length === 0 ? (
            <div className="text-gray-400">No transactions yet</div>
          ) : (
            transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                <div>
                  <div className="text-white font-medium capitalize">
                    {transaction.type.replace('_', ' ')}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </div>
                  {transaction.description && (
                    <div className="text-gray-500 text-xs">{transaction.description}</div>
                  )}
                </div>
                <div className={`font-bold ${
                  transaction.type === 'commission' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {transaction.type === 'commission' ? '-' : '+'}
                  {transaction.amount.toFixed(2)} ETB
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Wallet;
