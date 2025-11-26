# Supabase Booking Setup Guide

This guide will walk you through setting up the bookings table in Supabase step-by-step.

## Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project (or create a new one if you don't have one)

## Step 2: Open SQL Editor

1. In the left sidebar, click on **"SQL Editor"** (it has a `</>` icon)
2. Click the **"New query"** button (top right) to create a new SQL query

## Step 3: Copy the Migration SQL

1. Open the file `supabase/migrations/add_bookings_table.sql` from your project
2. Copy **ALL** the contents of that file
3. Paste it into the SQL Editor in Supabase

## Step 4: Run the Migration

1. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
2. You should see a success message: "Success. No rows returned"

## Step 5: Verify the Table Was Created

1. In the left sidebar, click on **"Table Editor"** (it has a table icon)
2. You should see a new table called **"bookings"** in the list
3. Click on **"bookings"** to see its structure

You should see these columns:
- `id` (uuid, primary key)
- `full_name` (text)
- `email` (text)
- `phone` (text, nullable)
- `company` (text, nullable)
- `project_type` (text, nullable)
- `project_budget` (text, nullable)
- `preferred_date` (date, nullable)
- `preferred_time` (text, nullable)
- `timezone` (text, nullable)
- `message` (text, nullable)
- `status` (text, default: 'pending')
- `calendly_event_id` (text, nullable)
- `notes` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Step 6: Verify Row Level Security (RLS)

1. In the **"Table Editor"**, click on **"bookings"**
2. Click on the **"Policies"** tab at the top
3. You should see 3 policies:
   - ✅ **Allow public insert on bookings** - Allows anyone to submit booking forms
   - ✅ **Allow admin/designer to view bookings** - Only admins/designers can view bookings
   - ✅ **Allow admin/designer to update bookings** - Only admins/designers can update bookings

## Step 7: Test the Setup (Optional)

1. Go back to **"SQL Editor"**
2. Run this test query to verify everything works:

```sql
-- Test insert (this should work)
INSERT INTO public.bookings (full_name, email, message)
VALUES ('Test User', 'test@example.com', 'This is a test booking');

-- Test select (this should fail if you're not an admin/designer)
SELECT * FROM public.bookings;
```

3. If the insert works, you're all set! ✅

## Troubleshooting

### If you get a "permission denied" error:
- Make sure you're using the SQL Editor (not Table Editor)
- The SQL Editor runs with admin privileges

### If the table doesn't appear:
- Refresh the Table Editor page
- Check the SQL Editor for any error messages
- Make sure you copied the entire SQL file

### If RLS policies don't appear:
- The policies are created automatically by the SQL script
- If they're missing, you can manually create them in the "Policies" tab

## Next Steps

Once the table is set up:

1. ✅ The booking form at `/book-a-call` will automatically save submissions to this table
2. ✅ You can view bookings in Supabase Table Editor (if you're an admin/designer)
3. ✅ Email notifications will be sent if you configure Resend (optional)

## Viewing Bookings

To view submitted bookings:

1. Go to **"Table Editor"** → **"bookings"**
2. You'll see all submitted booking requests
3. You can filter, sort, and edit bookings directly in the table editor

---

**That's it!** Your booking system is now set up and ready to capture leads. 🎉

