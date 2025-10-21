"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Send } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = parseInt(params.id as string);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('files');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock project data - in production, fetch by ID
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
      progress: 65,
      files: [
        { name: "logo-concept-v1.ai", size: "2.4 MB", date: "Oct 5" },
        { name: "logo-concept-v2.ai", size: "2.1 MB", date: "Oct 7" }
      ],
      messages: [
        { id: 1, sender: 'designer', senderName: 'Sarah Johnson', content: 'Hi! I&apos;ve reviewed your project brief for the logo redesign. I have a few questions to get started.', timestamp: '10:30 AM', isRead: true },
        { id: 2, sender: 'user', senderName: 'You', content: 'Sure! I&apos;m happy to provide more details.', timestamp: '10:32 AM', isRead: true },
        { id: 3, sender: 'designer', senderName: 'Sarah Johnson', content: 'What&apos;s the primary emotion you want the logo to convey? Modern and professional, or more playful and creative?', timestamp: '10:33 AM', isRead: true },
        { id: 4, sender: 'user', senderName: 'You', content: 'I&apos;d like it to be modern and professional, but still approachable. We&apos;re a tech startup targeting small businesses.', timestamp: '10:35 AM', isRead: true },
        { id: 5, sender: 'designer', senderName: 'Sarah Johnson', content: 'Perfect! I&apos;ll start working on some concepts. I should have initial designs ready for you by tomorrow afternoon.', timestamp: '10:37 AM', isRead: true },
        { id: 6, sender: 'designer', senderName: 'Sarah Johnson', content: 'I&apos;ve uploaded the latest concepts to your project folder. Let me know what you think!', timestamp: '2:15 PM', isRead: false },
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
      progress: 90,
      files: [
        { name: "brand-guidelines.pdf", size: "5.2 MB", date: "Oct 6" },
        { name: "color-palette.pdf", size: "1.1 MB", date: "Oct 6" }
      ],
      messages: [
        { id: 1, sender: 'designer', senderName: 'Mike Chen', content: 'Starting work on your brand guidelines. I&apos;ll need some info about your brand values.', timestamp: '9:00 AM', isRead: true },
        { id: 2, sender: 'user', senderName: 'You', content: 'Our core values are innovation, trust, and simplicity.', timestamp: '9:30 AM', isRead: true },
        { id: 3, sender: 'designer', senderName: 'Mike Chen', content: 'Great! I&apos;ll revise the color palette to reflect those values.', timestamp: '11:00 AM', isRead: true },
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
      progress: 100,
      files: [
        { name: "instagram-templates.psd", size: "12.3 MB", date: "Sep 29" },
        { name: "facebook-templates.psd", size: "8.7 MB", date: "Sep 29" },
        { name: "final-assets.zip", size: "45.2 MB", date: "Sep 30" }
      ],
      messages: [
        { id: 1, sender: 'designer', senderName: 'Sarah Johnson', content: 'Project completed! All templates are uploaded.', timestamp: 'Sep 30, 2:00 PM', isRead: true },
        { id: 2, sender: 'user', senderName: 'You', content: 'These look amazing! Thank you!', timestamp: 'Sep 30, 3:15 PM', isRead: true },
      ]
    },
  ];

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Link href="/dashboard" className="text-purple-600 hover:text-purple-700 font-semibold">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [project.messages]);

  return (
    <>
      <DashboardNav userName="John Doe" notifications={3} />
      
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Back Button & Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Dashboard
            </Link>

            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{project.name}</h1>
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${
                    project.status === 'Completed' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : project.status === 'In Progress'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-lg text-gray-600">{project.type}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                  {project.designer.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{project.designer}</p>
                  <p className="text-sm text-gray-500">Senior Designer</p>
                </div>
              </div>
            </div>

            {/* Progress Bar for In Progress Projects */}
            {project.status === 'In Progress' && (
              <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Project Progress</span>
                  <span className="text-sm font-bold text-purple-600">{project.progress}%</span>
                </div>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 rounded-full"
                  >
                    <motion.div
                      animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-full h-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                        backgroundSize: '50% 100%',
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Project Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Information</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Created</p>
                    <p className="text-lg font-bold text-gray-900">{project.createdDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Deadline</p>
                    <p className="text-lg font-bold text-gray-900">{project.deadline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Hours Used</p>
                    <p className="text-lg font-bold text-purple-600">{project.hoursUsed}h</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Last Update</p>
                    <p className="text-lg font-bold text-gray-900">{project.lastUpdate}</p>
                  </div>
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('files')}
                    className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 relative ${
                      activeTab === 'files'
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    📁 Files
                    {activeTab === 'files' && (
                      <motion.div
                        layoutId="activeProjectTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 relative ${
                      activeTab === 'timeline'
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    📊 Timeline
                    {activeTab === 'timeline' && (
                      <motion.div
                        layoutId="activeProjectTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex-1 px-6 py-4 font-semibold transition-all duration-300 relative ${
                      activeTab === 'activity'
                        ? 'text-purple-600 bg-purple-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    ⚡ Activity
                    {activeTab === 'activity' && (
                      <motion.div
                        layoutId="activeProjectTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600"
                      />
                    )}
                  </button>
                </div>

                <div className="p-8">
                  {/* Files Tab */}
                  {activeTab === 'files' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="font-bold text-gray-900 text-xl mb-4">Project Files</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {project.files.map((file, fileIndex) => (
                          <motion.div 
                            key={fileIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: fileIndex * 0.1 }}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-md transition-all duration-300 border border-gray-100 group"
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

                  {/* Timeline Tab */}
                  {activeTab === 'timeline' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="font-bold text-gray-900 text-xl mb-4">Project Timeline</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                            ✓
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-1">Project Briefed</h5>
                            <p className="text-sm text-gray-600">Initial requirements submitted and reviewed</p>
                            <p className="text-xs text-gray-400 mt-2">{project.createdDate}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-lg">
                            🎨
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-1">Design In Progress</h5>
                            <p className="text-sm text-gray-600">{project.designer} is actively working on your project</p>
                            <p className="text-xs text-gray-400 mt-2">{project.lastUpdate}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl opacity-60">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 text-white text-lg">
                            📦
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-1">Delivery</h5>
                            <p className="text-sm text-gray-600">Final files and deliverables</p>
                            <p className="text-xs text-gray-400 mt-2">Expected: {project.deadline}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Activity Tab */}
                  {activeTab === 'activity' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <h3 className="font-bold text-gray-900 text-xl mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="text-xl">📄</div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Files uploaded</p>
                            <p className="text-xs text-gray-600">{project.designer} added 2 new files</p>
                            <p className="text-xs text-gray-400 mt-1">{project.lastUpdate}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="text-xl">💬</div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">New message</p>
                            <p className="text-xs text-gray-600">{project.designer} sent you a message</p>
                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="text-xl">🎨</div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Design phase started</p>
                            <p className="text-xs text-gray-600">Project moved to active development</p>
                            <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Chat */}
            <div className="space-y-6">
              {/* Chat Container */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden sticky top-24"
              >
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-sm font-bold">
                      {project.designer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Chat with {project.designer}</h3>
                      <p className="text-sm opacity-90">{project.name}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-white max-h-[500px] overflow-y-auto">
                  <div className="space-y-4">
                    {project.messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                          <div className="flex items-center gap-2 mb-2">
                            {msg.sender === 'designer' && (
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {project.designer.split(' ').map(n => n[0]).join('')}
                              </div>
                            )}
                            <span className="text-xs font-semibold text-gray-600">{msg.senderName}</span>
                            <span className="text-xs text-gray-400">{msg.timestamp}</span>
                          </div>
                          <div className={`p-4 rounded-2xl ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                              : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Message ${project.designer}...`}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      className="px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100"
              >
                <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Messages</span>
                    <span className="font-bold text-purple-600">{project.messages.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Files</span>
                    <span className="font-bold text-purple-600">{project.files.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hours Used</span>
                    <span className="font-bold text-purple-600">{project.hoursUsed}h</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

