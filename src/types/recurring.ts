import { Transaction } from './transaction';

export interface RecurringTransaction {
  id: string;
  template: Omit<Transaction, 'id' | 'date'>;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number; // every N days/weeks/months
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    startDate: number; // timestamp
    endDate?: number; // optional end date
  };
  lastCreated?: number;
  nextScheduled?: number;
  active: boolean;
  createdAt: number;
}
