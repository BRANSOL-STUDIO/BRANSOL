-- Add 'Awaiting Designer' status to projects table constraint
-- This allows projects to start in "Awaiting Designer" status (25% progress)
-- and be moved to "In Progress" when designer starts working

-- Drop the existing constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- Add the new constraint with 'Awaiting Designer' status
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN ('Awaiting Designer', 'In Progress', 'Review', 'Completed', 'On Hold', 'Archived'));

-- Update any existing projects with invalid status to 'Awaiting Designer'
UPDATE projects 
SET status = 'Awaiting Designer' 
WHERE status NOT IN ('Awaiting Designer', 'In Progress', 'Review', 'Completed', 'On Hold', 'Archived');
