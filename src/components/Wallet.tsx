
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CreditCard, Smartphone, Building2, History } from 'lucide-react';

interface User {
  id: string;
  name: string;
  walletBalance: number;
}

interface WalletProps {
  user: User;
}

const Wallet = ({ user }: WalletProps) => {
  const [topUpAmount, setTopUpAmount] = useState('');

  const transactions = [
    { id: '1', type: 'Commission', amount: -25.50, date: '2024-01-15', status: 'Completed' },
    { id: '2', type: 'Top-up', amount: 500.00, date: '2024-01-14', status: 'Completed' },
    { id: '3', type: 'Promo Credit', amount: 100.00, date: '2024-01-13', status: 'Completed' }
  ];

  return (
    <div className="p-4 pb-20 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Wallet</h1>
        <div className="text-4xl font-bold text-green-400">
          {user.walletBalance.toFixed(2)} ETB
        </div>
        <p className="text-gray-400">Current Balance</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Top Up Options</h2>
        
        <div className="grid gap-4">
          <Button className="h-16 bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-3">
            <Smartphone className="h-6 w-6" />
            <span>Telebirr</span>
          </Button>
          
          <Button className="h-16 bg-purple-600 hover:bg-purple-700 flex items-center justify-center space-x-3">
            <Building2 className="h-6 w-6" />
            <span>Bank Transfer</span>
          </Button>
          
          <Button className="h-16 bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-3">
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
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Quick Top Up
              </Button>
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
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
              <div>
                <div className="text-white font-medium">{transaction.type}</div>
                <div className="text-gray-400 text-sm">{transaction.date}</div>
              </div>
              <div className={`font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} ETB
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Wallet;
