// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatar?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string) => Promise<{ error: any; requiresEmailConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateProfile: (updates: { display_name: string }) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && (error as any).code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const convertToUser = (supabaseUser: SupabaseUser, userProfile?: Profile): User => {
    const displayName =
      (userProfile && (userProfile.display_name || undefined)) ||
      (supabaseUser.user_metadata && ((supabaseUser.user_metadata as any).full_name || (supabaseUser.user_metadata as any).name)) ||
      (supabaseUser.email ? supabaseUser.email.split('@')[0] : 'User');

    return {
      id: supabaseUser.id,
      name: typeof displayName === 'string' ? displayName : 'User',
      email: supabaseUser.email || '',
      createdAt: (supabaseUser as any).created_at || '',
      avatar: userProfile?.avatar_url || (supabaseUser.user_metadata as any)?.avatar_url,
    };
  };

  useEffect(() => {
    // Auth state change listener
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session as Session | null);

      if (session?.user) {
        setIsAuthenticated(true);
        // fetch profile async
        setTimeout(async () => {
          await fetchProfile(session.user.id);
        }, 0);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setProfile(null);
      }

      setIsLoading(false);
    });

    // initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session as Session | null);

      if (session?.user) {
        setIsAuthenticated(true);
        setTimeout(async () => {
          await fetchProfile(session.user.id);
        }, 0);
      }

      setIsLoading(false);
    }).catch(err => {
      console.error('Error fetching initial session:', err);
      setIsLoading(false);
    });

    return () => {
      data.subscription?.unsubscribe();
    };
  }, []);

  // Update user whenever session or profile changes
  useEffect(() => {
    if (session?.user) {
      const updatedUser = convertToUser(session.user as SupabaseUser, profile || undefined);
      setUser(updatedUser);
    } else {
      setUser(null);
    }
  }, [session, profile]);

  // -------------------------
  // SUPABASE-ONLY signup with auto sign-in attempt
  // -------------------------
  const signup = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        return { error: new Error("Please enter email and password.") };
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: String(email).trim(),
          password,
          // options: { emailRedirectTo: window.location.origin + '/auth' } // optional
        } as any);

        if (error) {
          console.warn('[Signup] supabase error:', error);
          return { error: new Error(error.message || 'Signup failed.') };
        }

        const sessionCreated = (data as any)?.session ?? null;

        // If a session is returned by signUp, signup is complete and user is signed in.
        if (sessionCreated) {
          return { error: null };
        }

        // No session returned => Supabase likely requires email confirmation.
        // Attempt auto sign-in (this may succeed if your Supabase instance does not require verify or if confirm disabled)
        try {
          const signInResult = await supabase.auth.signInWithPassword({
            email: String(email).trim(),
            password,
          } as any);

          const { data: signInData, error: signInError } = signInResult as any;
          if (signInError) {
            console.warn('Auto sign-in failed:', signInError);
            // Still treat signup as success but indicate verification required
            return { error: null, requiresEmailConfirmation: true };
          }

          // sign-in succeeded — session created and listener will update UI
          return { error: null };
        } catch (signInErr) {
          console.error('Auto sign-in unexpected:', signInErr);
          return { error: null, requiresEmailConfirmation: true };
        }
      } catch (innerErr: any) {
        console.error('[Signup] unexpected supabase error:', innerErr);
        return { error: new Error(innerErr?.message || 'Signup failed.') };
      }
    } catch (err) {
      console.error('[Signup] unexpected error:', err);
      return { error: err };
    }
  };

  // -------------------------
  // Login
  // -------------------------
  const login = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      const { data, error } = result as any;

      if (error) {
        console.error('Login error:', error);
        return { error };
      }

      const signedUser = data?.user;
      const signedSession = data?.session;

      if (!signedSession) {
        return { error: new Error('Unable to sign in. Check email and password.') };
      }

      // Optionally enforce email confirmation if your flow requires it:
      const confirmedAt = (signedUser && (signedUser.confirmed_at || signedUser.email_confirmed_at)) ?? null;
      if (!signedUser || (!signedUser.confirmed_at && !signedUser.email_confirmed_at)) {
        // sign out to avoid leaving a non-confirmed session
        await supabase.auth.signOut();
        return { error: new Error('Please verify your email before logging in. Check your inbox for the confirmation link.') };
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected login error:', err);
      return { error: err };
    }
  };

  // -------------------------
  // OAuth Google
  // -------------------------
  const signInWithGoogle = async () => {
    try {
      const redirectUrl = window.location.origin + '/';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: redirectUrl },
      } as any);

      if (error) {
        console.error('OAuth signin error:', error);
        return { error };
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected OAuth error:', err);
      return { error: err };
    }
  };

  // -------------------------
  // Logout
  // -------------------------
  const logout = async () => {
    await supabase.auth.signOut();
  };

  // -------------------------
  // Update profile
  // -------------------------
  const updateProfile = async (updates: { display_name: string }) => {
    if (!session?.user) {
      return { error: new Error('No user logged in') };
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', session.user.id);

    if (!error) {
      await fetchProfile(session.user.id);
    }

    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      isAuthenticated,
      isLoading,
      login,
      signup,
      signInWithGoogle,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
