# Technical Specification - Phase 5: Export & Backup

## 1. Export Data Feature

### 1.1 Overview
Enable users to export their financial data in multiple formats (CSV, Excel, PDF) for backup, analysis, or sharing purposes.

### 1.2 Technical Architecture

```typescript
// src/types/export.ts
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  dateRange?: {
    start: number;
    end: number;
  };
  categories?: string[];
  wallets?: string[];
  includeCharts?: boolean; // For PDF only
}

export interface ExportResult {
  success: boolean;
  data?: Blob | string;
  filename: string;
  error?: string;
}
```

### 1.3 CSV Export Implementation

```typescript
// src/utils/export.ts
import { Transaction } from '../types/transaction';

export function exportToCSV(
  transactions: Transaction[],
  options?: ExportOptions
): string {
  // Filter transactions based on options
  const filtered = filterTransactions(transactions, options);
  
  // CSV header
  const headers = [
    'Ngày',
    'Loại',
    'Danh mục',
    'Ví',
    'Số tiền',
    'Ghi chú'
  ];
  
  // Convert to CSV rows
  const rows = filtered.map(t => [
    formatDate(t.date),
    t.type === 'expense' ? 'Chi tiêu' : 'Thu nhập',
    t.category.name,
    t.wallet.name,
    t.amount.toString(),
    `"${t.note || ''}"` // Escape quotes
  ]);
  
  // Combine
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob(['\uFEFF' + content], { 
    type: 'text/csv;charset=utf-8;' 
  });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
```

### 1.4 Excel Export Implementation

```typescript
// src/utils/export-excel.ts
import * as XLSX from 'xlsx';
import { Transaction } from '../types/transaction';
import { Budget } from '../types/budget';

export function exportToExcel(
  transactions: Transaction[],
  budgets?: Budget[],
  options?: ExportOptions
): void {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Sheet 1: Transactions
  const transactionData = transactions.map(t => ({
    'Ngày': formatDate(t.date),
    'Loại': t.type === 'expense' ? 'Chi tiêu' : 'Thu nhập',
    'Danh mục': t.category.name,
    'Ví': t.wallet.name,
    'Số tiền': t.amount,
    'Ghi chú': t.note || ''
  }));
  
  const ws1 = XLSX.utils.json_to_sheet(transactionData);
  
  // Format currency column
  const range = XLSX.utils.decode_range(ws1['!ref'] || 'A1');
  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: 4 }); // Column E (amount)
    if (ws1[cellAddress]) {
      ws1[cellAddress].z = '#,##0';
    }
  }
  
  XLSX.utils.book_append_sheet(wb, ws1, 'Giao dịch');
  
  // Sheet 2: Summary
  const summary = calculateSummary(transactions);
  const ws2 = XLSX.utils.json_to_sheet([summary]);
  XLSX.utils.book_append_sheet(wb, ws2, 'Tổng quan');
  
  // Sheet 3: Budget (if provided)
  if (budgets && budgets.length > 0) {
    const budgetData = budgets.map(b => ({
      'Danh mục': b.categoryId || 'Tổng',
      'Ngân sách': b.amount,
      'Đã chi': b.spent || 0,
      'Còn lại': b.amount - (b.spent || 0),
      'Tỷ lệ': `${Math.round((b.spent || 0) / b.amount * 100)}%`
    }));
    
    const ws3 = XLSX.utils.json_to_sheet(budgetData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Ngân sách');
  }
  
  // Write file
  const filename = `chi-tieu-${formatDate(Date.now())}.xlsx`;
  XLSX.writeFile(wb, filename);
}

function calculateSummary(transactions: Transaction[]) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    'Tổng thu nhập': income,
    'Tổng chi tiêu': expense,
    'Chênh lệch': income - expense,
    'Số giao dịch': transactions.length
  };
}
```

### 1.5 PDF Export Implementation

```typescript
// src/utils/export-pdf.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Transaction } from '../types/transaction';

export function exportToPDF(
  transactions: Transaction[],
  options?: ExportOptions
): void {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Báo cáo Chi Tiêu', 105, 15, { align: 'center' });
  
  // Date range
  doc.setFontSize(12);
  if (options?.dateRange) {
    const dateText = `${formatDate(options.dateRange.start)} - ${formatDate(options.dateRange.end)}`;
    doc.text(dateText, 105, 25, { align: 'center' });
  }
  
  // Summary section
  const summary = calculateSummary(transactions);
  doc.setFontSize(14);
  doc.text('Tổng quan', 14, 35);
  
  doc.autoTable({
    startY: 40,
    head: [['Chỉ số', 'Giá trị']],
    body: [
      ['Tổng thu nhập', formatCurrency(summary['Tổng thu nhập'])],
      ['Tổng chi tiêu', formatCurrency(summary['Tổng chi tiêu'])],
      ['Chênh lệch', formatCurrency(summary['Chênh lệch'])],
      ['Số giao dịch', summary['Số giao dịch'].toString()]
    ],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  // Transactions table
  doc.text('Chi tiết giao dịch', 14, doc.lastAutoTable.finalY + 10);
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 15,
    head: [['Ngày', 'Loại', 'Danh mục', 'Số tiền', 'Ghi chú']],
    body: transactions.map(t => [
      formatDate(t.date),
      t.type === 'expense' ? 'Chi' : 'Thu',
      t.category.name,
      formatCurrency(t.amount),
      (t.note || '').substring(0, 30)
    ]),
    theme: 'striped',
    headStyles: { fillColor: [52, 152, 219] },
    columnStyles: {
      3: { halign: 'right' }
    }
  });
  
  // Save
  const filename = `bao-cao-${formatDate(Date.now())}.pdf`;
  doc.save(filename);
}
```

### 1.6 Zalo Share Integration

```typescript
// src/utils/zalo-share.ts
import { openShareSheet } from 'zmp-sdk';

export async function shareFile(
  file: Blob,
  filename: string
): Promise<void> {
  try {
    // Convert Blob to Base64
    const base64 = await blobToBase64(file);
    
    // Share via Zalo
    await openShareSheet({
      type: 'file',
      data: {
        fileBase64: base64,
        fileName: filename
      }
    });
  } catch (error) {
    console.error('Share error:', error);
    throw error;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]); // Remove data:...;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
```

### 1.7 UI Component

```typescript
// src/pages/settings/export.tsx
import React, { useState } from 'react';
import { Page, Button, Select, DatePicker } from 'zmp-ui';
import { useRecoilValue } from 'recoil';
import { transactionsState } from '../../expense-state';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/export';
import { shareFile } from '../../utils/zalo-share';

const ExportPage: React.FC = () => {
  const transactions = useRecoilValue(transactionsState);
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState<[number, number]>([
    Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    Date.now()
  ]);
  
  const handleExport = async () => {
    const options = {
      format,
      dateRange: {
        start: dateRange[0],
        end: dateRange[1]
      }
    };
    
    try {
      switch (format) {
        case 'csv':
          const csvContent = exportToCSV(transactions, options);
          downloadCSV(csvContent, `chi-tieu-${Date.now()}.csv`);
          break;
        case 'excel':
          exportToExcel(transactions, undefined, options);
          break;
        case 'pdf':
          exportToPDF(transactions, options);
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      // Show error toast
    }
  };
  
  const handleShare = async () => {
    // Generate file and share
    const csvContent = exportToCSV(transactions);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    await shareFile(blob, `chi-tieu-${Date.now()}.csv`);
  };
  
  return (
    <Page className="page">
      <div className="section-container">
        <h2>Xuất dữ liệu</h2>
        
        <div className="mb-4">
          <label>Định dạng</label>
          <Select
            value={format}
            onChange={(value) => setFormat(value as any)}
          >
            <option value="csv">CSV</option>
            <option value="excel">Excel (.xlsx)</option>
            <option value="pdf">PDF</option>
          </Select>
        </div>
        
        <div className="mb-4">
          <label>Khoảng thời gian</label>
          {/* DatePicker component */}
        </div>
        
        <Button
          fullWidth
          onClick={handleExport}
        >
          Xuất dữ liệu
        </Button>
        
        <Button
          fullWidth
          variant="secondary"
          onClick={handleShare}
          className="mt-2"
        >
          Chia sẻ qua Zalo
        </Button>
      </div>
    </Page>
  );
};

export default ExportPage;
```

---

## 2. Dark Mode Feature

### 2.1 Theme Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Light mode
        primary: '#2196F3',
        background: '#FFFFFF',
        surface: '#F5F5F5',
        text: '#212121',
        textSecondary: '#757575',
        
        // Dark mode
        dark: {
          primary: '#42A5F5',
          background: '#121212',
          surface: '#1E1E1E',
          surfaceVariant: '#2C2C2C',
          text: '#FFFFFF',
          textSecondary: '#B0B0B0',
          border: '#333333',
        }
      }
    }
  },
  // ...
}
```

### 2.2 Theme State Management

```typescript
// src/contexts/theme-context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from 'zmp-sdk';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
  
  // Load saved theme
  useEffect(() => {
    storage.getStorage({
      keys: ['theme'],
      success: (data) => {
        const savedTheme = data.theme || 'light';
        setThemeState(savedTheme);
      }
    });
  }, []);
  
  // Apply theme
  useEffect(() => {
    let newEffectiveTheme: 'light' | 'dark' = 'light';
    
    if (theme === 'auto') {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      newEffectiveTheme = prefersDark ? 'dark' : 'light';
    } else {
      newEffectiveTheme = theme;
    }
    
    setEffectiveTheme(newEffectiveTheme);
    
    // Apply to DOM
    if (newEffectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    storage.setStorage({
      data: { theme: newTheme }
    });
  };
  
  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### 2.3 Theme Toggle Component

```typescript
// src/components/theme-toggle.tsx
import React from 'react';
import { Icon } from 'zmp-ui';
import { useTheme } from '../contexts/theme-context';

export const ThemeToggle: React.FC = () => {
  const { theme, effectiveTheme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(effectiveTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {effectiveTheme === 'light' ? (
        <Icon icon="zi-moon" size={24} />
      ) : (
        <Icon icon="zi-sun" size={24} />
      )}
    </button>
  );
};
```

### 2.4 Color Scheme

```css
/* Dark mode color palette */
:root.dark {
  /* Primary colors */
  --primary-color: #42A5F5;
  --primary-light: #64B5F6;
  --primary-dark: #1976D2;
  
  /* Background */
  --bg-primary: #121212;
  --bg-secondary: #1E1E1E;
  --bg-tertiary: #2C2C2C;
  
  /* Surface */
  --surface: #1E1E1E;
  --surface-variant: #2C2C2C;
  
  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: #B0B0B0;
  --text-disabled: #707070;
  
  /* Borders */
  --border-color: #333333;
  
  /* Status colors */
  --success: #4CAF50;
  --warning: #FFC107;
  --error: #F44336;
  --info: #2196F3;
}
```

---

## 3. Testing Plan

### 3.1 Unit Tests

```typescript
// __tests__/export.test.ts
import { exportToCSV } from '../utils/export';
import { Transaction } from '../types/transaction';

describe('exportToCSV', () => {
  it('should export transactions to CSV format', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        type: 'expense',
        amount: 50000,
        category: { id: '1', name: 'Ăn uống' },
        wallet: { id: '1', name: 'Tiền mặt' },
        date: Date.now(),
        note: 'Test'
      }
    ];
    
    const csv = exportToCSV(transactions);
    
    expect(csv).toContain('Ngày,Loại,Danh mục,Ví,Số tiền,Ghi chú');
    expect(csv).toContain('Chi tiêu');
    expect(csv).toContain('Ăn uống');
    expect(csv).toContain('50000');
  });
});
```

### 3.2 Integration Tests

- Test export with filtered data
- Test share functionality
- Test theme switching
- Test theme persistence

### 3.3 Manual Testing Checklist

- [ ] CSV export with various data sizes
- [ ] Excel export with multiple sheets
- [ ] PDF generation quality
- [ ] Share via Zalo works
- [ ] Dark mode on all pages
- [ ] Theme toggle smooth transition
- [ ] Theme persistence after app restart

---

## 4. Performance Considerations

### 4.1 Large Data Sets
- Implement pagination for large exports
- Use web workers for heavy processing
- Stream data for very large files

### 4.2 Memory Management
- Clean up blob URLs after use
- Limit in-memory data size
- Use lazy loading where possible

---

_Version: 1.0_  
_Last updated: 2025-12-10_
