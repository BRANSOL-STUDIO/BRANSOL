/**
 * Debug API: Check User Status
 * 
 * This endpoint helps debug login issues by checking if a user exists
 * and their account status.
 * 
 * IMPORTANT: This is for debugging only. Remove or secure this endpoint
 * in production.
 * 
 * GET /api/debug/check-user?email=user@example.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration');
}

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is disabled in production' },
      { status: 403 }
    );
  }

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(normalizedEmail);

    if (userError || !userData?.user) {
      return NextResponse.json({
        exists: false,
        email: normalizedEmail,
        message: 'User not found',
        suggestion: 'The user may need to sign up first, or check if the email is correct.',
      });
    }

    const user = userData.user;

    // Check profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      exists: true,
      email: normalizedEmail,
      user: {
        id: user.id,
        email: user.email,
        emailConfirmed: user.email_confirmed_at !== null,
        emailConfirmedAt: user.email_confirmed_at,
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at,
        confirmedAt: user.confirmed_at,
      },
      profile: profile || null,
      profileError: profileError ? profileError.message : null,
      suggestions: [
        !user.email_confirmed_at ? 'Email not confirmed - user may need to verify email' : null,
        !profile ? 'Profile not found - profile may need to be created' : null,
        !user.last_sign_in_at ? 'User has never signed in' : null,
      ].filter(Boolean),
    });
  } catch (error: any) {
    console.error('Debug check user error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check user' },
      { status: 500 }
    );
  }
}

