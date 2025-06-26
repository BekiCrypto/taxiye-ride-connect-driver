
-- Add columns to documents table for better tracking
ALTER TABLE documents ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS reviewed_by TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;

-- Create a table for AI verification sessions
CREATE TABLE IF NOT EXISTS ai_verification_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_phone_ref TEXT REFERENCES drivers(phone),
  session_status TEXT DEFAULT 'in_progress',
  liveness_check_passed BOOLEAN DEFAULT false,
  ai_confidence_score NUMERIC DEFAULT 0,
  verification_result TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT
);

-- Update drivers table to include more detailed status tracking
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS last_reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS reviewed_by TEXT;

-- Create RLS policies for ai_verification_sessions
ALTER TABLE ai_verification_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own verification sessions"
ON ai_verification_sessions FOR SELECT
USING (driver_phone_ref = (SELECT phone FROM drivers WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own verification sessions"
ON ai_verification_sessions FOR INSERT
WITH CHECK (driver_phone_ref = (SELECT phone FROM drivers WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own verification sessions"
ON ai_verification_sessions FOR UPDATE
USING (driver_phone_ref = (SELECT phone FROM drivers WHERE user_id = auth.uid()));

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for documents bucket
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');
