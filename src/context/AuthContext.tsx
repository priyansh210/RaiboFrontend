import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../services/ApiService';
import { STORAGE_KEYS } from '../api/config';
import { toast } from '@/hooks/use-toast';
import { googleAuthService } from '@/services/GoogleAuthService';

// Auth user type
export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  companyId: string;
}

// API Response types
interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    first_name?: string;
    last_name?: string;
    role?: string[];
    companyId?: string;
  };
}

interface RegisterResponse {
  message: string;
}

// Auth context type
export interface AuthContextType {
  user: AuthUser | null;
  profile: any | null; // Profile data
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: string[];
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    role: string,
    companyName: string,
    taxId?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  isBuyer: boolean;
  isGuest: boolean;
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
  isGuest: true
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
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        
        if (userJson && token) {
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
  
  // Login function with portal separation and admin redirect
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    console.log('AuthContext: Starting login process');
    
    try {
      const response = await apiService.login({ email, password }) as LoginResponse;
      console.log('AuthContext: Login response received:', response);
      
      if (!response) throw new Error('No response from server');
      
      // Store the auth token
      if (response.access_token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.access_token);
        console.log('AuthContext: Token stored');
      }
      
      // Create user object from response
      const userData: AuthUser = {
        id: response.user?.id || email,
        email: response.user?.email || email,
        firstName: response.user?.firstName || response.user?.first_name,
        lastName: response.user?.lastName || response.user?.last_name,
        roles: response.user?.role || ['buyer'],
        companyId: response.user?.companyId || 'none', // Default to 'none' if not provided
      };
      
      console.log('AuthContext: User data created:', userData);
      
      // Store user data
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
      setUser(userData);
      setRoles(getUserRoles(userData));
      setProfile({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
      });
      
      console.log('AuthContext: Login completed successfully');
      
      return;
    } catch (error: any) {
      console.error('AuthContext: Login error:', error);
      throw new Error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    role: string,
    companyName: string,
    taxId?: string
  ) => {
    setIsLoading(true);
    console.log('AuthContext: Starting registration process');
    
    try {
      // Prepare the request body
      const requestBody = {
        fullname: `${firstName} ${lastName}`,
        phone,
        email,
        password,
        role: role || 'buyer', // Default role to 'buyer' if not provided
        companyName: companyName || 'none', // Default company name to 'none' if not provided
        taxId: taxId || 'none', // Default tax ID to 'none' if not provided
      };
  
      // Make the API call
      const response = await apiService.register(requestBody) as RegisterResponse;
      console.log('AuthContext: Registration response received:', response);
  
      if (!response) throw new Error('No response from server');
  
      console.log('AuthContext: Registration completed successfully');
      return; // Return the full response for further use if needed
    } catch (error: any) {
      console.error('AuthContext: Registration error:', error);
      throw new Error(error.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Google login function
  const googleLogin = async () => {
  setIsLoading(true);
  console.log('AuthContext: Starting Google login process');
  
  try {
    const response = await googleAuthService.signInWithGoogle();
    // Store the auth data returned from backend

    if (!response) throw new Error('No response from server');

    // Store the auth token
    if (response.access_token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.access_token);
      console.log('AuthContext: Token stored');
    }
    
    // Create user object from response
    const userData: AuthUser = {
      id: response.user?.id,
      email: response.user?.email,
      firstName: response.user?.firstName || response.user?.first_name,
      lastName: response.user?.lastName || response.user?.last_name,
      roles: response.user?.role || ['buyer'],
      companyId: response.user?.companyId || 'none',
    };
    
    console.log('AuthContext: User data created:', userData);
    
    // Store user data
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    
    setUser(userData);
    setRoles(getUserRoles(userData));
    setProfile({
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
    });
    
    toast({
      title: "Google login successful",
      description: "Welcome to RAIBO!",
    });
    
    console.log('AuthContext: Google login completed successfully');
    
    return;
  } catch (error: any) {
    console.error('AuthContext: Google login error:', error);
    toast({
      title: "Login failed",
      description: error.message || "Failed to login with Google",
      variant: "destructive"
    });
    throw new Error(error.message || 'Failed to login with Google');
  } finally {
    setIsLoading(false);
  }
};
  
  const logout = async () => {
    try {
      // Clear auth state
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
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
  
  return (
    <AuthContext.Provider value={{ user, profile, isAuthenticated: !!user, isLoading, roles, login, register, logout, googleLogin, isBuyer: roles.includes('buyer'), isGuest: roles.includes('guest') }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
