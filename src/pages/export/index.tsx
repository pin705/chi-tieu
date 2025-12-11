import React, { useState } from 'react';
import { Page, Box, Text, Button, Select, Icon, useSnackbar } from 'zmp-ui';
import { useRecoilValue } from 'recoil';
import { transactionsState, categoriesState, walletsState, budgetsState } from '../../expense-state';
import { exportToCSV, downloadCSV, generateFilename } from '../../utils/export';
import { exportToExcel } from '../../utils/export-excel';
import { exportToPDF } from '../../utils/export-pdf';
import AppHeader from '../../components/app-header';

const { Option } = Select;

const ExportPage: React.FC = () => {
  const transactions = useRecoilValue(transactionsState);
  const categories = useRecoilValue(categoriesState);
  const wallets = useRecoilValue(walletsState);
  const budgets = useRecoilValue(budgetsState);
  const { openSnackbar } = useSnackbar();

  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (transactions.length === 0) {
      openSnackbar({
        type: 'warning',
        text: 'Không có dữ liệu để xuất',
      });
      return;
    }

    setExporting(true);

    try {
      switch (format) {
        case 'csv':
          const csvContent = exportToCSV(transactions, categories, wallets);
          const filename = generateFilename('chi-tieu', 'csv');
          downloadCSV(csvContent, filename);
          openSnackbar({
            type: 'success',
            text: 'Đã xuất file CSV thành công',
          });
          break;
        case 'excel':
          exportToExcel(transactions, categories, wallets, budgets);
          openSnackbar({
            type: 'success',
            text: 'Đã xuất file Excel thành công',
          });
          break;
        case 'pdf':
          exportToPDF(transactions, categories, wallets);
          openSnackbar({
            type: 'success',
            text: 'Đã xuất file PDF thành công',
          });
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      openSnackbar({
        type: 'error',
        text: 'Có lỗi xảy ra khi xuất dữ liệu',
      });
    } finally {
      setExporting(false);
    }
  };

  const getFormatDescription = () => {
    switch (format) {
      case 'csv':
        return 'File CSV dễ dàng mở bằng Excel và các ứng dụng bảng tính khác';
      case 'excel':
        return 'File Excel với nhiều sheet bao gồm giao dịch, tổng quan và ngân sách';
      case 'pdf':
        return 'File PDF chuyên nghiệp với biểu đồ và báo cáo chi tiết';
      default:
        return '';
    }
  };

  return (
    <Page className="flex flex-col bg-background dark:bg-dark-background">
      <AppHeader title="Xuất dữ liệu" />
      <Box className="flex-1 overflow-auto pb-20">
        {/* Export Info */}
        <Box className="m-4 p-6 bg-white dark:bg-dark-surface rounded-2xl shadow-sm">
          <Box className="flex items-center mb-4">
            <Icon icon="zi-download" className="text-blue-600 mr-3" size={28} />
            <Text.Title className="text-gray-900 dark:text-dark-text font-bold">
              Xuất dữ liệu chi tiêu
            </Text.Title>
          </Box>
          <Text size="small" className="text-gray-600 dark:text-dark-textSecondary">
            Xuất toàn bộ dữ liệu giao dịch của bạn sang các định dạng khác nhau để lưu trữ, 
            phân tích hoặc chia sẻ.
          </Text>
          <Box className="mt-4 p-3 bg-blue-50 dark:bg-dark-surfaceVariant rounded-lg">
            <Text size="xSmall" className="text-blue-700 dark:text-blue-400">
              <Icon icon="zi-info-circle" size={16} className="mr-1" />
              Tổng số giao dịch: <strong>{transactions.length}</strong>
            </Text>
          </Box>
        </Box>

        {/* Format Selection */}
        <Box className="mx-4 mb-4">
          <Text.Title className="mb-3 text-gray-900 dark:text-dark-text font-semibold">
            Chọn định dạng
          </Text.Title>
          <Box className="bg-white dark:bg-dark-surface rounded-2xl overflow-hidden shadow-sm">
            <Select
              value={format}
              onChange={(value) => setFormat(value as 'csv' | 'excel' | 'pdf')}
              closeOnSelect
              className="w-full"
            >
              <Option value="csv" title="CSV (Excel Compatible)">
                <Box className="flex items-center py-2">
                  <Icon icon="zi-file-text" className="text-green-600 mr-3" size={24} />
                  <Box className="flex-1">
                    <Text className="font-medium dark:text-dark-text">CSV</Text>
                    <Text size="xSmall" className="text-gray-500 dark:text-dark-textSecondary">
                      File văn bản, tương thích Excel
                    </Text>
                  </Box>
                </Box>
              </Option>
              <Option value="excel" title="Excel (.xlsx)">
                <Box className="flex items-center py-2">
                  <Icon icon="zi-grid" className="text-blue-600 mr-3" size={24} />
                  <Box className="flex-1">
                    <Text className="font-medium dark:text-dark-text">Excel</Text>
                    <Text size="xSmall" className="text-gray-500 dark:text-dark-textSecondary">
                      File Excel với nhiều sheet
                    </Text>
                  </Box>
                </Box>
              </Option>
              <Option value="pdf" title="PDF">
                <Box className="flex items-center py-2">
                  <Icon icon="zi-file" className="text-red-600 mr-3" size={24} />
                  <Box className="flex-1">
                    <Text className="font-medium dark:text-dark-text">PDF</Text>
                    <Text size="xSmall" className="text-gray-500 dark:text-dark-textSecondary">
                      Báo cáo chuyên nghiệp
                    </Text>
                  </Box>
                </Box>
              </Option>
            </Select>
          </Box>

          <Box className="mt-3 p-4 bg-gray-50 dark:bg-dark-surfaceVariant rounded-xl">
            <Text size="small" className="text-gray-700 dark:text-dark-textSecondary">
              {getFormatDescription()}
            </Text>
          </Box>
        </Box>

        {/* Export Button */}
        <Box className="px-4 mt-6">
          <Button
            fullWidth
            size="large"
            onClick={handleExport}
            disabled={exporting || transactions.length === 0}
            className="h-14 rounded-xl font-semibold shadow-md"
          >
            {exporting ? (
              <Box className="flex items-center justify-center">
                <Icon icon="zi-loading" className="mr-2 animate-spin" />
                Đang xuất...
              </Box>
            ) : (
              <Box className="flex items-center justify-center">
                <Icon icon="zi-download" className="mr-2" />
                Xuất dữ liệu
              </Box>
            )}
          </Button>
        </Box>

        {/* Additional Info */}
        <Box className="mx-4 mt-6 p-4 bg-amber-50 dark:bg-dark-surfaceVariant rounded-xl border border-amber-200 dark:border-dark-border">
          <Text.Title className="text-amber-800 dark:text-amber-400 mb-2 text-sm font-semibold">
            Lưu ý quan trọng
          </Text.Title>
          <Box className="space-y-2">
            <Text size="xSmall" className="text-amber-700 dark:text-amber-300 flex items-start">
              <span className="mr-2">•</span>
              File sẽ được tải xuống vào thư mục Downloads của thiết bị
            </Text>
            <Text size="xSmall" className="text-amber-700 dark:text-amber-300 flex items-start">
              <span className="mr-2">•</span>
              Dữ liệu xuất bao gồm tất cả giao dịch hiện có
            </Text>
            <Text size="xSmall" className="text-amber-700 dark:text-amber-300 flex items-start">
              <span className="mr-2">•</span>
              Định dạng Excel và PDF có thể mất vài giây để tạo
            </Text>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default ExportPage;
