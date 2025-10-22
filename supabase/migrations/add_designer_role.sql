-- Add role field to profiles to distinguish between clients and designers
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client' CHECK (role IN ('client', 'designer', 'admin'));

-- Add index for faster role-based queries
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- Update RLS policies to allow designers to view all projects
CREATE POLICY "Designers can view all projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

-- Allow designers to view all messages
CREATE POLICY "Designers can view all messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

-- Allow designers to send messages
CREATE POLICY "Designers can send messages to projects" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

-- Allow designers to view all project files
CREATE POLICY "Designers can view all project files" ON public.project_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

-- Allow designers to upload files to any project
CREATE POLICY "Designers can upload files to projects" ON public.project_files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

-- Allow designers to update project status
CREATE POLICY "Designers can update projects" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

COMMENT ON COLUMN public.profiles.role IS 'User role: client, designer, or admin';

