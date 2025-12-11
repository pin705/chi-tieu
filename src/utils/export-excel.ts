import * as XLSX from 'xlsx';
import { Transaction } from '../types/transaction';
import { Budget } from '../types/budget';
import { ExpenseCategory } from '../types/expense-category';
import { Wallet } from '../types/wallet';
import { ExportOptions } from '../types/export';
import {
  formatDate,
  formatCurrency,
  filterTransactions,
  getCategoryName,
  getWalletName,
  calculateSummary,
  generateFilename,
} from './export';

export function exportToExcel(
  transactions: Transaction[],
  categories: ExpenseCategory[],
  wallets: Wallet[],
  budgets?: Budget[],
  options?: ExportOptions
): void {
  const filtered = filterTransactions(transactions, options);

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Transactions
  const transactionData = filtered.map((t) => ({
    Ngày: formatDate(t.date),
    Loại: t.type === 'expense' ? 'Chi tiêu' : 'Thu nhập',
    'Danh mục': getCategoryName(t.categoryId, categories),
    Ví: getWalletName(t.walletId, wallets),
    'Số tiền': t.amount,
    'Ghi chú': t.note || '',
  }));

  const ws1 = XLSX.utils.json_to_sheet(transactionData);

  // Set column widths
  ws1['!cols'] = [
    { wch: 12 }, // Ngày
    { wch: 10 }, // Loại
    { wch: 15 }, // Danh mục
    { wch: 15 }, // Ví
    { wch: 15 }, // Số tiền
    { wch: 30 }, // Ghi chú
  ];

  XLSX.utils.book_append_sheet(wb, ws1, 'Giao dịch');

  // Sheet 2: Summary
  const summary = calculateSummary(filtered);
  const summaryData = [
    { 'Chỉ số': 'Tổng thu nhập', 'Giá trị': summary['Tổng thu nhập'] },
    { 'Chỉ số': 'Tổng chi tiêu', 'Giá trị': summary['Tổng chi tiêu'] },
    { 'Chỉ số': 'Chênh lệch', 'Giá trị': summary['Chênh lệch'] },
    { 'Chỉ số': 'Số giao dịch', 'Giá trị': summary['Số giao dịch'] },
  ];
  const ws2 = XLSX.utils.json_to_sheet(summaryData);
  ws2['!cols'] = [{ wch: 20 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Tổng quan');

  // Sheet 3: Budget (if provided)
  if (budgets && budgets.length > 0) {
    const budgetData = budgets.map((b) => {
      const categoryName = b.categoryId
        ? getCategoryName(b.categoryId, categories)
        : 'Tổng';
      
      // Calculate spent amount from transactions
      const spent = filtered
        .filter((t) => 
          t.type === 'expense' && 
          (!b.categoryId || t.categoryId === b.categoryId)
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const remaining = b.amount - spent;
      const percentage = Math.round((spent / b.amount) * 100);

      return {
        'Danh mục': categoryName,
        'Ngân sách': b.amount,
        'Đã chi': spent,
        'Còn lại': remaining,
        'Tỷ lệ': `${percentage}%`,
      };
    });

    const ws3 = XLSX.utils.json_to_sheet(budgetData);
    ws3['!cols'] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
    ];
    XLSX.utils.book_append_sheet(wb, ws3, 'Ngân sách');
  }

  // Write file
  const filename = generateFilename('chi-tieu', 'xlsx');
  XLSX.writeFile(wb, filename);
}
