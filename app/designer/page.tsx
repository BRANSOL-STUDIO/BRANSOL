"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Send, Users } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  user_id: string;
  type: string;
  status: string;
}

interface Message {
  id: string;
  project_id: string;
  sender_type: string;
  sender_name: string;
  content: string;
  created_at: string;
}

export default function DesignerPortal() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [designerName] = useState('Sarah Johnson'); // Hardcoded for demo
  const supabase = createClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchMessages(selectedProject);
      
      // Subscribe to real-time messages
      const channel = supabase
        .channel(`designer-messages:${selectedProject}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `project_id=eq.${selectedProject}`,
          },
          (payload) => {
            setMessages((current) => [...current, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    setProjects(data || []);
  };

  const fetchMessages = async (projectId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    
    setMessages(data || []);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedProject) return;

    await supabase.from('messages').insert([
      {
        project_id: selectedProject,
        sender_type: 'designer',
        sender_name: designerName,
        content: newMessage,
        is_read: false,
      },
    ]);

    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="container">
          <h1 className="text-2xl font-bold text-gray-900">Designer Portal</h1>
          <p className="text-sm text-gray-600">View and respond to client messages</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Client Projects</h2>
            </div>
            <div className="space-y-2">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedProject === project.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <h3 className="font-semibold mb-1">{project.name}</h3>
                  <p className={`text-sm ${selectedProject === project.id ? 'text-purple-100' : 'text-gray-600'}`}>
                    {project.type}
                  </p>
                  <span className={`text-xs ${selectedProject === project.id ? 'text-purple-200' : 'text-gray-500'}`}>
                    {project.status}
                  </span>
                </button>
              ))}
              {projects.length === 0 && (
                <p className="text-gray-500 text-center py-8 text-sm">No projects yet</p>
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            {selectedProject ? (
              <div className="flex flex-col h-[600px]">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {projects.find(p => p.id === selectedProject)?.name}
                  </h2>
                  <p className="text-sm text-gray-600">Chat with client</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender_type === 'designer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%]`}>
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
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
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
            ) : (
              <div className="h-[600px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Select a project to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

