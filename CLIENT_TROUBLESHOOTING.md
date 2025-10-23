# Client Profile Troubleshooting Guide

## 🔍 Debugging "Unknown Client" Issue

### Step 1: Check Console Output
After running the migration, refresh the designer portal and check the browser console for:

```
📊 ALL profiles in database: [...]
📊 Project user_ids: [...]
🔍 Project user IDs: [...]
🔍 Profiles for project user_ids: [...]
```

### Step 2: Run Database Check
```sql
-- Check projects and their client profiles
SELECT 
  p.id, 
  p.name, 
  p.user_id, 
  p.status,
  pr.full_name as client_name,
  pr.email as client_email
FROM projects p
LEFT JOIN profiles pr ON p.user_id = pr.id
ORDER BY p.created_at DESC;
```

### Step 3: Common Issues & Solutions

#### Issue A: No Profiles Exist
**Symptom**: `📊 ALL profiles in database: []`
**Solution**: Create a test client profile
```sql
INSERT INTO profiles (id, full_name, email, role) 
VALUES ('test-client-id', 'Test Client', 'test@example.com', 'client');
```

#### Issue B: Project user_id Doesn't Match Profile ID
**Symptom**: `🔍 Profiles for project user_ids: []`
**Solution**: Create missing profiles or fix user_id references
```sql
-- Create profiles for missing project user_ids
INSERT INTO profiles (id, full_name, email, role)
SELECT DISTINCT 
  p.user_id,
  'Client ' || SUBSTRING(p.user_id::text, 1, 8),
  NULL,
  'client'
FROM projects p
LEFT JOIN profiles pr ON p.user_id = pr.id
WHERE pr.id IS NULL;
```

#### Issue C: RLS Policy Blocking Access
**Symptom**: Error fetching profiles
**Solution**: Check RLS policies
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check RLS policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
```

### Step 4: Test Project Creation
1. **Create a new project** as a client
2. **Check if profile is created** automatically
3. **Verify in designer portal** that client name appears

### Step 5: Manual Profile Creation (if needed)
```sql
-- Create a profile for a specific user
INSERT INTO profiles (id, full_name, email, role, created_at)
VALUES (
  'your-user-id-here',
  'Client Name',
  'client@example.com',
  'client',
  NOW()
);
```

## 🎯 Expected Behavior After Fix

✅ **Client creates project** → Profile exists in database
✅ **Designer portal shows** → "Client Name" instead of "Unknown"
✅ **Project workflow** → Awaiting Designer → In Progress → Review → Completed

## 🚨 If Still Not Working

1. **Check browser console** for detailed error messages
2. **Run the database check** SQL above
3. **Verify RLS policies** are not blocking access
4. **Check if user is authenticated** properly
5. **Ensure Supabase environment variables** are set correctly

---
*Always check the console output first - it will tell you exactly what's wrong!*
