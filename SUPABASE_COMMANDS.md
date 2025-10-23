# Supabase Database Operations Reference

## 🗄️ Database Migrations & SQL Commands

### 1. **Add 'Awaiting Designer' Status** ✅ COMPLETED
```sql
-- Add 'Awaiting Designer' status to projects table constraint
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- Add the new constraint with 'Awaiting Designer' status
ALTER TABLE projects ADD CONSTRAINT projects_status_check 
CHECK (status IN ('Awaiting Designer', 'In Progress', 'Review', 'Completed', 'On Hold', 'Archived'));

-- Update any existing projects with invalid status to 'Awaiting Designer'
UPDATE projects 
SET status = 'Awaiting Designer' 
WHERE status NOT IN ('Awaiting Designer', 'In Progress', 'Review', 'Completed', 'On Hold', 'Archived');
```

### 2. **Check Current Database State**
```sql
-- Check all profiles
SELECT id, full_name, email, role, created_at FROM profiles ORDER BY created_at DESC;

-- Check all projects
SELECT id, name, user_id, status, created_at FROM projects ORDER BY created_at DESC;

-- Check projects with their client names
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

### 3. **Fix Missing Client Profiles** (if needed)
```sql
-- Create missing client profiles for projects without profiles
INSERT INTO profiles (id, full_name, email, role, created_at)
SELECT DISTINCT 
  p.user_id,
  'Client ' || SUBSTRING(p.user_id::text, 1, 8),
  NULL,
  'client',
  NOW()
FROM projects p
LEFT JOIN profiles pr ON p.user_id = pr.id
WHERE pr.id IS NULL;
```

### 4. **Reset Project Statuses** (if needed)
```sql
-- Reset all projects to 'Awaiting Designer' status
UPDATE projects SET status = 'Awaiting Designer' WHERE status IS NOT NULL;
```

### 5. **Check Row Level Security (RLS) Policies**
```sql
-- Check RLS policies on projects table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'projects';

-- Check RLS policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
```

### 6. **Emergency Database Reset** (if needed)
```sql
-- WARNING: This will delete all data!
-- Only use if you need to start fresh

-- Delete all data
DELETE FROM messages;
DELETE FROM project_files;
DELETE FROM projects;
DELETE FROM profiles;

-- Reset sequences
ALTER SEQUENCE profiles_id_seq RESTART WITH 1;
ALTER SEQUENCE projects_id_seq RESTART WITH 1;
ALTER SEQUENCE messages_id_seq RESTART WITH 1;
ALTER SEQUENCE project_files_id_seq RESTART WITH 1;
```

## 🔧 Common Troubleshooting Commands

### Check Authentication Users
```sql
-- Check auth.users table (if you have access)
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
ORDER BY created_at DESC;
```

### Check Project-Profile Relationships
```sql
-- Find orphaned projects (projects without profiles)
SELECT p.id, p.name, p.user_id, p.status
FROM projects p
LEFT JOIN profiles pr ON p.user_id = pr.id
WHERE pr.id IS NULL;
```

### Check Message Relationships
```sql
-- Check messages and their projects
SELECT 
  m.id,
  m.project_id,
  m.sender_name,
  m.sender_type,
  p.name as project_name,
  p.status
FROM messages m
LEFT JOIN projects p ON m.project_id = p.id
ORDER BY m.created_at DESC;
```

## 📋 Quick Health Check
```sql
-- Run this to check overall database health
SELECT 
  'Profiles' as table_name, 
  COUNT(*) as count 
FROM profiles
UNION ALL
SELECT 
  'Projects' as table_name, 
  COUNT(*) as count 
FROM projects
UNION ALL
SELECT 
  'Messages' as table_name, 
  COUNT(*) as count 
FROM messages
UNION ALL
SELECT 
  'Project Files' as table_name, 
  COUNT(*) as count 
FROM project_files;
```

## 🚨 Emergency Contacts
- **Supabase Dashboard**: https://supabase.com/dashboard
- **SQL Editor**: Dashboard → SQL Editor
- **Table Editor**: Dashboard → Table Editor
- **Authentication**: Dashboard → Authentication

---
*Always run these commands in Supabase Dashboard → SQL Editor*
*Test in development first before running in production*
