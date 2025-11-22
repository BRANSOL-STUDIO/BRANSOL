/**
 * Subscription Management Page
 * 
 * This page allows connected accounts to:
 * 1. Subscribe to platform services
 * 2. Manage their subscription
 * 3. Access billing portal
 * 
 * IMPORTANT: In production, get accountId from authenticated user's database record
 */

"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CreditCard, Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export default function SubscriptionPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Get account ID from localStorage or URL
   * TODO: In production, get from authenticated user's database record
   */
  const getAccountId = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('accountId') || localStorage.getItem('stripeAccountId');
  };

  /**
   * Create subscription checkout session
   * 
   * IMPORTANT: Replace PRICE_ID with your actual platform subscription price ID
   * This should be a price from your PLATFORM account, not a connected account
   */
  const handleSubscribe = async () => {
    const accountId = getAccountId();
    if (!accountId) {
      setError('No account ID found. Please create an account first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      /**
       * TODO: Replace 'price_1234567890' with your actual platform subscription price ID
       * 
       * To get your price ID:
       * 1. Go to Stripe Dashboard > Products
       * 2. Create a product for platform subscriptions
       * 3. Create a price for that product
       * 4. Copy the price ID (starts with 'price_')
       * 5. Add it to your .env.local as PLATFORM_SUBSCRIPTION_PRICE_ID
       */
      const priceId = process.env.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PRICE_ID || 'price_1234567890';

      if (priceId === 'price_1234567890') {
        throw new Error(
          'Platform subscription price ID not configured. ' +
          'Please set NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PRICE_ID in your .env.local file.'
        );
      }

      const response = await fetch('/api/connect/subscription/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          priceId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription checkout');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  /**
   * Open billing portal for subscription management
   */
  const handleManageBilling = async () => {
    const accountId = getAccountId();
    if (!accountId) {
      setError('No account ID found. Please create an account first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/connect/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          returnUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create billing portal session');
      }

      // Redirect to billing portal
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Check for success/cancel from checkout
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const canceled = searchParams.get('canceled') === 'true';

    if (sessionId) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }

    if (canceled) {
      setError('Subscription checkout was canceled.');
    }
  }, [searchParams]);

  const accountId = getAccountId();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Subscription Management
            </h1>
            <p className="text-gray-600">
              Subscribe to platform services and manage your subscription
            </p>
          </div>

          {!accountId && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">No Account Found</p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Please create a connected account first at{' '}
                    <a href="/dashboard/connect" className="underline">/dashboard/connect</a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 font-medium">
                Subscription activated successfully!
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Subscription Card */}
          {accountId && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Platform Subscription</h2>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Premium Features</h3>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Priority support</li>
                    <li>Advanced analytics</li>
                    <li>Custom integrations</li>
                    <li>Dedicated account manager</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Subscribe Now
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleManageBilling}
                    disabled={loading}
                    className="flex-1 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Manage Billing
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">About Subscriptions</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Subscriptions are billed monthly</li>
              <li>You can upgrade, downgrade, or cancel anytime</li>
              <li>Changes take effect immediately</li>
              <li>Access the billing portal to manage your subscription</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

