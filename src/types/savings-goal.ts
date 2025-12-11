export interface SavingsGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: number; // timestamp
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  contributions: SavingsContribution[];
}

export interface SavingsContribution {
  id: string;
  goalId: string;
  amount: number;
  date: number;
  note?: string;
}
