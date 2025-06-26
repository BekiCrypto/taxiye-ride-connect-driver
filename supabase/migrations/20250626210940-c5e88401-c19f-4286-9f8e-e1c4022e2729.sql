
-- First, let's ensure the drivers and passengers tables have proper unique constraints
-- and handle the case where phone numbers might overlap between drivers and passengers

-- Add unique constraints to prevent conflicts
ALTER TABLE public.drivers ADD CONSTRAINT drivers_phone_unique UNIQUE (phone);
ALTER TABLE public.passengers ADD CONSTRAINT passengers_phone_unique UNIQUE (phone);

-- Update the trigger function to handle driver registration more safely
CREATE OR REPLACE FUNCTION public.handle_new_driver_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create driver profile when user_type is explicitly 'driver' and phone exists
  IF NEW.raw_user_meta_data->>'user_type' = 'driver' 
     AND (NEW.phone IS NOT NULL OR NEW.raw_user_meta_data->>'phone' IS NOT NULL) THEN
    
    -- Check if this phone number already exists in passengers table
    -- If it does, we'll prefix the driver phone with 'DRV_' to make it unique
    DECLARE
      driver_phone TEXT;
      existing_passenger_count INTEGER;
    BEGIN
      driver_phone := COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone');
      
      -- Check if phone exists in passengers table
      SELECT COUNT(*) INTO existing_passenger_count 
      FROM public.passengers 
      WHERE phone = driver_phone;
      
      -- If phone exists in passengers, prefix with DRV_ for driver
      IF existing_passenger_count > 0 THEN
        driver_phone := 'DRV_' || driver_phone;
      END IF;
      
      INSERT INTO public.drivers (phone, user_id, name, email)
      VALUES (
        driver_phone,
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Driver'),
        NEW.email
      )
      ON CONFLICT (phone) DO NOTHING; -- Handle potential duplicates gracefully
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the passenger trigger function to handle conflicts with drivers
CREATE OR REPLACE FUNCTION public.handle_new_passenger_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create passenger profile for regular users (not drivers) and if phone exists
  IF (NEW.raw_user_meta_data->>'user_type' IS NULL OR NEW.raw_user_meta_data->>'user_type' = 'passenger') 
     AND (NEW.phone IS NOT NULL OR NEW.raw_user_meta_data->>'phone' IS NOT NULL) THEN
    
    DECLARE
      passenger_phone TEXT;
      existing_driver_count INTEGER;
    BEGIN
      passenger_phone := COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone');
      
      -- Check if phone exists in drivers table
      SELECT COUNT(*) INTO existing_driver_count 
      FROM public.drivers 
      WHERE phone = passenger_phone OR phone = 'DRV_' || passenger_phone;
      
      -- If phone exists in drivers, prefix with PSG_ for passenger
      IF existing_driver_count > 0 THEN
        passenger_phone := 'PSG_' || passenger_phone;
      END IF;
      
      INSERT INTO public.passengers (phone, user_id, name, email)
      VALUES (
        passenger_phone,
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        NEW.email
      )
      ON CONFLICT (phone) DO NOTHING; -- Handle potential duplicates gracefully
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update all foreign key references to use the new phone identifier system
-- Update rides table to handle the new phone system
ALTER TABLE public.rides DROP CONSTRAINT IF EXISTS rides_driver_phone_ref_fkey;
ALTER TABLE public.rides DROP CONSTRAINT IF EXISTS rides_passenger_phone_ref_fkey;

-- Add new foreign key constraints that can handle prefixed phone numbers
ALTER TABLE public.rides 
ADD CONSTRAINT rides_driver_phone_ref_fkey 
FOREIGN KEY (driver_phone_ref) REFERENCES public.drivers(phone) ON DELETE SET NULL;

ALTER TABLE public.rides 
ADD CONSTRAINT rides_passenger_phone_ref_fkey 
FOREIGN KEY (passenger_phone_ref) REFERENCES public.passengers(phone) ON DELETE SET NULL;

-- Update other tables with similar constraints
ALTER TABLE public.wallet_transactions 
DROP CONSTRAINT IF EXISTS wallet_transactions_driver_phone_ref_fkey;

ALTER TABLE public.wallet_transactions 
ADD CONSTRAINT wallet_transactions_driver_phone_ref_fkey 
FOREIGN KEY (driver_phone_ref) REFERENCES public.drivers(phone) ON DELETE CASCADE;

ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_driver_phone_ref_fkey;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_driver_phone_ref_fkey 
FOREIGN KEY (driver_phone_ref) REFERENCES public.drivers(phone) ON DELETE CASCADE;

ALTER TABLE public.documents 
DROP CONSTRAINT IF EXISTS documents_driver_phone_ref_fkey;

ALTER TABLE public.documents 
ADD CONSTRAINT documents_driver_phone_ref_fkey 
FOREIGN KEY (driver_phone_ref) REFERENCES public.drivers(phone) ON DELETE CASCADE;

ALTER TABLE public.promo_redemptions 
DROP CONSTRAINT IF EXISTS promo_redemptions_driver_phone_ref_fkey;

ALTER TABLE public.promo_redemptions 
ADD CONSTRAINT promo_redemptions_driver_phone_ref_fkey 
FOREIGN KEY (driver_phone_ref) REFERENCES public.drivers(phone) ON DELETE CASCADE;

ALTER TABLE public.sos_alerts 
DROP CONSTRAINT IF EXISTS sos_alerts_driver_phone_ref_fkey;

ALTER TABLE public.sos_alerts 
ADD CONSTRAINT sos_alerts_driver_phone_ref_fkey 
FOREIGN KEY (driver_phone_ref) REFERENCES public.drivers(phone) ON DELETE CASCADE;

ALTER TABLE public.support_tickets 
DROP CONSTRAINT IF EXISTS support_tickets_driver_phone_ref_fkey;

ALTER TABLE public.support_tickets 
ADD CONSTRAINT support_tickets_driver_phone_ref_fkey 
FOREIGN KEY (driver_phone_ref) REFERENCES public.drivers(phone) ON DELETE CASCADE;

ALTER TABLE public.ai_verification_sessions 
DROP CONSTRAINT IF EXISTS ai_verification_sessions_driver_phone_ref_fkey;

ALTER TABLE public.ai_verification_sessions 
ADD CONSTRAINT ai_verification_sessions_driver_phone_ref_fkey 
FOREIGN KEY (driver_phone_ref) REFERENCES public.drivers(phone) ON DELETE CASCADE;
