
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDriverAuth } from './useDriverAuth';
import { toast } from '@/hooks/use-toast';
import { DocumentExpiryNotification } from '@/types/driver';

export const useDocumentExpiry = () => {
  const { driver } = useDriverAuth();
  const [notifications, setNotifications] = useState<DocumentExpiryNotification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (driver) {
      fetchExpiryNotifications();
    }
  }, [driver]);

  const fetchExpiryNotifications = async () => {
    if (!driver) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('document_expiry_notifications')
        .select('*')
        .eq('driver_phone_ref', driver.phone)
        .order('expiry_date', { ascending: true });

      if (error) {
        console.error('Error fetching expiry notifications:', error);
        return;
      }

      setNotifications(data || []);

      // Check for urgent notifications (expiring within 7 days)
      const urgentNotifications = data?.filter(notification => {
        const expiryDate = new Date(notification.expiry_date);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
      }) || [];

      // Show toast notifications for urgent expiries
      urgentNotifications.forEach(notification => {
        const expiryDate = new Date(notification.expiry_date);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let message = '';
        if (daysUntilExpiry === 0) {
          message = `Your ${notification.document_type} expires today!`;
        } else if (daysUntilExpiry === 1) {
          message = `Your ${notification.document_type} expires tomorrow!`;
        } else {
          message = `Your ${notification.document_type} expires in ${daysUntilExpiry} days!`;
        }

        toast({
          title: "Document Expiry Alert",
          description: message,
          variant: daysUntilExpiry <= 1 ? "destructive" : "default"
        });
      });

    } catch (err) {
      console.error('Error fetching expiry notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getExpiringDocuments = (days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);

    return notifications.filter(notification => {
      const expiryDate = new Date(notification.expiry_date);
      return expiryDate <= cutoffDate;
    });
  };

  const getDocumentStatus = (documentType: 'license' | 'insurance' | 'roadworthiness') => {
    const notification = notifications.find(n => n.document_type === documentType);
    if (!notification) return { status: 'unknown', daysRemaining: null };

    const expiryDate = new Date(notification.expiry_date);
    const today = new Date();
    const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let status: 'valid' | 'warning' | 'expired' | 'critical';
    if (daysRemaining < 0) {
      status = 'expired';
    } else if (daysRemaining <= 1) {
      status = 'critical';
    } else if (daysRemaining <= 7) {
      status = 'warning';
    } else {
      status = 'valid';
    }

    return { status, daysRemaining, expiryDate: notification.expiry_date };
  };

  return {
    notifications,
    loading,
    fetchExpiryNotifications,
    getExpiringDocuments,
    getDocumentStatus
  };
};
