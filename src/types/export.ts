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
