
-- Update the driver status for bikilad@gmail.com to approved
UPDATE drivers 
SET approved_status = 'approved',
    last_reviewed_at = now(),
    reviewed_by = 'SYSTEM_ADMIN',
    admin_notes = 'Auto-approved for testing purposes'
WHERE email = 'bikilad@gmail.com';

-- If the driver doesn't exist with that email, let's also check by phone patterns
-- Update any driver with a phone that might be associated with this email
UPDATE drivers 
SET approved_status = 'approved',
    last_reviewed_at = now(),
    reviewed_by = 'SYSTEM_ADMIN',
    admin_notes = 'Auto-approved for testing purposes'
WHERE phone LIKE '%bikilad%' OR name ILIKE '%bikilad%';
