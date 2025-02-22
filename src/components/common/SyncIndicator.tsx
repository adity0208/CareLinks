import React from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { SyncStatus } from '../../types';

interface SyncIndicatorProps {
  status: SyncStatus;
  onSync: () => void;
}

export default function SyncIndicator({ status, onSync }: SyncIndicatorProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
        status.isOnline ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {status.isOnline ? (
          <Cloud className="w-4 h-4 mr-1" />
        ) : (
          <CloudOff className="w-4 h-4 mr-1" />
        )}
        <span>
          {status.isOnline ? 'Online' : 'Offline'}
          {status.lastSynced && ` • Last synced ${new Date(status.lastSynced).toLocaleTimeString()}`}
        </span>
      </div>
      {status.pendingChanges > 0 && (
        <button
          onClick={onSync}
          className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Sync ({status.pendingChanges})
        </button>
      )}
    </div>
  );
}