/**
 * Forgot Password Page
 * 
 * This page allows users to request a password reset email.
 * 
 * IMPORTANT: Configure the redirect URL in Supabase Dashboard:
 * 1. Go to Authentication > URL Configuration
 * 2. Set "Site URL" to your domain
 * 3. Add redirect URL: http://localhost:3000/reset-password (for local)
 * 4. Add redirect URL: https://yourdomain.com/reset-password (for production)
 */

"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await resetPassword(email);

      if (resetError) {
        setError(resetError.message || 'Failed to send reset email. Please try again.');
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
      }
    } catch (err: any) {
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
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
                  <p className="text-gray-600 mb-2">
                    We've sent a password reset link to:
                  </p>
                  <p className="font-semibold text-gray-900 mb-6">{email}</p>
                  <p className="text-sm text-gray-600 mb-6">
                    Click the link in the email to reset your password. The link will expire in 1 hour.
                  </p>
                  <Link
                    href="/login"
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Back to Login
                  </Link>
                </motion.div>
              ) : (
                <>
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

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Remember your password?{' '}
                      <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                        Sign in
                      </Link>
                    </p>
                  </div>
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

