-- Add project completion and archiving functionality
-- This migration adds fields to track project completion and archiving

-- Add completion tracking fields to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS completion_notes TEXT;

-- Update the status constraint to include 'Archived'
ALTER TABLE public.projects 
DROP CONSTRAINT IF EXISTS projects_status_check;

ALTER TABLE public.projects 
ADD CONSTRAINT projects_status_check 
CHECK (status IN ('In Progress', 'Review', 'Completed', 'On Hold', 'Archived'));

-- Create an index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_completed_at ON public.projects(completed_at);
CREATE INDEX IF NOT EXISTS idx_projects_archived_at ON public.projects(archived_at);

-- Add RLS policies for completion tracking
-- Allow users to complete their own projects
CREATE POLICY "Users can complete their own projects" ON public.projects
  FOR UPDATE USING (
    auth.uid() = user_id AND 
    status IN ('Review', 'Completed') AND
    auth.uid() = completed_by
  );

-- Allow designers to mark projects as completed
CREATE POLICY "Designers can mark projects as completed" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

-- Allow designers to archive projects
CREATE POLICY "Designers can archive projects" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

-- Add a function to automatically notify designer when project is completed
CREATE OR REPLACE FUNCTION notify_designer_project_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if status changed to 'Completed'
  IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
    -- Insert a notification message for the designer
    INSERT INTO public.messages (
      project_id,
      sender_type,
      sender_name,
      content,
      is_read
    ) VALUES (
      NEW.id,
      'system',
      'System',
      '🎉 Project "' || NEW.name || '" has been completed and approved by the client!',
      false
    );
    
    -- Update completion tracking fields
    NEW.completed_at = NOW();
    NEW.completed_by = auth.uid();
  END IF;
  
  -- Only trigger if status changed to 'Archived'
  IF NEW.status = 'Archived' AND OLD.status != 'Archived' THEN
    -- Update archiving tracking fields
    NEW.archived_at = NOW();
    NEW.archived_by = auth.uid();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically handle project completion
DROP TRIGGER IF EXISTS project_completion_trigger ON public.projects;
CREATE TRIGGER project_completion_trigger
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION notify_designer_project_completed();

-- Add RLS policy for system messages
CREATE POLICY "System can send completion messages" ON public.messages
  FOR INSERT WITH CHECK (
    sender_type = 'system' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

-- Allow designers to read system messages
CREATE POLICY "Designers can read system messages" ON public.messages
  FOR SELECT USING (
    sender_type = 'system' OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );
