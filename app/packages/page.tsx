"use client";

import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function PackagesPage() {
  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="container">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Individual Design{" "}
                <span className="font-serif italic text-purple-600">Services</span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Professional à la carte design services crafted by creative directors. 
                Perfect for one-time projects or specific creative needs. For ongoing support, check out our subscription plans.
              </motion.p>
            </motion.div>
          </div>
        </section>



        {/* Individual Services */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-purple-50 relative overflow-hidden">
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, #8b5cf6 1px, transparent 1px), radial-gradient(circle at 80% 20%, #3b82f6 1px, transparent 1px)`,
              backgroundSize: '60px 60px, 40px 40px'
            }}></div>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-100/20 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-blue-100/20 to-transparent"></div>
          </div>
          
          <div className="container relative z-10">
            <motion.div 
              className="text-center max-w-5xl mx-auto mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >

              
              {/* Service Stats */}
              <motion.div 
                className="flex flex-wrap justify-center gap-8 mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-600 mb-1">500+</div>
                  <div className="text-sm text-gray-600 font-medium">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-600 mb-1">98%</div>
                  <div className="text-sm text-gray-600 font-medium">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-600 mb-1">24h</div>
                  <div className="text-sm text-gray-600 font-medium">Response Time</div>
                </div>
              </motion.div>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  name: "Logo Design", 
                  price: 800, 
                  desc: "Professional logo creation with multiple concepts", 
                  slug: "logo-design",
                  image: "/images/services/logo-design.jpg"
                },
                { 
                  name: "Brand Guidelines", 
                  price: 1200, 
                  desc: "Comprehensive brand manual & standards", 
                  slug: "brand-guidelines",
                  image: "/images/services/brand-guidelines.jpg"
                },
                { 
                  name: "Social Media Kit", 
                  price: 600, 
                  desc: "30+ social media templates & assets", 
                  slug: "social-media-kit",
                  image: "/images/services/social-media-kit.jpg"
                },
                { 
                  name: "Presentation Design", 
                  price: 400, 
                  desc: "Professional pitch decks & presentations", 
                  slug: "presentation-design",
                  image: "/images/services/presentation-design.jpg"
                },
                { 
                  name: "Print Collateral", 
                  price: 500, 
                  desc: "Brochures, flyers, posters & more", 
                  slug: "print-collateral",
                  image: "/images/services/print-collateral.jpg"
                },
                { 
                  name: "Web Design", 
                  price: 2500, 
                  desc: "Modern website & landing page design", 
                  slug: "web-design",
                  image: "/images/services/web-design.jpg"
                },
                { 
                  name: "Animation", 
                  price: 800, 
                  desc: "Logo & brand animations", 
                  slug: "animation",
                  image: "/images/services/animation.jpg"
                },
                { 
                  name: "Creative Strategy", 
                  price: 1500, 
                  desc: "Brand & campaign strategy development", 
                  slug: "creative-strategy",
                  image: "/images/services/creative-strategy.jpg"
                }
              ].map((service, index) => (
                <motion.a
                  key={index}
                  href={`/products/${service.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  {/* Service Image */}
                  <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    {service.price >= 1500 && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          Popular
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Service Details */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 flex-1">{service.desc}</p>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <div className="text-3xl font-black text-purple-600">
                        ${service.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">One-time investment</div>
                    </div>
                    
                    {/* CTA Button */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 group-hover:from-purple-700 group-hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-center">
                      Learn More →
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
            
            {/* Trust Indicators */}
            <motion.div 
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-10 text-center">Why Choose Our Services?</h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Quality Guaranteed</h4>
                  <p className="text-sm text-gray-600">100% satisfaction guaranteed. We'll revise until you're completely happy.</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Fast Delivery</h4>
                  <p className="text-sm text-gray-600">Quick turnaround times for urgent projects. We understand time matters.</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Expert Team</h4>
                  <p className="text-sm text-gray-600">Creative directors with 10+ years of experience in brand design.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Elevate Your Brand?
              </h2>
              <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
                Let's discuss your creative needs and find the perfect service for your project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-purple-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  Schedule a Consultation
                </button>
                <a 
                  href="/subscriptions"
                  className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-purple-600 transition-colors duration-200"
                >
                  View Subscription Plans
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
