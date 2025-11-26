-- Create bookings/leads table for capturing consultation requests
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  project_type TEXT,
  project_budget TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  timezone TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'canceled')),
  calendly_event_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS bookings_email_idx ON public.bookings(email);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON public.bookings(status);
CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON public.bookings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert bookings (for public form)
CREATE POLICY "Allow public insert on bookings"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users with admin/designer role can view bookings
CREATE POLICY "Allow admin/designer to view bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'designer')
    )
  );

-- Policy: Only authenticated users with admin/designer role can update bookings
CREATE POLICY "Allow admin/designer to update bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'designer')
    )
  );

-- Add comments
COMMENT ON TABLE public.bookings IS 'Stores consultation booking requests from the public booking form';
COMMENT ON COLUMN public.bookings.status IS 'Booking status: pending, scheduled, completed, canceled';
COMMENT ON COLUMN public.bookings.calendly_event_id IS 'Optional Calendly event ID if integrated';

