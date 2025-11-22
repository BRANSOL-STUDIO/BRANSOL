-- Add Stripe subscription fields to profiles table
-- Run this in Supabase SQL Editor

-- Add subscription_plan field (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'subscription_plan') THEN
    ALTER TABLE public.profiles ADD COLUMN subscription_plan TEXT;
  END IF;
END $$;

-- Add subscription_status field (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'subscription_status') THEN
    ALTER TABLE public.profiles ADD COLUMN subscription_status TEXT DEFAULT 'inactive';
  END IF;
END $$;

-- Add stripe_customer_id field (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id') THEN
    ALTER TABLE public.profiles ADD COLUMN stripe_customer_id TEXT;
  END IF;
END $$;

-- Add stripe_subscription_id field (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'stripe_subscription_id') THEN
    ALTER TABLE public.profiles ADD COLUMN stripe_subscription_id TEXT;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS profiles_stripe_subscription_id_idx ON public.profiles(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS profiles_subscription_status_idx ON public.profiles(subscription_status);

-- Add comments
COMMENT ON COLUMN public.profiles.subscription_plan IS 'Subscription plan slug (essentials, growth-kit, ecosystem)';
COMMENT ON COLUMN public.profiles.subscription_status IS 'Subscription status (active, canceled, past_due, etc.)';
COMMENT ON COLUMN public.profiles.stripe_customer_id IS 'Stripe customer ID';
COMMENT ON COLUMN public.profiles.stripe_subscription_id IS 'Stripe subscription ID';

