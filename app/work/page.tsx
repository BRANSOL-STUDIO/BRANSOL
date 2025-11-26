"use client";

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { projects, getProjectsByCategory } from '@/lib/data/projects';

export default function WorkPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Brand Identity', 'Product Design', 'Platform Design', 'Healthcare', 'Food & Beverage', 'Health & Fitness', 'Web Design', 'Logo Design'];

  // Filter projects based on category and search
  const filteredProjects = useMemo(() => {
    let filtered = selectedCategory === 'All' 
      ? projects 
      : getProjectsByCategory(selectedCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-20 pb-16 md:pb-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-[#f12150]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto mb-12"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block mb-6"
              >
                <span className="px-4 py-2 bg-[#f12150]/10 text-[#f12150] rounded-full text-sm font-semibold">
                  Portfolio
                </span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Our Work
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Creative solutions for brands that want to lead, not follow. Explore our portfolio of transformative projects.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto mt-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-[#f12150] mb-1">{projects.length}+</div>
                  <div className="text-sm text-gray-600">Projects</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-[#f12150] mb-1">{categories.length - 1}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-[#f12150] mb-1">100%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-[#f12150] focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400"
                />
              </div>
            </motion.div>

            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-[#f12150] text-white shadow-lg shadow-[#f12150]/30'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#f12150] hover:text-[#f12150] hover:bg-[#f12150]/5'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container">
            {filteredProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-6 py-3 bg-[#f12150] text-white rounded-xl font-semibold hover:bg-[#c91a3f] transition-colors"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {selectedCategory === 'All' ? 'All Projects' : selectedCategory}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
                    </p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedCategory}-${searchQuery}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                  >
                    {filteredProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="group cursor-pointer"
                      >
                        <Link href={`/work/${project.id}`}>
                          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                            {/* Project Image/Thumbnail */}
                            <div className={`relative h-64 bg-gradient-to-br ${project.gradient} overflow-hidden`}>
                              {/* Try to load actual image, fallback to gradient */}
                              {project.images && project.images[0] && (
                                <Image
                                  src={project.images[0]}
                                  alt={project.name}
                                  fill
                                  className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              )}
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white z-10">
                                <div className="absolute top-4 left-4 text-white text-sm font-bold opacity-90 backdrop-blur-sm bg-black/30 px-3 py-1.5 rounded-lg border border-white/20">
                                  {project.name}
                                </div>
                                <div className="text-white text-sm text-center mt-auto opacity-90 font-medium px-4">
                                  {project.description}
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                              
                              {/* Category Badge */}
                              <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/30">
                                  {project.category}
                                </span>
                              </div>
                            </div>

                            {/* Project Info */}
                            <div className="p-6 flex-1 flex flex-col">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#f12150] transition-colors line-clamp-1">
                                    {project.name}
                                  </h3>
                                  <p className="text-sm text-gray-500">{project.category}</p>
                                </div>
                                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-[#f12150] group-hover:scale-110 transition-all flex-shrink-0 ml-2" />
                              </div>
                              
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                                {project.description}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {project.tags.length > 2 && (
                                  <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
                                    +{project.tags.length - 2}
                                  </span>
                                )}
                              </div>

                              {/* Footer */}
                              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                <span className="text-xs text-gray-500 font-medium">{project.year}</span>
                                <div className="flex items-center gap-1 text-[#f12150] text-sm font-semibold group-hover:gap-2 transition-all">
                                  <span>View</span>
                                  <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-[#f12150] to-[#c91a3f] relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to start your project?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Let's create something amazing together. Get in touch and let's bring your vision to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/book-a-call"
                  className="group bg-white text-[#f12150] hover:bg-gray-50 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] text-center flex items-center justify-center gap-2"
                >
                  <span>Book a Call</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/subscriptions"
                  className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 text-center"
                >
                  View Packages
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
