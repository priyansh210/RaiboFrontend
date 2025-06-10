import { API_BASE_URL, API_ENDPOINTS } from '../api/config';
import { apiService } from './ApiService';

declare global {
  interface Window {
    google: any;
  }
}

export class GoogleAuthService {
  private static CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;
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
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GoogleAuthService.CLIENT_ID,
        scope: 'profile email',
        callback: async (response: any) => {
          if (response.error) {
            reject(new Error(response.error));
            return;
          }

          try {
            // Send access token to backend
            const authResult = await this.handleGoogleToken(response.access_token);
            resolve({ access_token: authResult.access_token, user: authResult.user });
          } catch (error) {
            reject(error);
          }
        },
      });

      client.requestAccessToken();
    });
  }

  private async handleGoogleToken(googleAccessToken: string): Promise<any> {
    const data = await apiService.googleLogin(googleAccessToken);
    
    if (!data) {
      throw new Error('Failed to authenticate with backend');
    }
    return data;
  }
}

export const googleAuthService = GoogleAuthService.getInstance();