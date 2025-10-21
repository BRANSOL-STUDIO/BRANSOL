"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectChat } from '@/hooks/useProjectChat';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { projects: supabaseProjects, sendMessage: sendSupabaseMessage, createProject: createSupabaseProject, loading: projectsLoading } = useProjectChat(user?.id);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projectDetailTab, setProjectDetailTab] = useState('files');
  const [activeProjectChat, setActiveProjectChat] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    description: '',
    deadline: '',
    budget: '',
    files: [] as File[]
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load projects from localStorage on mount
  const getInitialProjects = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bransol_user_projects');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error loading projects from localStorage:', e);
        }
      }
    }
    // Default projects if nothing in localStorage
    return [
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
      ],
      messages: [
        { id: 1, sender: 'designer', senderName: 'Sarah Johnson', content: 'Hi! 👋 I&apos;ve reviewed your project brief for the logo redesign. I have a few questions to get started.', timestamp: '10:30 AM', isRead: true },
        { id: 2, sender: 'user', senderName: 'You', content: 'Sure! I&apos;m happy to provide more details. 😊', timestamp: '10:32 AM', isRead: true },
        { id: 3, sender: 'designer', senderName: 'Sarah Johnson', content: 'What&apos;s the primary emotion you want the logo to convey? Modern and professional, or more playful and creative? 🎨', timestamp: '10:33 AM', isRead: true },
        { id: 4, sender: 'user', senderName: 'You', content: 'I&apos;d like it to be modern and professional, but still approachable. We&apos;re a tech startup targeting small businesses. 💼', timestamp: '10:35 AM', isRead: true },
        { id: 5, sender: 'designer', senderName: 'Sarah Johnson', content: 'Perfect! 🎯 I&apos;ll start working on some concepts. I should have initial designs ready for you by tomorrow afternoon.', timestamp: '10:37 AM', isRead: true },
        { id: 6, sender: 'designer', senderName: 'Sarah Johnson', content: 'I&apos;ve uploaded the latest concepts to your project folder. Let me know what you think! 🚀', timestamp: '2:15 PM', isRead: false },
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
        ],
        messages: [
          { id: 1, sender: 'designer', senderName: 'Mike Chen', content: 'Starting work on your brand guidelines. 📚 I&apos;ll need some info about your brand values.', timestamp: '9:00 AM', isRead: true },
          { id: 2, sender: 'user', senderName: 'You', content: 'Our core values are innovation, trust, and simplicity. ✨', timestamp: '9:30 AM', isRead: true },
          { id: 3, sender: 'designer', senderName: 'Mike Chen', content: 'Great! 👍 I&apos;ll revise the color palette to reflect those values.', timestamp: '11:00 AM', isRead: true },
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
        ],
        messages: [
          { id: 1, sender: 'designer', senderName: 'Sarah Johnson', content: 'Project completed! 🎉 All templates are uploaded.', timestamp: 'Sep 30, 2:00 PM', isRead: true },
          { id: 2, sender: 'user', senderName: 'You', content: 'These look amazing! Thank you! 🙌', timestamp: 'Sep 30, 3:15 PM', isRead: true },
        ]
      },
    ];
  };

  // Mock user data for non-authenticated users
  const [localProjects, setLocalProjects] = useState(getInitialProjects);

  // Save local projects to localStorage whenever they change (only if not using Supabase)
  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      localStorage.setItem('bransol_user_projects', JSON.stringify(localProjects));
    }
  }, [localProjects, user]);

  // Use Supabase projects if user is authenticated, otherwise use local projects
  const userProjects = user ? supabaseProjects : localProjects;
  const setUserProjects = user ? () => {} : setLocalProjects; // Supabase updates handled by hook

  const userData = {
    name: profile?.full_name || "Ricardo Beaumont",
    email: profile?.email || "ricardo@beaumont.com",
    plan: profile?.plan || "Professional",
    hoursRemaining: profile?.hours_remaining || 8,
    hoursUsed: profile ? (profile.hours_total - profile.hours_remaining) : 2,
    hoursTotal: profile?.hours_total || 10,
    nextBilling: "Nov 8, 2025",
    projects: userProjects,
    recentMessages: userProjects.reduce((count, p) => count + (p.messages?.filter((m: any) => !m.isRead && !m.is_read).length || 0), 0)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If user is authenticated, create project in Supabase
    if (user && createSupabaseProject) {
      await createSupabaseProject({
        name: formData.projectName,
        type: formData.projectType,
        description: formData.description,
        deadline: formData.deadline,
      });
    } else {
      // Mock creation for non-authenticated users
      console.log('Project Brief Submitted:', formData);
    }
    
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

  const handleSendMessage = async (projectId: number | string) => {
    if (!message.trim()) return;

    // If user is authenticated, use Supabase
    if (user && sendSupabaseMessage) {
      await sendSupabaseMessage(
        String(projectId),
        message,
        userData.name
      );
      setMessage('');
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    // Otherwise use localStorage (mock data)
    const newMessage = {
      id: Date.now(),
      sender: 'user' as const,
      senderName: 'You',
      content: message,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isRead: true
    };

    setLocalProjects(prevProjects => 
      prevProjects.map(p => 
        p.id === projectId 
          ? { ...p, messages: [...p.messages, newMessage] }
          : p
      )
    );

    setMessage('');
    
    // Scroll to bottom after message is sent
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Auto-scroll when selected project changes
  useEffect(() => {
    if (selectedProject) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [selectedProject]);

  return (
    <>
      <DashboardNav 
        userName={userData.name} 
        notifications={userData.recentMessages}
        onTabChange={setActiveTab}
      />
      
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
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Welcome back, {userData.name}! 👋
                  </h1>
                  <p className="text-base text-gray-600">Here&apos;s what&apos;s happening with your projects today.</p>
                </div>
                <div className="hidden xl:flex items-center gap-3">
                  <div className="px-5 py-2.5 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 mb-0.5">Member since</p>
                    <p className="text-sm font-bold text-purple-600">{subscription.startDate.split(',')[0]}</p>
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
                <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Projects</h2>
                    <p className="text-sm text-gray-600">Brief new projects and manage existing ones</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewProjectForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm"
                  >
                    <span className="text-lg">+</span>
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
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                              <span className={`px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${
                                project.status === 'Completed' 
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                  : project.status === 'In Progress'
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                              }`}>
                                {project.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{project.type}</p>
                          </div>
                          <Link 
                            href={`/dashboard/projects/${project.id}`}
                            className="text-purple-600 hover:text-purple-700 font-semibold text-xs flex items-center gap-1 group"
                          >
                            View Details 
                            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                          </Link>
                        </div>

                        {/* Progress Bar for In Progress Projects */}
                        {project.status === 'In Progress' && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-gray-600">Project Progress</span>
                              <span className="text-xs font-bold text-purple-600">65%</span>
                            </div>
                            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '65%' }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 rounded-full"
                                style={{
                                  backgroundSize: '200% 100%',
                                }}
                              >
                                <motion.div
                                  animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                  className="w-full h-full"
                                  style={{
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                    backgroundSize: '50% 100%',
                                  }}
                                />
                              </motion.div>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Created</p>
                            <p className="text-sm font-semibold text-gray-900">{project.createdDate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Deadline</p>
                            <p className="text-sm font-semibold text-gray-900">{project.deadline}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Hours Used</p>
                            <p className="text-sm font-semibold text-gray-900">{project.hoursUsed}h</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Designer</p>
                            <p className="text-sm font-semibold text-gray-900">{project.designer}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-5">
                          <p className="text-xs text-gray-500 font-medium">Last update: {project.lastUpdate}</p>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 text-xs shadow-md hover:shadow-lg flex items-center gap-1.5"
                            >
                              <span className="text-sm">📂</span> {selectedProject === project.id ? 'Close' : 'Open Project'}
                            </motion.button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Full-Screen Project Details Modal */}
            {selectedProject && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
                onClick={() => setSelectedProject(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="bg-white rounded-3xl max-w-7xl w-full my-8 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const project = userData.projects.find(p => p.id === selectedProject);
                    if (!project) return null;

                    return (
                      <>
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white rounded-t-3xl">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2.5 mb-2">
                                <h2 className="text-2xl font-bold">{project.name}</h2>
                                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                  project.status === 'Completed' 
                                    ? 'bg-green-500 text-white'
                                    : project.status === 'In Progress'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-yellow-500 text-white'
                                }`}>
                                  {project.status}
                                </span>
                              </div>
                              <p className="text-base opacity-90">{project.type}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* Mark as Complete Button for Review Status */}
                              {project.status === 'Review' && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setShowCompleteModal(true)}
                                  className="bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg flex items-center gap-2"
                                >
                                  <span className="text-lg">✓</span>
                                  Approve & Complete
                                </motion.button>
                              )}
                              
                              {/* Download All Button for Completed Projects */}
                              {project.status === 'Completed' && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="bg-white text-purple-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg flex items-center gap-2"
                                >
                                  <Download className="w-5 h-5" />
                                  Download All Files
                                </motion.button>
                              )}

                              <button
                                onClick={() => setSelectedProject(null)}
                                className="text-white hover:bg-white/20 rounded-xl p-2 transition-colors"
                              >
                                <span className="text-3xl">×</span>
                              </button>
                            </div>
                          </div>

                          {/* Progress Bar / Status Banner */}
                          {project.status === 'In Progress' && (
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">Project Progress</span>
                                <span className="text-sm font-bold">65%</span>
                              </div>
                              <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: '65%' }}
                                  transition={{ duration: 1.5, ease: "easeOut" }}
                                  className="absolute top-0 left-0 h-full bg-white rounded-full"
                                >
                                  <motion.div
                                    animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-full h-full opacity-50"
                                    style={{
                                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                                      backgroundSize: '50% 100%',
                                    }}
                                  />
                                </motion.div>
                              </div>
                            </div>
                          )}

                          {project.status === 'Review' && (
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">Ready for Review</span>
                                <span className="text-sm font-bold">100%</span>
                              </div>
                              <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="absolute top-0 left-0 h-full w-full bg-white rounded-full"></div>
                              </div>
                              <p className="text-xs mt-2 opacity-90">All deliverables are ready for your approval</p>
                            </div>
                          )}

                          {project.status === 'Completed' && (
                            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-500 text-xl">
                                  ✓
                                </div>
                                <div>
                                  <p className="text-sm font-bold">Project Completed</p>
                                  <p className="text-xs opacity-90">All files are available for download</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Modal Content */}
                        <div className="p-8">
                          <div className="grid lg:grid-cols-3 gap-6">
                            {/* Left Column - Tabbed Content */}
                            <div className="lg:col-span-2 space-y-6">
                              {/* Project Info Cards */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Created</p>
                                  <p className="text-sm font-bold text-gray-900">{project.createdDate}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Deadline</p>
                                  <p className="text-sm font-bold text-gray-900">{project.deadline}</p>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4">
                                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Hours</p>
                                  <p className="text-sm font-bold text-purple-600">{project.hoursUsed}h</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Designer</p>
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                      {project.designer.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <p className="text-xs font-bold text-gray-900">{project.designer.split(' ')[0]}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Tabs Navigation */}
                              <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
                                <button
                                  onClick={() => setProjectDetailTab('files')}
                                  className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                    projectDetailTab === 'files'
                                      ? 'bg-white text-purple-600 shadow-md'
                                      : 'text-gray-600 hover:text-gray-900'
                                  }`}
                                >
                                  📁 Files
                                </button>
                                <button
                                  onClick={() => setProjectDetailTab('timeline')}
                                  className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                    projectDetailTab === 'timeline'
                                      ? 'bg-white text-purple-600 shadow-md'
                                      : 'text-gray-600 hover:text-gray-900'
                                  }`}
                                >
                                  📊 Timeline
                                </button>
                                <button
                                  onClick={() => setProjectDetailTab('activity')}
                                  className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                                    projectDetailTab === 'activity'
                                      ? 'bg-white text-purple-600 shadow-md'
                                      : 'text-gray-600 hover:text-gray-900'
                                  }`}
                                >
                                  ⚡ Activity
                                </button>
                              </div>

                              {/* Tab Content */}
                              <div className="min-h-[400px]">
                                {/* Files Tab */}
                                {projectDetailTab === 'files' && (
                                  <motion.div
                                    key="files"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Project Files ({project.files.length})</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                      {project.files.map((file, fileIndex) => (
                                        <motion.div 
                                          key={fileIndex}
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ duration: 0.3, delay: fileIndex * 0.1 }}
                                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 group"
                                        >
                                          <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                                              📄
                                            </div>
                                            <div>
                                              <p className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors">{file.name}</p>
                                              <p className="text-xs text-gray-500">{file.size} • {file.date}</p>
                                            </div>
                                          </div>
                                          <motion.button 
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-colors shadow-md"
                                          >
                                            <Download className="w-4 h-4" />
                                          </motion.button>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}

                                {/* Timeline Tab */}
                                {projectDetailTab === 'timeline' && (
                                  <motion.div
                                    key="timeline"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Project Timeline</h3>
                                    <div className="space-y-4">
                                      <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex items-start gap-4 p-5 bg-green-50 border-2 border-green-200 rounded-2xl"
                                      >
                                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">✓</div>
                                        <div className="flex-1">
                                          <p className="font-bold text-gray-900 text-lg mb-1">Project Briefed</p>
                                          <p className="text-sm text-gray-600 mb-2">Initial requirements submitted and reviewed by {project.designer}</p>
                                          <p className="text-xs text-gray-500">{project.createdDate}</p>
                                        </div>
                                      </motion.div>
                                      <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex items-start gap-4 p-5 bg-blue-50 border-2 border-blue-200 rounded-2xl"
                                      >
                                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">🎨</div>
                                        <div className="flex-1">
                                          <p className="font-bold text-gray-900 text-lg mb-1">Design In Progress</p>
                                          <p className="text-sm text-gray-600 mb-2">{project.designer} is actively working on your project</p>
                                          <p className="text-xs text-gray-500">Last update: {project.lastUpdate}</p>
                                        </div>
                                      </motion.div>
                                      <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex items-start gap-4 p-5 bg-gray-50 border-2 border-gray-200 rounded-2xl opacity-60"
                                      >
                                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-2xl shadow-lg">📦</div>
                                        <div className="flex-1">
                                          <p className="font-bold text-gray-900 text-lg mb-1">Delivery</p>
                                          <p className="text-sm text-gray-600 mb-2">Final files and deliverables will be ready</p>
                                          <p className="text-xs text-gray-500">Expected: {project.deadline}</p>
                                        </div>
                                      </motion.div>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Activity Tab */}
                                {projectDetailTab === 'activity' && (
                                  <motion.div
                                    key="activity"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                                    <div className="space-y-3">
                                      <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                                      >
                                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl">📄</div>
                                        <div className="flex-1">
                                          <p className="font-semibold text-gray-900">Files uploaded</p>
                                          <p className="text-sm text-gray-600">{project.designer} added {project.files.length} new files</p>
                                          <p className="text-xs text-gray-400 mt-1">{project.lastUpdate}</p>
                                        </div>
                                      </motion.div>
                                      <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                                      >
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">💬</div>
                                        <div className="flex-1">
                                          <p className="font-semibold text-gray-900">New message</p>
                                          <p className="text-sm text-gray-600">{project.designer} sent you a message</p>
                                          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                        </div>
                                      </motion.div>
                                      <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                                      >
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">🎨</div>
                                        <div className="flex-1">
                                          <p className="font-semibold text-gray-900">Design phase started</p>
                                          <p className="text-sm text-gray-600">Project moved to active development</p>
                                          <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                                        </div>
                                      </motion.div>
                                      <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                                      >
                                        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center text-xl">📋</div>
                                        <div className="flex-1">
                                          <p className="font-semibold text-gray-900">Project created</p>
                                          <p className="text-sm text-gray-600">You submitted the project brief</p>
                                          <p className="text-xs text-gray-400 mt-1">{project.createdDate}</p>
                                        </div>
                                      </motion.div>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            </div>

                            {/* Right Column - Chat */}
                            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 p-6 h-fit sticky top-0">
                              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                                  {project.designer.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900">{project.designer}</h3>
                                  <p className="text-xs text-gray-500">Senior Designer</p>
                                </div>
                              </div>

                              {/* Messages */}
                              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto pr-2">
                                {project.messages.map((msg) => (
                                  <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                  >
                                    <div className={`max-w-[85%]`}>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold text-gray-500">{msg.senderName}</span>
                                        <span className="text-xs text-gray-400">{msg.timestamp}</span>
                                      </div>
                                      <div className={`p-3 rounded-2xl ${
                                        msg.sender === 'user'
                                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                          : 'bg-white border border-gray-200 text-gray-900'
                                      }`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <div ref={messagesEndRef} />
                              </div>

                              {/* Message Input */}
                              <div className="flex gap-2 pt-4 border-t border-gray-200">
                                <input
                                  type="text"
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  placeholder="Type a message... (Try adding emojis! 😊)"
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleSendMessage(project.id);
                                    }
                                  }}
                                />
                                <motion.button 
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSendMessage(project.id)}
                                  disabled={!message.trim()}
                                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                                    message.trim()
                                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg'
                                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  }`}
                                >
                                  Send 🚀
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              </motion.div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Messages</h2>
                  <p className="text-gray-600">All your project conversations in one place</p>
                </div>

                {/* Chat Conversations List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-4">
                  {userData.projects.map((project, index) => {
                    const unreadCount = project.messages.filter(m => !m.isRead).length;
                    const lastMessage = project.messages[project.messages.length - 1];
                    
                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        onClick={() => {
                          setActiveTab('projects');
                          setActiveProjectChat(project.id);
                        }}
                        className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group"
                      >
                        <div className="flex items-start gap-4">
                          {/* Designer Avatar */}
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-md group-hover:scale-110 transition-transform duration-300">
                            {project.designer.split(' ').map(n => n[0]).join('')}
                          </div>

                          {/* Chat Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{project.name}</h3>
                                <p className="text-sm text-gray-500">{project.designer}</p>
                              </div>
                              {unreadCount > 0 && (
                                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate mb-2">
                              <span className="font-semibold">{lastMessage.senderName}:</span> {lastMessage.content}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">{lastMessage.timestamp}</span>
                              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                                project.status === 'Completed' 
                                  ? 'bg-green-100 text-green-700'
                                  : project.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {project.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h2>
                  <p className="text-gray-600">Manage your personal information and avatar</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Profile Form */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                      <form className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                            <input
                              type="text"
                              defaultValue="Ricardo"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                            <input
                              type="text"
                              defaultValue="Beaumont"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            defaultValue="ricardo@beaumont.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                          <input
                            type="text"
                            placeholder="Your company name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                          <textarea
                            rows={4}
                            placeholder="Tell us a bit about yourself..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          />
                        </div>
                        <div className="flex gap-3 pt-4">
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Password Change */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                        >
                          Update Password
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Avatar Section */}
                  <div className="space-y-6">
                    {/* Current Avatar */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Picture</h3>
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-xl mb-4">
                          {userData.name.charAt(0)}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">Current Avatar</p>
                        
                        {/* Upload Button */}
                        <label className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-4 py-3 rounded-xl transition-all duration-300 text-center cursor-pointer">
                          <input type="file" accept="image/*" className="hidden" />
                          Upload Photo
                        </label>
                        <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF (Max 5MB)</p>
                      </div>
                    </div>

                    {/* Predefined Avatars */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Choose Avatar</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {['🎨', '🚀', '⚡', '🎯', '💎', '🔥', '🌟', '💡', '🎭'].map((emoji, index) => (
                          <button
                            key={index}
                            className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 hover:from-purple-100 hover:to-blue-100 rounded-xl flex items-center justify-center text-3xl transition-all duration-300 hover:scale-110 border-2 border-transparent hover:border-purple-400"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Avatar Colors */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Background Color</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          'from-purple-600 to-blue-600',
                          'from-pink-500 to-red-500',
                          'from-green-500 to-emerald-500',
                          'from-orange-500 to-yellow-500',
                          'from-blue-500 to-cyan-500',
                          'from-indigo-500 to-purple-500',
                          'from-red-500 to-pink-500',
                          'from-gray-700 to-gray-900'
                        ].map((gradient, index) => (
                          <button
                            key={index}
                            className={`aspect-square bg-gradient-to-br ${gradient} rounded-xl hover:scale-110 transition-all duration-300 border-2 border-transparent hover:border-gray-400`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Account Status */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100 p-6">
                      <h3 className="font-bold text-gray-900 mb-4">Account Status</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Email Verified</span>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">✓ Verified</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Member Since</span>
                          <span className="text-sm font-semibold text-gray-900">Oct 2024</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Plan</span>
                          <span className="text-sm font-semibold text-purple-600">Professional</span>
                        </div>
                      </div>
                    </div>
                  </div>
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

          {/* Complete Project Modal */}
          {showCompleteModal && (
            <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setShowCompleteModal(false)}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-3xl max-w-lg w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-2xl">
                    ✓
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Approve Project Completion?</h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    By approving this project, you confirm that you&apos;re satisfied with the deliverables. 
                    The project will be marked as complete and archived.
                  </p>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-6 border border-purple-100">
                    <h3 className="font-bold text-gray-900 mb-3">What happens next:</h3>
                    <ul className="space-y-2 text-left text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        All files will remain available for download
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Project moved to completed archive
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Designer will be notified
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        You can still access chat history
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowCompleteModal(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        console.log('Project marked as complete');
                        setShowCompleteModal(false);
                        setSelectedProject(null);
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      ✓ Approve & Complete
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
      </main>
    </>
  );
}

