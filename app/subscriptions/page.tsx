"use client";

import { motion } from 'framer-motion';
import { SITE } from '@/config/sitemap';
import { Check, Star, ArrowRight, Zap, Users, Crown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function SubscriptionsPage() {
  const plans = [
    {
      name: "Essentials",
      price: 3500,
      btc: 0.040,
      description: "Perfect for startups and small businesses",
      icon: Zap,
      color: "from-blue-500 to-purple-600",
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
    {
      name: "Growth Kit",
      price: 5500,
      btc: 0.063,
      description: "Most popular choice for growing businesses",
      icon: Users,
      color: "from-purple-500 to-pink-600",
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
    {
      name: "Ecosystem",
      price: 8000,
      btc: 0.091,
      description: "Complete brand ecosystem for established companies",
      icon: Crown,
      color: "from-pink-500 to-red-600",
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
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Design Subscriptions
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  That Scale With You
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-200 mb-8 leading-relaxed">
                Professional design services delivered monthly. Pause, cancel, or upgrade anytime.
              </p>
              <p className="text-lg text-purple-300 mb-8 max-w-2xl mx-auto">
                Get unlimited design requests, priority support, and access to our full creative team. 
                Perfect for businesses that need consistent, high-quality design work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white">
                  <span className="text-sm font-medium">💰 Save 5% with crypto</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white">
                  <span className="text-sm font-medium">⚡ 72-hour delivery</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white">
                  <span className="text-sm font-medium">🎯 Unlimited revisions</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-20 -mt-10 relative z-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                All plans include unlimited revisions, source files, and priority support
              </p>
            </motion.div>
            <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative ${
                    plan.popular 
                      ? 'lg:scale-105 z-10' 
                      : 'lg:scale-100'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
                        <Star className="w-4 h-4 fill-current" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Plan Card */}
                  <div className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden border-2 ${
                    plan.popular 
                      ? 'border-purple-400 shadow-purple-500/25' 
                      : 'border-gray-200'
                  }`}>
                    {/* Header */}
                    <div className={`bg-gradient-to-br ${plan.color} p-8 text-white relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <plan.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold">{plan.name}</h3>
                        </div>
                        <p className="text-purple-100 mb-6">{plan.description}</p>
                        
                        <div className="text-center">
                          <div className="mb-2">
                            <span className="text-4xl font-bold">${plan.price.toLocaleString()}</span>
                            <span className="text-purple-200 ml-2 text-lg">/month</span>
                          </div>
                          <div className="text-sm text-purple-200">
                            <span className="text-purple-300 font-semibold">{plan.btc} BTC</span>
                            <span className="text-purple-200 ml-2">(5% discount)</span>
                          </div>
                          <div className="mt-3 text-xs text-purple-300">
                            Billed monthly • Cancel anytime
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="p-8">
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                          What's Included
                        </h4>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start gap-3"
                          >
                            <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <Link
                        href={`/subscriptions/checkout?plan=${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                            : 'bg-gray-900 hover:bg-gray-800 text-white hover:shadow-lg'
                        }`}
                      >
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose BRANSOL Subscriptions?
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to scale your brand design
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
              {[
                {
                  icon: "⚡",
                  title: "Lightning Fast",
                  description: "Get your designs delivered within 72 hours. No waiting weeks for results."
                },
                {
                  icon: "🎨",
                  title: "Unlimited Revisions",
                  description: "Not happy with something? We'll revise until it's perfect. No extra charges."
                },
                {
                  icon: "📁",
                  title: "Source Files Included",
                  description: "Own all your designs. Get editable source files for every project."
                },
                {
                  icon: "👥",
                  title: "Dedicated Team",
                  description: "Work with experienced designers who understand your brand vision."
                },
                {
                  icon: "🔄",
                  title: "Flexible Billing",
                  description: "Pause, cancel, or upgrade anytime. No long-term contracts required."
                },
                {
                  icon: "💳",
                  title: "Crypto Payments",
                  description: "Pay with Bitcoin and save 5%. Traditional payment methods also accepted."
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="text-center p-6"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to know about our subscription service
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  question: "How does the subscription work?",
                  answer: "Choose your plan and get access to our design services. Submit unlimited requests within your plan's scope. We deliver within 72 hours with unlimited revisions."
                },
                {
                  question: "Can I pause or cancel anytime?",
                  answer: "Absolutely! You can pause your subscription for up to 3 months or cancel at any time. No long-term contracts or hidden fees."
                },
                {
                  question: "What if I need more than my plan includes?",
                  answer: "You can upgrade to a higher tier anytime, or purchase additional services à la carte. We'll work with you to find the perfect solution."
                },
                {
                  question: "Do I own the designs I receive?",
                  answer: "Yes! You own 100% of the designs we create for you. We provide all source files and transfer full rights upon completion."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">{faq.question}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-purple-900 to-blue-900">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Brand?
              </h2>
              <p className="text-xl text-purple-200 mb-8">
                Join hundreds of businesses already using BRANSOL subscriptions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/subscriptions/checkout?plan=growth-kit"
                  className="bg-white text-purple-900 hover:bg-purple-50 font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-xl text-lg"
                >
                  Start with Growth Kit
                </Link>
                <Link
                  href={SITE.ctas.book.href}
                  className="border-2 border-white text-white hover:bg-white hover:text-purple-900 font-bold px-8 py-4 rounded-xl transition-all duration-300 text-lg"
                >
                  Book a Consultation
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
