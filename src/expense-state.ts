import { atom, selector, selectorFamily } from "recoil";
import { getUserInfo } from "zmp-sdk";
import {
  ExpenseCategory,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "types/expense-category";
import { Wallet, DEFAULT_WALLETS } from "types/wallet";
import { Transaction } from "types/transaction";
import { Budget } from "types/budget";
import { getStorage, setStorage } from "zmp-sdk";

// User state
export const userState = selector({
  key: "user",
  get: async () => {
    const { userInfo } = await getUserInfo({ autoRequestPermission: true });
    return userInfo;
  },
});

// Categories state
const loadCategories = async (): Promise<ExpenseCategory[]> => {
  try {
    const stored = await getStorage({ keys: ["categories"] });
    if (stored.categories) {
      return JSON.parse(stored.categories);
    }
  } catch (error) {
    console.warn("Error loading categories:", error);
  }
  return [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];
};

const saveCategories = async (categories: ExpenseCategory[]) => {
  try {
    await setStorage({
      data: { categories: JSON.stringify(categories) },
    });
  } catch (error) {
    console.error("Error saving categories:", error);
  }
};

export const categoriesState = atom<ExpenseCategory[]>({
  key: "categories",
  default: loadCategories(),
  effects: [
    ({ onSet }) => {
      onSet((newCategories) => {
        saveCategories(newCategories);
      });
    },
  ],
});

export const expenseCategoriesState = selector<ExpenseCategory[]>({
  key: "expenseCategories",
  get: ({ get }) => {
    const categories = get(categoriesState);
    return categories.filter((c) => c.type === "expense");
  },
});

export const incomeCategoriesState = selector<ExpenseCategory[]>({
  key: "incomeCategories",
  get: ({ get }) => {
    const categories = get(categoriesState);
    return categories.filter((c) => c.type === "income");
  },
});

// Wallets state
const loadWallets = async (): Promise<Wallet[]> => {
  try {
    const stored = await getStorage({ keys: ["wallets"] });
    if (stored.wallets) {
      return JSON.parse(stored.wallets);
    }
  } catch (error) {
    console.warn("Error loading wallets:", error);
  }
  return DEFAULT_WALLETS;
};

const saveWallets = async (wallets: Wallet[]) => {
  try {
    await setStorage({
      data: { wallets: JSON.stringify(wallets) },
    });
  } catch (error) {
    console.error("Error saving wallets:", error);
  }
};

export const walletsState = atom<Wallet[]>({
  key: "wallets",
  default: loadWallets(),
  effects: [
    ({ onSet }) => {
      onSet((newWallets) => {
        saveWallets(newWallets);
      });
    },
  ],
});

export const totalBalanceState = selector({
  key: "totalBalance",
  get: ({ get }) => {
    const wallets = get(walletsState);
    return wallets.reduce((total, wallet) => total + wallet.balance, 0);
  },
});

// Transactions state
const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const stored = await getStorage({ keys: ["transactions"] });
    if (stored.transactions) {
      return JSON.parse(stored.transactions);
    }
  } catch (error) {
    console.warn("Error loading transactions:", error);
  }
  return [];
};

const saveTransactions = async (transactions: Transaction[]) => {
  try {
    await setStorage({
      data: { transactions: JSON.stringify(transactions) },
    });
  } catch (error) {
    console.error("Error saving transactions:", error);
  }
};

export const transactionsState = atom<Transaction[]>({
  key: "transactions",
  default: loadTransactions(),
  effects: [
    ({ onSet }) => {
      onSet((newTransactions) => {
        saveTransactions(newTransactions);
      });
    },
  ],
});

// Sorted transactions (newest first)
export const sortedTransactionsState = selector<Transaction[]>({
  key: "sortedTransactions",
  get: ({ get }) => {
    const transactions = get(transactionsState);
    return [...transactions].sort((a, b) => b.date - a.date);
  },
});

// Get transactions for current month
export const currentMonthTransactionsState = selector<Transaction[]>({
  key: "currentMonthTransactions",
  get: ({ get }) => {
    const transactions = get(sortedTransactionsState);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
  },
});

// Statistics for current month
export const monthlyStatsState = selector({
  key: "monthlyStats",
  get: ({ get }) => {
    const transactions = get(currentMonthTransactionsState);
    
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expense,
      balance: income - expense,
      total: income + expense,
    };
  },
});

// Transactions by category (for pie chart)
export const transactionsByCategoryState = selectorFamily<
  { categoryId: string; amount: number; percentage: number }[],
  "income" | "expense"
>({
  key: "transactionsByCategory",
  get:
    (type) =>
    ({ get }) => {
      const transactions = get(currentMonthTransactionsState);
      const filtered = transactions.filter((t) => t.type === type);
      
      const total = filtered.reduce((sum, t) => sum + t.amount, 0);
      
      if (total === 0) return [];
      
      const byCategory = filtered.reduce((acc, t) => {
        if (!acc[t.categoryId]) {
          acc[t.categoryId] = 0;
        }
        acc[t.categoryId] += t.amount;
        return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(byCategory)
        .map(([categoryId, amount]) => ({
          categoryId,
          amount,
          percentage: (amount / total) * 100,
        }))
        .sort((a, b) => b.amount - a.amount);
    },
});

// Selected transaction type for forms
export const selectedTransactionTypeState = atom<"income" | "expense">({
  key: "selectedTransactionType",
  default: "expense",
});

// Budgets state
const loadBudgets = async (): Promise<Budget[]> => {
  try {
    const stored = await getStorage({ keys: ["budgets"] });
    if (stored.budgets) {
      return JSON.parse(stored.budgets);
    }
  } catch (error) {
    console.warn("Error loading budgets:", error);
  }
  return [];
};

const saveBudgets = async (budgets: Budget[]) => {
  try {
    await setStorage({
      data: { budgets: JSON.stringify(budgets) },
    });
  } catch (error) {
    console.error("Error saving budgets:", error);
  }
};

export const budgetsState = atom<Budget[]>({
  key: "budgets",
  default: loadBudgets(),
  effects: [
    ({ onSet }) => {
      onSet((newBudgets) => {
        saveBudgets(newBudgets);
      });
    },
  ],
});

// Get budget for current month
export const currentMonthBudgetState = selector<Budget | undefined>({
  key: "currentMonthBudget",
  get: ({ get }) => {
    const budgets = get(budgetsState);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return budgets.find(
      (b) => b.type === "monthly" && b.month === currentMonth && b.year === currentYear
    );
  },
});

// Get category budgets for current month
export const currentMonthCategoryBudgetsState = selector<Budget[]>({
  key: "currentMonthCategoryBudgets",
  get: ({ get }) => {
    const budgets = get(budgetsState);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return budgets.filter(
      (b) => b.type === "category" && b.month === currentMonth && b.year === currentYear
    );
  },
});

// Get budget status (spending vs budget)
export const budgetStatusState = selector({
  key: "budgetStatus",
  get: ({ get }) => {
    const monthlyBudget = get(currentMonthBudgetState);
    const stats = get(monthlyStatsState);
    
    if (!monthlyBudget) {
      return {
        hasBudget: false,
        budget: 0,
        spent: stats.expense,
        remaining: 0,
        percentage: 0,
        isExceeded: false,
      };
    }

    const remaining = monthlyBudget.amount - stats.expense;
    const percentage = (stats.expense / monthlyBudget.amount) * 100;

    return {
      hasBudget: true,
      budget: monthlyBudget.amount,
      spent: stats.expense,
      remaining,
      percentage,
      isExceeded: stats.expense > monthlyBudget.amount,
    };
  },
});

// Get category budget status
export const categoryBudgetStatusState = selectorFamily<
  {
    hasBudget: boolean;
    budget: number;
    spent: number;
    remaining: number;
    percentage: number;
    isExceeded: boolean;
  },
  string
>({
  key: "categoryBudgetStatus",
  get:
    (categoryId) =>
    ({ get }) => {
      const categoryBudgets = get(currentMonthCategoryBudgetsState);
      const categoryBudget = categoryBudgets.find((b) => b.categoryId === categoryId);
      const categoryStats = get(transactionsByCategoryState("expense"));
      const categoryStat = categoryStats.find((s) => s.categoryId === categoryId);
      const spent = categoryStat?.amount || 0;

      if (!categoryBudget) {
        return {
          hasBudget: false,
          budget: 0,
          spent,
          remaining: 0,
          percentage: 0,
          isExceeded: false,
        };
      }

      const remaining = categoryBudget.amount - spent;
      const percentage = (spent / categoryBudget.amount) * 100;

      return {
        hasBudget: true,
        budget: categoryBudget.amount,
        spent,
        remaining,
        percentage,
        isExceeded: spent > categoryBudget.amount,
      };
    },
});

// Get transactions for last N months (for trend analysis)
export const lastMonthsTransactionsState = selectorFamily<
  { month: number; year: number; transactions: Transaction[] }[],
  number
>({
  key: "lastMonthsTransactions",
  get:
    (months) =>
    ({ get }) => {
      const transactions = get(sortedTransactionsState);
      const now = new Date();
      const result: { month: number; year: number; transactions: Transaction[] }[] = [];

      for (let i = 0; i < months; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = d.getMonth();
        const year = d.getFullYear();

        const monthTransactions = transactions.filter((t) => {
          const date = new Date(t.date);
          return date.getMonth() === month && date.getFullYear() === year;
        });

        result.push({ month, year, transactions: monthTransactions });
      }

      return result.reverse();
    },
});

// Monthly trend data (income and expense for last N months)
export const monthlyTrendState = selectorFamily<
  { month: number; year: number; income: number; expense: number }[],
  number
>({
  key: "monthlyTrend",
  get:
    (months) =>
    ({ get }) => {
      const monthsData = get(lastMonthsTransactionsState(months));

      return monthsData.map(({ month, year, transactions }) => {
        const income = transactions
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);

        const expense = transactions
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);

        return { month, year, income, expense };
      });
    },
});

// Weekly trend for current month
export const weeklyTrendState = selector<
  { week: number; income: number; expense: number }[]
>({
  key: "weeklyTrend",
  get: ({ get }) => {
    const transactions = get(currentMonthTransactionsState);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get first day of month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const weeks: { week: number; income: number; expense: number }[] = [];

    // Calculate number of weeks in month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const numWeeks = Math.ceil((lastDay.getDate() + firstDay.getDay()) / 7);

    for (let week = 0; week < numWeeks; week++) {
      const weekStart = new Date(currentYear, currentMonth, week * 7 - firstDay.getDay() + 1);
      const weekEnd = new Date(currentYear, currentMonth, (week + 1) * 7 - firstDay.getDay());

      const weekTransactions = transactions.filter((t) => {
        const date = new Date(t.date);
        return date >= weekStart && date <= weekEnd;
      });

      const income = weekTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = weekTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      weeks.push({ week: week + 1, income, expense });
    }

    return weeks;
  },
});
