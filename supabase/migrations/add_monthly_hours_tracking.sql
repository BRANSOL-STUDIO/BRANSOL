-- Add monthly hours tracking to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS hours_reset_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
ADD COLUMN IF NOT EXISTS billing_day INTEGER DEFAULT 1;

-- Function to check and reset hours if new month
CREATE OR REPLACE FUNCTION check_and_reset_monthly_hours()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the current date
  DECLARE
    current_date DATE := CURRENT_DATE;
    last_reset_date DATE := DATE(NEW.hours_reset_date);
    days_since_reset INTEGER := current_date - last_reset_date;
    is_new_month BOOLEAN := EXTRACT(MONTH FROM current_date) != EXTRACT(MONTH FROM last_reset_date) 
                          OR EXTRACT(YEAR FROM current_date) != EXTRACT(YEAR FROM last_reset_date);
  BEGIN
    -- If it's been a month since last reset, reset the hours
    IF is_new_month AND days_since_reset >= 28 THEN
      NEW.hours_remaining := NEW.hours_total;
      NEW.hours_reset_date := TIMEZONE('utc'::text, NOW());
    END IF;
    
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-reset hours when profile is accessed
CREATE TRIGGER auto_reset_monthly_hours
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_and_reset_monthly_hours();

-- Add comment
COMMENT ON COLUMN public.profiles.hours_reset_date IS 'Date when hours were last reset (beginning of billing month)';
COMMENT ON COLUMN public.profiles.billing_day IS 'Day of month when billing cycle resets (1-28)';

