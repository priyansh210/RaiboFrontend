
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../integrations/supabase/client';
import { STORAGE_KEYS } from '../api/config';
import { toast } from '@/hooks/use-toast';

// Auth user type
export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

// Auth context type
export interface AuthContextType {
  user: AuthUser | null;
  profile: any | null; // Profile data
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: string[];
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  isBuyer: boolean;
  isSeller: boolean;
  isAdmin: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  roles: [],
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  googleLogin: async () => {},
  isBuyer: false,
  isSeller: false,
  isAdmin: false
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  
  // Get user roles helper
  const getUserRoles = (user: AuthUser) => {
    return user.roles || [];
  };
  
  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            const userData = session?.user ? {
              id: session.user.id,
              email: session.user.email || '',
              firstName: session.user.firstName,
              lastName: session.user.lastName,
              roles: session.user.roles
            } : null;
            
            setUser(userData);
            
            if (userData) {
              setRoles(getUserRoles(userData));
              setProfile({
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email,
              });
            } else {
              setRoles([]);
              setProfile(null);
            }
          }
        );
        
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            roles: session.user.roles
          };
          
          setUser(userData);
          setRoles(getUserRoles(userData));
          setProfile({
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
          });
        }
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw new Error(error.message);
      
      return;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  };
  
  // Register function
  const register = async (firstName: string, lastName: string, email: string) => {
    try {
      // Create a random password for demo purposes (in a real app, you'd collect this from the user)
      const password = `Password${Math.floor(Math.random() * 1000)}!`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'buyer'
          }
        }
      });
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Account created successfully",
        description: "You have been automatically logged in.",
      });
      
      return;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Failed to register');
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      
      // Reset auth state
      setUser(null);
      setRoles([]);
      setProfile(null);
      
      toast({
        title: "Logged out successfully",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to logout');
    }
  };
  
  // Google login function
  const googleLogin = async () => {
    try {
      // In a mock implementation, just create a demo user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'google-user@example.com',
        password: 'password123'
      });
      
      if (error) throw new Error(error.message);
      
      return;
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(error.message || 'Failed to login with Google');
    }
  };
  
  const isBuyer = roles.includes('buyer');
  const isSeller = roles.includes('seller');
  const isAdmin = roles.includes('admin');
  
  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAuthenticated: !!user,
      isLoading,
      roles,
      login,
      register,
      logout,
      googleLogin,
      isBuyer,
      isSeller,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
