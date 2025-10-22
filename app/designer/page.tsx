"use client";

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Send, Users, LogOut, MessageSquare, FolderOpen, Clock, ArrowLeft, Search, Filter, Calendar, AlertCircle, CheckCircle, XCircle, MoreHorizontal, Download, FileText, Image, File, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  user_id: string;
  type: string;
  status: string;
  description?: string;
  deadline?: string;
  hours_used: number;
  designer_name?: string;
  created_at: string;
  updated_at: string;
}

interface Message {
  id: string;
  project_id: string;
  sender_type: string;
  sender_name: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

interface ClientProfile {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface ProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_size: string | null;
  file_url: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export default function DesignerPortal() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [clientProfiles, setClientProfiles] = useState<Record<string, ClientProfile>>({});
  const [newMessage, setNewMessage] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'projects' | 'clients'>('projects');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const designerName = profile?.full_name || 'Designer';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Check if user is a designer
  useEffect(() => {
    if (profile && profile.role !== 'designer' && profile.role !== 'admin') {
      alert('Access denied: Designer portal is for designers only');
      router.push('/dashboard');
    }
  }, [profile, router]);

  useEffect(() => {
    if (profile?.role === 'designer' || profile?.role === 'admin') {
      fetchProjects();
    }
  }, [profile]);

  useEffect(() => {
    if (selectedProject) {
      fetchMessages(selectedProject.id);
      
      // Subscribe to real-time messages
      const channel = supabase
        .channel(`designer-messages:${selectedProject.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `project_id=eq.${selectedProject.id}`,
          },
          (payload) => {
            setMessages((current) => [...current, payload.new as Message]);
            setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }

    setProjects(data || []);

    // Fetch client profiles
    const userIds = [...new Set(data?.map(p => p.user_id) || [])];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', userIds);

    const profileMap: Record<string, ClientProfile> = {};
    profiles?.forEach(p => {
      profileMap[p.id] = p;
    });
    setClientProfiles(profileMap);
  };

  const fetchMessages = async (projectId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    
    setMessages(data || []);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Fetch project files
  const fetchProjectFiles = async (projectId: string) => {
    setLoadingFiles(true);
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching project files:', error);
      } else {
        setProjectFiles(data || []);
      }
    } catch (error) {
      console.error('Error fetching project files:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject || !user) return;

    const { error } = await supabase.from('messages').insert([
      {
        project_id: selectedProject.id,
        sender_id: user.id,
        sender_type: 'designer',
        sender_name: profile?.full_name || 'Designer',
        content: newMessage,
        is_read: false,
      },
    ]);

    if (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
      return;
    }

    setNewMessage('');
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', projectId);

    if (error) {
      console.error('Error updating status:', error);
      return;
    }

    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, status } : p
    ));

    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, status } : null);
    }

    alert('✅ Project status updated!');
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => {
      const client = clientProfiles[project.user_id];
      const matchesSearch = searchQuery === '' || 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client?.full_name && client.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'client':
          const clientA = clientProfiles[a.user_id]?.full_name || '';
          const clientB = clientProfiles[b.user_id]?.full_name || '';
          return clientA.localeCompare(clientB);
        case 'status':
          const statusOrder = { 'In Progress': 0, 'Review': 1, 'Completed': 2, 'On Hold': 3 };
          return (statusOrder[a.status as keyof typeof statusOrder] || 4) - (statusOrder[b.status as keyof typeof statusOrder] || 4);
        default:
          return 0;
      }
    });

  // Dashboard Statistics
  const dashboardStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'In Progress').length,
    reviewProjects: projects.filter(p => p.status === 'Review').length,
    completedProjects: projects.filter(p => p.status === 'Completed').length,
    totalClients: Object.keys(clientProfiles).length,
    unreadMessages: messages.filter(m => !m.is_read && m.sender_type === 'user').length,
  };

  // Group projects by client
  const projectsByClient = Object.keys(clientProfiles).reduce((acc, clientId) => {
    const clientProjects = filteredAndSortedProjects.filter(p => p.user_id === clientId);
    if (clientProjects.length > 0) {
      acc[clientId] = {
        client: clientProfiles[clientId],
        projects: clientProjects,
        totalProjects: clientProjects.length,
        activeProjects: clientProjects.filter(p => p.status === 'In Progress').length,
        unreadMessages: clientProjects.reduce((count, p) => {
          return count + messages.filter(m => m.project_id === p.id && !m.is_read && m.sender_type === 'user').length;
        }, 0),
      };
    }
    return acc;
  }, {} as Record<string, {
    client: ClientProfile;
    projects: Project[];
    totalProjects: number;
    activeProjects: number;
    unreadMessages: number;
  }>);

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Review':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'On Hold':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Archived':
        return <FolderOpen className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Get file icon based on file type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
      case 'webp':
        return <Image className="w-4 h-4 text-blue-600" />;
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="w-4 h-4 text-red-600" />;
      default:
        return <File className="w-4 h-4 text-gray-600" />;
    }
  };

  // Format file size
  const formatFileSize = (size: string | null) => {
    if (!size) return 'Unknown size';
    const bytes = parseInt(size);
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle file download
  const handleFileDownload = (file: ProjectFile) => {
    if (file.file_url) {
      window.open(file.file_url, '_blank');
    }
  };

  // Handle file deletion
  const handleFileDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const { error } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);

      if (error) {
        console.error('Error deleting file:', error);
        alert('Failed to delete file');
      } else {
        // Refresh files list
        if (selectedProject) {
          fetchProjectFiles(selectedProject.id);
        }
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  // Don't render if not a designer
  if (profile && profile.role !== 'designer' && profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Designer Portal</h1>
                <p className="text-xs text-gray-500">Manage client projects</p>
              </div>
            </div>
            
            {/* Dashboard Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{dashboardStats.totalProjects}</div>
                  <div className="text-xs text-gray-500">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{dashboardStats.activeProjects}</div>
                  <div className="text-xs text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">{dashboardStats.reviewProjects}</div>
                  <div className="text-xs text-gray-500">Review</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-600">{dashboardStats.totalClients}</div>
                  <div className="text-xs text-gray-500">Clients</div>
                </div>
                {dashboardStats.unreadMessages > 0 && (
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{dashboardStats.unreadMessages}</div>
                    <div className="text-xs text-gray-500">Unread</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {profile?.full_name || 'Designer'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('projects')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'projects'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                📋 Projects View
              </button>
              <button
                onClick={() => setViewMode('clients')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'clients'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                👥 Clients View
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter('In Progress')}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                Active Only
              </button>
              <button
                onClick={() => setStatusFilter('Review')}
                className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
              >
                Review Only
              </button>
              <button
                onClick={() => setStatusFilter('all')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                All Projects
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {viewMode === 'projects' ? (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Projects List */}
            <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedClient ? `${clientProfiles[selectedClient]?.full_name || 'Client'} Projects` : 'Client Projects'}
                </h2>
                <span className="ml-auto bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-bold">
                  {selectedClient 
                    ? filteredAndSortedProjects.filter(p => p.user_id === selectedClient).length
                    : filteredAndSortedProjects.length
                  }
                </span>
                {selectedClient && (
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Clear client filter"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Search and Filter Controls */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search projects, clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                             <option value="all">All Status</option>
                             <option value="In Progress">In Progress</option>
                             <option value="Review">Review</option>
                             <option value="Completed">Completed</option>
                             <option value="On Hold">On Hold</option>
                             <option value="Archived">Archived</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="recent">Recent</option>
                    <option value="name">Name</option>
                    <option value="client">Client</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {(selectedClient 
                  ? filteredAndSortedProjects.filter(p => p.user_id === selectedClient)
                  : filteredAndSortedProjects
                ).map((project) => {
                  const client = clientProfiles[project.user_id];
                  const unreadCount = messages.filter(m => 
                    m.project_id === project.id && !m.is_read && m.sender_type === 'user'
                  ).length;

                  return (
                    <button
                      key={project.id}
                      onClick={() => {
                        setSelectedProject(project);
                        setNewStatus(project.status);
                        fetchProjectFiles(project.id);
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-all border ${
                        selectedProject?.id === project.id
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-600'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(project.status)}
                          <h3 className="font-semibold text-sm">{project.name}</h3>
                        </div>
                        {unreadCount > 0 && selectedProject?.id !== project.id && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1">
                        <p className={`text-sm font-medium ${selectedProject?.id === project.id ? 'text-purple-100' : 'text-gray-700'}`}>
                          {client?.full_name || 'Unknown Client'}
                        </p>
                        <p className={`text-xs ${selectedProject?.id === project.id ? 'text-purple-100' : 'text-gray-500'}`}>
                          {project.type}
                        </p>
                        <p className={`text-xs ${selectedProject?.id === project.id ? 'text-purple-100' : 'text-gray-400'}`}>
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          selectedProject?.id === project.id 
                            ? 'bg-white/20 text-white' 
                            : project.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : project.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-700'
                            : project.status === 'Review'
                            ? 'bg-yellow-100 text-yellow-700'
                            : project.status === 'Archived'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {project.status}
                        </span>
                        
                        {project.deadline && (
                          <div className={`flex items-center gap-1 text-xs ${
                            selectedProject?.id === project.id ? 'text-purple-100' : 'text-gray-400'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(project.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
                {projects.length === 0 && (
                  <p className="text-gray-500 text-center py-8 text-sm">No projects yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedProject ? (
              <div className="space-y-6">
                {/* Project Header */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.name}</h2>
                      <p className="text-gray-600 mb-3">{selectedProject.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Client: {clientProfiles[selectedProject.user_id]?.full_name || 'Unknown'}</span>
                        <span>•</span>
                        <span>{selectedProject.type}</span>
                        <span>•</span>
                        <span>{new Date(selectedProject.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Updater */}
                  <div className="flex gap-3 items-center pt-4 border-t border-gray-200">
                    <label className="text-sm font-semibold text-gray-700">Update Status:</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Archived">Archived</option>
                    </select>
                    {newStatus !== selectedProject.status && (
                      <button
                        onClick={() => updateProjectStatus(selectedProject.id, newStatus)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold text-sm"
                      >
                        Save Status
                      </button>
                    )}
                  </div>
                </div>

                {/* Chat */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-bold text-gray-900">Project Chat</h3>
                      <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-bold">
                        {messages.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Real-time chat</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No messages yet</p>
                        <p className="text-xs text-gray-400">Start a conversation with the client</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.sender_type === 'designer' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="max-w-[80%]">
                            <div className={`flex items-center gap-2 mb-1 ${msg.sender_type === 'designer' ? 'justify-end' : 'justify-start'}`}>
                              <span className={`text-xs font-semibold ${msg.sender_type === 'designer' ? 'text-green-600' : 'text-gray-600'}`}>
                                {msg.sender_name}
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(msg.created_at).toLocaleTimeString('en-US', { 
                                  hour: 'numeric', 
                                  minute: '2-digit',
                                  hour12: true 
                                })}
                              </span>
                            </div>
                            <div
                              className={`p-3 rounded-2xl ${
                                msg.sender_type === 'designer'
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                  : 'bg-gray-100 text-gray-900 border border-gray-200'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="Type your message to client..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                  </div>
                </div>

                {/* Project Files */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-bold text-gray-900">Project Files</h3>
                      <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-bold">
                        {projectFiles.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Client uploads</span>
                    </div>
                  </div>

                  {/* Files List */}
                  <div className="space-y-3">
                    {loadingFiles ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
                        <p className="text-sm text-gray-500">Loading files...</p>
                      </div>
                    ) : projectFiles.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-sm">No files uploaded yet</p>
                        <p className="text-xs text-gray-400">Client files will appear here when uploaded</p>
                      </div>
                    ) : (
                      projectFiles.map((file) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {getFileIcon(file.file_name)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.file_name}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span>{formatFileSize(file.file_size)}</span>
                                <span>{new Date(file.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleFileDownload(file)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Download file"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            {file.file_url && (
                              <button
                                onClick={() => window.open(file.file_url!, '_blank')}
                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="View file"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleFileDelete(file.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete file"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Project</h3>
                <p className="text-gray-600">Choose a project from the list to view details and chat with clients</p>
              </div>
            )}
          </div>
        </div>
        ) : (
          /* Clients View */
          <div className="space-y-6">
            {/* Clients Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(projectsByClient).map(([clientId, clientData], index) => (
                <motion.div
                  key={clientId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Client Header */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                        {clientData.client.full_name?.split(' ').map(n => n[0]).join('') || 'C'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{clientData.client.full_name || 'Unknown Client'}</h3>
                        <p className="text-sm text-gray-500">{clientData.client.email}</p>
                      </div>
                      {clientData.unreadMessages > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          {clientData.unreadMessages}
                        </span>
                      )}
                    </div>
                    
                    {/* Client Stats */}
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-white rounded-xl p-3">
                        <div className="text-lg font-bold text-gray-900">{clientData.totalProjects}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      <div className="bg-white rounded-xl p-3">
                        <div className="text-lg font-bold text-blue-600">{clientData.activeProjects}</div>
                        <div className="text-xs text-gray-500">Active</div>
                      </div>
                      <div className="bg-white rounded-xl p-3">
                        <div className="text-lg font-bold text-green-600">{clientData.projects.filter(p => p.status === 'Completed').length}</div>
                        <div className="text-xs text-gray-500">Done</div>
                      </div>
                    </div>
                  </div>

                  {/* Client Projects */}
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Recent Projects</h4>
                    <div className="space-y-2">
                      {clientData.projects.slice(0, 3).map((project) => (
                        <div
                          key={project.id}
                          onClick={() => {
                            setSelectedProject(project);
                            setNewStatus(project.status);
                            fetchProjectFiles(project.id);
                            setViewMode('projects'); // Switch to projects view
                          }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getStatusIcon(project.status)}
                              <span className="font-medium text-sm text-gray-900 group-hover:text-purple-600 transition-colors">
                                {project.name}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{project.type}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              project.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : project.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-700'
                                : project.status === 'Review'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {project.status}
                            </span>
                            {project.deadline && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(project.deadline).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {clientData.projects.length > 3 && (
                        <div className="text-center pt-2">
                          <span className="text-xs text-gray-500">
                            +{clientData.projects.length - 3} more projects
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Client Actions */}
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedClient(clientId);
                          setViewMode('projects');
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
                      >
                        View All Projects
                      </button>
                      <button
                        onClick={() => {
                          // Find the most recent project for this client
                          const recentProject = clientData.projects.sort((a, b) => 
                            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                          )[0];
                          if (recentProject) {
                            setSelectedProject(recentProject);
                            setNewStatus(recentProject.status);
                            fetchProjectFiles(recentProject.id);
                            setViewMode('projects');
                          }
                        }}
                        className="flex-1 bg-white text-purple-600 hover:bg-purple-50 font-semibold px-4 py-2 rounded-xl transition-colors text-sm border border-purple-200"
                      >
                        Start Chat
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {Object.keys(projectsByClient).length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Clients Yet</h3>
                <p className="text-gray-600">Client projects will appear here when they're created</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
