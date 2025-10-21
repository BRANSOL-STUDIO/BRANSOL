"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

export default function TestAuthPage() {
  const { user, profile, loading } = useAuth();
  const [testResult, setTestResult] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function runTests() {
      const results: any = {
        timestamp: new Date().toISOString(),
        envVars: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
        },
        auth: {
          user: user ? `✅ Logged in as ${user.email}` : '❌ Not logged in',
          userId: user?.id || 'N/A',
          profile: profile ? `✅ Profile exists: ${profile.full_name}` : '❌ No profile',
        },
        database: {},
      };

      // Test database connection
      try {
        const { data, error } = await supabase.from('profiles').select('count');
        results.database.connection = error ? `❌ Error: ${error.message}` : '✅ Connected';
        results.database.profilesTable = data ? '✅ Table exists' : '❌ Table not found';
      } catch (e: any) {
        results.database.error = e.message;
      }

      setTestResult(results);
    }

    if (!loading) {
      runTests();
    }
  }, [user, profile, loading]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6">🔍 Supabase Connection Test</h1>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : (
            <pre className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-auto text-sm">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          )}

          <div className="mt-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-bold text-blue-900 mb-2">Quick Checks:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Environment variables: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}</li>
                <li>• User logged in: {user ? '✅' : '❌'}</li>
                <li>• Profile loaded: {profile ? '✅' : '❌'}</li>
              </ul>
            </div>

            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-yellow-800 font-semibold">⚠️ Not logged in</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Go to <a href="/signup" className="underline">/signup</a> to create an account, 
                  or <a href="/login" className="underline">/login</a> if you have one.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <a href="/dashboard" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700">
                Go to Dashboard
              </a>
              <a href="/login" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300">
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

