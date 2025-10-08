"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SubscriptionPage() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Mock subscription data
  const subscription = {
    plan: 'Professional',
    status: 'Active',
    price: 2500,
    billingCycle: 'Monthly',
    hoursIncluded: 10,
    hoursUsed: 2,
    hoursRemaining: 8,
    nextBilling: 'November 8, 2025',
    startDate: 'October 8, 2024',
    paymentMethod: '•••• 4242',
    cardType: 'Visa'
  };

  // Available plans for upgrade
  const plans = [
    {
      name: 'Starter',
      price: 1500,
      hours: 5,
      features: ['5 hours/month', 'Email support', '48h response time', 'Basic projects']
    },
    {
      name: 'Professional',
      price: 2500,
      hours: 10,
      features: ['10 hours/month', 'Priority support', '24h response time', 'All project types', 'Dedicated designer']
    },
    {
      name: 'Enterprise',
      price: 4500,
      hours: 20,
      features: ['20 hours/month', 'Premium support', '12h response time', 'All project types', 'Dedicated team', 'Strategy sessions']
    }
  ];

  // Usage history
  const usageHistory = [
    { date: 'Oct 5, 2025', project: 'Logo Redesign', hours: 1.5, designer: 'Sarah Johnson' },
    { date: 'Oct 3, 2025', project: 'Logo Redesign', hours: 0.5, designer: 'Sarah Johnson' },
  ];

  // Billing history
  const billingHistory = [
    { date: 'Oct 8, 2025', amount: 2500, status: 'Paid', invoice: 'INV-2025-10' },
    { date: 'Sep 8, 2025', amount: 2500, status: 'Paid', invoice: 'INV-2025-09' },
    { date: 'Aug 8, 2025', amount: 2500, status: 'Paid', invoice: 'INV-2025-08' },
  ];

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Subscription Management</h1>
            <p className="text-gray-600">Manage your plan, billing, and usage</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-4">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-sm font-semibold">{subscription.status}</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{subscription.plan} Plan</h2>
                    <p className="text-lg opacity-90">${subscription.price.toLocaleString()}/month</p>
                  </div>
                  <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm"
                  >
                    Upgrade Plan
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm opacity-75 mb-1">Hours This Month</p>
                    <p className="text-2xl font-bold">{subscription.hoursRemaining} / {subscription.hoursIncluded}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-75 mb-1">Next Billing</p>
                    <p className="text-2xl font-bold">{subscription.nextBilling.split(',')[0]}</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Usage</span>
                    <span className="text-sm font-bold">{Math.round((subscription.hoursUsed / subscription.hoursIncluded) * 100)}%</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(subscription.hoursUsed / subscription.hoursIncluded) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>

              {/* Usage History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Usage History</h3>
                <div className="space-y-3">
                  {usageHistory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.project}</h4>
                        <p className="text-sm text-gray-600">{item.designer} • {item.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-600">{item.hours}h</p>
                      </div>
                    </div>
                  ))}
                </div>
                {usageHistory.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No usage yet this month</p>
                )}
              </motion.div>

              {/* Billing History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Billing History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Amount</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Status</th>
                        <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Invoice</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingHistory.map((bill, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 px-2 text-sm text-gray-900">{bill.date}</td>
                          <td className="py-3 px-2 text-sm font-semibold text-gray-900">${bill.amount.toLocaleString()}</td>
                          <td className="py-3 px-2">
                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                              {bill.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                              {bill.invoice} ↓
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-sm">
                    Purchase Additional Hours
                  </button>
                  <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                  >
                    Upgrade Plan
                  </button>
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors text-sm">
                    Update Payment Method
                  </button>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {subscription.cardType === 'Visa' ? 'V' : 'M'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{subscription.cardType}</p>
                    <p className="text-sm text-gray-600">{subscription.paymentMethod}</p>
                  </div>
                </div>
              </motion.div>

              {/* Subscription Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <h3 className="font-bold text-gray-900 mb-4">Subscription Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Billing Cycle</p>
                    <p className="font-semibold text-gray-900">{subscription.billingCycle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Member Since</p>
                    <p className="font-semibold text-gray-900">{subscription.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
                    <p className="font-semibold text-gray-900">{subscription.nextBilling}</p>
                  </div>
                </div>
              </motion.div>

              {/* Cancel Subscription */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-2xl border border-red-200 shadow-sm p-6"
              >
                <h3 className="font-bold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-600 mb-4">Cancel your subscription at any time</p>
                <button 
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                >
                  Cancel Subscription
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCancelModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancel Subscription?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to all features at the end of your billing cycle.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
              >
                Keep Subscription
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors">
                Cancel Plan
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowUpgradeModal(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h2>
              <button onClick={() => setShowUpgradeModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.name} className={`border-2 rounded-2xl p-6 ${
                  plan.name === subscription.plan 
                    ? 'border-purple-600 bg-purple-50' 
                    : 'border-gray-200'
                }`}>
                  {plan.name === subscription.plan && (
                    <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">Current Plan</span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{plan.name}</h3>
                  <div className="text-3xl font-black text-purple-600 mb-1">${plan.price.toLocaleString()}</div>
                  <p className="text-sm text-gray-600 mb-6">{plan.hours} hours/month</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    disabled={plan.name === subscription.plan}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      plan.name === subscription.plan
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                    }`}
                  >
                    {plan.name === subscription.plan ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
      
      <Footer />
    </>
  );
}


