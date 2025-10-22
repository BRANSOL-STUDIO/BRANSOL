"use client";

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Send, Users, LogOut, MessageSquare, FolderOpen, Clock, ArrowLeft } from 'lucide-react';
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

export default function DesignerPortal() {
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [clientProfiles, setClientProfiles] = useState<Record<string, ClientProfile>>({});
  const [newMessage, setNewMessage] = useState('');
  const [newStatus, setNewStatus] = useState('');
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

      <div className="container py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Client Projects</h2>
                <span className="ml-auto bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-bold">
                  {projects.length}
                </span>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {projects.map((project) => {
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
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        selectedProject?.id === project.id
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{project.name}</h3>
                        {unreadCount > 0 && selectedProject?.id !== project.id && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mb-1 ${selectedProject?.id === project.id ? 'text-purple-100' : 'text-gray-600'}`}>
                        {client?.full_name || 'Unknown Client'}
                      </p>
                      <p className={`text-xs ${selectedProject?.id === project.id ? 'text-purple-100' : 'text-gray-500'}`}>
                        {project.type}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedProject?.id === project.id 
                            ? 'bg-white/20 text-white' 
                            : project.status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : project.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {project.status}
                        </span>
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
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-bold text-gray-900">Project Chat</h3>
                    <span className="ml-auto text-xs text-gray-500">{messages.length} messages</span>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender_type === 'designer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="max-w-[80%]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-500">{msg.sender_name}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </span>
                          </div>
                          <div
                            className={`p-3 rounded-2xl ${
                              msg.sender_type === 'designer'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
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
      </div>
    </div>
  );
}
