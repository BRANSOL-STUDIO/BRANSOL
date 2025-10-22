import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Message } from './useProjects';

export function useMessages(projectId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    // Fetch initial messages
    const fetchMessages = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`messages:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  const sendMessage = async (
    projectId: string,
    userId: string,
    senderName: string,
    content: string
  ) => {
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

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;

      // Update local state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (err) {
      console.error('Error marking message as read:', err);
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
      setMessages(prev => 
        prev.map(msg => 
          msg.project_id === projectId && msg.sender_type === 'designer' 
            ? { ...msg, is_read: true } 
            : msg
        )
      );
    } catch (err) {
      console.error('Error marking project messages as read:', err);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
    markAsRead,
    markProjectMessagesAsRead,
  };
}

