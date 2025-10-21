# Supabase Integration Setup

## ✅ Completed Setup

### 1. Database Schema
- Created tables: `profiles`, `projects`, `messages`, `project_files`
- Enabled Row Level Security (RLS) for data protection
- Set up real-time subscriptions for chat

### 2. Authentication
- Auth context created (`/contexts/AuthContext.tsx`)
- Login page (`/app/login`)
- Signup page (`/app/signup`)
- Automatic session management via middleware

### 3. Chat Functionality
- Real-time chat in project details
- Messages persist in Supabase database
- Instant updates when new messages arrive
- Works offline with localStorage fallback

## 🚀 How to Use

### For Development (Without Auth)
- Dashboard works with mock data stored in localStorage
- No login required - access `/dashboard` directly
- Messages saved locally to your browser

### For Production (With Auth)
1. Users create account at `/signup`
2. Login at `/login`
3. Dashboard loads real data from Supabase
4. Chat messages sync in real-time
5. Data persists across devices

## 🔧 Environment Variables Required

Make sure these are set in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://chxxgdpoyztfswfgzxce.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📊 Database Tables

### profiles
- User account information
- Plan details and hours tracking
- Avatar customization

### projects
- User projects with status tracking
- Designer assignment
- Hours used tracking

### messages
- Chat messages with real-time updates
- Read/unread status
- Linked to projects

### project_files
- File uploads for each project
- File metadata

## 🔐 Security

- Row Level Security enabled on all tables
- Users can only access their own data
- Authenticated requests required for mutations
- Service role key only used server-side

## 📱 Features

✅ Real-time chat updates  
✅ Project management  
✅ File uploads  
✅ Profile customization  
✅ Hours tracking  
✅ Multi-device sync  
✅ Offline fallback  

## 🐛 Troubleshooting

**Chat messages not persisting?**
- Check if you're logged in
- Verify environment variables in Vercel
- Check browser console for errors

**Can't login?**
- Confirm email in Supabase dashboard
- Check if user exists in `auth.users`
- Verify RLS policies are active

