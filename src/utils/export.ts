import { Transaction } from '../types/transaction';
import { ExpenseCategory } from '../types/expense-category';
import { Wallet } from '../types/wallet';
import { ExportOptions } from '../types/export';

// Format date helper
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Generate filename with current date
export function generateFilename(prefix: string, extension: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${prefix}-${year}-${month}-${day}.${extension}`;
}

// Format currency helper
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

// Filter transactions based on options
export function filterTransactions(
  transactions: Transaction[],
  options?: ExportOptions
): Transaction[] {
  let filtered = [...transactions];

  if (options?.dateRange) {
    filtered = filtered.filter(
      (t) =>
        t.date >= options.dateRange!.start && t.date <= options.dateRange!.end
    );
  }

  if (options?.categories && options.categories.length > 0) {
    filtered = filtered.filter((t) => options.categories!.includes(t.categoryId));
  }

  if (options?.wallets && options.wallets.length > 0) {
    filtered = filtered.filter((t) => options.wallets!.includes(t.walletId));
  }

  return filtered.sort((a, b) => b.date - a.date);
}

// Get category name by ID
export function getCategoryName(
  categoryId: string,
  categories: ExpenseCategory[]
): string {
  const category = categories.find((c) => c.id === categoryId);
  return category?.name || 'Unknown';
}

// Get wallet name by ID
export function getWalletName(walletId: string, wallets: Wallet[]): string {
  const wallet = wallets.find((w) => w.id === walletId);
  return wallet?.name || 'Unknown';
}

// Export to CSV
export function exportToCSV(
  transactions: Transaction[],
  categories: ExpenseCategory[],
  wallets: Wallet[],
  options?: ExportOptions
): string {
  const filtered = filterTransactions(transactions, options);

  // CSV header with BOM for Excel UTF-8 support
  const headers = ['Ngày', 'Loại', 'Danh mục', 'Ví', 'Số tiền', 'Ghi chú'];

  // Convert to CSV rows
  const rows = filtered.map((t) => [
    formatDate(t.date),
    t.type === 'expense' ? 'Chi tiêu' : 'Thu nhập',
    getCategoryName(t.categoryId, categories),
    getWalletName(t.walletId, wallets),
    t.amount.toString(),
    `"${(t.note || '').replace(/"/g, '""')}"`, // Escape quotes
  ]);

  // Add summary row
  const totalIncome = filtered
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filtered
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  rows.push([]);
  rows.push(['Tổng thu nhập', '', '', '', totalIncome.toString(), '']);
  rows.push(['Tổng chi tiêu', '', '', '', totalExpense.toString(), '']);
  rows.push(['Chênh lệch', '', '', '', (totalIncome - totalExpense).toString(), '']);

  // Combine
  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join(
    '\n'
  );

  return csvContent;
}

// Download CSV file
export function downloadCSV(content: string, filename: string): void {
  // Add BOM for UTF-8 support in Excel
  const blob = new Blob(['\uFEFF' + content], {
    type: 'text/csv;charset=utf-8;',
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Calculate summary for export
export function calculateSummary(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    'Tổng thu nhập': income,
    'Tổng chi tiêu': expense,
    'Chênh lệch': income - expense,
    'Số giao dịch': transactions.length,
  };
}
