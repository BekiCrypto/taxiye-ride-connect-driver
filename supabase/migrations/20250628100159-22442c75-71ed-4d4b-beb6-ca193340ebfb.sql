
-- Add unique constraint to documents table for proper upsert functionality
ALTER TABLE public.documents 
ADD CONSTRAINT documents_driver_phone_ref_type_unique 
UNIQUE (driver_phone_ref, type);
