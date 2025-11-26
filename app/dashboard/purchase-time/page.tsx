"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PurchaseTimePage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  // Time packages
  const timePackages = [
    {
      id: 1,
      hours: 5,
      price: 750,
      pricePerHour: 150,
      savings: 0,
      popular: false,
      description: 'Perfect for small projects'
    },
    {
      id: 2,
      hours: 10,
      price: 1400,
      pricePerHour: 140,
      savings: 100,
      popular: true,
      description: 'Most popular choice'
    },
    {
      id: 3,
      hours: 20,
      price: 2600,
      pricePerHour: 130,
      savings: 400,
      popular: false,
      description: 'Best value for larger projects'
    },
    {
      id: 4,
      hours: 40,
      price: 4800,
      pricePerHour: 120,
      savings: 1200,
      popular: false,
      description: 'Enterprise solution'
    }
  ];

  // Recent purchases
  const recentPurchases = [
    { date: 'Sep 15, 2025', hours: 5, amount: 750, status: 'Completed' },
    { date: 'Aug 22, 2025', hours: 10, amount: 1400, status: 'Completed' },
  ];

  const handlePurchase = () => {
    if (selectedPackage) {
      setShowCheckout(true);
    }
  };

  const selectedPkg = timePackages.find(pkg => pkg.id === selectedPackage);

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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Purchase Additional Time</h1>
            <p className="text-gray-600">Add more hours to your account for current or future projects</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Time Packages */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Choose Your Time Package</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {timePackages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? 'border-purple-600 shadow-xl scale-[1.02]'
                          : 'border-gray-200 hover:border-purple-300 hover:shadow-lg'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center mb-4">
                        <div className="text-5xl font-black text-purple-600 mb-2">{pkg.hours}</div>
                        <div className="text-sm text-gray-600 font-medium">Hours</div>
                      </div>

                      <div className="text-center mb-4">
                        <div className="text-3xl font-black text-gray-900 mb-1">
                          ${pkg.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          ${pkg.pricePerHour}/hour
                        </div>
                      </div>

                      {pkg.savings > 0 && (
                        <div className="text-center mb-4">
                          <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                            Save ${pkg.savings}
                          </span>
                        </div>
                      )}

                      <p className="text-center text-sm text-gray-600 mb-4">{pkg.description}</p>

                      <div className={`w-full py-3 rounded-xl font-semibold text-center transition-colors ${
                        selectedPackage === pkg.id
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedPackage === pkg.id ? 'Selected ✓' : 'Select Package'}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100"
                >
                  <h3 className="font-bold text-gray-900 mb-4">✨ What You Get</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Hours never expire</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Use for any project type</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Same dedicated designer</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Priority support included</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Instant account credit</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>Better rates than hourly</span>
                    </li>
                  </ul>
                </motion.div>

                {/* Recent Purchases */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
                >
                  <h3 className="font-bold text-gray-900 mb-4">Recent Purchases</h3>
                  {recentPurchases.length > 0 ? (
                    <div className="space-y-3">
                      {recentPurchases.map((purchase, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-semibold text-gray-900">{purchase.hours} Hours</p>
                            <p className="text-sm text-gray-600">{purchase.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${purchase.amount.toLocaleString()}</p>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                              {purchase.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">No previous purchases</p>
                  )}
                </motion.div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-8"
              >
                <h3 className="font-bold text-gray-900 mb-6">Order Summary</h3>
                
                {selectedPackage ? (
                  <>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package</span>
                        <span className="font-semibold text-gray-900">{selectedPkg?.hours} Hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rate</span>
                        <span className="font-semibold text-gray-900">${selectedPkg?.pricePerHour}/hour</span>
                      </div>
                      {selectedPkg && selectedPkg.savings > 0 && (
                        <div className="flex justify-between">
                          <span className="text-green-600">Savings</span>
                          <span className="font-semibold text-green-600">-${selectedPkg.savings}</span>
                        </div>
                      )}
                      <div className="pt-4 border-t border-gray-200 flex justify-between">
                        <span className="font-bold text-gray-900">Total</span>
                        <span className="font-black text-2xl text-purple-600">${selectedPkg?.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handlePurchase}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mb-4"
                    >
                      Proceed to Checkout
                    </button>

                    <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                      <span>🔒</span>
                      <span>Secure payment processing</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">⏱️</div>
                    <p className="text-gray-600">Select a package to continue</p>
                  </div>
                )}
              </motion.div>

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
              >
                <h3 className="font-bold text-gray-900 mb-4">Payment Methods</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-2xl">💳</span>
                    <span className="text-sm text-gray-700">Credit Card</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-2xl">₿</span>
                    <span className="text-sm text-gray-700">Bitcoin</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-2xl">Ξ</span>
                    <span className="text-sm text-gray-700">Ethereum</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-2xl">◎</span>
                    <span className="text-sm text-gray-700">Solana</span>
                  </div>
                </div>
              </motion.div>

              {/* Help */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <div className="flex gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1 text-sm">Need Help?</h4>
                    <p className="text-sm text-blue-800 mb-2">Contact our team if you need assistance choosing the right package.</p>
                    <button className="text-sm text-blue-700 font-semibold hover:text-blue-800">
                      Chat with Support →
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      {showCheckout && selectedPkg && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCheckout(false)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            {/* Order Summary in Modal */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Package:</span>
                  <span className="font-semibold">{selectedPkg.hours} Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Rate:</span>
                  <span className="font-semibold">${selectedPkg.pricePerHour}/hour</span>
                </div>
                {selectedPkg.savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings:</span>
                    <span className="font-semibold">-${selectedPkg.savings}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-purple-200 flex justify-between">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-black text-2xl text-purple-600">${selectedPkg.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Payment Method</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Credit Card (•••• 4242)</option>
                  <option>New Credit Card</option>
                  <option>Bitcoin</option>
                  <option>Ethereum</option>
                  <option>Solana</option>
                </select>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                <input type="checkbox" id="terms" className="mt-1" />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the terms and conditions. Hours will be added to my account immediately after payment.
                </label>
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg"
              >
                Complete Purchase - ${selectedPkg.price.toLocaleString()}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>🔒</span>
              <span>Secure payment</span>
            </div>
          </motion.div>
        </div>
      )}
      
      <Footer />
    </>
  );
}


