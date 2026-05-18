import { db } from './db';

const API_BASE_URL = '/api';

export const isOnline = () => navigator.onLine;

export const fetchApiaries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/apiaries`);
    if (!response.ok) throw new Error('Failed to fetch apiaries');
    const data = await response.json();
    
    // Cache locally
    await db.apiaries.clear();
    await db.apiaries.bulkAdd(data);
    
    return data;
  } catch (err) {
    if (!isOnline()) {
      console.log('Offline: loading apiaries from local DB');
      return await db.apiaries.toArray();
    }
    throw err;
  }
};

export const createApiary = async (data: any) => {
  if (!isOnline()) {
    await db.syncQueue.add({
      type: 'apiary',
      data,
      status: 'pending',
      timestamp: Date.now()
    });
    return { id: 'temp-' + Date.now(), ...data, _pending: true };
  }

  const response = await fetch(`${API_BASE_URL}/apiaries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create apiary');
  return response.json();
};

export const updateApiary = async (id: string, data: any) => {
  if (!isOnline() || id.startsWith('temp-')) {
    await db.syncQueue.add({
      type: 'apiary-update',
      data: { id, ...data },
      status: 'pending',
      timestamp: Date.now()
    });
    return { id, ...data, _pending: true };
  }

  const response = await fetch(`${API_BASE_URL}/apiaries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update apiary');
  return response.json();
};

export const fetchHives = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/hives`);
    if (!response.ok) throw new Error('Failed to fetch hives');
    const data = await response.json();
    
    // Cache locally
    await db.hives.clear();
    await db.hives.bulkAdd(data);
    
    return data;
  } catch (err) {
    if (!isOnline()) {
      console.log('Offline: loading hives from local DB');
      return await db.hives.toArray();
    }
    throw err;
  }
};

export const fetchHiveById = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/hives/${id}`);
    if (!response.ok) throw new Error('Failed to fetch hive');
    return response.json();
  } catch (err) {
    if (!isOnline()) {
      return await db.hives.get(id);
    }
    throw err;
  }
};

export const createHive = async (data: any) => {
  if (!isOnline()) {
    await db.syncQueue.add({
      type: 'hive',
      data,
      status: 'pending',
      timestamp: Date.now()
    });
    return { id: 'temp-' + Date.now(), ...data, _pending: true };
  }

  const response = await fetch(`${API_BASE_URL}/hives`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create hive');
  return response.json();
};

export const updateHive = async (id: string, data: any) => {
  if (!isOnline() || id.startsWith('temp-')) {
    await db.syncQueue.add({
      type: 'hive-update',
      data: { id, ...data },
      status: 'pending',
      timestamp: Date.now()
    });
    return { id, ...data, _pending: true };
  }

  const response = await fetch(`${API_BASE_URL}/hives/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update hive');
  return response.json();
};

export const createInspection = async (data: any) => {
  if (!isOnline()) {
    await db.syncQueue.add({
      type: 'inspection',
      data,
      status: 'pending',
      timestamp: Date.now()
    });
    return { id: 'temp-' + Date.now(), ...data, _pending: true };
  }

  const response = await fetch(`${API_BASE_URL}/inspections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create inspection');
  return response.json();
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to upload image');
  return response.json();
};

export const fetchInspectionById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/inspections/${id}`);
  if (!response.ok) throw new Error('Failed to fetch inspection');
  return response.json();
};

export const updateInspection = async (id: string, data: any) => {
  if (!isOnline() || id.startsWith('temp-')) {
    await db.syncQueue.add({
      type: 'inspection-update',
      data: { id, ...data },
      status: 'pending',
      timestamp: Date.now()
    });
    return { id, ...data, _pending: true };
  }

  const response = await fetch(`${API_BASE_URL}/inspections/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update inspection');
  return response.json();
};

export const deleteInspection = async (id: string) => {
  if (!isOnline() || id.startsWith('temp-')) {
    await db.syncQueue.add({
      type: 'inspection-delete',
      data: { id },
      status: 'pending',
      timestamp: Date.now()
    });
    return true;
  }

  const response = await fetch(`${API_BASE_URL}/inspections/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete inspection');
  return true;
};

export const createHarvest = async (data: any) => {
  if (!isOnline()) {
    await db.syncQueue.add({
      type: 'harvest',
      data,
      status: 'pending',
      timestamp: Date.now()
    });
    return { id: 'temp-' + Date.now(), ...data, _pending: true };
  }

  const response = await fetch(`${API_BASE_URL}/harvests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create harvest');
  return response.json();
};

export const createTreatment = async (data: any) => {
  if (!isOnline()) {
    await db.syncQueue.add({
      type: 'treatment',
      data,
      status: 'pending',
      timestamp: Date.now()
    });
    return { id: 'temp-' + Date.now(), ...data, _pending: true };
  }

  const response = await fetch(`${API_BASE_URL}/treatments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create treatment');
  return response.json();
};

export const createFeeding = async (data: any) => {
  if (!isOnline()) {
    await db.syncQueue.add({
      type: 'feeding',
      data,
      status: 'pending',
      timestamp: Date.now()
    });
    return { id: 'temp-' + Date.now(), ...data, _pending: true };
  }

  const response = await fetch(`${API_BASE_URL}/feedings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create feeding');
  return response.json();
};

export const deleteHive = async (id: string) => {
  if (!isOnline() || id.startsWith('temp-')) {
    await db.syncQueue.add({
      type: 'hive-delete',
      data: { id },
      status: 'pending',
      timestamp: Date.now()
    });
    // Optimistically remove from local cache if it exists
    await db.hives.delete(id);
    return true;
  }

  const response = await fetch(`${API_BASE_URL}/hives/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete hive');
  }
  return true;
};

export const deleteApiary = async (id: string) => {
  if (!isOnline() || id.startsWith('temp-')) {
    await db.syncQueue.add({
      type: 'apiary-delete',
      data: { id },
      status: 'pending',
      timestamp: Date.now()
    });
    // Optimistically remove from local cache
    await db.apiaries.delete(id);
    return true;
  }

  const response = await fetch(`${API_BASE_URL}/apiaries/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete apiary');
  }
  return true;
};
