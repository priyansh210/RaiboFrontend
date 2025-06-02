import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../services/ApiService';
import { STORAGE_KEYS } from '../api/config';
import { toast } from '@/hooks/use-toast';
import { User, UserProfile, UserRoles } from '../models/internal/User';
import { ExternalLoginResponse, ExternalRegisterResponse } from '../models/external/AuthModels';
import { AuthMapper } from '../mappers/AuthMapper';

// Auth context type
export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: string[];
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => Promise<void>;
  isBuyer: boolean;
  isSeller: boolean;
  isAdmin: boolean;
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
  isSeller: false,
  isAdmin: false,
  isGuest: true
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  
  // Get user roles helper
  const getUserRoles = (user: User) => {
    return user.roles || [];
  };
  
  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      try {
        const userJson = localStorage.getItem(STORAGE_KEYS.USER);
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        
        if (userJson && token) {
          try {
            const userData = JSON.parse(userJson) as User;
            setUser(userData);
            setRoles(getUserRoles(userData));
            setProfile(AuthMapper.mapUserToProfile(userData));
          } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          }
        }
        
        window.addEventListener('storage', (event) => {
          if (event.key === STORAGE_KEYS.USER) {
            if (event.newValue) {
              try {
                const userData = JSON.parse(event.newValue) as User;
                setUser(userData);
                setRoles(getUserRoles(userData));
                setProfile(AuthMapper.mapUserToProfile(userData));
              } catch (error) {
                console.error('Error parsing user data from storage event:', error);
              }
            } else {
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
    setIsLoading(true);
    console.log('AuthContext: Starting login process');
    
    try {
      const response = await apiService.login({ email, password }) as ExternalLoginResponse;
      console.log('AuthContext: Login response received:', response);
      
      if (!response) throw new Error('No response from server');
      
      if (response.access_token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.access_token);
        console.log('AuthContext: Token stored');
      }
      
      const userData = AuthMapper.mapExternalLoginToUser(response);
      console.log('AuthContext: User data created:', userData);
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
      setUser(userData);
      setRoles(getUserRoles(userData));
      setProfile(AuthMapper.mapUserToProfile(userData));
      
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
  const register = async (firstName: string, lastName: string, email: string, phone?: string) => {
    setIsLoading(true);
    console.log('AuthContext: Starting registration process');
    
    try {
      const password = `TempPass${Math.floor(Math.random() * 1000)}!`;
      
      const response = await apiService.register({
        fullname: `${firstName} ${lastName}`,
        phone: phone || '',
        email,
        password
      }) as ExternalRegisterResponse;
      
      console.log('AuthContext: Registration response received:', response);
      
      if (!response) throw new Error('No response from server');
      
      if (response.access_token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.access_token);
        console.log('AuthContext: Token stored after registration');
      }
      
      const userData = AuthMapper.mapExternalRegisterToUser(response);
      userData.firstName = firstName;
      userData.lastName = lastName;
      userData.phone = phone;
      
      console.log('AuthContext: User data created after registration:', userData);
      
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
      setUser(userData);
      setRoles(getUserRoles(userData));
      setProfile(AuthMapper.mapUserToProfile(userData));
      
      toast({
        title: "Account created successfully",
        description: "You have been automatically logged in.",
      });
      
      console.log('AuthContext: Registration completed successfully');
      return;
    } catch (error: any) {
      console.error('AuthContext: Registration error:', error);
      throw new Error(error.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Google login function
  const googleLogin = async () => {
    try {
      throw new Error('Use GoogleAuthService for Google login');
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(error.message || 'Failed to login with Google');
    }
  };
  
  const logout = async () => {
    try {
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
  
  const isBuyer = roles.includes(UserRoles.BUYER);
  const isSeller = roles.includes(UserRoles.SELLER);
  const isAdmin = roles.includes(UserRoles.ADMIN);
  const isGuest = !user;
  
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
      isAdmin,
      isGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
