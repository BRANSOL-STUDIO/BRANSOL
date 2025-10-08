"use client";

import { motion } from 'framer-motion';
import { SITE } from '@/config/sitemap';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section id="hero" className="py-16 bg-white relative overflow-hidden">
          {/* Dot Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>
          
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="max-w-md">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight"
                >
                  Design subscriptions for{" "}
                  <span className="font-serif italic text-purple-600">everyone</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl text-gray-600 mb-8 leading-relaxed"
                >
                  Pause or cancel anytime.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <a
                    href="/subscriptions"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg text-center"
                  >
                    {SITE.ctas.primary.label}
                  </a>
                  <a
                    href={SITE.ctas.secondary.href}
                    className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 text-center"
                  >
                    {SITE.ctas.secondary.label}
                  </a>
                </motion.div>
              </div>

              {/* Right Side - Featured Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative flex justify-center"
              >
                {/* Main Card */}
                <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-10 md:p-12 shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-center w-full max-w-md">
                  
                  {/* Top Badge */}
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="absolute top-6 left-6 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                    Start today
                  </motion.div>

                  {/* Top Right Graphics */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="absolute top-6 right-6 flex gap-2"
                  >
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          y: [0, -10, 0],
                          rotate: [0, 5, 0]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: i * 0.2
                        }}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                      >
                        <span className="text-white text-lg">😊</span>
                      </motion.div>
                    ))}
                    <motion.div
                      animate={{ 
                        y: [0, -8, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 1
                      }}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
                    >
                      <span className="text-white text-xs font-bold">MONTHLY CLUB</span>
                    </motion.div>
                  </motion.div>

                  {/* Card Content */}
                  <div className="relative z-10 text-left text-white pt-20">
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="text-4xl md:text-5xl font-bold mb-4"
                    >
                      Join BRANSOL
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.0 }}
                      className="text-xl mb-8 opacity-90"
                    >
                      One subscription to rule them all
                    </motion.p>
                    
                    {/* Primary CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full mb-8"
                    >
                      <a
                        href="/subscriptions"
                        className="block w-full bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-purple-600 hover:text-white hover:shadow-xl text-center group"
                      >
                        See pricing
                        <motion.span
                          className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-200"
                        >
                          →
                        </motion.span>
                      </a>
                    </motion.div>

                    {/* Secondary Info */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.4 }}
                      className="flex items-center gap-4 text-sm opacity-90"
                    >
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-lg">😊</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white mb-1">Book a 15-min intro call</p>
                        <motion.a 
                          href={SITE.ctas.book?.href || '#'} 
                          className="text-white underline hover:no-underline font-medium inline-flex items-center gap-1 group"
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          Schedule now 
                          <motion.span
                            className="group-hover:translate-x-1 transition-transform duration-200"
                          >
                            →
                          </motion.span>
                        </motion.a>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 flex-shrink-0"
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          {/* Dot Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                The way design should&apos;ve been done in the first place
              </h2>
              <p className="text-lg text-gray-600">
                Streamlined workflows that deliver exceptional results faster than ever before.
              </p>
            </motion.div>

            {/* Workflow Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Subscribe Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Subscribe</h3>
                <p className="text-gray-600 leading-relaxed">
                  Choose your design package and get instant access to our streamlined process.
                </p>
              </motion.div>

              {/* Request Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 relative z-10">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                
                {/* Animated Background Labels */}
                <div className="absolute inset-0 p-8 overflow-hidden">
                  {/* Row 1 - Moving Right */}
                  <div className="absolute top-4 left-0 w-full h-8 overflow-hidden">
                    <motion.div
                      animate={{ x: [0, -300, 0] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="flex gap-4 whitespace-nowrap"
                    >
                      {[...Array(8)].map((_, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium opacity-60">
                          Logo Design
                        </span>
                      ))}
                    </motion.div>
                  </div>
                  
                  {/* Row 2 - Moving Left */}
                  <div className="absolute top-16 left-0 w-full h-8 overflow-hidden">
                    <motion.div
                      animate={{ x: [-300, 0, -300] }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="flex gap-4 whitespace-nowrap"
                    >
                      {[...Array(10)].map((_, i) => (
                        <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium opacity-40">
                          Brand Strategy
                        </span>
                      ))}
                    </motion.div>
                  </div>
                  
                  {/* Row 3 - Moving Right */}
                  <div className="absolute top-28 left-0 w-full h-8 overflow-hidden">
                    <motion.div
                      animate={{ x: [0, -300, 0] }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      className="flex gap-4 whitespace-nowrap"
                    >
                      {[...Array(6)].map((_, i) => (
                        <span key={i} className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium opacity-50">
                          Web Design
                        </span>
                      ))}
                    </motion.div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">Request</h3>
                <p className="text-gray-600 leading-relaxed relative z-10">
                  Submit your brief and watch our AI-enhanced team create your designs with precision and speed.
                </p>
              </motion.div>

              {/* Receive Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Receive</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get your completed designs, source files, and everything you need to bring your vision to life.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-20 bg-[#250e2d] relative overflow-hidden">
          {/* Dot Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Choose your package
              </h2>
              <p className="text-xl text-purple-300">
                Transparent pricing with everything you need to succeed
              </p>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {SITE.sections.pricing.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border ${
                    plan.highlight 
                      ? 'border-purple-400 shadow-2xl shadow-purple-500/25' 
                      : 'border-white/20'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">${plan.usd.toLocaleString()}</span>
                      <span className="text-purple-300 ml-2">USD</span>
                    </div>
                    <div className="text-sm text-gray-200">
                      <span className="text-purple-300">{plan.btc} BTC</span>
                      <span className="text-gray-400 ml-2">(5% off)</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: (index * 0.2) + (featureIndex * 0.1) }}
                        className="flex items-center gap-3 text-gray-200"
                      >
                        <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
                    }`}
                  >
                    <Link href={`/subscriptions/checkout?plan=${plan.name.toLowerCase().replace(/\s+/g, '-')}`} className="block w-full h-full flex items-center justify-center">
                      Get Started
                    </Link>
                  </motion.button>
                </motion.div>
              ))}
            </div>
            
            {/* Crypto Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-12"
            >
              <p className="text-purple-300 text-lg">
                💰 Save 5% with BTC/USDC via Coinbase Commerce
              </p>
            </motion.div>
          </div>
        </section>

        {/* Work Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          {/* Dot Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Our Work
              </h2>
              <p className="text-xl text-gray-600">
                See how we&apos;ve helped brands transform their visual identity
              </p>
            </motion.div>

            {/* Work Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-gray-100 rounded-2xl aspect-square mb-4 group-hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-lg font-medium">Project {index + 1}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Brand Project {index + 1}</h3>
                  <p className="text-gray-600 text-sm">Logo Design • Brand Identity</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          {/* Dot Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>
          
          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                What Our Clients Say
              </h2>
              <p className="text-xl text-gray-600">
                Don&apos;t just take our word for it
              </p>
            </motion.div>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  quote: "BRANSOL transformed our brand identity completely. The AI-enhanced process was incredibly fast without sacrificing quality.",
                  author: "Sarah Chen",
                  role: "CEO, TechFlow"
                },
                {
                  quote: "Professional, efficient, and the results exceeded our expectations. The turnaround time was impressive.",
                  author: "Marcus Rodriguez",
                  role: "Founder, GreenLeaf"
                },
                {
                  quote: "Finally, a design agency that understands modern business needs. The subscription model is brilliant.",
                  author: "Emily Watson",
                  role: "Marketing Director, InnovateCorp"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="mb-6">
                    <div className="flex text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          {/* Dot Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>
          
          <div className="container relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
              >
                Ready to Transform Your Brand?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 mb-8"
              >
                Join the future of design with AI-enhanced creativity and human expertise.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <a
                  href="/subscriptions"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg text-lg"
                >
                  {SITE.ctas.primary.label}
                </a>
                <a
                  href={SITE.ctas.book.href}
                  className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-lg"
                >
                  {SITE.ctas.book.label}
                </a>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
