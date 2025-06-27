
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { useWallet } from '@/hooks/useWallet';
import { Wallet, Plus, TrendingUp, Eye } from 'lucide-react';

interface WalletCardProps {
  onNavigate: (page: string) => void;
}

const WalletCard = ({ onNavigate }: WalletCardProps) => {
  const { driver } = useDriverAuth();
  const { transactions } = useWallet();

  if (!driver) return null;

  // Calculate today's earnings
  const today = new Date().toDateString();
  const todayTransactions = transactions.filter(transaction => 
    new Date(transaction.created_at || '').toDateString() === today &&
    transaction.type === 'ride_earning' &&
    transaction.status === 'completed'
  );
  const todayEarnings = todayTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border-emerald-700/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-emerald-400" />
            <span>Wallet Balance</span>
          </div>
          <Button
            onClick={() => onNavigate('wallet')}
            size="sm"
            variant="ghost"
            className="text-emerald-400 hover:bg-emerald-800/20"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-3xl font-bold text-white mb-1">
            {driver.wallet_balance.toFixed(2)} ETB
          </div>
          <div className="flex items-center space-x-2 text-emerald-400 text-sm">
            <TrendingUp className="h-3 w-3" />
            <span>+{todayEarnings.toFixed(2)} ETB today</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => onNavigate('wallet')}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Top Up
          </Button>
          <Button
            onClick={() => onNavigate('earnings')}
            variant="outline"
            className="flex-1 border-emerald-600 text-emerald-400 hover:bg-emerald-800/20"
            size="sm"
          >
            View History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
