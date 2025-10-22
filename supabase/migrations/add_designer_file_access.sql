-- Add RLS policies for designers to access project files
-- This allows designers to view and manage files for all projects

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
CREATE POLICY "Designers can upload project files" ON public.project_files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

-- Allow designers to delete project files
CREATE POLICY "Designers can delete project files" ON public.project_files
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

-- Allow designers to view all projects
CREATE POLICY "Designers can view all projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );

-- Allow designers to update all projects
CREATE POLICY "Designers can update all projects" ON public.projects
  FOR UPDATE USING (
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

-- Allow designers to send messages to any project
CREATE POLICY "Designers can send messages to any project" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('designer', 'admin')
    )
  );
