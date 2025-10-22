"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Palette, Zap, Award } from 'lucide-react';

export default function WorkPage() {
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
                Our Work
              </h1>
              <p className="text-xl text-gray-600">
                Explore our portfolio of creative projects and brand transformations
              </p>
            </motion.div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-200 p-12 text-center"
              >
                <div className="flex justify-center gap-4 mb-8">
                  <Palette className="w-12 h-12 text-purple-600" />
                  <Zap className="w-12 h-12 text-blue-600" />
                  <Award className="w-12 h-12 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Portfolio Coming Soon
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  We're currently showcasing our best work. Check back soon to see our portfolio of amazing projects!
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="/packages"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
                  >
                    View Packages
                  </a>
                  <a
                    href="mailto:hello@bransol.com"
                    className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    Get in Touch
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

