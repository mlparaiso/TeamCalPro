declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export interface GoogleAuthConfig {
  clientId: string;
  apiKey: string;
  discoveryDoc: string;
  scopes: string;
}

class GoogleAuthService {
  private isInitialized = false;
  private isSignedIn = false;
  private config: GoogleAuthConfig | null = null;

  async init(config: GoogleAuthConfig) {
    this.config = config;
    
    // Load Google API script
    if (!window.gapi) {
      await this.loadGoogleAPI();
    }

    // Initialize gapi
    await new Promise<void>((resolve) => {
      window.gapi.load('auth2', resolve);
    });

    await window.gapi.auth2.init({
      client_id: config.clientId,
    });

    // Load Google Sheets API
    await window.gapi.client.init({
      apiKey: config.apiKey,
      clientId: config.clientId,
      discoveryDocs: [config.discoveryDoc],
      scope: config.scopes
    });

    this.isInitialized = true;
    this.isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  async signIn(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Google Auth not initialized');
    }

    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signIn();
    this.isSignedIn = true;
  }

  async signOut(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Google Auth not initialized');
    }

    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signOut();
    this.isSignedIn = false;
  }

  isUserSignedIn(): boolean {
    return this.isSignedIn && window.gapi?.auth2?.getAuthInstance()?.isSignedIn.get();
  }

  getCurrentUser() {
    if (!this.isUserSignedIn()) return null;
    return window.gapi.auth2.getAuthInstance().currentUser.get();
  }

  getUserProfile() {
    const user = this.getCurrentUser();
    if (!user) return null;
    
    const profile = user.getBasicProfile();
    return {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl()
    };
  }

  async getSpreadsheetData(spreadsheetId: string, range: string = 'Schedule!A:D') {
    if (!this.isUserSignedIn()) {
      throw new Error('User not signed in');
    }

    const response = await window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.result;
  }
}

export const googleAuthService = new GoogleAuthService();

export const GOOGLE_CONFIG: GoogleAuthConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
  discoveryDoc: 'https://sheets.googleapis.com/$discovery/rest?version=v4',
  scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly'
};