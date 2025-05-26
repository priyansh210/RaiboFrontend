
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

  public async signInWithGoogle(): Promise<{ name: string; email: string; picture?: string }> {
    if (!window.google) {
      throw new Error('Google Sign-In not initialized');
    }

    return new Promise((resolve, reject) => {
      window.googleAuthCallback = (response: any) => {
        try {
          // Decode the JWT token to get user info
          const payload = this.parseJwt(response.credential);
          resolve({
            name: payload.name,
            email: payload.email,
            picture: payload.picture
          });
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

  private parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  public static setClientId(clientId: string) {
    GoogleAuthService.CLIENT_ID = clientId;
  }
}

export const googleAuthService = GoogleAuthService.getInstance();
