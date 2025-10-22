-- Complete Schema Update for BRANSOL
-- Run this in Supabase SQL Editor to add all missing fields

-- Add role field to profiles (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'client' CHECK (role IN ('client', 'designer', 'admin'));
  END IF;
END $$;

-- Add hours_reset_date field (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'hours_reset_date') THEN
    ALTER TABLE public.profiles ADD COLUMN hours_reset_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
  END IF;
END $$;

-- Add billing_day field (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'billing_day') THEN
    ALTER TABLE public.profiles ADD COLUMN billing_day INTEGER DEFAULT 1;
  END IF;
END $$;

-- Add created_at to profiles if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'created_at') THEN
    ALTER TABLE public.profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
  END IF;
END $$;

-- Add updated_at to profiles if missing
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
    ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
  END IF;
END $$;

-- Create indexes for better performance (if not exists)
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS messages_project_id_idx ON public.messages(project_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON public.projects(status);

-- Drop existing designer policies if they exist (to recreate them)
DROP POLICY IF EXISTS "Designers can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Designers can view all messages" ON public.messages;
DROP POLICY IF EXISTS "Designers can send messages to projects" ON public.messages;
DROP POLICY IF EXISTS "Designers can view all project files" ON public.project_files;
DROP POLICY IF EXISTS "Designers can upload files to projects" ON public.project_files;
DROP POLICY IF EXISTS "Designers can update projects" ON public.projects;

-- Create/Update RLS policies for designers
CREATE POLICY "Designers can view all projects" ON public.projects
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

CREATE POLICY "Designers can view all messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = messages.project_id
      AND projects.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

CREATE POLICY "Designers can send messages to projects" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    ) OR
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = messages.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Designers can view all project files" ON public.project_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_files.project_id
      AND projects.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

CREATE POLICY "Designers can upload files to projects" ON public.project_files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    ) OR
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_files.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Designers can update projects" ON public.projects
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.role IS 'User role: client (default), designer, or admin';
COMMENT ON COLUMN public.profiles.hours_reset_date IS 'Date when hours were last reset (beginning of billing month)';
COMMENT ON COLUMN public.profiles.billing_day IS 'Day of month when billing cycle resets (1-28)';

-- Success message
SELECT 'Schema update completed successfully!' as message;

