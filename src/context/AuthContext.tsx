import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/mockApi';
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
        // Check for existing user in localStorage
        const userJson = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (userJson) {
          try {
            const userData = JSON.parse(userJson) as AuthUser;
            setUser(userData);
            setRoles(getUserRoles(userData));
            setProfile({
              first_name: userData.firstName,
              last_name: userData.lastName,
              email: userData.email,
            });
          } catch (error) {
            console.error('Error parsing user data:', error);
            // Clear invalid data
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          }
        }
        
        // Set up auth state change listener
        window.addEventListener('storage', (event) => {
          if (event.key === STORAGE_KEYS.USER) {
            if (event.newValue) {
              try {
                const userData = JSON.parse(event.newValue) as AuthUser;
                setUser(userData);
                setRoles(getUserRoles(userData));
                setProfile({
                  first_name: userData.firstName,
                  last_name: userData.lastName,
                  email: userData.email,
                });
              } catch (error) {
                console.error('Error parsing user data from storage event:', error);
              }
            } else {
              // User logged out
              setUser(null);
              setRoles([]);
              setProfile(null);
            }
          }
        });
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
      const { data, error, status } = await authApi.login({ email, password });
      
      if (error) throw new Error(error);
      if (!data) throw new Error('No user data returned');
      
      setUser(data);
      setRoles(getUserRoles(data));
      setProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
      });
      
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
      
      const { data, error, status } = await authApi.register({
        email,
        password,
        firstName,
        lastName,
        role: 'buyer'
      });
      
      if (error) throw new Error(error);
      if (!data) throw new Error('No user data returned');
      
      setUser(data);
      setRoles(getUserRoles(data));
      setProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
      });
      
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
  
  // Google login function
  const googleLogin = async () => {
    try {
      // In a mock implementation, just create a demo user
      const { data, error, status } = await authApi.login({
        email: 'google-user@example.com',
        password: 'password123'
      });
      
      if (error) throw new Error(error);
      if (!data) throw new Error('No user data returned');
      
      setUser(data);
      setRoles(getUserRoles(data));
      setProfile({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
      });
      
      return;
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(error.message || 'Failed to login with Google');
    }
  };
  
  const logout = async () => {
    try {
      const { error } = await authApi.logout();
      if (error) throw new Error(error);
      
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
