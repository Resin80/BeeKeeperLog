import { db } from './db';
import { createApiary, createHive, createInspection, deleteHive, deleteApiary, updateHive, updateApiary, createHarvest, createTreatment, createFeeding, updateInspection, deleteInspection } from './api';

export const syncOfflineData = async () => {
  const pendingItems = await db.syncQueue.where('status').equals('pending').toArray();
  
  if (pendingItems.length === 0) return;

  console.log(`Starting sync of ${pendingItems.length} items...`);

  for (const item of pendingItems) {
    try {
      if (item.type === 'apiary') {
        await createApiary(item.data);
      } else if (item.type === 'apiary-update') {
        await updateApiary(item.data.id, item.data);
      } else if (item.type === 'hive') {
        await createHive(item.data);
      } else if (item.type === 'hive-update') {
        await updateHive(item.data.id, item.data);
      } else if (item.type === 'inspection') {
        await createInspection(item.data);
      } else if (item.type === 'inspection-update') {
        await updateInspection(item.data.id, item.data);
      } else if (item.type === 'inspection-delete') {
        if (!item.data.id.startsWith('temp-')) {
          await deleteInspection(item.data.id);
        }
      } else if (item.type === 'harvest') {
        await createHarvest(item.data);
      } else if (item.type === 'treatment') {
        await createTreatment(item.data);
      } else if (item.type === 'feeding') {
        await createFeeding(item.data);
      } else if (item.type === 'hive-delete') {
        if (!item.data.id.startsWith('temp-')) {
          await deleteHive(item.data.id);
        }
      } else if (item.type === 'apiary-delete') {
        if (!item.data.id.startsWith('temp-')) {
          await deleteApiary(item.data.id);
        }
      }
      
      // Remove from queue on success
      await db.syncQueue.delete(item.id!);
      console.log(`Synced ${item.type} successfully`);
    } catch (err) {
      console.error(`Failed to sync ${item.type}:`, err);
      // Keep in queue to try again later
    }
  }
};

// Initialize sync listeners
export const initSyncService = () => {
  window.addEventListener('online', () => {
    console.log('App is online. Starting sync...');
    syncOfflineData();
  });

  // Also try to sync on startup if online
  if (navigator.onLine) {
    syncOfflineData();
  }
};
