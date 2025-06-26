
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Gift, 
  TrendingUp, 
  Bell, 
  HelpCircle, 
  User,
  DollarSign,
  Calendar
} from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (page: string) => void;
}

const QuickActions = ({ onNavigate }: QuickActionsProps) => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Users,
      label: 'Refer & Earn',
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => navigate('/referral')
    },
    {
      icon: TrendingUp,
      label: 'Earnings',
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => navigate('/earnings')
    },
    {
      icon: Bell,
      label: 'Notifications',
      color: 'bg-purple-600 hover:bg-purple-700',
      onClick: () => navigate('/notifications')
    },
    {
      icon: HelpCircle,
      label: 'Support',
      color: 'bg-orange-600 hover:bg-orange-700',
      onClick: () => navigate('/support')
    },
    {
      icon: User,
      label: 'Profile',
      color: 'bg-gray-600 hover:bg-gray-700',
      onClick: () => navigate('/profile')
    },
    {
      icon: DollarSign,
      label: 'Wallet',
      color: 'bg-emerald-600 hover:bg-emerald-700',
      onClick: () => navigate('/wallet')
    }
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                onClick={action.onClick}
                className={`h-16 flex flex-col items-center justify-center space-y-1 ${action.color}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
