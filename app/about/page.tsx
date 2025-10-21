"use client";

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Award, Users, Zap, Heart, Target, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: '500+', label: 'Projects Delivered' },
    { number: '200+', label: 'Happy Clients' },
    { number: '50+', label: 'Team Members' },
    { number: '99%', label: 'Satisfaction Rate' },
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Client-Centric',
      description: 'Your success is our success. We prioritize understanding your unique needs and delivering solutions that exceed expectations.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Innovation First',
      description: 'We blend cutting-edge AI technology with human creativity to deliver designs that are both modern and timeless.',
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Quality Obsessed',
      description: 'Every pixel matters. We maintain the highest standards of quality in everything we create, from logos to complete brand identities.',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Results Driven',
      description: 'Beautiful design is just the start. We focus on creating work that drives real business results and measurable growth.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Creative Director',
      image: '🎨',
      bio: '15+ years crafting memorable brand identities',
    },
    {
      name: 'Michael Chen',
      role: 'Lead Designer',
      image: '✨',
      bio: 'Award-winning designer with Fortune 500 experience',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Brand Strategist',
      image: '🚀',
      bio: 'Transforming businesses through strategic design',
    },
    {
      name: 'David Kim',
      role: 'UX Director',
      image: '💡',
      bio: 'Creating user experiences that convert',
    },
  ];

  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
          {/* Dot Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Empowering Brands Through{' '}
                <span className="font-serif italic text-purple-600">Creative Excellence</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We&apos;re a team of passionate designers, strategists, and innovators dedicated to helping businesses 
                stand out in a crowded market. Our mission is simple: create exceptional design experiences that 
                drive real business growth.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>

          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Founded in 2020, BRANSOL was born from a simple observation: businesses needed access to 
                    high-quality design services without the traditional agency overhead and long wait times.
                  </p>
                  <p>
                    We pioneered the design subscription model, combining the best of human creativity with 
                    AI-enhanced workflows to deliver exceptional results at unprecedented speed.
                  </p>
                  <p>
                    Today, we&apos;ve helped over 200 businesses transform their brands, from startups finding their 
                    visual voice to established companies refreshing their identity for a new generation.
                  </p>
                  <p>
                    Our team brings together decades of experience from top agencies and tech companies, all united 
                    by a passion for creating work that makes a real impact.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-3xl p-12 shadow-2xl">
                  <div className="text-white">
                    <div className="text-6xl font-bold mb-4">2020</div>
                    <div className="text-2xl font-semibold mb-6">Year Founded</div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-6 h-6" />
                        <span>200% Growth Year over Year</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-6 h-6" />
                        <span>50+ Team Members Worldwide</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-6 h-6" />
                        <span>15+ Industry Awards</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Values
              </h2>
              <p className="text-xl text-gray-600">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600">
                The creative minds behind BRANSOL
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-purple-300">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      {member.image}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-purple-600 font-semibold mb-3">{member.role}</p>
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Brand?
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Join hundreds of businesses who trust BRANSOL with their brand identity
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/subscriptions"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg text-lg"
                >
                  Get Started Today
                </a>
                <a
                  href="https://calendly.com/bransol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold px-8 py-4 rounded-xl transition-all duration-300 text-lg"
                >
                  Schedule a Call
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

