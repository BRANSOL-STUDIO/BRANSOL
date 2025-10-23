"use client";

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Send, Users, LogOut, MessageSquare, FolderOpen, Clock, ArrowLeft, Search, Calendar, AlertCircle, CheckCircle, XCircle, Download, FileText, Image, File, Eye, Trash2, X } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState('recent');
  const [activeSection, setActiveSection] = useState('all');
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

  // Fetch projects
  const fetchProjects = async () => {
    try {
      console.log('🔍 Fetching projects...');
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching projects:', error);
        throw error;
      }
      
      console.log('📊 Projects data:', data);
      console.log('📊 Project user_ids:', data?.map(p => ({ id: p.id, name: p.name, user_id: p.user_id })));
      
      // Check if any project user_ids exist in profiles
      if (data && data.length > 0) {
        const projectUserIds = data.map(p => p.user_id);
        console.log('🔍 Project user IDs:', projectUserIds);
        
        // Check if these user_ids exist in profiles
        const { data: profileCheck } = await supabase
          .from('profiles')
          .select('id, full_name, role')
          .in('id', projectUserIds);
          
        console.log('🔍 Profiles for project user_ids:', profileCheck);
      }
      
      setProjects(data || []);
    } catch (err) {
      console.error('❌ Error fetching projects:', err);
    }
  };

  // Fetch client profiles
  const fetchClientProfiles = async () => {
    try {
      console.log('🔍 Fetching client profiles...');
      console.log('🔍 Current user:', user?.id, 'Current profile role:', profile?.role);
      
      // First, let's see ALL profiles in the database
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role');
        
      if (allError) {
        console.error('❌ Error fetching all profiles:', allError);
      } else {
        console.log('📊 ALL profiles in database:', allProfiles);
      }
      
      // For designers, try to fetch all profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email');

      if (error) {
        console.error('❌ Error fetching client profiles:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // If that fails, try fetching only profiles that have projects
        console.log('🔄 Trying alternative approach - fetching profiles with projects...');
        const { data: projectData } = await supabase
          .from('projects')
          .select('user_id');
        
        if (projectData && projectData.length > 0) {
          const userIds = [...new Set(projectData.map(p => p.user_id))];
          console.log('🔍 Found user IDs from projects:', userIds);
          
          // Try to fetch profiles for these specific users
          const { data: altData, error: altError } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds);
            
          if (altError) {
            console.error('❌ Alternative approach also failed:', altError);
            return;
          }
          
          console.log('📊 Alternative profiles data:', altData);
          const profilesMap = (altData || []).reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as Record<string, ClientProfile>);
          
          setClientProfiles(profilesMap);
          return;
        }
        
        throw error;
      }
      
      console.log('📊 Client profiles data:', data);
      
      const profilesMap = (data || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {} as Record<string, ClientProfile>);
      
      console.log('🗺️ Profiles map:', profilesMap);
      setClientProfiles(profilesMap);
    } catch (err) {
      console.error('❌ Error fetching client profiles:', err);
    }
  };

  // Fetch messages for selected project
  const fetchMessages = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
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

      if (error) throw error;
      setProjectFiles(data || []);
    } catch (err) {
      console.error('Error fetching project files:', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!selectedProject || !newMessage.trim()) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            project_id: selectedProject.id,
            sender_id: user?.id,
            sender_type: 'designer',
            sender_name: designerName,
            content: newMessage.trim(),
            is_read: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
      setNewMessage('');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Update project status
  const updateProjectStatus = async (projectId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', projectId);

      if (error) throw error;
      
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId ? { ...project, status } : project
        )
      );
      
      if (selectedProject?.id === projectId) {
        setSelectedProject(prev => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error('Error updating project status:', err);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Try to find the correct client profile
  const findCorrectClientProfile = async (projectUserId: string) => {
    try {
      console.log('🔍 Trying to find correct client profile for project user ID:', projectUserId);
      
      // First, let's see if there are any profiles at all
      const { data: allProfiles, error: allError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role');
        
      if (allError) {
        console.error('❌ Error fetching all profiles:', allError);
        return null;
      }
      
      console.log('📊 All profiles in database:', allProfiles);
      
      // Look for profiles with 'client' role
      const clientProfiles = allProfiles?.filter(p => p.role === 'client' || !p.role);
      console.log('👥 Client profiles found:', clientProfiles);
      
      // If no client profiles, let's check if the project has any clues about the real client
      if (!clientProfiles || clientProfiles.length === 0) {
        console.log('🔍 No client profiles found. Checking project data for client info...');
        
        // Check if there are any messages from the client that might have their name
        const { data: messages, error: messagesError } = await supabase
          .from('messages')
          .select('sender_name, sender_type')
          .eq('project_id', selectedProject?.id)
          .eq('sender_type', 'user');
          
        if (!messagesError && messages && messages.length > 0) {
          const clientName = messages[0].sender_name;
          console.log('🔍 Found client name from messages:', clientName);
          
          // Create a client profile with the real client name
          const { data: newClient, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: projectUserId,
              email: null, // We don't have the email
              full_name: clientName,
              role: 'client'
            })
            .select()
            .single();
            
          if (createError) {
            console.error('❌ Error creating client profile:', createError);
            // Use fallback with real client name
            const fallbackProfile = {
              id: projectUserId,
              full_name: clientName,
              email: null
            };
            
            setClientProfiles(prev => ({
              ...prev,
              [projectUserId]: fallbackProfile
            }));
            
            return fallbackProfile;
          } else {
            console.log('✅ Created client profile with real name:', newClient);
            setClientProfiles(prev => ({
              ...prev,
              [projectUserId]: newClient
            }));
            
            return newClient;
          }
        } else {
          console.log('⚠️ No client messages found. Cannot determine real client name.');
          // Don't create a fake profile - just use a generic fallback
          const fallbackProfile = {
            id: projectUserId,
            full_name: 'Unknown Client',
            email: null
          };
          
          setClientProfiles(prev => ({
            ...prev,
            [projectUserId]: fallbackProfile
          }));
          
          return fallbackProfile;
        }
      }
      
      if (clientProfiles && clientProfiles.length > 0) {
        // If we found client profiles, use the first one as a fallback
        const fallbackClient = clientProfiles[0];
        console.log('🔄 Using fallback client:', fallbackClient);
        
        // Update the project's user_id to match the found client
        const { error: updateError } = await supabase
          .from('projects')
          .update({ user_id: fallbackClient.id })
          .eq('id', selectedProject?.id);
          
        if (updateError) {
          console.error('❌ Error updating project user_id:', updateError);
        } else {
          console.log('✅ Updated project user_id to:', fallbackClient.id);
          // Refresh the project data
          fetchProjects();
        }
        
        return fallbackClient;
      }
      
      return null;
    } catch (err) {
      console.error('❌ Error finding correct client profile:', err);
      return null;
    }
  };

  // Fetch specific client profile if not found
  const fetchSpecificClientProfile = async (userId: string) => {
    try {
      console.log('🔍 Fetching specific client profile for:', userId);
      console.log('🔍 Current user:', user?.id, 'Current profile role:', profile?.role);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('id', userId);

      if (error) {
        console.error('❌ Error fetching specific client profile:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }
      
      console.log('📊 Specific client profile data:', data);
      
      if (!data || data.length === 0) {
        console.log('⚠️ No profile found for user ID:', userId);
        // Try to find the correct client profile
        const correctClient = await findCorrectClientProfile(userId);
        
        if (correctClient) {
          setClientProfiles(prev => ({
            ...prev,
            [userId]: correctClient
          }));
          return correctClient;
        }
        
        // Create a fallback profile entry
        const fallbackProfile = {
          id: userId,
          full_name: `Client ${userId.slice(0, 8)}`,
          email: null
        };
        
        setClientProfiles(prev => ({
          ...prev,
          [userId]: fallbackProfile
        }));
        
        return fallbackProfile;
      }
      
      // Add to clientProfiles map
      setClientProfiles(prev => ({
        ...prev,
        [userId]: data[0]
      }));
      
      return data[0];
    } catch (err) {
      console.error('❌ Error fetching specific client profile:', err);
      return null;
    }
  };

  // Load data on mount
  useEffect(() => {
    console.log('🔍 Designer portal mounted, user:', user?.id, 'profile:', profile?.role);
    fetchProjects();
    fetchClientProfiles();
  }, [user, profile]);

  // Function to create missing client profiles
  const createMissingClientProfiles = async () => {
    try {
      console.log('🔧 Creating missing client profiles...');
      
      // Get all project user_ids
      const projectUserIds = projects.map(p => p.user_id);
      console.log('🔍 Project user IDs:', projectUserIds);
      
      // Check which ones don't have profiles
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('id')
        .in('id', projectUserIds);
        
      const existingIds = existingProfiles?.map(p => p.id) || [];
      const missingIds = projectUserIds.filter(id => !existingIds.includes(id));
      
      console.log('🔍 Missing profile IDs:', missingIds);
      
      if (missingIds.length === 0) {
        console.log('✅ All project user_ids have profiles');
        return;
      }
      
      // Create profiles for missing user_ids
      const profilesToCreate = missingIds.map(userId => ({
        id: userId,
        full_name: `Client ${userId.slice(0, 8)}`,
        email: null,
        role: 'client',
        created_at: new Date().toISOString()
      }));
      
      const { data: newProfiles, error } = await supabase
        .from('profiles')
        .insert(profilesToCreate)
        .select();
        
      if (error) {
        console.error('❌ Error creating profiles:', error);
      } else {
        console.log('✅ Created profiles:', newProfiles);
        // Refresh client profiles
        fetchClientProfiles();
      }
      
    } catch (err) {
      console.error('❌ Error creating missing client profiles:', err);
    }
  };

  // Load messages when project is selected
  useEffect(() => {
    if (selectedProject) {
      fetchMessages(selectedProject.id);
      fetchProjectFiles(selectedProject.id);
      setNewStatus(selectedProject.status);
      
      // Fetch client profile if not found
      if (!clientProfiles[selectedProject.user_id]) {
        console.log('🔍 Client profile not found, fetching specific profile...');
        fetchSpecificClientProfile(selectedProject.user_id);
      }
    }
  }, [selectedProject]);

  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => {
      const client = clientProfiles[project.user_id];
      const matchesSearch = searchQuery === '' || 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client?.full_name && client.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by active section
      const matchesSection = activeSection === 'all' || 
        (activeSection === 'awaiting' && project.status === 'Awaiting Designer') ||
        (activeSection === 'active' && project.status === 'In Progress') ||
        (activeSection === 'review' && project.status === 'Review') ||
        (activeSection === 'archived' && (project.status === 'Completed' || project.status === 'Archived'));
      
      return matchesSearch && matchesSection;
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
          const statusOrder = { 'Briefing': 0, 'In Progress': 1, 'Review': 2, 'Revision': 3, 'Completed': 4, 'On Hold': 5, 'Archived': 6 };
          return (statusOrder[a.status as keyof typeof statusOrder] || 7) - (statusOrder[b.status as keyof typeof statusOrder] || 7);
        default:
          return 0;
      }
    });

  // Dashboard Statistics
  const dashboardStats = {
    totalProjects: projects.length,
    awaitingProjects: projects.filter(p => p.status === 'Awaiting Designer').length,
    activeProjects: projects.filter(p => p.status === 'In Progress').length,
    reviewProjects: projects.filter(p => p.status === 'Review').length,
    completedProjects: projects.filter(p => p.status === 'Completed').length,
    totalClients: Object.keys(clientProfiles).length,
    unreadMessages: messages.filter(m => !m.is_read && m.sender_type === 'user').length,
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Awaiting Designer':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'Briefing':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Review':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Revision':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
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
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white sticky top-0 z-50 shadow-xl">
        <div className="container">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-white/80 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-1">
                  Designer Portal
                </h1>
                <p className="text-base text-white/80 font-medium">Project Management Dashboard</p>
              </div>
            </div>
            
            {/* Dashboard Stats */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xl font-bold">{dashboardStats.totalProjects}</div>
                  <div className="text-xs text-white/70 uppercase tracking-wide">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-200">{dashboardStats.awaitingProjects}</div>
                  <div className="text-xs text-white/70 uppercase tracking-wide">Awaiting</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-200">{dashboardStats.activeProjects}</div>
                  <div className="text-xs text-white/70 uppercase tracking-wide">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-200">{dashboardStats.reviewProjects}</div>
                  <div className="text-xs text-white/70 uppercase tracking-wide">Review</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white/90">{dashboardStats.totalClients}</div>
                  <div className="text-xs text-white/70 uppercase tracking-wide">Clients</div>
                </div>
                {dashboardStats.unreadMessages > 0 && (
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-200">{dashboardStats.unreadMessages}</div>
                    <div className="text-xs text-white/70 uppercase tracking-wide">Unread</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {(profile?.full_name || 'D').split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="text-sm font-medium">{profile?.full_name || 'Designer'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-xl transition-all duration-200 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
            >
              <option value="recent">Recent</option>
              <option value="name">Name</option>
              <option value="client">Client</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Workflow Section Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveSection('all')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeSection === 'all'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                All Projects ({projects.length})
              </button>
              <button
                onClick={() => setActiveSection('awaiting')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeSection === 'awaiting'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Awaiting Designer ({projects.filter(p => p.status === 'Awaiting Designer').length})
                </div>
              </button>
              <button
                onClick={() => setActiveSection('active')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeSection === 'active'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Active ({projects.filter(p => p.status === 'In Progress').length})
                </div>
              </button>
              <button
                onClick={() => setActiveSection('review')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeSection === 'review'
                    ? 'bg-white text-yellow-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  In Review ({projects.filter(p => p.status === 'Review' || p.status === 'Revision').length})
                </div>
              </button>
              <button
                onClick={() => setActiveSection('archived')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeSection === 'archived'
                    ? 'bg-white text-gray-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-gray-600" />
                  Archived ({projects.filter(p => p.status === 'Completed' || p.status === 'Archived').length})
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Asana-style List View */}
      <div className="container py-8">
        {/* Modern Projects List */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden backdrop-blur-sm">
          {/* Enhanced Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-8 py-6">
            <div className="grid grid-cols-12 gap-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
              <div className="col-span-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Project
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Client
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Status
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Created
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Messages
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                Actions
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredAndSortedProjects.map((project) => {
              const client = clientProfiles[project.user_id];
              const unreadCount = messages.filter(m => 
                m.project_id === project.id && !m.is_read && m.sender_type === 'user'
              ).length;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01, backgroundColor: '#f8fafc' }}
                  className={`grid grid-cols-12 gap-6 px-8 py-6 transition-all duration-300 cursor-pointer group ${
                    selectedProject?.id === project.id 
                      ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 shadow-lg' 
                      : 'hover:shadow-md hover:bg-gray-50/50'
                  }`}
                  onClick={() => {
                    setSelectedProject(project);
                    setNewStatus(project.status);
                    fetchProjectFiles(project.id);
                  }}
                >
                  {/* Enhanced Project Info */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                      {getStatusIcon(project.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate mt-1">{project.type}</p>
                    </div>
                  </div>

                  {/* Client */}
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {client?.full_name?.split(' ').map(n => n[0]).join('') || 'C'}
                      </div>
                      <span className="text-sm text-gray-700 truncate">
                        {client?.full_name || 'Unknown Client'}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex items-center">
                    <select
                      value={project.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateProjectStatus(project.id, e.target.value);
                      }}
                      className="text-xs px-2 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="Awaiting Designer">Awaiting Designer</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  {/* Created Date */}
                  <div className="col-span-2 flex items-center">
                    <div className="text-sm text-gray-600">
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="col-span-1 flex items-center justify-center">
                    {unreadCount > 0 ? (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        {unreadCount}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">0</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-center gap-2">
                    {project.status === 'Awaiting Designer' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateProjectStatus(project.id, 'In Progress');
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
                        title="Start Project"
                      >
                        Start
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProject(project);
                        setNewStatus(project.status);
                        fetchProjectFiles(project.id);
                      }}
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-1 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Empty State */}
            {filteredAndSortedProjects.length === 0 && (
              <div className="px-6 py-12 text-center">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Found</h3>
                <p className="text-gray-600">
                  {searchQuery ? 'No projects match your search criteria' : 'No projects have been created yet'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Detail Sidebar */}
      {selectedProject && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{selectedProject.name}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{selectedProject.description}</p>
              
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <span className="text-sm text-gray-500 uppercase tracking-wide font-medium">Client</span>
                  <div className="text-base font-semibold text-gray-900 mt-1">{clientProfiles[selectedProject.user_id]?.full_name || 'Unknown'}</div>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <span className="text-sm text-gray-500 uppercase tracking-wide font-medium">Type</span>
                  <div className="text-base font-semibold text-gray-900 mt-1">{selectedProject.type}</div>
                </div>
                
                <div className="border-b border-gray-100 pb-4">
                  <span className="text-sm text-gray-500 uppercase tracking-wide font-medium">Created</span>
                  <div className="text-base font-semibold text-gray-900 mt-1">{new Date(selectedProject.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-3">Update Status</h4>
              <div className="flex gap-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="Awaiting Designer">Awaiting Designer</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Archived">Archived</option>
                </select>
                {newStatus !== selectedProject.status && (
                  <button
                    onClick={() => updateProjectStatus(selectedProject.id, newStatus)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
                  >
                    Update
                  </button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-3">Send Message</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message to the client..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-base font-semibold text-gray-900 mb-3">Recent Messages</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {messages.slice(-5).map((msg) => (
                  <div key={msg.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{msg.sender_name}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.created_at).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{msg.content}</p>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-8">No messages yet</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-3">Project Files</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {loadingFiles ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading files...</p>
                  </div>
                ) : projectFiles.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No files uploaded yet</p>
                ) : (
                  projectFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {file.file_name}
                        </p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.file_size)}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleFileDownload(file)}
                          className="px-3 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        >
                          Download
                        </button>
                        {file.file_url && (
                          <button
                            onClick={() => window.open(file.file_url!, '_blank')}
                            className="px-3 py-1 text-xs text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                          >
                            View
                          </button>
                        )}
                        <button
                          onClick={() => handleFileDelete(file.id)}
                          className="px-3 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}