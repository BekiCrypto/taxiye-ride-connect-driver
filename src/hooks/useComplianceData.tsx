
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Driver, DocumentExpiryNotification, ComplianceAuditLog } from '@/types/driver';
import { toast } from '@/hooks/use-toast';
import { mapDriverData } from '@/utils/driverUtils';

export const useComplianceData = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [expiryNotifications, setExpiryNotifications] = useState<DocumentExpiryNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<ComplianceAuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDrivers(),
        fetchExpiryNotifications(),
        fetchAuditLogs()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching drivers:', error);
      return;
    }

    const mappedDrivers: Driver[] = (data || []).map(mapDriverData);
    setDrivers(mappedDrivers);
  };

  const fetchExpiryNotifications = async (expiryFilter: string = '30') => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + parseInt(expiryFilter));

    const { data, error } = await supabase
      .from('document_expiry_notifications')
      .select('*')
      .lte('expiry_date', cutoffDate.toISOString().split('T')[0])
      .order('expiry_date', { ascending: true });

    if (error) {
      console.error('Error fetching expiry notifications:', error);
      return;
    }

    const mappedNotifications: DocumentExpiryNotification[] = (data || []).map(notification => ({
      id: notification.id,
      driver_phone_ref: notification.driver_phone_ref,
      document_type: notification.document_type as 'license' | 'insurance' | 'roadworthiness',
      expiry_date: notification.expiry_date,
      notification_sent_30_days: notification.notification_sent_30_days,
      notification_sent_7_days: notification.notification_sent_7_days,
      notification_sent_on_expiry: notification.notification_sent_on_expiry,
      last_notification_sent: notification.last_notification_sent,
      created_at: notification.created_at,
      updated_at: notification.updated_at
    }));

    setExpiryNotifications(mappedNotifications);
  };

  const fetchAuditLogs = async () => {
    const { data, error } = await supabase
      .from('compliance_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching audit logs:', error);
      return;
    }

    const mappedLogs: ComplianceAuditLog[] = (data || []).map(log => ({
      id: log.id,
      driver_phone_ref: log.driver_phone_ref,
      action_type: log.action_type as 'registration' | 'document_upload' | 'expiry_notification' | 'approval' | 'rejection',
      action_details: log.action_details as Record<string, any>,
      performed_by: log.performed_by,
      created_at: log.created_at
    }));

    setAuditLogs(mappedLogs);
  };

  const exportToCSV = (filteredDrivers: Driver[]) => {
    const csvData = filteredDrivers.map(driver => ({
      Name: driver.name,
      Phone: driver.phone,
      Email: driver.email || '',
      Gender: driver.gender || '',
      'Date of Birth': driver.date_of_birth || '',
      'License Number': driver.license_number || '',
      'License Expiry': driver.license_expiry_date || '',
      'Vehicle Make': driver.vehicle_make || '',
      'Vehicle Model': driver.vehicle_model || '',
      'Vehicle Year': driver.vehicle_year || '',
      'Plate Number': driver.plate_number || '',
      'Insurance Expiry': driver.insurance_expiry_date || '',
      'Roadworthiness Expiry': driver.roadworthiness_expiry_date || '',
      'Approval Status': driver.approved_status,
      'Registration Complete': driver.is_registration_complete ? 'Yes' : 'No',
      'Service Agreement Signed': driver.service_agreement_signed ? 'Yes' : 'No',
      'Created At': driver.created_at || ''
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drivers_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Driver data has been exported to CSV"
    });
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    drivers,
    expiryNotifications,
    auditLogs,
    loading,
    fetchAllData,
    fetchExpiryNotifications,
    exportToCSV
  };
};
