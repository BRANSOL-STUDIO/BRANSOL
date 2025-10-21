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
            status: 'In Progress',
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

  return {
    projects,
    loading,
    sendMessage,
    createProject,
    refetch: fetchProjects,
  };
}

