"use client";

import { use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectById } from '@/lib/data/projects';

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = parseInt(resolvedParams.id);
  const project = getProjectById(projectId);

  if (!project) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
            <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 bg-[#f12150] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#c91a3f] transition-all"
            >
              <ArrowLeft className="w-5 h-5 rotate-180" />
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Placeholder images - replace with actual image paths when you upload images
  const projectImages = project.images || [
    `/images/projects/placeholder-${project.id}-1.jpg`,
    `/images/projects/placeholder-${project.id}-2.jpg`,
    `/images/projects/placeholder-${project.id}-3.jpg`,
  ];

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        {/* Back Button */}
        <section className="pt-8 pb-8">
          <div className="container">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#f12150] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Work</span>
            </Link>
          </div>
        </section>

        {/* Banner with White Sides */}
        <section className="pb-0">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-2xl bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white z-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center">{project.name}</h1>
                <p className="text-xl md:text-2xl opacity-90 text-center max-w-3xl">{project.description}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Project Details */}
        <section className="pt-12 pb-12">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-8 lg:gap-12"
            >
              {/* Left Column - Description */}
              <div>
                {project.fullDescription && (
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-left">About This Project</h2>
                    <p className="text-gray-700 leading-relaxed text-lg text-left">
                      {project.fullDescription}
                    </p>
                  </div>
                )}

                {/* Services */}
                {project.services && project.services.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Services</h3>
                    <div className="flex flex-wrap gap-3">
                      {project.services.map((service) => (
                        <span
                          key={service}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Project Info */}
              <div>
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Project Details</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Client</h4>
                      <p className="text-lg font-medium text-gray-900">{project.client || project.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Year</h4>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <p className="text-lg font-medium text-gray-900">{project.year}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Category</h4>
                      <p className="text-lg font-medium text-gray-900">{project.category}</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-[#f12150]/10 text-[#f12150] rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Project Images */}
        <section className="py-12 bg-gray-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Project Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 group cursor-pointer"
                  >
                    <Image
                      src={image}
                      alt={`${project.name} - Image ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to gradient background if image doesn't exist
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.className = `relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br ${project.gradient} flex items-center justify-center`;
                          parent.innerHTML = `<div class="text-white text-center p-6"><p class="text-sm opacity-80">Image ${index + 1}</p><p class="text-xs opacity-60 mt-2">Upload image to /public/images/projects/${project.name.toLowerCase().replace(/\s+/g, '-')}/${index + 1}.jpg</p></div>`;
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Next Project CTA */}
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">View More Work</h2>
              <p className="text-gray-600 mb-8">
                Explore our other projects and creative solutions
              </p>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 bg-[#f12150] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#c91a3f] transition-all duration-300 hover:shadow-xl"
              >
                <span>Back to Portfolio</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
