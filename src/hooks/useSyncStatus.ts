import { useState, useCallback } from 'react';
import { SyncStatus } from '../types';

interface SyncError {
  message: string;
  code: string;
}

export function useSyncStatus(initialStatus: SyncStatus) {
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<SyncError | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const sync = useCallback(async () => {
    setIsSyncing(true);
    setError(null);

    try {
      // Simulate sync delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update sync status
      setStatus(prev => ({
        ...prev,
        lastSynced: new Date().toISOString(),
        pendingChanges: 0
      }));
    } catch (err) {
      setError({
        message: 'Failed to sync data. Please try again.',
        code: 'SYNC_ERROR'
      });
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const setOffline = useCallback(() => {
    setStatus(prev => ({
      ...prev,
      isOnline: false
    }));
  }, []);

  const setOnline = useCallback(() => {
    setStatus(prev => ({
      ...prev,
      isOnline: true
    }));
  }, []);

  return {
    status,
    error,
    isSyncing,
    sync,
    setOffline,
    setOnline
  };
}