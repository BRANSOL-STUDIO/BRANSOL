import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ChatMessage {
  id: string;
  sender_type: 'user' | 'designer';
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ProjectWithMessages {
  id: string;
  name: string;
  type: string;
  description?: string;
  status: string;
  deadline?: string;
  hours_used: number;
  designer_name?: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
  files: Array<{
    id: string;
    file_name: string;
    file_size: string;
    file_url?: string;
    created_at: string;
  }>;
}

export function useProjectChat(userId?: string) {
  const [projects, setProjects] = useState<ProjectWithMessages[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchProjects = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Fetch messages and files for each project
      const projectsWithDetails = await Promise.all(
        (projectsData || []).map(async (project) => {
          const [messagesRes, filesRes] = await Promise.all([
            supabase
              .from('messages')
              .select('*')
              .eq('project_id', project.id)
              .order('created_at', { ascending: true }),
            supabase
              .from('project_files')
              .select('*')
              .eq('project_id', project.id)
              .order('created_at', { ascending: false }),
          ]);

          return {
            ...project,
            messages: messagesRes.data || [],
            files: filesRes.data || [],
          };
        })
      );

      setProjects(projectsWithDetails);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    // Subscribe to real-time message updates for all projects
    if (userId) {
      const channel = supabase
        .channel('project-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
          },
          (payload) => {
            const newMessage = payload.new as ChatMessage;
            setProjects((current) =>
              current.map((project) =>
                project.id === (newMessage as any).project_id
                  ? { ...project, messages: [...project.messages, newMessage] }
                  : project
              )
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId]);

  const sendMessage = async (projectId: string, content: string, senderName: string) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            project_id: projectId,
            sender_id: userId,
            sender_type: 'user',
            sender_name: senderName,
            content,
            is_read: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      return null;
    }
  };

  const createProject = async (projectData: {
    name: string;
    type: string;
    description?: string;
    deadline?: string;
  }) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: userId,
            ...projectData,
            status: 'Briefing',
            hours_used: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setProjects((prev) => [
        {
          ...data,
          messages: [],
          files: [],
        },
        ...prev,
      ]);

      return data;
    } catch (err) {
      console.error('Error creating project:', err);
      return null;
    }
  };

  const markProjectMessagesAsRead = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('project_id', projectId)
        .eq('sender_type', 'designer'); // Only mark designer messages as read

      if (error) throw error;

      // Update local state
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? {
                ...project,
                messages: project.messages.map(msg => 
                  msg.sender_type === 'designer' 
                    ? { ...msg, is_read: true } 
                    : msg
                )
              }
            : project
        )
      );
    } catch (err) {
      console.error('Error marking project messages as read:', err);
    }
  };

  const completeProject = async (projectId: string, completionNotes?: string) => {
    try {
      console.log('🔵 Starting project completion:', { projectId, completionNotes });
      
      const { data, error } = await supabase
        .from('projects')
        .update({ 
          status: 'Completed',
          completed_at: new Date().toISOString(),
          completion_notes: completionNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .select();

      console.log('🔵 Supabase response:', { data, error });

      if (error) {
        console.error('🔴 Supabase error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          fullError: error
        });
        throw error;
      }

      // Update local state
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { 
                ...project, 
                status: 'Completed',
                completed_at: new Date().toISOString(),
                completion_notes: completionNotes
              }
            : project
        )
      );

      console.log('✅ Project completed successfully');
      return true;
    } catch (err) {
      console.error('🔴 Error completing project:', err);
      console.error('🔴 Error type:', typeof err);
      console.error('🔴 Error keys:', err ? Object.keys(err) : 'null');
      return false;
    }
  };

  const archiveProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          status: 'Archived',
          archived_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      // Update local state
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { 
                ...project, 
                status: 'Archived',
                archived_at: new Date().toISOString()
              }
            : project
        )
      );

      return true;
    } catch (err) {
      console.error('Error archiving project:', err);
      return false;
    }
  };

  return {
    projects,
    loading,
    sendMessage,
    createProject,
    markProjectMessagesAsRead,
    completeProject,
    archiveProject,
    refetch: fetchProjects,
  };
}

