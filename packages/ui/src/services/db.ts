import Dexie, { type Table } from 'dexie';

export interface Apiary {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface Hive {
  id: string;
  name: string;
  type: string;
  installDate: string;
  latitude?: number;
  longitude?: number;
  honeySupers: number;
  queenColor?: string;
  status: string;
  apiaryId: string;
}

export interface SyncItem {
  id?: number;
  type: 'inspection' | 'hive' | 'apiary' | 'hive-delete' | 'apiary-delete' | 'hive-update' | 'apiary-update' | 'harvest' | 'treatment' | 'feeding' | 'inspection-update' | 'inspection-delete';
  data: any;
  status: 'pending' | 'synced' | 'error';
  timestamp: number;
}

export class BeeKeeperDB extends Dexie {
  apiaries!: Table<Apiary>;
  hives!: Table<Hive>;
  syncQueue!: Table<SyncItem>;
  feedings!: Table<any>;

  constructor() {
    super('BeeKeeperLogDB');
    this.version(1).stores({
      apiaries: 'id, name',
      hives: 'id, name, apiaryId',
      syncQueue: '++id, type, status',
      feedings: '++id, hiveId, date'
    });
  }
}

export const db = new BeeKeeperDB();
