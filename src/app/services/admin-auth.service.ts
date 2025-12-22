import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  // Use sessionStorage instead of localStorage for better security
  private readonly ADMIN_SESSION_KEY = 'admin_session';
  private readonly ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  constructor(private router: Router) {}

  // Check if storage is available
  private isStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('Storage is not available:', e);
      return false;
    }
  }

  // Login method
  login(username: string, password: string): boolean {
    console.log('Login attempt:', username);
    
    // Validate credentials
    if (username === this.ADMIN_CREDENTIALS.username && 
        password === this.ADMIN_CREDENTIALS.password) {
      
      // Create session data
      const sessionData = {
        isAuthenticated: true,
        username: username,
        timestamp: new Date().getTime(),
        sessionId: this.generateSessionId()
      };
      
      // Store session
      if (this.isStorageAvailable()) {
        sessionStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(sessionData));
        console.log('Session stored:', sessionData);
      } else {
        console.warn('Storage not available, using in-memory session');
        // Fallback to in-memory storage
        (window as any).adminSession = sessionData;
      }
      
      return true;
    }
    
    console.log('Invalid credentials');
    return false;
  }

  // Generate random session ID
  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }

  // Check if admin is logged in
  isLoggedIn(): boolean {
    // Try to get session data
    let sessionData: any = null;
    
    if (this.isStorageAvailable()) {
      const data = sessionStorage.getItem(this.ADMIN_SESSION_KEY);
      if (data) {
        try {
          sessionData = JSON.parse(data);
        } catch (error) {
          console.error('Error parsing session data:', error);
        }
      }
    } else {
      // Fallback to in-memory session
      sessionData = (window as any).adminSession;
    }

    // Check if session exists and is valid
    if (!sessionData || !sessionData.isAuthenticated) {
      return false;
    }

    // Check session expiration (1 hour)
    const currentTime = new Date().getTime();
    const sessionAge = currentTime - sessionData.timestamp;
    const maxSessionAge = 60 * 60 * 1000; // 1 hour in milliseconds

    if (sessionAge > maxSessionAge) {
      console.log('Session expired');
      this.logout();
      return false;
    }

    return true;
  }

  // Logout method
  logout(): void {
    console.log('Logging out admin');
    
    if (this.isStorageAvailable()) {
      sessionStorage.removeItem(this.ADMIN_SESSION_KEY);
    }
    
    // Clear in-memory session
    (window as any).adminSession = null;
    
    this.router.navigate(['/admin/login']);
  }

  // Get current admin username
  getAdminUsername(): string {
    let sessionData: any = null;
    
    if (this.isStorageAvailable()) {
      const data = sessionStorage.getItem(this.ADMIN_SESSION_KEY);
      if (data) {
        try {
          sessionData = JSON.parse(data);
        } catch (error) {
          return '';
        }
      }
    } else {
      sessionData = (window as any).adminSession;
    }
    
    return sessionData?.username || '';
  }

  // Clear all auth data
  clearAuth(): void {
    if (this.isStorageAvailable()) {
      sessionStorage.removeItem(this.ADMIN_SESSION_KEY);
    }
    (window as any).adminSession = null;
  }
}