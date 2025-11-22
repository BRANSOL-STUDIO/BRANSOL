# Login Troubleshooting Guide

If you're getting "Invalid login credentials" error, follow these steps:

## Common Causes

### 1. **User Doesn't Exist**
- **Solution**: Sign up first at `/signup`
- **Check**: Try creating a new account

### 2. **Email Confirmation Required**
- **Symptom**: Error mentions "email not confirmed"
- **Solution**: 
  1. Check your email inbox (and spam folder)
  2. Click the confirmation link in the email
  3. Try logging in again

### 3. **Wrong Password**
- **If you signed up via Stripe**: 
  - Your password was auto-generated and sent in the receipt email
  - Check your email for the receipt with subject "Your Purchase Receipt"
  - The password is in that email
- **If you forgot your password**:
  - Use "Forgot password?" link on login page
  - Reset your password via email

### 4. **Email Format Issues**
- Make sure there are no extra spaces
- Email is case-insensitive, but check for typos
- Try copying and pasting your email

## Debug Steps

### Step 1: Check if User Exists

Use the debug endpoint (development only):

```bash
# Replace with your email
curl "http://localhost:3000/api/debug/check-user?email=your@email.com"
```

Or visit in browser:
```
http://localhost:3000/api/debug/check-user?email=your@email.com
```

This will tell you:
- If the user exists
- If email is confirmed
- If profile exists
- Last sign-in date

### Step 2: Check Browser Console

Open browser DevTools (F12) and check the Console tab for:
- `🔵 Attempting to sign in:` - Shows the email being used
- `🔴 Sign in error:` - Shows detailed error information

### Step 3: Check Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **Users**
3. Search for your email
4. Check:
   - User exists?
   - Email confirmed? (green checkmark)
   - Last sign-in date

## Solutions by Scenario

### Scenario 1: New User (Never Signed Up)

**Solution**: 
1. Go to `/signup`
2. Create an account
3. Check email for confirmation (if required)
4. Log in

### Scenario 2: Signed Up via Stripe Payment

**Problem**: Password was auto-generated and sent in receipt email

**Solution**:
1. Check your email inbox for receipt email
2. Look for the password in the email
3. Use that password to log in
4. Or use "Forgot password?" to reset it

### Scenario 3: Email Not Confirmed

**Problem**: Supabase requires email confirmation

**Solution**:
1. Check your email inbox (and spam)
2. Click the confirmation link
3. Try logging in again

**To disable email confirmation** (for testing):
1. Go to Supabase Dashboard
2. **Authentication** → **Settings**
3. Disable "Enable email confirmations"
4. Save changes

### Scenario 4: Forgot Password

**Solution**:
1. Click "Forgot password?" on login page
2. Enter your email
3. Check email for reset link
4. Set new password
5. Log in with new password

## Testing Login

### Create a Test Account

1. Go to `/signup`
2. Use a test email (e.g., `test@example.com`)
3. Create password (min 6 characters)
4. Sign up
5. If email confirmation is disabled, you can log in immediately
6. If email confirmation is enabled, check email first

### Test with Debug Endpoint

```bash
# Check if user exists
curl "http://localhost:3000/api/debug/check-user?email=test@example.com"
```

## Common Error Messages

| Error Message | Meaning | Solution |
|--------------|---------|----------|
| "Invalid login credentials" | Email or password is wrong | Check credentials, try password reset |
| "Email not confirmed" | Need to verify email | Check inbox for confirmation email |
| "User not found" | Account doesn't exist | Sign up first |
| "Too many requests" | Rate limited | Wait a few minutes |

## Still Having Issues?

1. **Check Supabase Configuration**:
   - Verify `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
   - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`

2. **Check Browser Console**:
   - Look for detailed error messages
   - Check network tab for API calls

3. **Check Supabase Dashboard**:
   - Verify user exists
   - Check email confirmation status
   - Check authentication logs

4. **Try Password Reset**:
   - Use "Forgot password?" feature
   - Set a new password
   - Try logging in again

## Quick Fixes

### Disable Email Confirmation (Testing Only)

1. Supabase Dashboard → Authentication → Settings
2. Toggle off "Enable email confirmations"
3. Save

### Reset User Password (Admin)

1. Supabase Dashboard → Authentication → Users
2. Find user by email
3. Click "Reset password"
4. User will receive reset email

### Check User Status

Use the debug endpoint:
```
http://localhost:3000/api/debug/check-user?email=YOUR_EMAIL
```

This shows:
- User exists?
- Email confirmed?
- Profile exists?
- Last sign-in?

