
-- Update drivers table to support EtASN compliance requirements
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS national_id_number TEXT;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS license_expiry_date DATE;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS vehicle_make TEXT;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS vehicle_year INTEGER;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS insurance_expiry_date DATE;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS roadworthiness_expiry_date DATE;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS service_agreement_signed BOOLEAN DEFAULT false;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS service_agreement_date DATE;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS digital_signature_url TEXT;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS registration_step INTEGER DEFAULT 1;
ALTER TABLE public.drivers ADD COLUMN IF NOT EXISTS is_registration_complete BOOLEAN DEFAULT false;

-- Create document expiry notifications table
CREATE TABLE IF NOT EXISTS public.document_expiry_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_phone_ref TEXT REFERENCES drivers(phone),
  document_type TEXT NOT NULL, -- 'license', 'insurance', 'roadworthiness'
  expiry_date DATE NOT NULL,
  notification_sent_30_days BOOLEAN DEFAULT false,
  notification_sent_7_days BOOLEAN DEFAULT false,
  notification_sent_on_expiry BOOLEAN DEFAULT false,
  last_notification_sent TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create compliance audit logs table
CREATE TABLE IF NOT EXISTS public.compliance_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_phone_ref TEXT REFERENCES drivers(phone),
  action_type TEXT NOT NULL, -- 'registration', 'document_upload', 'expiry_notification', 'approval', 'rejection'
  action_details JSONB,
  performed_by TEXT, -- admin user or system
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create service agreements table
CREATE TABLE IF NOT EXISTS public.service_agreements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_phone_ref TEXT REFERENCES drivers(phone),
  agreement_version TEXT NOT NULL DEFAULT '1.0',
  signed_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  digital_signature_url TEXT,
  agreement_document_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for new tables
ALTER TABLE public.document_expiry_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_agreements ENABLE ROW LEVEL SECURITY;

-- Policies for document_expiry_notifications
CREATE POLICY "Users can view their own expiry notifications"
ON public.document_expiry_notifications FOR SELECT
USING (driver_phone_ref = (SELECT phone FROM drivers WHERE user_id = auth.uid()));

CREATE POLICY "System can manage expiry notifications"
ON public.document_expiry_notifications FOR ALL
USING (true); -- This will be restricted by application logic

-- Policies for compliance_audit_logs  
CREATE POLICY "Admins can view all audit logs"
ON public.compliance_audit_logs FOR SELECT
USING (true); -- Restricted by admin role in application

CREATE POLICY "System can insert audit logs"
ON public.compliance_audit_logs FOR INSERT
WITH CHECK (true);

-- Policies for service_agreements
CREATE POLICY "Users can view their own service agreements"
ON public.service_agreements FOR SELECT
USING (driver_phone_ref = (SELECT phone FROM drivers WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own service agreements"
ON public.service_agreements FOR INSERT
WITH CHECK (driver_phone_ref = (SELECT phone FROM drivers WHERE user_id = auth.uid()));

-- Create function to automatically create expiry notifications when driver data is updated
CREATE OR REPLACE FUNCTION public.update_expiry_notifications()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete existing notifications for this driver
  DELETE FROM public.document_expiry_notifications 
  WHERE driver_phone_ref = NEW.phone;
  
  -- Insert new notifications based on expiry dates
  IF NEW.license_expiry_date IS NOT NULL THEN
    INSERT INTO public.document_expiry_notifications 
    (driver_phone_ref, document_type, expiry_date)
    VALUES (NEW.phone, 'license', NEW.license_expiry_date);
  END IF;
  
  IF NEW.insurance_expiry_date IS NOT NULL THEN
    INSERT INTO public.document_expiry_notifications 
    (driver_phone_ref, document_type, expiry_date)
    VALUES (NEW.phone, 'insurance', NEW.insurance_expiry_date);
  END IF;
  
  IF NEW.roadworthiness_expiry_date IS NOT NULL THEN
    INSERT INTO public.document_expiry_notifications 
    (driver_phone_ref, document_type, expiry_date)
    VALUES (NEW.phone, 'roadworthiness', NEW.roadworthiness_expiry_date);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update expiry notifications
CREATE TRIGGER update_driver_expiry_notifications
  AFTER UPDATE ON public.drivers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_expiry_notifications();

-- Create function to check for expiring documents (for cron job)
CREATE OR REPLACE FUNCTION public.check_expiring_documents()
RETURNS void AS $$
DECLARE
  notification_record RECORD;
BEGIN
  -- Check for documents expiring in 30 days
  FOR notification_record IN 
    SELECT * FROM public.document_expiry_notifications 
    WHERE expiry_date <= CURRENT_DATE + INTERVAL '30 days'
    AND expiry_date > CURRENT_DATE + INTERVAL '29 days'
    AND notification_sent_30_days = false
  LOOP
    -- Update notification status
    UPDATE public.document_expiry_notifications 
    SET notification_sent_30_days = true,
        last_notification_sent = now()
    WHERE id = notification_record.id;
    
    -- Log the notification
    INSERT INTO public.compliance_audit_logs 
    (driver_phone_ref, action_type, action_details, performed_by)
    VALUES (
      notification_record.driver_phone_ref,
      'expiry_notification',
      jsonb_build_object(
        'document_type', notification_record.document_type,
        'expiry_date', notification_record.expiry_date,
        'days_remaining', 30
      ),
      'system'
    );
  END LOOP;
  
  -- Check for documents expiring in 7 days
  FOR notification_record IN 
    SELECT * FROM public.document_expiry_notifications 
    WHERE expiry_date <= CURRENT_DATE + INTERVAL '7 days'
    AND expiry_date > CURRENT_DATE + INTERVAL '6 days'
    AND notification_sent_7_days = false
  LOOP
    UPDATE public.document_expiry_notifications 
    SET notification_sent_7_days = true,
        last_notification_sent = now()
    WHERE id = notification_record.id;
    
    INSERT INTO public.compliance_audit_logs 
    (driver_phone_ref, action_type, action_details, performed_by)
    VALUES (
      notification_record.driver_phone_ref,
      'expiry_notification',
      jsonb_build_object(
        'document_type', notification_record.document_type,
        'expiry_date', notification_record.expiry_date,
        'days_remaining', 7
      ),
      'system'
    );
  END LOOP;
  
  -- Check for documents expiring today
  FOR notification_record IN 
    SELECT * FROM public.document_expiry_notifications 
    WHERE expiry_date = CURRENT_DATE
    AND notification_sent_on_expiry = false
  LOOP
    UPDATE public.document_expiry_notifications 
    SET notification_sent_on_expiry = true,
        last_notification_sent = now()
    WHERE id = notification_record.id;
    
    INSERT INTO public.compliance_audit_logs 
    (driver_phone_ref, action_type, action_details, performed_by)
    VALUES (
      notification_record.driver_phone_ref,
      'expiry_notification',
      jsonb_build_object(
        'document_type', notification_record.document_type,
        'expiry_date', notification_record.expiry_date,
        'days_remaining', 0
      ),
      'system'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;
