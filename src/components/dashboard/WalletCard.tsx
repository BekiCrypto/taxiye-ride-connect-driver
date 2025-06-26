
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';

interface WalletCardProps {
  onNavigate: (page: string) => void;
}

const WalletCard = ({ onNavigate }: WalletCardProps) => {
  const { driver } = useDriverAuth();

  if (!driver) return null;

  return (
    <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-700/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-600/20 rounded-xl">
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-semibold text-white mb-1">Wallet Balance</div>
              <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                {driver.wallet_balance.toFixed(2)} ETB
              </div>
              <div className="text-xs text-gray-400 mt-1">Available for withdrawal</div>
            </div>
          </div>
          <Button 
            onClick={() => onNavigate('wallet')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-900/25"
          >
            Manage Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
