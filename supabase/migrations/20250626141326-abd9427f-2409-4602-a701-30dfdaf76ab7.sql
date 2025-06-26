
-- First, let's check if the driver exists and their current status
SELECT * FROM drivers WHERE email = 'bikilad@gmail.com';

-- Update the driver status to approved if not already
UPDATE drivers 
SET approved_status = 'approved',
    last_reviewed_at = now(),
    reviewed_by = 'SYSTEM_ADMIN',
    admin_notes = 'Auto-approved for testing purposes'
WHERE email = 'bikilad@gmail.com';

-- Also check if there are any drivers with similar patterns and approve them too
UPDATE drivers 
SET approved_status = 'approved',
    last_reviewed_at = now(),
    reviewed_by = 'SYSTEM_ADMIN',
    admin_notes = 'Auto-approved for testing purposes'
WHERE phone LIKE '%bikilad%' OR name ILIKE '%bikilad%';
