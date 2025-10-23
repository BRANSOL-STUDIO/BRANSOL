-- Quick Database Health Check
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Check all profiles
SELECT 'PROFILES' as table_name, id, full_name, email, role, created_at FROM profiles ORDER BY created_at DESC;

-- 2. Check all projects
SELECT 'PROJECTS' as table_name, id, name, user_id, status, created_at FROM projects ORDER BY created_at DESC;

-- 3. Check projects with their client profiles (this will show the issue)
SELECT 
  'PROJECTS_WITH_CLIENTS' as table_name,
  p.id as project_id, 
  p.name as project_name, 
  p.user_id as project_user_id, 
  p.status,
  pr.id as profile_id,
  pr.full_name as client_name,
  pr.email as client_email,
  pr.role as profile_role
FROM projects p
LEFT JOIN profiles pr ON p.user_id = pr.id
ORDER BY p.created_at DESC;

-- 4. Find orphaned projects (projects without profiles)
SELECT 
  'ORPHANED_PROJECTS' as table_name,
  p.id, 
  p.name, 
  p.user_id, 
  p.status
FROM projects p
LEFT JOIN profiles pr ON p.user_id = pr.id
WHERE pr.id IS NULL;
