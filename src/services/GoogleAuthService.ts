
import { API_BASE_URL, API_ENDPOINTS } from '../api/config';

declare global {
  interface Window {
    google: any;
    googleAuthCallback: (response: any) => void;
  }
}

export class GoogleAuthService {
  private static CLIENT_ID = ''; // This should be set from environment or config
  private static instance: GoogleAuthService;
  
  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  public async initializeGoogleAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Sign-In script'));
      
      document.head.appendChild(script);
    });
  }

  public async signInWithGoogle(): Promise<{ access_token: string; user: any }> {
    if (!window.google) {
      throw new Error('Google Sign-In not initialized');
    }

    return new Promise((resolve, reject) => {
      window.googleAuthCallback = async (response: any) => {
        try {
          // Send the credential to the backend
          const backendResponse = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              credential: response.credential
            })
          });

          if (!backendResponse.ok) {
            throw new Error('Failed to authenticate with backend');
          }

          const authData = await backendResponse.json();
          resolve(authData);
        } catch (error) {
          reject(error);
        }
      };

      window.google.accounts.id.initialize({
        client_id: GoogleAuthService.CLIENT_ID,
        callback: window.googleAuthCallback,
      });

      window.google.accounts.id.prompt();
    });
  }

  public static setClientId(clientId: string) {
    GoogleAuthService.CLIENT_ID = clientId;
  }
}

export const googleAuthService = GoogleAuthService.getInstance();
