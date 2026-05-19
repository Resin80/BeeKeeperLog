import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { RefreshCcw, CheckCircle } from 'lucide-react';

const SyncStatus: React.FC = () => {
  const [pendingCount, setPendingCount] = useState(0);

  const checkQueue = async () => {
    try {
      const count = await db.syncQueue.where('status').equals('pending').count();
      setPendingCount(count);
    } catch (err) {
      console.error('Failed to count sync queue:', err);
    }
  };

  useEffect(() => {
    // Initial check
    checkQueue();

    // Check every 5 seconds
    const interval = setInterval(checkQueue, 5000);

    // Also check when window comes back online
    window.addEventListener('online', checkQueue);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', checkQueue);
    };
  }, []);

  if (pendingCount === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '5px', 
        color: '#4CAF50', 
        fontSize: '0.8rem',
        fontWeight: 'bold',
        background: '#E8F5E9',
        padding: '4px 10px',
        borderRadius: '20px'
      }}>
        <CheckCircle size={14} />
        Synced
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '5px', 
      color: '#FFB900', 
      fontSize: '0.8rem',
      fontWeight: 'bold',
      background: '#FFFDE7',
      padding: '4px 10px',
      borderRadius: '20px'
    }}>
      <RefreshCcw size={14} className={pendingCount > 0 ? 'spin' : ''} />
      {pendingCount} Pending
    </div>
  );
};

export default SyncStatus;
