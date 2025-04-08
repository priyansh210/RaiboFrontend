
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { authApi } from '../api/mockApi';
import { AuthUser } from '../api/types';

interface AuthContextType {
  user: AuthUser | null;
  roles: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  register: (email: string, password: string, role: 'buyer' | 'seller') => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  roles: [],
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  googleLogin: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const response = await authApi.getCurrentUser();
        if (response.data) {
          setUser(response.data);
        }
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
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      
      if (response.error) {
        toast({
          title: "Login Failed",
          description: response.error,
          variant: "destructive",
        });
        throw new Error(response.error);
      }
      
      if (response.data) {
        setUser(response.data);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Google login (simulated)
  const googleLogin = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "Google Login",
        description: "This would redirect to Google in a real application",
      });
      
      // Simulate successful login after a delay
      setTimeout(async () => {
        await login("buyer@example.com", "password123");
      }, 1000);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };
  
  // Register function
  const register = async (email: string, password: string, role: 'buyer' | 'seller') => {
    setIsLoading(true);
    try {
      const response = await authApi.register({ 
        email, 
        password, 
        role
      });
      
      if (response.error) {
        toast({
          title: "Registration Failed",
          description: response.error,
          variant: "destructive",
        });
        throw new Error(response.error);
      }
      
      if (response.data) {
        setUser(response.data);
        toast({
          title: "Registration Successful",
          description: "Your account has been created!",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Context value
  const value = {
    user,
    roles: user?.roles || [],
    isAuthenticated: !!user,
    isLoading,
    login,
    googleLogin,
    register,
    logout,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
