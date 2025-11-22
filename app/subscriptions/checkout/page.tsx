"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Lock, CreditCard, Calendar, ArrowLeft, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface SubscriptionPlan {
  name: string;
  price: number;
  btc: number;
  description: string;
  features: string[];
  popular: boolean;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planSlug = searchParams.get('plan');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [message, setMessage] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    projectDetails: ''
  });

  // Map plan slugs to Stripe lookup keys
  // Update these with your actual Stripe Price lookup keys
  const stripeLookupKeys: Record<string, string> = {
    'essentials': 'Essentials-c7c18be', // Update with your actual lookup key
    'growth-kit': 'GrowthKit-c7c18be', // Update with your actual lookup key
    'ecosystem': 'Ecosystem-c7c18be', // Update with your actual lookup key
  };

  // Check URL params for success/cancel on mount
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const sessionIdParam = searchParams.get('session_id');

    if (success === 'true' && sessionIdParam) {
      setIsSuccess(true);
      setSessionId(sessionIdParam);
    }

    if (canceled === 'true') {
      setIsSuccess(false);
      setMessage("Order canceled -- continue to shop around and checkout when you're ready.");
    }
  }, [searchParams]);

  // Plan data based on slug
  const plans: Record<string, SubscriptionPlan> = {
    'essentials': {
      name: "Essentials",
      price: 3500,
      btc: 0.040,
      description: "Perfect for startups and small businesses",
      features: [
        "Logo & brand system",
        "Color palette + typography", 
        "5 social media templates",
        "72-hour delivery",
        "2 revision rounds",
        "Source files included"
      ],
      popular: false
    },
    'growth-kit': {
      name: "Growth Kit",
      price: 5500,
      btc: 0.063,
      description: "Most popular choice for growing businesses",
      features: [
        "Everything in Essentials",
        "Complete brand guidelines",
        "Landing page design (UI)",
        "Professional pitch deck",
        "10+ social media posts",
        "Unlimited revisions",
        "Priority support"
      ],
      popular: true
    },
    'ecosystem': {
      name: "Ecosystem",
      price: 8000,
      btc: 0.091,
      description: "Complete brand ecosystem for established companies",
      features: [
        "Everything in Growth Kit",
        "Animated logo variations",
        "Investor presentation deck",
        "Complete email marketing kit",
        "Packaging design mocks",
        "Brand video intro",
        "Dedicated project manager",
        "Lifetime support access"
      ],
      popular: false
    }
  };

  const selectedPlan = plans[planSlug || 'growth-kit'];
  
  // Calculate pricing based on billing cycle
  const getPricing = () => {
    const basePrice = selectedPlan.price;
    switch (billingCycle) {
      case 'monthly':
        return { price: basePrice, discount: 0, savings: 0 };
      case 'quarterly':
        return { price: basePrice * 3 * 0.9, discount: 10, savings: basePrice * 3 * 0.1 };
      case 'annual':
        return { price: basePrice * 12 * 0.8, discount: 20, savings: basePrice * 12 * 0.2 };
      default:
        return { price: basePrice, discount: 0, savings: 0 };
    }
  };

  const pricing = getPricing();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage('');

    try {
      const lookupKey = stripeLookupKeys[planSlug || 'growth-kit'];
      
      if (!lookupKey) {
        throw new Error('Stripe lookup key not found for this plan');
      }

      // Create form data for Stripe checkout
      const formDataToSend = new FormData();
      formDataToSend.append('lookup_key', lookupKey);
      formDataToSend.append('billing_cycle', billingCycle);
      formDataToSend.append('email', formData.email);

      // Call Stripe checkout API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        body: formDataToSend,
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          throw new Error('Invalid response from server');
        }
      } else {
        // If not JSON, read as text for error message
        const text = await response.text();
        throw new Error(text || 'Failed to create checkout session');
      }

      if (!response.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setMessage(error.message || 'An error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePortalSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('session_id', sessionId);

      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to create portal session');
      }

      // Redirect to Stripe Customer Portal
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (error: any) {
      console.error('Portal session error:', error);
      setMessage(error.message || 'An error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Plan Not Found</h1>
            <p className="text-gray-600 mb-6">Please select a valid subscription plan.</p>
            <Link 
              href="/subscriptions"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              View Plans
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Show success page with portal session button
  if (isSuccess && sessionId) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
          <div className="text-center max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to BRANSOL!</h1>
            <p className="text-gray-600 mb-6">
              Your {selectedPlan.name} subscription is now active. We'll be in touch within 24 hours to discuss your first project.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                <strong>Plan:</strong> {selectedPlan.name}<br/>
                <strong>Billing:</strong> {billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}<br/>
                <strong>First Payment:</strong> ${pricing.price.toLocaleString()}
              </p>
            </div>
            <form onSubmit={handlePortalSession} className="mb-4">
              <input type="hidden" name="session_id" value={sessionId} />
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
              >
                {isProcessing ? 'Loading...' : 'Manage your billing information'}
              </button>
            </form>
            <Link 
              href="/"
              className="inline-block text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200"
            >
              Return Home
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Show error message if canceled or error occurred
  if (message) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <p className="text-yellow-800">{message}</p>
            </div>
            <Link 
              href="/subscriptions"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Back to Plans
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/subscriptions"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Plans
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Complete Your Subscription</h1>
            <p className="text-gray-600">Set up your {selectedPlan.name} subscription and start creating</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">Subscription Details</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Billing Cycle Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Billing Cycle
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'monthly', label: 'Monthly', desc: 'No discount' },
                      { id: 'quarterly', label: 'Quarterly', desc: 'Save 10%' },
                      { id: 'annual', label: 'Annual', desc: 'Save 20%' }
                    ].map((cycle) => (
                      <button
                        key={cycle.id}
                        type="button"
                        onClick={() => setBillingCycle(cycle.id as any)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                          billingCycle === cycle.id
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="font-semibold">{cycle.label}</div>
                        <div className="text-sm opacity-75">{cycle.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="projectDetails" className="block text-sm font-medium text-gray-700 mb-2">
                    First Project Details
                  </label>
                  <textarea
                    id="projectDetails"
                    name="projectDetails"
                    rows={4}
                    value={formData.projectDetails}
                    onChange={handleInputChange}
                    placeholder="Tell us about your first project, goals, and any specific requirements..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Terms Acceptance */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I agree to the{' '}
                      <Link href="/terms" className="text-purple-600 hover:text-purple-700 underline">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
                        Privacy Policy
                      </Link>
                      . I understand this is a recurring subscription that I can cancel anytime.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Redirecting to Checkout...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Checkout - ${pricing.price.toLocaleString()}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Your subscription will automatically renew. Cancel anytime from your account dashboard.
                </p>
              </form>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Plan Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    {selectedPlan.popular && <Star className="w-6 h-6 text-white fill-current" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedPlan.name}</h3>
                    <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Summary</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Base Price</span>
                    <span className="text-gray-900">${selectedPlan.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Billing Cycle</span>
                    <span className="text-gray-900 capitalize">{billingCycle}</span>
                  </div>
                  {pricing.discount > 0 && (
                    <div className="flex items-center justify-between text-sm text-green-600">
                      <span>Discount ({pricing.discount}%)</span>
                      <span>-${pricing.savings.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-lg font-semibold text-gray-900">
                    <span>First Payment</span>
                    <span>${pricing.price.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {billingCycle === 'monthly' 
                      ? 'Monthly billing'
                      : billingCycle === 'quarterly'
                      ? 'Billed every 3 months'
                      : 'Billed annually'
                    }
                  </p>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-3">What Happens Next?</h3>
                <ul className="text-sm text-purple-800 space-y-2">
                  <li>• We'll review your project details</li>
                  <li>• Schedule your onboarding call</li>
                  <li>• Begin your first design project</li>
                  <li>• Regular design requests throughout your subscription</li>
                  <li>• Priority support and unlimited revisions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SubscriptionCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
