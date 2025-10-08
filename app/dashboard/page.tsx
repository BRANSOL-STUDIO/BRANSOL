"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
import Footer from '@/components/Footer';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    description: '',
    deadline: '',
    budget: '',
    files: [] as File[]
  });

  // Mock user data - in production, this would come from auth/API
  const userData = {
    name: "John Doe",
    email: "john@example.com",
    plan: "Professional",
    hoursRemaining: 8,
    hoursTotal: 10,
    nextBilling: "Nov 8, 2025",
    projects: [
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
    ],
    recentMessages: 3
  };

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

  // Subscription data
  const subscription = {
    plan: 'Professional',
    status: 'Active',
    price: 2500,
    billingCycle: 'Monthly',
    hoursIncluded: 10,
    hoursUsed: 2,
    hoursRemaining: 8,
    nextBilling: 'November 8, 2025',
    startDate: 'October 8, 2024',
    paymentMethod: '•••• 4242',
    cardType: 'Visa'
  };

  const plans = [
    {
      name: 'Starter',
      price: 1500,
      hours: 5,
      features: ['5 hours/month', 'Email support', '48h response time', 'Basic projects']
    },
    {
      name: 'Professional',
      price: 2500,
      hours: 10,
      features: ['10 hours/month', 'Priority support', '24h response time', 'All project types', 'Dedicated designer']
    },
    {
      name: 'Enterprise',
      price: 4500,
      hours: 20,
      features: ['20 hours/month', 'Premium support', '12h response time', 'All project types', 'Dedicated team', 'Strategy sessions']
    }
  ];

  const usageHistory = [
    { date: 'Oct 5, 2025', project: 'Logo Redesign', hours: 1.5, designer: 'Sarah Johnson' },
    { date: 'Oct 3, 2025', project: 'Logo Redesign', hours: 0.5, designer: 'Sarah Johnson' },
  ];

  const billingHistory = [
    { date: 'Oct 8, 2025', amount: 2500, status: 'Paid', invoice: 'INV-2025-10' },
    { date: 'Sep 8, 2025', amount: 2500, status: 'Paid', invoice: 'INV-2025-09' },
    { date: 'Aug 8, 2025', amount: 2500, status: 'Paid', invoice: 'INV-2025-08' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Project Brief Submitted:', formData);
    setShowNewProjectForm(false);
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
      <DashboardNav userName={userData.name} notifications={userData.recentMessages} />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex">
          {/* Sidebar Navigation */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block w-72 min-h-screen bg-white border-r border-gray-200 sticky top-0 overflow-y-auto"
          >
            {/* User Profile Section */}
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {userData.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{userData.name}</h3>
                  <p className="text-sm text-gray-500">{userData.email}</p>
                </div>
              </div>
              
              {/* Hours Remaining Widget */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-700">Hours Remaining</p>
                  <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-bold">{subscription.plan}</span>
                </div>
                <div className="text-3xl font-black text-purple-600 mb-2">{userData.hoursRemaining}</div>
                <div className="bg-gray-200 rounded-full h-2 mb-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(userData.hoursRemaining / userData.hoursTotal) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                  ></motion.div>
                </div>
                <p className="text-xs text-gray-600">of {userData.hoursTotal} hours this month</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Menu</p>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">📊</span>
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'projects'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">🎨</span>
                  <span>Projects</span>
                  <span className="ml-auto bg-purple-100 text-purple-600 text-xs font-bold px-2 py-1 rounded-full">
                    {userData.projects.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                    activeTab === 'chat'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">💬</span>
                  <span>Chat</span>
                  {userData.recentMessages > 0 && (
                    <span className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      {userData.recentMessages}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === 'subscription'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">⚡</span>
                  <span>Subscription</span>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Quick Actions</p>
                <div className="space-y-2">
                  <button 
                    onClick={() => { setActiveTab('projects'); setShowNewProjectForm(true); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg"
                  >
                    <span className="text-xl">+</span>
                    <span>New Project</span>
                  </button>
                  <Link
                    href="/dashboard/purchase-time"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all duration-300"
                  >
                    <span className="text-xl">⚡</span>
                    <span>Buy Hours</span>
                  </Link>
                </div>
              </div>
            </nav>
          </motion.aside>

          {/* Main Content Area */}
          <div className="flex-1 p-8 lg:p-12">
            {/* Welcome Header */}
            <motion.div 
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                    Welcome back, {userData.name}! 👋
                  </h1>
                  <p className="text-lg text-gray-600">Here&apos;s what&apos;s happening with your projects today.</p>
                </div>
                <div className="hidden xl:flex items-center gap-3">
                  <div className="px-6 py-3 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Member since</p>
                    <p className="font-bold text-purple-600">{subscription.startDate.split(',')[0]}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tab Content */}
            <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Hours Remaining Card */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group"
                  >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">{userData.plan}</span>
                      </div>
                      <div className="text-5xl font-black mb-2">{userData.hoursRemaining}</div>
                      <div className="text-lg opacity-90 mb-4">Hours Remaining</div>
                      <div className="mt-6 bg-white/20 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(userData.hoursRemaining / userData.hoursTotal) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="bg-white h-3 rounded-full shadow-lg"
                        ></motion.div>
                      </div>
                      <p className="text-xs opacity-75 mt-2">{userData.hoursUsed} of {userData.hoursTotal} hours used</p>
                    </div>
                  </motion.div>

                  {/* Active Projects Card */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                    
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        {userData.projects.length}
                      </div>
                      <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Projects</div>
                      <button 
                        onClick={() => setActiveTab('projects')}
                        className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        View all <span>→</span>
                      </button>
                    </div>
                  </motion.div>

                  {/* Messages Card */}
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                        {userData.recentMessages > 0 && (
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                            {userData.recentMessages} New
                          </span>
                        )}
                      </div>
                      <div className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                        {userData.recentMessages}
                      </div>
                      <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Unread Messages</div>
                      <button 
                        onClick={() => setActiveTab('chat')}
                        className="mt-4 text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        Open chat <span>→</span>
                      </button>
                    </div>
                  </motion.div>
                </div>

                {/* Recent Projects */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Recent Projects</h2>
                    <button 
                      onClick={() => setActiveTab('projects')}
                      className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      View All <span>→</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {userData.projects.map((project, index) => (
                      <motion.div 
                        key={project.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                        className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-md transition-all duration-300 border border-gray-100 group cursor-pointer"
                        onClick={() => setActiveTab('projects')}
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">{project.name}</h3>
                          <p className="text-sm text-gray-500">{project.lastUpdate}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                            project.status === 'Completed' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                              : project.status === 'In Progress'
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                              : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          }`}>
                            {project.status}
                          </span>
                          <span className="text-gray-400 group-hover:text-purple-600 transition-colors">→</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => { setActiveTab('projects'); setShowNewProjectForm(true); }}
                    className="relative bg-gradient-to-br from-purple-600 via-purple-500 to-blue-600 text-white font-semibold py-8 px-8 rounded-3xl transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 text-left overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl mb-3">📋</div>
                          <div className="text-xl font-bold mb-2">Start New Project</div>
                          <div className="text-sm opacity-90">Brief a new design project</div>
                        </div>
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => setActiveTab('subscription')}
                    className="relative bg-white border-2 border-gray-200 hover:border-purple-300 text-gray-900 font-semibold py-8 px-8 rounded-3xl transition-all duration-300 shadow-xl hover:shadow-2xl text-left overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-50 to-blue-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-3xl mb-3">⚡</div>
                          <div className="text-xl font-bold mb-2">Add More Time</div>
                          <div className="text-sm text-gray-600">Purchase additional hours</div>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Projects Header */}
                <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Projects</h2>
                    <p className="text-gray-600">Brief new projects and manage existing ones</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewProjectForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <span className="text-2xl">+</span>
                    New Project
                  </motion.button>
                </div>

                {/* Projects List */}
                <div className="space-y-4">
                  {userData.projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                      className="bg-white rounded-3xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                              <span className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                                project.status === 'Completed' 
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                  : project.status === 'In Progress'
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
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

                        <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
                          <p className="text-sm text-gray-500 font-medium">Last update: {project.lastUpdate}</p>
                          <div className="flex gap-3">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setActiveTab('chat')}
                              className="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 font-semibold rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-md flex items-center gap-2"
                            >
                              <span className="text-base">💬</span> Chat
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                              className="px-5 py-2.5 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-purple-700 font-semibold rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-md flex items-center gap-2"
                            >
                              <span className="text-base">📁</span> Files ({project.files.length})
                            </motion.button>
                          </div>
                        </div>

                        {/* Expandable Files Section */}
                        {selectedProject === project.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-gray-200"
                          >
                            <h4 className="font-bold text-gray-900 mb-4 text-lg">Project Files</h4>
                            <div className="space-y-3">
                              {project.files.map((file, fileIndex) => (
                                <motion.div 
                                  key={fileIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: fileIndex * 0.1 }}
                                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-md transition-all duration-300 border border-gray-100 group"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                                      📄
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors">{file.name}</p>
                                      <p className="text-xs text-gray-500">{file.size} • Uploaded {file.date}</p>
                                    </div>
                                  </div>
                                  <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </motion.button>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Chat with Designer</h2>
                  <p className="text-gray-600 mb-6">Real-time communication with your creative team</p>
                  <a 
                    href="/dashboard/chat"
                    className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                  >
                    Open Chat →
                  </a>
                </div>
              </motion.div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Current Plan */}
                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-4">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            <span className="text-sm font-semibold">{subscription.status}</span>
                          </div>
                          <h2 className="text-3xl font-bold mb-2">{subscription.plan} Plan</h2>
                          <p className="text-lg opacity-90">${subscription.price.toLocaleString()}/month</p>
                        </div>
                        <button 
                          onClick={() => setShowUpgradeModal(true)}
                          className="bg-white text-purple-600 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm"
                        >
                          Upgrade Plan
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <p className="text-sm opacity-75 mb-1">Hours This Month</p>
                          <p className="text-2xl font-bold">{subscription.hoursRemaining} / {subscription.hoursIncluded}</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-75 mb-1">Next Billing</p>
                          <p className="text-2xl font-bold">{subscription.nextBilling.split(',')[0]}</p>
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Usage</span>
                          <span className="text-sm font-bold">{Math.round((subscription.hoursUsed / subscription.hoursIncluded) * 100)}%</span>
                        </div>
                        <div className="bg-white/20 rounded-full h-3">
                          <div 
                            className="bg-white h-3 rounded-full transition-all duration-500"
                            style={{ width: `${(subscription.hoursUsed / subscription.hoursIncluded) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Usage History */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Usage History</h3>
                      <div className="space-y-3">
                        {usageHistory.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{item.project}</h4>
                              <p className="text-sm text-gray-600">{item.designer} • {item.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-purple-600">{item.hours}h</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Billing History */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Billing History</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Date</th>
                              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Amount</th>
                              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Status</th>
                              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Invoice</th>
                            </tr>
                          </thead>
                          <tbody>
                            {billingHistory.map((bill, index) => (
                              <tr key={index} className="border-b border-gray-100">
                                <td className="py-3 px-2 text-sm text-gray-900">{bill.date}</td>
                                <td className="py-3 px-2 text-sm font-semibold text-gray-900">${bill.amount.toLocaleString()}</td>
                                <td className="py-3 px-2">
                                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                                    {bill.status}
                                  </span>
                                </td>
                                <td className="py-3 px-2">
                                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                    {bill.invoice} ↓
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <Link 
                          href="/dashboard/purchase-time"
                          className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-sm text-center"
                        >
                          Purchase Additional Hours
                        </Link>
                        <button 
                          onClick={() => setShowUpgradeModal(true)}
                          className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                        >
                          Upgrade Plan
                        </button>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors text-sm">
                          Update Payment Method
                        </button>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {subscription.cardType === 'Visa' ? 'V' : 'M'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{subscription.cardType}</p>
                          <p className="text-sm text-gray-600">{subscription.paymentMethod}</p>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Info */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Subscription Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Billing Cycle</p>
                          <p className="font-semibold text-gray-900">{subscription.billingCycle}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Member Since</p>
                          <p className="font-semibold text-gray-900">{subscription.startDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
                          <p className="font-semibold text-gray-900">{subscription.nextBilling}</p>
                        </div>
                      </div>
                    </div>

                    {/* Cancel Subscription */}
                    <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
                      <h3 className="font-bold text-red-600 mb-2">Danger Zone</h3>
                      <p className="text-sm text-gray-600 mb-4">Cancel your subscription at any time</p>
                      <button 
                        onClick={() => setShowCancelModal(true)}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            </div>
          </div>
        </div>

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
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Project Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.projectName}
                        onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Logo Redesign for Acme Corp"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Project Type *</label>
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

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Project Description *</label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        placeholder="Describe your project goals, target audience, style preferences..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Preferred Deadline</label>
                      <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Reference Files (Optional)</label>
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
                            <p className="text-sm text-gray-600 font-semibold mb-2">{formData.files.length} file(s) selected</p>
                          </div>
                        )}
                      </div>
                    </div>

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

          {/* Cancel Subscription Modal */}
          {showCancelModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCancelModal(false)}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl max-w-md w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancel Subscription?</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to cancel your subscription? You&apos;ll lose access to all features at the end of your billing cycle.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                  >
                    Keep Subscription
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors">
                    Cancel Plan
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Upgrade Plan Modal */}
          {showUpgradeModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowUpgradeModal(false)}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Plan</h2>
                  <button onClick={() => setShowUpgradeModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div key={plan.name} className={`border-2 rounded-2xl p-6 ${
                      plan.name === subscription.plan 
                        ? 'border-purple-600 bg-purple-50' 
                        : 'border-gray-200'
                    }`}>
                      {plan.name === subscription.plan && (
                        <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">Current Plan</span>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{plan.name}</h3>
                      <div className="text-3xl font-black text-purple-600 mb-1">${plan.price.toLocaleString()}</div>
                      <p className="text-sm text-gray-600 mb-6">{plan.hours} hours/month</p>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-green-600">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button 
                        disabled={plan.name === subscription.plan}
                        className={`w-full py-3 rounded-xl font-semibold transition-all ${
                          plan.name === subscription.plan
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                        }`}
                      >
                        {plan.name === subscription.plan ? 'Current Plan' : 'Upgrade'}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
      </main>
      
      <Footer />
    </>
  );
}

