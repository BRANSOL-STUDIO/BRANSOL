import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Message {
  id: string;
  sender_type: 'user' | 'designer';
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ProjectFile {
  id: string;
  file_name: string;
  file_size: string;
  file_url: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  type: string;
  description?: string;
  status: string;
  deadline?: string;
  hours_used: number;
  designer_name?: string;
  completed_at?: string;
  completed_by?: string;
  archived_at?: string;
  archived_by?: string;
  completion_notes?: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
  files?: ProjectFile[];
}

export function useProjects(userId?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchProjects = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const createProject = async (projectData: {
    name: string;
    type: string;
    description?: string;
    deadline?: string;
  }) => {
    if (!userId) return null;

    try {
      const { data, error: createError } = await supabase
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

      if (createError) throw createError;

      setProjects((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating project:', err);
      return null;
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    refetch: fetchProjects,
  };
}

