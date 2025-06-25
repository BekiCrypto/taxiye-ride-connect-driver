
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUp, ArrowDown, CreditCard, Smartphone, Building } from 'lucide-react';

interface User {
  walletBalance: number;
}

interface WalletProps {
  user: User;
}

const Wallet = ({ user }: WalletProps) => {
  const [topUpAmount, setTopUpAmount] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const transactions = [
    { id: 1, type: 'commission', amount: -25.50, description: 'Trip Commission', date: '2024-01-15 14:30' },
    { id: 2, type: 'topup', amount: 500.00, description: 'Telebirr Top-up', date: '2024-01-15 10:15' },
    { id: 3, type: 'earning', amount: 185.75, description: 'Trip Earning', date: '2024-01-15 09:45' },
    { id: 4, type: 'promo', amount: 50.00, description: 'Promo Code Bonus', date: '2024-01-14 16:20' },
    { id: 5, type: 'commission', amount: -18.25, description: 'Trip Commission', date: '2024-01-14 15:10' }
  ];

  const handleTopUp = (method: string) => {
    console.log(`Top up ${topUpAmount} ETB via ${method}`);
    // Simulate top-up success
  };

  const handlePromoRedeem = () => {
    console.log(`Redeeming promo code: ${promoCode}`);
    // Simulate promo redemption
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      {/* Wallet Balance Header */}
      <Card className="bg-gradient-to-r from-green-800 to-green-600 border-green-500">
        <CardContent className="p-6 text-center">
          <h2 className="text-lg font-medium text-green-100 mb-2">Current Balance</h2>
          <div className="text-4xl font-bold text-white mb-4">
            {user.walletBalance.toFixed(2)} ETB
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-green-700 rounded-lg p-3">
              <div className="text-green-100">Available</div>
              <div className="font-semibold text-white">{user.walletBalance.toFixed(2)} ETB</div>
            </div>
            <div className="bg-green-700 rounded-lg p-3">
              <div className="text-green-100">Reserved</div>
              <div className="font-semibold text-white">0.00 ETB</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="topup" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="topup" className="text-white">Top Up</TabsTrigger>
          <TabsTrigger value="promo" className="text-white">Promo</TabsTrigger>
          <TabsTrigger value="history" className="text-white">History</TabsTrigger>
        </TabsList>

        <TabsContent value="topup" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Add Money to Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount (ETB)
                </label>
                <Input
                  type="number"
                  placeholder="100"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-white font-medium">Choose Payment Method</h3>
                
                <Button 
                  onClick={() => handleTopUp('telebirr')}
                  className="w-full h-14 bg-orange-600 hover:bg-orange-700 flex items-center justify-start px-4"
                  disabled={!topUpAmount}
                >
                  <Smartphone className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Telebirr</div>
                    <div className="text-sm opacity-80">Mobile payment</div>
                  </div>
                </Button>

                <Button 
                  onClick={() => handleTopUp('bank')}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 flex items-center justify-start px-4"
                  disabled={!topUpAmount}
                >
                  <Building className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Bank Transfer</div>
                    <div className="text-sm opacity-80">CBE, Dashen, etc.</div>
                  </div>
                </Button>

                <Button 
                  onClick={() => handleTopUp('card')}
                  className="w-full h-14 bg-purple-600 hover:bg-purple-700 flex items-center justify-start px-4"
                  disabled={!topUpAmount}
                >
                  <CreditCard className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Card Payment</div>
                    <div className="text-sm opacity-80">Visa, Mastercard</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promo" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Redeem Promo Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <Button 
                onClick={handlePromoRedeem}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!promoCode}
              >
                Redeem Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.amount > 0 ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {transaction.amount > 0 ? 
                        <ArrowUp className="h-4 w-4 text-white" /> : 
                        <ArrowDown className="h-4 w-4 text-white" />
                      }
                    </div>
                    <div>
                      <div className="text-white font-medium">{transaction.description}</div>
                      <div className="text-xs text-gray-400">{transaction.date}</div>
                    </div>
                  </div>
                  <div className={`font-bold ${
                    transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} ETB
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Wallet;
