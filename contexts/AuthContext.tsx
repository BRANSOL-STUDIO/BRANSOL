"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  avatar_emoji: string | null;
  avatar_gradient: string;
  company: string | null;
  phone: string | null;
  bio: string | null;
  plan: string;
  hours_remaining: number;
  hours_total: number;
  hours_reset_date: string;
  billing_day: number;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔵 Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.log('🔵 Profile fetch error:', error.code, error.message);
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('🔵 Creating new profile...');
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const newProfile = {
              id: userId,
              email: userData.user.email,
              full_name: userData.user.user_metadata?.full_name || null,
            };
            
            const { data: createdProfile, error: createError } = await supabase
              .from('profiles')
              .insert([newProfile])
              .select()
              .single();
            
            if (!createError && createdProfile) {
              console.log('✅ Profile created successfully:', createdProfile);
              setProfile(createdProfile);
            } else {
              console.error('❌ Profile creation failed:', createError);
            }
          }
        } else {
          console.warn('Error fetching profile:', error.message);
        }
      } else {
        console.log('✅ Profile fetched successfully:', data);
        setProfile(data);
      }
    } catch (error) {
      console.warn('Could not fetch/create profile:', error);
    } finally {
      console.log('🔵 Setting loading to false');
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('🔵 AuthContext: Starting signUp for', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      console.log('🔵 Supabase auth.signUp response:', { data, error });

      if (error) {
        console.error('🔴 Auth signup error:', error);
        throw error;
      }

      // Create profile
      if (data.user) {
        console.log('🔵 Creating profile for user:', data.user.id);
        console.log('🔵 User email:', data.user.email);
        console.log('🔵 Full name:', fullName);
        
        try {
          // Create profile with only basic fields that we know exist
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .insert([{
              id: data.user.id,
              email: data.user.email,
              full_name: fullName,
            }])
            .select();

          console.log('🔵 Profile creation response:', { profileData, profileError });
          console.log('🔵 ProfileData type:', typeof profileData);
          console.log('🔵 ProfileError type:', typeof profileError);
          console.log('🔵 ProfileError keys:', profileError ? Object.keys(profileError) : 'null');

          if (profileError) {
            console.error('🔴 Profile creation error:', profileError);
            console.error('🔴 Error code:', profileError.code);
            console.error('🔴 Error message:', profileError.message);
            console.error('🔴 Error details:', profileError.details);
            console.error('🔴 Full error object:', JSON.stringify(profileError, null, 2));
          
            // If profile already exists (duplicate key), just continue - it's fine
            if (profileError.code === '23505') {
              console.log('ℹ️ Profile already exists, continuing...');
            } else {
              // Try again with minimal fields if first attempt failed
              console.log('🔵 Retrying with minimal profile fields...');
              const { data: retryData, error: retryError } = await supabase
                .from('profiles')
                .insert([{
                  id: data.user.id,
                  email: data.user.email,
                  full_name: fullName,
                }])
                .select();
              
              console.log('🔵 Retry response:', { retryData, retryError });
              
              if (retryError && retryError.code !== '23505') {
                console.error('🔴 Retry also failed:', retryError);
              } else {
                console.log('✅ Profile created with minimal fields');
              }
            }
          } else {
            console.log('✅ Profile created successfully:', profileData);
          }
        } catch (profileCreationError) {
          console.error('🔴 Exception during profile creation:', profileCreationError);
        }
      }

      console.log('✅ Signup completed successfully');
      return { error: null };
    } catch (error) {
      console.error('🔴 SignUp catch error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      console.log('🔄 Starting signOut process...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Supabase signOut error:', error);
        throw error;
      }
      
      // Clear local state immediately
      setUser(null);
      setProfile(null);
      setLoading(false);
      
      console.log('✅ Successfully signed out');
      
      // Force a page reload to ensure all state is cleared
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('❌ Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      throw new Error('User must be authenticated to update profile');
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      // Update local state with the returned data from database
      if (data) {
        setProfile(data);
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

