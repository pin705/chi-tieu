import { Transaction } from './transaction';
import { Budget } from './budget';
import { Wallet } from './wallet';
import { ExpenseCategory } from './expense-category';

export interface BackupMetadata {
  id: string;
  timestamp: number;
  version: string;
  size: number;
  deviceId: string;
}

export interface BackupData {
  transactions: Transaction[];
  budgets: Budget[];
  wallets: Wallet[];
  categories: ExpenseCategory[];
  version: string;
  timestamp: number;
}

export interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  lastBackup?: number;
  maxBackups: number;
}
