import { BackupData, BackupMetadata } from '../types/backup';
import { Transaction } from '../types/transaction';
import { Budget } from '../types/budget';
import { Wallet } from '../types/wallet';
import { ExpenseCategory } from '../types/expense-category';
import { getStorage, setStorage } from 'zmp-sdk';

const BACKUP_PREFIX = 'backup_';
const BACKUP_METADATA_KEY = 'backup_metadata';

// Generate unique ID for backup
function generateBackupId(): string {
  return `${BACKUP_PREFIX}${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

// Get device ID (simple implementation)
function getDeviceId(): string {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
}

// Create a backup
export async function createBackup(
  transactions: Transaction[],
  budgets: Budget[],
  wallets: Wallet[],
  categories: ExpenseCategory[]
): Promise<BackupMetadata> {
  const backupData: BackupData = {
    transactions,
    budgets,
    wallets,
    categories,
    version: '1.0.0',
    timestamp: Date.now(),
  };

  const backupId = generateBackupId();
  const metadata: BackupMetadata = {
    id: backupId,
    timestamp: Date.now(),
    version: '1.0.0',
    size: JSON.stringify(backupData).length,
    deviceId: getDeviceId(),
  };

  try {
    // Save backup data
    await setStorage({
      data: {
        [backupId]: JSON.stringify(backupData),
      },
    });

    // Update backup metadata list
    const metadataList = await getBackupMetadataList();
    metadataList.push(metadata);
    await setStorage({
      data: {
        [BACKUP_METADATA_KEY]: JSON.stringify(metadataList),
      },
    });

    return metadata;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw error;
  }
}

// Get list of all backup metadata
export async function getBackupMetadataList(): Promise<BackupMetadata[]> {
  try {
    const stored = await getStorage({ keys: [BACKUP_METADATA_KEY] });
    if (stored[BACKUP_METADATA_KEY]) {
      return JSON.parse(stored[BACKUP_METADATA_KEY]);
    }
  } catch (error) {
    console.warn('Error loading backup metadata:', error);
  }
  return [];
}

// Restore from a backup
export async function restoreBackup(backupId: string): Promise<BackupData> {
  try {
    const stored = await getStorage({ keys: [backupId] });
    if (stored[backupId]) {
      return JSON.parse(stored[backupId]);
    }
    throw new Error('Backup not found');
  } catch (error) {
    console.error('Error restoring backup:', error);
    throw error;
  }
}

// Delete a backup
export async function deleteBackup(backupId: string): Promise<void> {
  try {
    // Note: ZMP SDK doesn't have a delete function, so we'll set it to null
    await setStorage({
      data: {
        [backupId]: null,
      },
    });

    // Remove from metadata list
    const metadataList = await getBackupMetadataList();
    const updatedList = metadataList.filter((m) => m.id !== backupId);
    await setStorage({
      data: {
        [BACKUP_METADATA_KEY]: JSON.stringify(updatedList),
      },
    });
  } catch (error) {
    console.error('Error deleting backup:', error);
    throw error;
  }
}

// Clean up old backups (keep only the latest N backups)
export async function cleanupOldBackups(maxBackups: number = 5): Promise<void> {
  try {
    const metadataList = await getBackupMetadataList();
    
    // Sort by timestamp (newest first)
    const sorted = [...metadataList].sort((a, b) => b.timestamp - a.timestamp);
    
    // Delete old backups
    const toDelete = sorted.slice(maxBackups);
    for (const metadata of toDelete) {
      await deleteBackup(metadata.id);
    }
  } catch (error) {
    console.error('Error cleaning up backups:', error);
    throw error;
  }
}

// Export backup as JSON file
export function exportBackupAsFile(backupData: BackupData, filename?: string): void {
  const jsonString = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `backup-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Import backup from JSON file
export async function importBackupFromFile(file: File): Promise<BackupData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        resolve(backupData);
      } catch (error) {
        reject(new Error('Invalid backup file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}
