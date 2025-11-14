import React, { FC } from "react";
import { Page, Header, Box, Text, List, Icon, Button, useSnackbar } from "zmp-ui";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState, walletsState, transactionsState, categoriesState } from "expense-state";
import { openWebview } from "zmp-sdk";

const SettingsPage: FC = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const { openSnackbar } = useSnackbar();
  const setWallets = useSetRecoilState(walletsState);
  const setTransactions = useSetRecoilState(transactionsState);
  const setCategories = useSetRecoilState(categoriesState);

  const handleClearData = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu?")) {
      // Reset to default values by clearing storage
      setWallets([]);
      setTransactions([]);
      setCategories([]);
      
      // Reload the page to reinitialize with defaults
      window.location.reload();
      
      openSnackbar({
        type: "success",
        text: "Đã xóa toàn bộ dữ liệu",
      });
    }
  };

  return (
    <Page className="flex flex-col">
      <Header title="Cài đặt" showBackIcon={false} />
      <Box className="flex-1 overflow-auto">
        {/* User Info */}
        <Box className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <Box className="flex items-center space-x-3">
            <img
              className="w-16 h-16 rounded-full border-2 border-white"
              src={user.avatar.startsWith("http") ? user.avatar : undefined}
            />
            <Box>
              <Text.Title className="text-white">{user.name}</Text.Title>
              <Text size="small" className="text-white opacity-90">
                ID: {user.id}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Settings List */}
        <Box className="mt-4">
          <List>
            <List.Item
              prefix={<Icon icon="zi-user" />}
              title="Quản lý ví"
              suffix={<Icon icon="zi-chevron-right" />}
              onClick={() => navigate("/manage-wallets")}
            />
            <List.Item
              prefix={<Icon icon="zi-list-1" />}
              title="Quản lý danh mục"
              suffix={<Icon icon="zi-chevron-right" />}
              onClick={() => navigate("/manage-categories")}
            />
            <List.Item
              prefix={<Icon icon="zi-star" />}
              title="Quản lý ngân sách"
              suffix={<Icon icon="zi-chevron-right" />}
              onClick={() => navigate("/budget")}
            />
            <List.Item
              prefix={<Icon icon="zi-calendar" />}
              title="Lịch sử giao dịch"
              suffix={<Icon icon="zi-chevron-right" />}
              onClick={() => navigate("/history")}
            />
          </List>
        </Box>

        <Box className="mt-4">
          <List>
            <List.Item
              prefix={<Icon icon="zi-help-circle" />}
              title="Hướng dẫn sử dụng"
              suffix={<Icon icon="zi-chevron-right" />}
              onClick={() => {
                openSnackbar({
                  text: "Tính năng đang phát triển",
                });
              }}
            />
            <List.Item
              prefix={<Icon icon="zi-info-circle" />}
              title="Giới thiệu"
              suffix={<Icon icon="zi-chevron-right" />}
              onClick={() => {
                openSnackbar({
                  text: "Quản lý Chi Tiêu v1.0.0",
                });
              }}
            />
          </List>
        </Box>

        {/* Danger Zone */}
        <Box className="p-4 mt-4">
          <Text.Title size="small" className="mb-3 text-red-600">
            Vùng nguy hiểm
          </Text.Title>
          <Button
            variant="secondary"
            fullWidth
            onClick={handleClearData}
            className="border-red-500 text-red-600"
          >
            <Icon icon="zi-delete" className="mr-2" />
            Xóa toàn bộ dữ liệu
          </Button>
        </Box>

        {/* Footer */}
        <Box className="p-4 text-center">
          <Text size="xSmall" className="text-gray-400">
            Phiên bản 1.0.0
          </Text>
          <Text size="xSmall" className="text-gray-400">
            © 2024 Quản Lý Chi Tiêu
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default SettingsPage;
