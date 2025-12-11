import { Transaction } from '../types/transaction';
import { ExpenseCategory } from '../types/expense-category';

// Keywords for automatic categorization
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'food': ['ăn', 'quán', 'nhà hàng', 'cà phê', 'cafe', 'phở', 'cơm', 'bún', 'bánh', 'trà', 'sữa', 'food', 'restaurant', 'coffee'],
  'transport': ['xe', 'grab', 'taxi', 'xăng', 'đỗ xe', 'gửi xe', 'vé', 'bus', 'metro', 'transport', 'parking'],
  'shopping': ['mua', 'siêu thị', 'chợ', 'quần áo', 'giày', 'shopping', 'mall', 'thời trang', 'fashion'],
  'entertainment': ['phim', 'game', 'karaoke', 'du lịch', 'vui chơi', 'giải trí', 'cinema', 'movie', 'concert'],
  'bills': ['điện', 'nước', 'internet', 'điện thoại', 'hóa đơn', 'bill', 'tiền nhà', 'rent'],
  'health': ['bệnh viện', 'thuốc', 'khám', 'phòng khám', 'health', 'hospital', 'medicine', 'doctor'],
  'education': ['học', 'sách', 'khóa học', 'course', 'education', 'school', 'university'],
};

// Category ID mapping (based on default categories)
const CATEGORY_ID_MAP: Record<string, string> = {
  'food': '1', // Ăn uống
  'transport': '2', // Di chuyển
  'shopping': '3', // Mua sắm
  'entertainment': '4', // Giải trí
  'bills': '5', // Hóa đơn
  'health': '6', // Sức khỏe
  'education': '7', // Giáo dục
};

/**
 * Automatically suggest category based on transaction note
 */
export function suggestCategory(
  note: string,
  categories: ExpenseCategory[]
): ExpenseCategory | null {
  if (!note || note.trim().length === 0) {
    return null;
  }

  const normalizedNote = note.toLowerCase().trim();

  // Try to match keywords
  for (const [key, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalizedNote.includes(keyword)) {
        const categoryId = CATEGORY_ID_MAP[key];
        const category = categories.find(c => c.id === categoryId && c.type === 'expense');
        if (category) {
          return category;
        }
      }
    }
  }

  return null;
}

/**
 * Learn from user's transaction history to improve suggestions
 */
export function learnFromHistory(
  transactions: Transaction[],
  categories: ExpenseCategory[]
): Map<string, string> {
  const patterns = new Map<string, string>();

  // Analyze transaction notes and their categories
  transactions.forEach(transaction => {
    if (!transaction.note || transaction.note.trim().length === 0) {
      return;
    }

    const words = transaction.note.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 2) { // Skip very short words
        patterns.set(word, transaction.categoryId);
      }
    });
  });

  return patterns;
}

/**
 * Suggest category based on learned patterns
 */
export function suggestCategoryWithLearning(
  note: string,
  patterns: Map<string, string>,
  categories: ExpenseCategory[]
): ExpenseCategory | null {
  if (!note || note.trim().length === 0) {
    return null;
  }

  const normalizedNote = note.toLowerCase().trim();
  const words = normalizedNote.split(/\s+/);

  // Count matches for each category
  const categoryMatches = new Map<string, number>();

  words.forEach(word => {
    if (patterns.has(word)) {
      const categoryId = patterns.get(word)!;
      categoryMatches.set(categoryId, (categoryMatches.get(categoryId) || 0) + 1);
    }
  });

  // Find category with most matches
  let bestCategoryId: string | null = null;
  let maxMatches = 0;

  categoryMatches.forEach((count, categoryId) => {
    if (count > maxMatches) {
      maxMatches = count;
      bestCategoryId = categoryId;
    }
  });

  if (bestCategoryId) {
    return categories.find(c => c.id === bestCategoryId) || null;
  }

  // Fallback to keyword matching
  return suggestCategory(note, categories);
}

// Constants for thresholds
const UNUSUAL_SPENDING_THRESHOLD = 2; // standard deviations
const SPENDING_TREND_THRESHOLD = 0.1; // 10% threshold

/**
 * Detect unusual transactions (spending much higher than average)
 */
export function detectUnusualTransactions(
  transactions: Transaction[],
  categoryId?: string
): Transaction[] {
  let filtered = transactions.filter(t => t.type === 'expense');
  
  if (categoryId) {
    filtered = filtered.filter(t => t.categoryId === categoryId);
  }

  if (filtered.length < 5) {
    return []; // Not enough data
  }

  // Calculate average and standard deviation
  const amounts = filtered.map(t => t.amount);
  const average = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;
  
  const variance = amounts.reduce((sum, a) => sum + Math.pow(a - average, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);

  // Find transactions that are more than threshold standard deviations above average
  const threshold = average + (UNUSUAL_SPENDING_THRESHOLD * stdDev);
  
  return filtered.filter(t => t.amount > threshold);
}

/**
 * Calculate spending trend (increasing, decreasing, stable)
 */
export function calculateSpendingTrend(
  transactions: Transaction[],
  months: number = 3
): 'increasing' | 'decreasing' | 'stable' {
  const now = new Date();
  const monthlySpending: number[] = [];

  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.getMonth();
    const year = d.getFullYear();

    const monthTransactions = transactions.filter(t => {
      if (t.type !== 'expense') return false;
      const date = new Date(t.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });

    const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    monthlySpending.push(total);
  }

  if (monthlySpending.length < 2) {
    return 'stable';
  }

  // Calculate trend using linear regression slope
  const n = monthlySpending.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = monthlySpending.reduce((sum, y) => sum + y, 0);
  const sumXY = monthlySpending.reduce((sum, y, i) => sum + (i * y), 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  // Determine trend based on slope
  const threshold = monthlySpending[0] * SPENDING_TREND_THRESHOLD;
  
  if (slope > threshold) {
    return 'increasing';
  } else if (slope < -threshold) {
    return 'decreasing';
  }
  
  return 'stable';
}

/**
 * Generate spending insights
 */
export function generateInsights(
  transactions: Transaction[],
  categories: ExpenseCategory[]
): string[] {
  const insights: string[] = [];

  // Check for unusual transactions
  const unusual = detectUnusualTransactions(transactions);
  if (unusual.length > 0) {
    insights.push(`Bạn có ${unusual.length} giao dịch chi tiêu cao bất thường trong tháng này.`);
  }

  // Check spending trend
  const trend = calculateSpendingTrend(transactions);
  if (trend === 'increasing') {
    insights.push('Chi tiêu của bạn đang có xu hướng tăng trong 3 tháng gần đây.');
  } else if (trend === 'decreasing') {
    insights.push('Tuyệt vời! Chi tiêu của bạn đang giảm dần trong 3 tháng gần đây.');
  }

  // Check if user is spending on weekends more
  const now = new Date();
  const thisMonth = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear() && t.type === 'expense';
  });

  const weekendSpending = thisMonth.filter(t => {
    const day = new Date(t.date).getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  }).reduce((sum, t) => sum + t.amount, 0);

  const totalSpending = thisMonth.reduce((sum, t) => sum + t.amount, 0);
  
  if (weekendSpending > totalSpending * 0.4) {
    insights.push('Hơn 40% chi tiêu của bạn diễn ra vào cuối tuần.');
  }

  return insights;
}
