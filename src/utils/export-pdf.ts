import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '../types/transaction';
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

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

export function exportToPDF(
  transactions: Transaction[],
  categories: ExpenseCategory[],
  wallets: Wallet[],
  options?: ExportOptions
): void {
  const filtered = filterTransactions(transactions, options);
  
  // Create PDF document
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text('Báo cáo Chi Tiêu', 105, 15, { align: 'center' });

  // Date range
  doc.setFontSize(12);
  if (options?.dateRange) {
    const dateText = `${formatDate(options.dateRange.start)} - ${formatDate(options.dateRange.end)}`;
    doc.text(dateText, 105, 25, { align: 'center' });
  } else {
    doc.text(formatDate(Date.now()), 105, 25, { align: 'center' });
  }

  // Summary section
  const summary = calculateSummary(filtered);
  doc.setFontSize(14);
  doc.text('Tổng quan', 14, 35);

  autoTable(doc, {
    startY: 40,
    head: [['Chỉ số', 'Giá trị']],
    body: [
      ['Tổng thu nhập', formatCurrency(summary['Tổng thu nhập'])],
      ['Tổng chi tiêu', formatCurrency(summary['Tổng chi tiêu'])],
      ['Chênh lệch', formatCurrency(summary['Chênh lệch'])],
      ['Số giao dịch', summary['Số giao dịch'].toString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Transactions table
  const finalY = doc.lastAutoTable.finalY || 40;
  doc.setFontSize(14);
  doc.text('Chi tiết giao dịch', 14, finalY + 10);

  // Prepare transaction data
  const transactionRows = filtered.map((t) => [
    formatDate(t.date),
    t.type === 'expense' ? 'Chi' : 'Thu',
    getCategoryName(t.categoryId, categories),
    formatCurrency(t.amount),
    (t.note || '').substring(0, 30),
  ]);

  autoTable(doc, {
    startY: finalY + 15,
    head: [['Ngày', 'Loại', 'Danh mục', 'Số tiền', 'Ghi chú']],
    body: transactionRows,
    theme: 'striped',
    headStyles: { fillColor: [52, 152, 219] },
    columnStyles: {
      3: { halign: 'right' },
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
  });

  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Trang ${i} / ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save
  const filename = generateFilename('bao-cao', 'pdf');
  doc.save(filename);
}
