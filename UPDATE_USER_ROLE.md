# Update User Role in Supabase

## The Issue:
Your designer account is probably still set with `role = 'client'` in the database, which is why it's redirecting to the client dashboard instead of the designer portal.

## Solution:

### **Option 1: Update via Supabase Dashboard (Recommended)**

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to**: Table Editor → `profiles` table
3. **Find your designer user** (search by email)
4. **Click on the role cell** for that user
5. **Change the value** from `client` to `designer`
6. **Save the change**
7. **Log out and log back in**

### **Option 2: Update via SQL Editor**

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to**: SQL Editor
3. **Run this query** (replace with your designer's email):

```sql
-- Update role to designer
UPDATE public.profiles
SET role = 'designer'
WHERE email = 'your-designer-email@example.com';

-- Verify the change
SELECT id, email, full_name, role
FROM public.profiles
WHERE email = 'your-designer-email@example.com';
```

### **Option 3: Check Current Role**

To see what role your account currently has:

```sql
-- Check all users and their roles
SELECT id, email, full_name, role, created_at
FROM public.profiles
ORDER BY created_at DESC;
```

## Expected Behavior After Update:

✅ Login with designer account → Automatically redirected to `/designer`
✅ Login with client account → Automatically redirected to `/dashboard`
✅ Role-based access control works correctly

## Valid Role Values:

- `'client'` - Regular client users (default)
- `'designer'` - Designer/staff members
- `'admin'` - Administrators with full access

## Troubleshooting:

If you're still having issues after updating the role:

1. **Clear browser cache** and cookies
2. **Log out completely** from the site
3. **Log back in** with the designer account
4. **Check the browser console** for the log message:
   - Should show: `🔵 Profile loaded, checking role: designer`
   - Should show: `🔵 Redirecting to designer portal`

## Quick Test:

After updating the role, you can test by:
1. Going to: `http://localhost:3000/login`
2. Logging in with your designer credentials
3. You should be **immediately redirected** to `/designer`

---

**Note**: The role field was added in a recent migration, so existing users might need their role manually set to 'designer' or 'admin' as needed.

