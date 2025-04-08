
/**
 * Mock API Client
 * This replaces the Supabase client with a frontend-only implementation
 */

import { mockUsers } from './mockData';
import { STORAGE_KEYS } from './config';
import { AuthUser } from './types';

// Authentication types
interface Session {
  user: AuthUser | null;
  access_token: string;
  refresh_token: string;
}

interface AuthChangeCallback {
  (event: 'SIGNED_IN' | 'SIGNED_OUT', session: Session | null): void;
}

// Auth module
const auth = {
  // Current session management
  getSession: () => {
    const sessionStr = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    return { data: { session } };
  },
  
  // Sign in with email/password
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { data: { session: null, user: null }, error: { message: 'Invalid credentials' } };
    }
    
    // Create a mock session
    const session = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles
      },
      access_token: `mock-token-${Date.now()}`,
      refresh_token: `mock-refresh-${Date.now()}`
    };
    
    // Store session in localStorage
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(session.user));
    
    // Trigger auth change event
    authChangeCallbacks.forEach(callback => callback('SIGNED_IN', session));
    
    return { data: { session, user: session.user }, error: null };
  },
  
  // Sign up with email/password
  signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return { data: { session: null, user: null }, error: { message: 'User already exists' } };
    }
    
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      firstName: options?.data?.first_name || '',
      lastName: options?.data?.last_name || '',
      roles: [options?.data?.role || 'buyer']
    };
    
    // Add to mock users (in a real app, this would persist to a database)
    mockUsers.push(newUser);
    
    // Create a mock session
    const session = {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        roles: newUser.roles
      },
      access_token: `mock-token-${Date.now()}`,
      refresh_token: `mock-refresh-${Date.now()}`
    };
    
    // Store session in localStorage
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(session.user));
    
    // Trigger auth change event
    authChangeCallbacks.forEach(callback => callback('SIGNED_IN', session));
    
    return { data: { session, user: session.user }, error: null };
  },
  
  // Sign out
  signOut: async () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    
    // Trigger auth change event
    authChangeCallbacks.forEach(callback => callback('SIGNED_OUT', null));
    
    return { error: null };
  },
  
  // Auth state change subscription
  onAuthStateChange: (callback: AuthChangeCallback) => {
    authChangeCallbacks.push(callback);
    
    // Return a subscription object with an unsubscribe method
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = authChangeCallbacks.indexOf(callback);
            if (index > -1) {
              authChangeCallbacks.splice(index, 1);
            }
          }
        }
      }
    };
  }
};

// Storage for auth change callbacks
const authChangeCallbacks: AuthChangeCallback[] = [];

// Mock database module for data operations
const from = (table: string) => {
  return {
    select: () => {
      return {
        eq: (field: string, value: any) => {
          // Implement mock database queries here
          return { data: [], error: null };
        },
        single: () => {
          return { data: null, error: null };
        }
      };
    },
    insert: (data: any) => {
      return {
        select: () => {
          return {
            single: () => {
              return { data: { id: `${table}-${Date.now()}`, ...data }, error: null };
            }
          };
        }
      };
    },
    update: (data: any) => {
      return {
        eq: (field: string, value: any) => {
          return { data: null, error: null };
        }
      };
    },
    delete: () => {
      return {
        eq: (field: string, value: any) => {
          return { data: null, error: null };
        }
      };
    }
  };
};

// Mock storage module
const storage = {
  from: (bucket: string) => ({
    upload: async (path: string, file: File) => {
      console.log(`Mock uploading ${file.name} to ${bucket}/${path}`);
      return { data: { path }, error: null };
    },
    getPublicUrl: (path: string) => {
      return { data: { publicUrl: `https://mock-storage.example.com/${bucket}/${path}` } };
    }
  })
};

// Export the mock API client
export const mockApiClient = {
  auth,
  from,
  storage
};
