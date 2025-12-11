import React, { useState, useEffect } from 'react';
import { Page, Box, Text, Button, Icon, useSnackbar, List } from 'zmp-ui';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  transactionsState,
  categoriesState,
  walletsState,
  budgetsState,
} from '../../expense-state';
import AppHeader from '../../components/app-header';
import {
  createBackup,
  getBackupMetadataList,
  restoreBackup,
  deleteBackup,
  exportBackupAsFile,
} from '../../services/backup-service';
import { BackupMetadata } from '../../types/backup';

const BackupPage: React.FC = () => {
  const transactions = useRecoilValue(transactionsState);
  const categories = useRecoilValue(categoriesState);
  const wallets = useRecoilValue(walletsState);
  const budgets = useRecoilValue(budgetsState);

  const setTransactions = useSetRecoilState(transactionsState);
  const setCategories = useSetRecoilState(categoriesState);
  const setWallets = useSetRecoilState(walletsState);
  const setBudgets = useSetRecoilState(budgetsState);

  const { openSnackbar } = useSnackbar();

  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      const metadataList = await getBackupMetadataList();
      setBackups(metadataList.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Error loading backups:', error);
    }
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      await createBackup(transactions, budgets, wallets, categories);
      openSnackbar({
        type: 'success',
        text: 'Đã sao lưu dữ liệu thành công',
      });
      await loadBackups();
    } catch (error) {
      openSnackbar({
        type: 'error',
        text: 'Có lỗi xảy ra khi sao lưu',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!confirm('Bạn có chắc chắn muốn khôi phục dữ liệu? Dữ liệu hiện tại sẽ bị ghi đè.')) {
      return;
    }

    setLoading(true);
    try {
      const backupData = await restoreBackup(backupId);
      
      // Restore all data
      setTransactions(backupData.transactions);
      setCategories(backupData.categories);
      setWallets(backupData.wallets);
      setBudgets(backupData.budgets);

      openSnackbar({
        type: 'success',
        text: 'Đã khôi phục dữ liệu thành công',
      });
    } catch (error) {
      openSnackbar({
        type: 'error',
        text: 'Có lỗi xảy ra khi khôi phục',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bản sao lưu này?')) {
      return;
    }

    try {
      await deleteBackup(backupId);
      openSnackbar({
        type: 'success',
        text: 'Đã xóa bản sao lưu',
      });
      await loadBackups();
    } catch (error) {
      openSnackbar({
        type: 'error',
        text: 'Có lỗi xảy ra khi xóa',
      });
    }
  };

  const handleExportBackup = async (backupId: string) => {
    try {
      const backupData = await restoreBackup(backupId);
      exportBackupAsFile(backupData);
      openSnackbar({
        type: 'success',
        text: 'Đã xuất file sao lưu',
      });
    } catch (error) {
      openSnackbar({
        type: 'error',
        text: 'Có lỗi xảy ra khi xuất file',
      });
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Page className="flex flex-col bg-background">
      <AppHeader title="Sao lưu & Khôi phục" />
      <Box className="flex-1 overflow-auto pb-20">
        {/* Backup Info */}
        <Box className="m-4 p-6 bg-white rounded-2xl shadow-sm">
          <Box className="flex items-center mb-4">
            <Icon icon="zi-backup-solid" className="text-blue-600 mr-3" size={28} />
            <Text.Title className="text-gray-900 font-bold">
              Sao lưu dữ liệu
            </Text.Title>
          </Box>
          <Text size="small" className="text-gray-600 mb-4">
            Tạo bản sao lưu để bảo vệ dữ liệu của bạn. Bạn có thể khôi phục dữ liệu từ các bản sao lưu bất kỳ lúc nào.
          </Text>
          <Button
            fullWidth
            size="large"
            onClick={handleCreateBackup}
            disabled={loading}
            className="rounded-xl font-semibold"
          >
            <Box className="flex items-center justify-center">
              <Icon icon="zi-plus-circle" className="mr-2" />
              Tạo bản sao lưu mới
            </Box>
          </Button>
        </Box>

        {/* Backups List */}
        <Box className="mx-4 mb-4">
          <Text.Title className="mb-3 text-gray-900 font-semibold">
            Các bản sao lưu ({backups.length})
          </Text.Title>

          {backups.length === 0 ? (
            <Box className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <Icon icon="zi-download-solid" size={48} className="text-gray-400 mb-3" />
              <Text className="text-gray-500">
                Chưa có bản sao lưu nào
              </Text>
            </Box>
          ) : (
            <Box className="space-y-3">
              {backups.map((backup) => (
                <Box
                  key={backup.id}
                  className="bg-white rounded-2xl p-4 shadow-sm"
                >
                  <Box className="flex items-start justify-between mb-3">
                    <Box className="flex-1">
                      <Text className="font-semibold">
                        {formatDate(backup.timestamp)}
                      </Text>
                      <Text size="xSmall" className="text-gray-500 mt-1">
                        Dung lượng: {formatSize(backup.size)}
                      </Text>
                    </Box>
                    <Icon icon="zi-bookmark" className="text-blue-600" size={24} />
                  </Box>

                  <Box className="flex gap-2">
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => handleRestoreBackup(backup.id)}
                      className="flex-1"
                    >
                      <Icon icon="zi-retry" size={16} className="mr-1" />
                      Khôi phục
                    </Button>
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => handleExportBackup(backup.id)}
                    >
                      <Icon icon="zi-download" size={16} />
                    </Button>
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="border-red-300 text-red-600"
                    >
                      <Icon icon="zi-delete" size={16} />
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Info */}
        <Box className="mx-4 mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <Text.Title className="text-blue-800 mb-2 text-sm font-semibold">
            Lưu ý
          </Text.Title>
          <Box className="space-y-2">
            <Text size="xSmall" className="text-blue-700 flex items-start">
              <span className="mr-2">•</span>
              Dữ liệu được lưu trữ cục bộ trên thiết bị
            </Text>
            <Text size="xSmall" className="text-blue-700 flex items-start">
              <span className="mr-2">•</span>
              Nên tạo bản sao lưu định kỳ để đảm bảo an toàn
            </Text>
            <Text size="xSmall" className="text-blue-700 flex items-start">
              <span className="mr-2">•</span>
              Có thể xuất file và lưu trữ ở nơi khác
            </Text>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default BackupPage;
