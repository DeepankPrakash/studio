"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserHistoryEntry, 
  UserPreferences, 
  UserSession,
  userHistoryManager 
} from '@/lib/userHistory';

export interface UseUserHistoryReturn {
  // History operations
  addHistoryEntry: (action: UserHistoryEntry['action'], data: UserHistoryEntry['data']) => void;
  getHistory: (limit?: number) => UserHistoryEntry[];
  getHistoryByAction: (action: UserHistoryEntry['action'], limit?: number) => UserHistoryEntry[];
  clearHistory: () => void;
  
  // Form data persistence
  getLastFormData: () => Partial<UserHistoryEntry['data']>;
  saveLastFormData: (data: Partial<UserHistoryEntry['data']>) => void;
  
  // Preferences
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  
  // Session info
  currentSession: UserSession | null;
  
  // Statistics
  userStats: any;
  
  // Import/Export
  exportHistory: () => string;
  importHistory: (data: string) => boolean;
  
  // Storage health
  storageHealth: { available: boolean; spaceUsed: number; entriesCount: number };
  
  // State
  loading: boolean;
  error: string | null;
}

export const useUserHistory = (): UseUserHistoryReturn => {
  const { user } = useAuth();
  
  const [preferences, setPreferences] = useState<UserPreferences>(() => 
    userHistoryManager.instance.getPreferences()
  );
  const [currentSession, setCurrentSession] = useState<UserSession | null>(() => 
    userHistoryManager.instance.getCurrentSession()
  );
  const [userStats, setUserStats] = useState(() => 
    userHistoryManager.instance.getUserStats()
  );
  const [storageHealth, setStorageHealth] = useState(() => 
    userHistoryManager.instance.checkStorageHealth()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update stats when history changes
  const updateStats = useCallback(() => {
    setUserStats(userHistoryManager.instance.getUserStats());
    setStorageHealth(userHistoryManager.instance.checkStorageHealth());
  }, []);

  // Listen to history updates
  useEffect(() => {
    const handleHistoryUpdate = () => updateStats();
    const handleHistoryCleared = () => updateStats();
    
    window.addEventListener('userHistoryUpdated', handleHistoryUpdate);
    window.addEventListener('userHistoryCleared', handleHistoryCleared);
    
    return () => {
      window.removeEventListener('userHistoryUpdated', handleHistoryUpdate);
      window.removeEventListener('userHistoryCleared', handleHistoryCleared);
    };
  }, [updateStats]);

  // Track user login
  useEffect(() => {
    if (user?.email) {
      userHistoryManager.instance.addHistoryEntry('login', {
        email: user.email
      });
    }
  }, [user]);

  const addHistoryEntry = useCallback((action: UserHistoryEntry['action'], data: UserHistoryEntry['data']) => {
    userHistoryManager.instance.addHistoryEntry(action, data);
    updateStats();
  }, [updateStats]);

  const getHistory = useCallback((limit?: number) => {
    return userHistoryManager.instance.getHistory(limit);
  }, []);

  const getHistoryByAction = useCallback((action: UserHistoryEntry['action'], limit?: number) => {
    return userHistoryManager.instance.getHistoryByAction(action, limit);
  }, []);

  const clearHistory = useCallback(() => {
    userHistoryManager.instance.clearHistory();
    updateStats();
  }, [updateStats]);

  const getLastFormData = useCallback(() => {
    return userHistoryManager.instance.getLastFormData(user?.email || undefined);
  }, [user?.email]);

  const saveLastFormData = useCallback((data: Partial<UserHistoryEntry['data']>) => {
    userHistoryManager.instance.saveLastFormData(data, user?.email || undefined);
  }, [user?.email]);

  const updatePreferences = useCallback((prefs: Partial<UserPreferences>) => {
    userHistoryManager.instance.savePreferences(prefs);
    setPreferences(userHistoryManager.instance.getPreferences());
  }, []);

  const exportHistory = useCallback(() => {
    return userHistoryManager.instance.exportHistory();
  }, []);

  const importHistory = useCallback((data: string) => {
    const success = userHistoryManager.instance.importHistory(data);
    if (success) {
      setPreferences(userHistoryManager.instance.getPreferences());
      updateStats();
    }
    return success;
  }, [updateStats]);

  return {
    // History operations
    addHistoryEntry,
    getHistory,
    getHistoryByAction,
    clearHistory,
    
    // Form data persistence
    getLastFormData,
    saveLastFormData,
    
    // Preferences
    preferences,
    updatePreferences,
    
    // Session info
    currentSession,
    
    // Statistics
    userStats,
    
    // Import/Export
    exportHistory,
    importHistory,
    
    // Storage health
    storageHealth,
    
    // State
    loading,
    error
  };
};
