
-- Clear all driver-related data to start fresh
DELETE FROM public.ai_verification_sessions;
DELETE FROM public.documents;
DELETE FROM public.notifications;
DELETE FROM public.promo_redemptions;
DELETE FROM public.rides;
DELETE FROM public.sos_alerts;
DELETE FROM public.support_tickets;
DELETE FROM public.wallet_transactions;
DELETE FROM public.drivers;

-- Reset any sequences if they exist (this ensures new records start from 1)
-- Note: Since we're using UUIDs, there are no sequences to reset
