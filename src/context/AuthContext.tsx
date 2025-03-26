
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  phone: string | null;
}

interface AuthContextProps {
  user: User | null;
  profile: UserProfile | null;
  roles: string[];
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSeller: boolean;
  isBuyer: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (first_name: string, last_name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  googleLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  profile: null,
  roles: [],
  session: null,
  isAuthenticated: false,
  isLoading: true,
  isSeller: false,
  isBuyer: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUserProfile: async () => {},
  googleLogin: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserProfile = async () => {
    if (!user) return;

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      
      setProfile(profileData);

      // Get user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (rolesError) throw rolesError;
      
      const userRoles = rolesData.map(r => r.role);
      setRoles(userRoles);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setRoles([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        refreshUserProfile();
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      refreshUserProfile();
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || 'Failed to log in. Please try again.',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: "Login with Google failed",
        description: error.message || 'Failed to log in with Google. Please try again.',
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (
    first_name: string, 
    last_name: string, 
    email: string, 
    password: string,
    role: string = 'buyer'
  ): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Modified to auto-confirm email by setting emailRedirectTo to null
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name,
            last_name,
          },
          emailRedirectTo: null // This prevents the email confirmation requirement
        }
      });
      
      if (signUpError) throw signUpError;
      
      // For immediate login after signup (since we're bypassing email confirmation)
      if (!data.session) {
        await login(email, password);
      }
      
      // If the role is seller, add the role manually
      if (role === 'seller' && data.user) {
        // We need to wait a bit for the trigger to create the buyer role first
        setTimeout(async () => {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user?.id,
              role: 'seller'
            });
            
          if (roleError) {
            console.error('Error assigning seller role:', roleError);
          } else {
            // Refresh profile to get updated roles
            await refreshUserProfile();
          }
        }, 1000);
      }
      
      toast({
        title: "Welcome to RAIBO!",
        description: "Your account has been created successfully.",
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || 'Failed to create account. Please try again.',
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: error.message || 'Failed to log out. Please try again.',
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        roles,
        session,
        isAuthenticated: !!user,
        isLoading,
        isSeller: roles.includes('seller'),
        isBuyer: roles.includes('buyer'),
        login,
        register,
        logout,
        refreshUserProfile,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
