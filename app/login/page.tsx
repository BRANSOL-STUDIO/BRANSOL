"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, loading: authLoading, profile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const passwordReset = searchParams.get('passwordReset') === 'true';

  // Show success message if redirected from password reset
  useEffect(() => {
    if (passwordReset) {
      // You could show a success message here
      console.log('Password reset successful');
    }
  }, [passwordReset]);

  // Auto-redirect when profile loads after successful login
  useEffect(() => {
    console.log('🔵 Login useEffect triggered:', { 
      profile: profile ? { id: profile.id, email: profile.email, role: profile.role } : null, 
      authLoading, 
      formLoading: loading,
      hasProfile: !!profile 
    });
    
    // Only redirect when we have a profile and auth is not loading
    if (profile && !authLoading) {
      console.log('🔵 Profile loaded, checking role:', profile.role);
      
      // Check if user has a designer role and redirect accordingly
      if (profile.role === 'designer' || profile.role === 'admin') {
        console.log('🔵 Redirecting to designer portal');
        setLoading(false); // Stop loading state
        router.push('/designer');
        return; // Exit early to prevent further execution
      } else {
        console.log('🔵 Redirecting to client dashboard');
        // Check if there's a specific redirect requested
        if (redirectTo === '/designer') {
          // If they were trying to access designer portal but aren't a designer
          setError('Access denied: Designer portal is for designers only');
          setLoading(false);
          return;
        }
        setLoading(false); // Stop loading state
        router.push(redirectTo);
        return; // Exit early to prevent further execution
      }
    }
  }, [profile, authLoading, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Validate password is not empty
    if (!password || password.length === 0) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }

    console.log('🔵 Starting login process...');

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        console.error('🔴 Login error:', signInError);
        // Use the user-friendly error message from AuthContext
        setError(signInError.message || 'Invalid login credentials. Please check your email and password.');
        setLoading(false);
      } else {
        console.log('✅ Login successful, profile will load and redirect automatically');
        // The useEffect above will handle the redirect when profile loads
        // Don't set loading to false here - let the redirect handle it
      }
    } catch (err: any) {
      console.error('🔴 Unexpected login error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="container">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600">Sign in to your client portal</p>
              </div>

              {passwordReset && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Password Reset Successful</p>
                    <p className="text-sm text-green-700">You can now sign in with your new password.</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-900">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                    {error.includes('Invalid email or password') && (
                      <div className="mt-3 pt-3 border-t border-red-200">
                        <p className="text-xs text-red-600 font-medium mb-2">Troubleshooting:</p>
                        <ul className="text-xs text-red-600 space-y-1 list-disc list-inside">
                          <li>If you received a welcome email, check it for your password</li>
                          <li>Make sure you're using the correct email address</li>
                          <li>Check if email confirmation is required (check your inbox)</li>
                          <li>Try resetting your password using "Forgot password?"</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-purple-600 rounded" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading || authLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  Demo mode not available for Client Portal
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

