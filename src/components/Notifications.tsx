
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertCircle, DollarSign, Car, X } from 'lucide-react';
import { useDriverAuth } from '@/hooks/useDriverAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'general' | 'ride' | 'payment' | 'admin' | 'promo';
  driver_phone_ref: string;
  created_at: string;
  is_read: boolean;
}

const Notifications = () => {
  const { driver } = useDriverAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (driver) {
      fetchNotifications();
    }
  }, [driver]);

  const fetchNotifications = async () => {
    if (!driver) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('driver_phone_ref', driver.phone)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } else if (data) {
      setNotifications(data as Notification[]);
    }
    setLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
    } else {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    }
  };

  const markAllAsRead = async () => {
    if (!driver) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('driver_phone_ref', driver.phone)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
    } else {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      toast({
        title: "All Marked as Read",
        description: "All notifications have been marked as read",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ride':
        return <Car className="h-5 w-5 text-blue-400" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-green-400" />;
      case 'admin':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case 'promo':
        return <DollarSign className="h-5 w-5 text-yellow-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'ride':
        return 'bg-blue-900';
      case 'payment':
        return 'bg-green-900';
      case 'admin':
        return 'bg-red-900';
      case 'promo':
        return 'bg-yellow-900';
      default:
        return 'bg-gray-800';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="p-4 pb-20 flex items-center justify-center min-h-[400px] bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <div className="text-white">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 space-y-6 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-green-400" />
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="bg-red-600 text-white">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            Mark All Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-white text-lg mb-2">No notifications yet</div>
            <div className="text-gray-400">You'll see important updates here</div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`border-gray-700 ${getNotificationColor(notification.type)} ${
                !notification.is_read ? 'border-l-4 border-l-green-400' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className={`font-semibold ${
                          !notification.is_read ? 'text-white' : 'text-gray-300'
                        }`}>
                          {notification.title}
                        </div>
                        <div className={`text-sm mt-1 ${
                          !notification.is_read ? 'text-gray-200' : 'text-gray-400'
                        }`}>
                          {notification.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(notification.created_at).toLocaleString()}
                        </div>
                      </div>
                      {!notification.is_read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          size="sm"
                          variant="ghost"
                          className="text-green-400 hover:text-green-300"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
