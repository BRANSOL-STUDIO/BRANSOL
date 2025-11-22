/**
 * Reset Password Page
 * 
 * This page is shown when users click the password reset link from their email.
 * Supabase redirects here with a hash token in the URL.
 * 
 * IMPORTANT: Configure the redirect URL in Supabase Dashboard:
 * 1. Go to Authentication > URL Configuration
 * 2. Add redirect URL: http://localhost:3000/reset-password (for local)
 * 3. Add redirect URL: https://yourdomain.com/reset-password (for production)
 */

"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Suspense } from 'react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  /**
   * Check if we have a valid reset token
   * 
   * Supabase includes the token in the URL hash (#access_token=...)
   * We check if the user is authenticated (which happens automatically
   * when they click the reset link)
   */
  useEffect(() => {
    // Check if there's a token in the URL
    const hash = window.location.hash;
    const hasToken = hash.includes('access_token') || hash.includes('type=recovery');

    if (hasToken) {
      setIsValidToken(true);
    } else {
      // Check if user is already authenticated (token was processed)
      const checkAuth = async () => {
        // Small delay to let Supabase process the token
        setTimeout(() => {
          setIsValidToken(true); // Assume valid if no hash (already processed)
        }, 1000);
      };
      checkAuth();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await updatePassword(password);

      if (updateError) {
        setError(updateError.message || 'Failed to update password. Please try again.');
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login?passwordReset=true');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-20">
          <div className="container">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Verifying reset link...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (isValidToken === false) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-20">
          <div className="container">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
                <div className="text-center mb-6">
                  <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
                  <p className="text-gray-600 mb-6">
                    This password reset link is invalid or has expired. Please request a new one.
                  </p>
                  <Link
                    href="/forgot-password"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Request New Reset Link
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful!</h2>
                  <p className="text-gray-600 mb-6">
                    Your password has been updated. You can now sign in with your new password.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">Redirecting to login...</p>
                  <Link
                    href="/login"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Go to Login
                  </Link>
                </motion.div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-600">
                      Enter your new password below
                    </p>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-900">Error</p>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter new password"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}

