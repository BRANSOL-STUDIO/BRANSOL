/**
 * Connect Account Onboarding Page
 * 
 * This page allows users to:
 * 1. Create a Stripe Connect account
 * 2. Onboard to collect payments
 * 3. View their account status
 * 
 * IMPORTANT: In production, you should:
 * - Get the user's account ID from your database
 * - Only show this page to authenticated users
 * - Store account IDs securely
 */

"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, XCircle, Loader2, CreditCard, AlertCircle } from 'lucide-react';

interface AccountStatus {
  accountId: string | null;
  readyToProcessPayments: boolean;
  onboardingComplete: boolean;
  requirementsStatus: string;
}

export default function ConnectPage() {
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    displayName: '',
    contactEmail: '',
    country: 'us',
  });

  /**
   * Load account status on mount
   * 
   * TODO: In production, get accountId from:
   * - Authenticated user's database record
   * - Session storage
   * - URL parameter (for demo only)
   */
  useEffect(() => {
    // For demo: get accountId from localStorage or URL
    // In production, get from authenticated user
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('accountId') || localStorage.getItem('stripeAccountId');

    if (accountId) {
      checkAccountStatus(accountId);
    }
  }, []);

  /**
   * Check the current status of a connected account
   */
  const checkAccountStatus = async (accountId: string) => {
    setStatusLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/connect/account-status?accountId=${accountId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check account status');
      }

      setAccountStatus({
        accountId: data.accountId,
        readyToProcessPayments: data.readyToProcessPayments,
        onboardingComplete: data.onboardingComplete,
        requirementsStatus: data.requirementsStatus,
      });

      // Store account ID for future use
      localStorage.setItem('stripeAccountId', data.accountId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setStatusLoading(false);
    }
  };

  /**
   * Create a new Stripe Connect account
   */
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/connect/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Store account ID
      localStorage.setItem('stripeAccountId', data.accountId);

      // Check status
      await checkAccountStatus(data.accountId);

      alert('Account created successfully! You can now onboard to collect payments.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Start the onboarding process
   */
  const handleOnboard = async () => {
    if (!accountStatus?.accountId) {
      setError('No account ID found. Please create an account first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/connect/create-onboarding-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: accountStatus.accountId,
          returnUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create onboarding link');
      }

      // Redirect to Stripe onboarding
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Stripe Connect Setup
            </h1>
            <p className="text-gray-600">
              Create a connected account and onboard to start accepting payments
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Create Account Form */}
          {!accountStatus && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Create Connected Account
              </h2>

              <form onSubmit={handleCreateAccount} className="space-y-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                    Business/Display Name *
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    required
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="My Business Name"
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="contact@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    id="country"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="us">United States</option>
                    <option value="gb">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Account Status */}
          {accountStatus && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-purple-600" />
                Account Status
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Account ID</span>
                  <code className="text-sm bg-white px-3 py-1 rounded border border-gray-200">
                    {accountStatus.accountId}
                  </code>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Onboarding Complete</span>
                  {accountStatus.onboardingComplete ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Yes</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-yellow-600">
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">No</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Ready to Process Payments</span>
                  {accountStatus.readyToProcessPayments ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Yes</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-5 h-5" />
                      <span className="font-semibold">No</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Requirements Status</span>
                  <span className="font-semibold capitalize">
                    {accountStatus.requirementsStatus}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                {!accountStatus.onboardingComplete && (
                  <button
                    onClick={handleOnboard}
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Onboard to Collect Payments
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => accountStatus.accountId && checkAccountStatus(accountStatus.accountId)}
                  disabled={statusLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  {statusLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Refresh Status'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Create a connected account with your business information</li>
              <li>Complete onboarding to verify your identity and business details</li>
              <li>Once approved, you can create products and accept payments</li>
              <li>Your customers can purchase from your storefront</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

