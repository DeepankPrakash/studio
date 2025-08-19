// Types for user history
export interface UserHistoryEntry {
  id: string;
  timestamp: number;
  action: 'login' | 'profile_update' | 'workout_generated' | 'diet_generated' | 'supplement_generated' | 'form_filled' | 'preferences_updated' | 'plan_saved' | 'plan_viewed';
  data: {
    // User info
    email?: string;
    age?: number;
    height?: number;
    weight?: number;
    gender?: 'male' | 'female' | 'other';
    
    // Goals & Activity  
    goals?: 'cut' | 'bulk' | 'maintain';
    goal?: 'cut' | 'bulk' | 'maintain'; // Alternative naming
    activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
    
    // Workout Preferences
    workoutDays?: number;
    workoutTime?: number;
    equipment?: string;
    workoutPreference?: 'strength' | 'cardio' | 'mixed';
    
    // Diet & Health
    foodPreferences?: string;
    injuries?: string;
    previousPlan?: string;
    dietPreference?: 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
    restrictions?: string[];
    
    // Plans generated
    planType?: 'workout' | 'diet' | 'supplement';
    planContent?: any;
    
    // General action data
    action?: string;
    category?: string;
    details?: any;
    
    // Context
    userAgent?: string;
    sessionId?: string;
  };
  sessionId: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr';
  units: 'metric' | 'imperial';
  notifications: boolean;
  autoSave: boolean;
  rememberFormData: boolean;
}

export interface UserSession {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  actionsCount: number;
  device: string;
}

// Storage keys for localStorage
const STORAGE_KEYS = {
  HISTORY: 'fitmate_user_history',
  PREFERENCES: 'fitmate_user_preferences',
  SESSION: 'fitmate_session',
  LAST_FORM_DATA: 'fitmate_last_form'
};

// Generate unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get device info
const getDeviceInfo = (): string => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Mobile')) return 'Mobile';
  if (userAgent.includes('Tablet')) return 'Tablet';
  return 'Desktop';
};

// Class for managing user history
export class UserHistoryManager {
  private static instance: UserHistoryManager;
  private currentSession: UserSession | null = null;
  private maxHistoryEntries = 1000;
  private maxStorageSize = 5 * 1024 * 1024; // 5MB

  // Safe localStorage access helper
  private safeLocalStorage = {
    getItem: (key: string): string | null => {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return null;
      }
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Error writing to localStorage:', error);
      }
    }
  };

  static getInstance(): UserHistoryManager {
    if (!UserHistoryManager.instance) {
      UserHistoryManager.instance = new UserHistoryManager();
    }
    return UserHistoryManager.instance;
  }

  private constructor() {
    // Only initialize if we're in the browser
    if (typeof window !== 'undefined') {
      this.initializeSession();
      this.setupBeforeUnload();
    }
  }

  // Initialize or resume session
  private initializeSession(): void {
    try {
      // Guard against server-side rendering
      if (typeof window === 'undefined') {
        return;
      }

      const savedSession = this.safeLocalStorage.getItem(STORAGE_KEYS.SESSION);
      const now = Date.now();
      
      if (savedSession) {
        const session = JSON.parse(savedSession) as UserSession;
        // Resume session if it's less than 24 hours old
        if (now - session.lastActivity < 24 * 60 * 60 * 1000) {
          this.currentSession = {
            ...session,
            lastActivity: now
          };
        }
      }

      if (!this.currentSession) {
        this.currentSession = {
          sessionId: generateSessionId(),
          startTime: now,
          lastActivity: now,
          actionsCount: 0,
          device: getDeviceInfo()
        };
      }

      this.saveSession();
    } catch (error) {
      console.error('Error initializing session:', error);
      // Create new session on error
      this.currentSession = {
        sessionId: generateSessionId(),
        startTime: Date.now(),
        lastActivity: Date.now(),
        actionsCount: 0,
        device: getDeviceInfo()
      };
    }
  }

  // Save current session to localStorage
  private saveSession(): void {
    if (typeof window === 'undefined' || !this.currentSession) {
      return;
    }
    
    this.safeLocalStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(this.currentSession));
  }

  // Setup before unload to save session
  private setupBeforeUnload(): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    window.addEventListener('beforeunload', () => {
      this.saveSession();
    });

    // Update last activity periodically
    setInterval(() => {
      if (this.currentSession) {
        this.currentSession.lastActivity = Date.now();
        this.saveSession();
      }
    }, 60000); // Every minute
  }

  // Generate unique ID for entries
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add new history entry
  addHistoryEntry(
    action: UserHistoryEntry['action'],
    data: UserHistoryEntry['data']
  ): void {
    if (!this.currentSession) return;

    try {
    const entry: UserHistoryEntry = {
      id: this.generateId(),
      timestamp: Date.now(),
      action,
      data: {
        ...data,
        userAgent: navigator.userAgent
      },
      sessionId: this.currentSession?.sessionId || ''
    };      // Get existing history
      const history = this.getHistory();
      
      // Add new entry at the beginning
      history.unshift(entry);

      // Limit history size
      if (history.length > this.maxHistoryEntries) {
        history.splice(this.maxHistoryEntries);
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

      // Update session
      this.currentSession.actionsCount++;
      this.currentSession.lastActivity = Date.now();
      this.saveSession();

      // Trigger custom event
      window.dispatchEvent(new CustomEvent('userHistoryUpdated', { 
        detail: { entry, totalEntries: history.length }
      }));

    } catch (error) {
      console.error('Error adding history entry:', error);
      // Try to free up space if storage is full
      if (error instanceof DOMException && error.code === 22) {
        this.cleanupOldEntries();
      }
    }
  }

  // Get user history
  getHistory(limit?: number): UserHistoryEntry[] {
    try {
      const historyJson = this.safeLocalStorage.getItem(STORAGE_KEYS.HISTORY);
      const history = historyJson ? JSON.parse(historyJson) as UserHistoryEntry[] : [];
      
      return limit ? history.slice(0, limit) : history;
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  // Get history by action type
  getHistoryByAction(action: UserHistoryEntry['action'], limit?: number): UserHistoryEntry[] {
    const history = this.getHistory();
    const filtered = history.filter(entry => entry.action === action);
    return limit ? filtered.slice(0, limit) : filtered;
  }

  // Get recent form data for auto-fill (user-specific)
  getLastFormData(userEmail?: string): Partial<UserHistoryEntry['data']> {
    try {
      if (!userEmail) return {};
      
      const userFormKey = `${STORAGE_KEYS.LAST_FORM_DATA}_${userEmail}`;
      const lastFormJson = this.safeLocalStorage.getItem(userFormKey);
      
      if (lastFormJson) {
        return JSON.parse(lastFormJson);
      }
      
      // Fallback: look for the most recent form_filled entry for this user
      const history = this.getHistory();
      const lastFormEntry = history.find(entry => 
        entry.action === 'form_filled' && 
        entry.data.email === userEmail
      );
      
      return lastFormEntry ? lastFormEntry.data : {};
    } catch (error) {
      console.error('Error getting last form data:', error);
      return {};
    }
  }

  // Save form data for auto-fill (user-specific)
  saveLastFormData(data: Partial<UserHistoryEntry['data']>, userEmail?: string): void {
    try {
      const preferences = this.getPreferences();
      if (!preferences.rememberFormData || !userEmail) return;
      
      const userFormKey = `${STORAGE_KEYS.LAST_FORM_DATA}_${userEmail}`;
      
      // Get existing data to merge
      const existingData = this.getLastFormData(userEmail);
      const mergedData = { ...existingData, ...data, email: userEmail };
      
      this.safeLocalStorage.setItem(userFormKey, JSON.stringify(mergedData));
      
      // Also save to history for backup
      this.addHistoryEntry('form_filled', mergedData);
    } catch (error) {
      console.error('Error saving last form data:', error);
    }
  }

  // Get user preferences
  getPreferences(): UserPreferences {
    try {
      const prefsJson = this.safeLocalStorage.getItem(STORAGE_KEYS.PREFERENCES);
      const defaultPrefs: UserPreferences = {
        theme: 'dark',
        language: 'en',
        units: 'metric',
        notifications: true,
        autoSave: true,
        rememberFormData: true
      };
      
      return prefsJson ? { ...defaultPrefs, ...JSON.parse(prefsJson) } : defaultPrefs;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return {
        theme: 'dark',
        language: 'en',
        units: 'metric',
        notifications: true,
        autoSave: true,
        rememberFormData: true
      };
    }
  }

  // Save user preferences
  savePreferences(preferences: Partial<UserPreferences>): void {
    try {
      const currentPrefs = this.getPreferences();
      const updatedPrefs = { ...currentPrefs, ...preferences };
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updatedPrefs));
      
      this.addHistoryEntry('preferences_updated', { details: updatedPrefs as any });
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  // Get user statistics
  getUserStats() {
    try {
      const history = this.getHistory();
      const now = Date.now();
      
      const stats = {
        totalActions: history.length,
        sessionsCount: new Set(history.map(h => h.sessionId)).size,
        lastActivity: history.length > 0 ? history[0].timestamp : 0,
        actionsToday: history.filter(h => now - h.timestamp < 24 * 60 * 60 * 1000).length,
        actionsThisWeek: history.filter(h => now - h.timestamp < 7 * 24 * 60 * 60 * 1000).length,
        mostCommonAction: this.getMostCommonAction(history),
        averageSessionLength: this.getAverageSessionLength(history),
        deviceBreakdown: this.getDeviceBreakdown(history)
      };

      return stats;
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalActions: 0,
        sessionsCount: 0,
        lastActivity: 0,
        actionsToday: 0,
        actionsThisWeek: 0,
        mostCommonAction: 'none',
        averageSessionLength: 0,
        deviceBreakdown: {}
      };
    }
  }

  private getMostCommonAction(history: UserHistoryEntry[]): string {
    try {
      if (history.length === 0) return 'none';
      
      const actionCounts: { [key: string]: number } = {};
      history.forEach(entry => {
        actionCounts[entry.action] = (actionCounts[entry.action] || 0) + 1;
      });
      
      const keys = Object.keys(actionCounts);
      return keys.length > 0 ? keys.reduce((a, b) => 
        actionCounts[a] > actionCounts[b] ? a : b
      ) : 'none';
    } catch (error) {
      console.error('Error getting most common action:', error);
      return 'none';
    }
  }

  private getAverageSessionLength(history: UserHistoryEntry[]): number {
    try {
      if (history.length === 0) return 0;
      
      const sessions: { [key: string]: { start: number; end: number } } = {};
      
      history.forEach(entry => {
        if (!sessions[entry.sessionId]) {
          sessions[entry.sessionId] = { start: entry.timestamp, end: entry.timestamp };
        } else {
          sessions[entry.sessionId].start = Math.min(sessions[entry.sessionId].start, entry.timestamp);
          sessions[entry.sessionId].end = Math.max(sessions[entry.sessionId].end, entry.timestamp);
        }
      });

      const lengths = Object.values(sessions).map(s => s.end - s.start);
      return lengths.length > 0 ? lengths.reduce((sum, len) => sum + len, 0) / lengths.length : 0;
    } catch (error) {
      console.error('Error getting average session length:', error);
      return 0;
    }
  }

  private getDeviceBreakdown(history: UserHistoryEntry[]): { [key: string]: number } {
    const devices: { [key: string]: number } = {};
    const sessions = new Set<string>();
    
    history.forEach(entry => {
      if (!sessions.has(entry.sessionId)) {
        sessions.add(entry.sessionId);
        const device = entry.data.userAgent?.includes('Mobile') ? 'Mobile' :
                     entry.data.userAgent?.includes('Tablet') ? 'Tablet' : 'Desktop';
        devices[device] = (devices[device] || 0) + 1;
      }
    });

    return devices;
  }

  // Clean up old entries to free space
  cleanupOldEntries(): void {
    try {
      const history = this.getHistory();
      const cutoffTime = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days ago
      
      const recentHistory = history.filter(entry => entry.timestamp > cutoffTime);
      
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(recentHistory));
      
      console.log(`Cleaned up ${history.length - recentHistory.length} old history entries`);
    } catch (error) {
      console.error('Error cleaning up old entries:', error);
    }
  }

  // Clear all history
  clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.LAST_FORM_DATA);
      
      window.dispatchEvent(new CustomEvent('userHistoryCleared'));
      
      this.addHistoryEntry('profile_update', { action: 'history_cleared' });
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  // Clear all user data
  clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Reset session
      this.currentSession = null;
      this.initializeSession();
      
      window.dispatchEvent(new CustomEvent('userDataCleared'));
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }

  // Export history for backup
  exportHistory(): string {
    const data = {
      history: this.getHistory(),
      preferences: this.getPreferences(),
      session: this.currentSession,
      stats: this.getUserStats(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  // Import history from backup
  importHistory(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.history && Array.isArray(data.history)) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data.history));
      }
      
      if (data.preferences) {
        localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(data.preferences));
      }
      
      window.dispatchEvent(new CustomEvent('userHistoryImported'));
      
      return true;
    } catch (error) {
      console.error('Error importing history:', error);
      return false;
    }
  }

  // Get current session info
  getCurrentSession(): UserSession | null {
    return this.currentSession;
  }

  // Check if localStorage is available and has space
  checkStorageHealth(): { available: boolean; spaceUsed: number; entriesCount: number } {
    try {
      const testKey = 'test_storage';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      const history = this.getHistory();
      const spaceUsed = JSON.stringify(history).length;
      
      return {
        available: true,
        spaceUsed,
        entriesCount: history.length
      };
    } catch (error) {
      return {
        available: false,
        spaceUsed: 0,
        entriesCount: 0
      };
    }
  }
}

// Export singleton instance - only create when accessed on client side
let _userHistoryManager: UserHistoryManager | null = null;

export const userHistoryManager = {
  get instance(): UserHistoryManager {
    if (typeof window !== 'undefined' && !_userHistoryManager) {
      _userHistoryManager = UserHistoryManager.getInstance();
    }
    return _userHistoryManager || ({
      // Return safe fallback methods if running on server
      getHistory: () => [],
      getHistoryByAction: () => [],
      addHistoryEntry: () => {},
      clearHistory: () => {},
      getLastFormData: () => ({}),
      saveLastFormData: () => {},
      getPreferences: () => ({
        theme: 'dark' as const,
        language: 'en' as const,
        units: 'metric' as const,
        notifications: true,
        autoSave: true,
        rememberFormData: true
      }),
      savePreferences: () => {},
      getUserStats: () => ({
        totalActions: 0,
        sessionsCount: 0,
        lastActivity: 0,
        actionsToday: 0,
        actionsThisWeek: 0,
        mostCommonAction: 'none',
        averageSessionLength: 0,
        deviceBreakdown: {}
      }),
      getCurrentSession: () => null,
      exportHistory: () => '{}',
      importHistory: () => false,
      checkStorageHealth: () => ({ available: false, spaceUsed: 0, entriesCount: 0 }),
      cleanupOldEntries: () => {}
    } as unknown as UserHistoryManager);
  }
};
