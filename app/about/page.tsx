"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Heart, Target, Users, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-5xl font-black text-gray-900 mb-6">
                About Bransol
              </h1>
              <p className="text-xl text-gray-600">
                Crafting exceptional brands that stand out and make an impact
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-200 p-12"
              >
                <div className="text-center mb-12">
                  <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Our Mission
                  </h2>
                  <p className="text-gray-600 text-lg">
                    At Bransol, we believe every brand has a unique story worth telling. Our mission is to help businesses discover and communicate their authentic voice through strategic design and creative excellence.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Passion</h3>
                    <p className="text-gray-600">
                      We're passionate about creating designs that resonate and inspire
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Purpose</h3>
                    <p className="text-gray-600">
                      Every design decision is driven by strategy and purpose
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Partnership</h3>
                    <p className="text-gray-600">
                      We work closely with our clients to bring their vision to life
                    </p>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <a
                    href="mailto:hello@bransol.com"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                  >
                    Let's Work Together
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
