/**
 * Debug API: Check Supabase Configuration
 * 
 * This endpoint verifies that Supabase is configured correctly.
 * 
 * IMPORTANT: This is for debugging only. Remove or secure this endpoint
 * in production.
 * 
 * GET /api/debug/check-config
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is disabled in production' },
      { status: 403 }
    );
  }

  const results: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    configuration: {},
    connection: {},
    errors: [],
  };

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  results.configuration = {
    NEXT_PUBLIC_SUPABASE_URL: {
      exists: !!supabaseUrl,
      value: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING',
      valid: supabaseUrl?.startsWith('https://') && supabaseUrl?.includes('.supabase.co'),
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      exists: !!supabaseAnonKey,
      value: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 30)}...` : 'MISSING',
      valid: supabaseAnonKey?.startsWith('eyJ'),
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      exists: !!supabaseServiceKey,
      value: supabaseServiceKey ? `${supabaseServiceKey.substring(0, 30)}...` : 'MISSING',
      valid: supabaseServiceKey?.startsWith('eyJ'),
    },
  };

  // Test connection if keys are present
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      // Test 1: Check if we can connect
      const { data: healthData, error: healthError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      results.connection.database = {
        status: healthError ? 'error' : 'connected',
        error: healthError?.message || null,
        canQuery: !healthError,
      };

      // Test 2: Check auth service
      try {
        const { data: authData, error: authError } = await supabase.auth.getSession();
        results.connection.auth = {
          status: authError ? 'error' : 'available',
          error: authError?.message || null,
          canAccess: !authError,
        };
      } catch (authErr: any) {
        results.connection.auth = {
          status: 'error',
          error: authErr.message,
          canAccess: false,
        };
      }

      // Test 3: Check if profiles table exists and is accessible
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .limit(1);

        results.connection.profilesTable = {
          exists: !profilesError,
          accessible: !profilesError,
          error: profilesError?.message || null,
          rowCount: profilesData?.length || 0,
        };
      } catch (profilesErr: any) {
        results.connection.profilesTable = {
          exists: false,
          accessible: false,
          error: profilesErr.message,
        };
      }
    } catch (connectionError: any) {
      results.errors.push({
        type: 'connection',
        message: connectionError.message,
      });
    }
  } else {
    results.errors.push({
      type: 'configuration',
      message: 'Missing required environment variables',
    });
  }

  // Summary
  const allConfigValid = 
    results.configuration.NEXT_PUBLIC_SUPABASE_URL.valid &&
    results.configuration.NEXT_PUBLIC_SUPABASE_ANON_KEY.valid &&
    results.configuration.SUPABASE_SERVICE_ROLE_KEY.valid;

  const allConnected = 
    results.connection.database?.canQuery &&
    results.connection.auth?.canAccess &&
    results.connection.profilesTable?.accessible;

  results.summary = {
    configurationValid: allConfigValid,
    connectionWorking: allConnected,
    status: allConfigValid && allConnected ? '✅ All checks passed' : '⚠️ Issues found',
    recommendations: [],
  };

  // Add recommendations
  if (!results.configuration.NEXT_PUBLIC_SUPABASE_URL.exists) {
    results.summary.recommendations.push('Add NEXT_PUBLIC_SUPABASE_URL to .env.local');
  }
  if (!results.configuration.NEXT_PUBLIC_SUPABASE_ANON_KEY.exists) {
    results.summary.recommendations.push('Add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local');
  }
  if (!results.configuration.SUPABASE_SERVICE_ROLE_KEY.exists) {
    results.summary.recommendations.push('Add SUPABASE_SERVICE_ROLE_KEY to .env.local');
  }
  if (results.connection.database?.status === 'error') {
    results.summary.recommendations.push('Check database connection and RLS policies');
  }
  if (results.connection.auth?.status === 'error') {
    results.summary.recommendations.push('Check Supabase auth service status');
  }
  if (!results.connection.profilesTable?.exists) {
    results.summary.recommendations.push('Create profiles table in Supabase');
  }

  return NextResponse.json(results, {
    status: allConfigValid && allConnected ? 200 : 500,
  });
}

