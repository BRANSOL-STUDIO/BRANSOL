# Password Reset Setup Guide

This guide explains how to configure the password reset feature in your application.

## Features

✅ **Forgot Password Page** - Users can request a password reset email  
✅ **Reset Password Page** - Users can set a new password via email link  
✅ **Email Integration** - Uses Supabase's built-in email service  
✅ **Success Messages** - Clear feedback throughout the process  

## Supabase Configuration

### 1. Configure Redirect URLs

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **URL Configuration**
3. Set the **Site URL** to your domain:
   - Local: `http://localhost:3000`
   - Production: `https://yourdomain.com`
4. Add **Redirect URLs**:
   - `http://localhost:3000/reset-password` (for local development)
   - `https://yourdomain.com/reset-password` (for production)

### 2. Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the **Reset Password** template if desired
3. The default template works out of the box

### 3. Email Provider Setup

Supabase uses its default email service for development. For production:

1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Configure your SMTP provider (SendGrid, Mailgun, etc.)
3. Or use Supabase's built-in email service

## How It Works

### User Flow

1. **User clicks "Forgot password?"** on login page
2. **User enters email** on `/forgot-password` page
3. **Supabase sends reset email** with a secure link
4. **User clicks link** in email (expires in 1 hour)
5. **User is redirected** to `/reset-password` page
6. **User enters new password** and confirms
7. **Password is updated** and user is redirected to login
8. **Success message** shown on login page

### Technical Flow

1. `resetPassword()` in `AuthContext` calls `supabase.auth.resetPasswordForEmail()`
2. Supabase sends email with reset token
3. User clicks link → Supabase processes token → redirects to `/reset-password`
4. `updatePassword()` in `AuthContext` calls `supabase.auth.updateUser()`
5. Password is updated and user can sign in

## Pages Created

- `/forgot-password` - Request password reset email
- `/reset-password` - Set new password (accessed via email link)
- Updated `/login` - Added "Forgot password?" link and success message

## API Functions

### `resetPassword(email: string)`
- Sends password reset email
- Returns error if email is invalid or rate limited

### `updatePassword(newPassword: string)`
- Updates user's password
- Requires valid reset token (from email link)
- Returns error if password is too short

## Testing

### Test the Flow

1. Go to `/login`
2. Click "Forgot password?"
3. Enter a valid email address
4. Check your email inbox
5. Click the reset link
6. Enter a new password (min 6 characters)
7. Confirm the password
8. You'll be redirected to login with a success message

### Test Email Delivery

- **Local Development**: Check Supabase Dashboard → Authentication → Users → Email Logs
- **Production**: Check your configured SMTP provider's logs

## Troubleshooting

### "Invalid Reset Link" Error

- **Cause**: Link expired (1 hour) or already used
- **Solution**: Request a new reset link

### Email Not Received

1. Check spam/junk folder
2. Verify email address is correct
3. Check Supabase email logs in dashboard
4. Verify SMTP is configured (for production)

### Redirect Not Working

1. Verify redirect URL is added in Supabase Dashboard
2. Check that Site URL matches your domain
3. Ensure URL matches exactly (including http/https)

### Password Update Fails

1. Ensure password is at least 6 characters
2. Check that reset link hasn't expired
3. Verify you're using the link from the most recent email

## Security Features

- ✅ Reset links expire after 1 hour
- ✅ Links can only be used once
- ✅ Email validation before sending
- ✅ Password strength validation (min 6 characters)
- ✅ Secure token-based authentication
- ✅ Rate limiting (handled by Supabase)

## Customization

### Change Reset Link Expiry

1. Go to Supabase Dashboard → Authentication → Settings
2. Adjust "Password Reset Token Expiry" (default: 1 hour)

### Customize Email Template

1. Go to Authentication → Email Templates
2. Edit "Reset Password" template
3. Use variables: `{{ .ConfirmationURL }}`, `{{ .Email }}`, etc.

### Change Redirect URL

Update the redirect URL in `contexts/AuthContext.tsx`:

```typescript
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`, // Change this
});
```

## Next Steps

1. ✅ Configure redirect URLs in Supabase Dashboard
2. ✅ Test the password reset flow
3. ✅ Customize email template (optional)
4. ✅ Set up SMTP for production (optional)
5. ✅ Test with real email addresses

The password reset feature is now fully functional! 🎉

