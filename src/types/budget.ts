export interface Budget {
  id: string;
  type: "monthly" | "category";
  amount: number;
  categoryId?: string; // Only for category budgets
  month: number; // Month index (0-11)
  year: number;
  createdAt: number; // timestamp
}

export interface BudgetFormData {
  type: "monthly" | "category";
  amount: string;
  categoryId?: string;
  month: number;
  year: number;
}
