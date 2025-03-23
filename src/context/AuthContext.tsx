
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('raibo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // For demo purposes, we'll just simulate a login
    // In a real app, this would make an API call to authenticate
    
    // Simulate API delay
    setIsLoading(true);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check for demo credentials (in real app, this would be server-side)
        if (email === 'user@example.com' && password === 'password') {
          const userData = {
            id: '1',
            name: 'Demo User',
            email: 'user@example.com',
          };
          
          setUser(userData);
          localStorage.setItem('raibo_user', JSON.stringify(userData));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    // For demo purposes, we'll just simulate a registration
    // In a real app, this would make an API call to create a new account
    
    // Simulate API delay
    setIsLoading(true);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // In a real app, we would check if the email is already taken
        const userData = {
          id: '1',
          name,
          email,
        };
        
        setUser(userData);
        localStorage.setItem('raibo_user', JSON.stringify(userData));
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('raibo_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
