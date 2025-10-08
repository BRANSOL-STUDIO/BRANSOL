"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProjectsPage() {
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    description: '',
    deadline: '',
    budget: '',
    files: [] as File[]
  });

  const projectTypes = [
    'Logo Design',
    'Brand Guidelines',
    'Social Media Kit',
    'Presentation Design',
    'Print Collateral',
    'Web Design',
    'Animation',
    'Creative Strategy',
    'Other'
  ];

  // Mock projects data with files
  const projects = [
    { 
      id: 1, 
      name: "Logo Redesign", 
      status: "In Progress", 
      type: "Logo Design",
      createdDate: "Oct 1, 2025",
      deadline: "Oct 15, 2025",
      hoursUsed: 3,
      designer: "Sarah Johnson",
      lastUpdate: "2 hours ago",
      files: [
        { name: "logo-concept-v1.ai", size: "2.4 MB", date: "Oct 5" },
        { name: "logo-concept-v2.ai", size: "2.1 MB", date: "Oct 7" }
      ]
    },
    { 
      id: 2, 
      name: "Brand Guidelines", 
      status: "Review", 
      type: "Brand Guidelines",
      createdDate: "Sep 25, 2025",
      deadline: "Oct 10, 2025",
      hoursUsed: 5,
      designer: "Mike Chen",
      lastUpdate: "1 day ago",
      files: [
        { name: "brand-guidelines.pdf", size: "5.2 MB", date: "Oct 6" },
        { name: "color-palette.pdf", size: "1.1 MB", date: "Oct 6" }
      ]
    },
    { 
      id: 3, 
      name: "Social Media Kit", 
      status: "Completed", 
      type: "Social Media Kit",
      createdDate: "Sep 15, 2025",
      deadline: "Sep 30, 2025",
      hoursUsed: 4,
      designer: "Sarah Johnson",
      lastUpdate: "3 days ago",
      files: [
        { name: "instagram-templates.psd", size: "12.3 MB", date: "Sep 29" },
        { name: "facebook-templates.psd", size: "8.7 MB", date: "Sep 29" },
        { name: "final-assets.zip", size: "45.2 MB", date: "Sep 30" }
      ]
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Project Brief Submitted:', formData);
    setShowNewProjectForm(false);
    // Reset form
    setFormData({
      projectName: '',
      projectType: '',
      description: '',
      deadline: '',
      budget: '',
      files: []
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, files: Array.from(e.target.files) });
    }
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          {/* Back Button & Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back to Dashboard Button */}
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Projects</h1>
                <p className="text-gray-600">Brief new projects and manage existing ones</p>
              </div>
              <button 
                onClick={() => setShowNewProjectForm(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                + New Project
              </button>
            </div>
          </motion.div>

          {/* New Project Form Modal */}
          {showNewProjectForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowNewProjectForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Brief a New Project</h2>
                    <button 
                      onClick={() => setShowNewProjectForm(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Project Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Logo Redesign for Acme Corp"
                      />
                    </div>

                    {/* Project Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Project Type *
                      </label>
                      <select
                        required
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select a project type</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Project Description *
                      </label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Describe your project goals, target audience, style preferences, and any specific requirements..."
                      />
                      <p className="text-sm text-gray-500 mt-2">Be as detailed as possible to help us understand your vision</p>
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Preferred Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Estimated Hours */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Estimated Hours Needed
                      </label>
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., 5"
                        min="1"
                      />
                      <p className="text-sm text-gray-500 mt-2">We'll provide a more accurate estimate after reviewing your brief</p>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Reference Files (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="text-4xl mb-2">📎</div>
                          <p className="text-gray-600 mb-1">Click to upload files</p>
                          <p className="text-sm text-gray-500">Logos, brand assets, inspiration, etc.</p>
                        </label>
                        {formData.files.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 font-semibold mb-2">{formData.files.length} file(s) selected:</p>
                            <div className="space-y-1">
                              {formData.files.map((file, index) => (
                                <p key={index} className="text-sm text-gray-600">{file.name}</p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300"
                      >
                        Submit Project Brief
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowNewProjectForm(false)}
                        className="px-6 py-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Projects List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.status === 'Completed' 
                            ? 'bg-green-100 text-green-700'
                            : project.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{project.type}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                      className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                    >
                      {selectedProject === project.id ? 'Hide Details ↑' : 'View Details →'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Created</p>
                      <p className="text-sm font-semibold text-gray-900">{project.createdDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Deadline</p>
                      <p className="text-sm font-semibold text-gray-900">{project.deadline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Hours Used</p>
                      <p className="text-sm font-semibold text-gray-900">{project.hoursUsed}h</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Designer</p>
                      <p className="text-sm font-semibold text-gray-900">{project.designer}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Last update: {project.lastUpdate}</p>
                    <div className="flex gap-2">
                      <Link 
                        href="/dashboard/chat"
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                      >
                        💬 Chat
                      </Link>
                      <button 
                        onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                        className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium rounded-lg transition-colors text-sm"
                      >
                        📁 Files ({project.files.length})
                      </button>
                    </div>
                  </div>

                  {/* Expandable Files Section */}
                  {selectedProject === project.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <h4 className="font-semibold text-gray-900 mb-3">Project Files</h4>
                      <div className="space-y-2">
                        {project.files.map((file, fileIndex) => (
                          <div 
                            key={fileIndex}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">📄</div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                                <p className="text-xs text-gray-500">{file.size} • Uploaded {file.date}</p>
                              </div>
                            </div>
                            <button className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {projects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center"
            >
              <div className="text-6xl mb-4">📋</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Projects Yet</h2>
              <p className="text-gray-600 mb-6">Start your first project by clicking the button above</p>
              <button 
                onClick={() => setShowNewProjectForm(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300"
              >
                Create Your First Project
              </button>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}


