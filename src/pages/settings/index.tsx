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
    <Page className="flex flex-col bg-background">
      <Header title="Cài đặt" showBackIcon={false} />
      <Box className="flex-1 overflow-auto pb-20">
        {/* User Info */}
        <Box className="rounded-2xl m-4 bg-white p-6 relative overflow-hidden">
          <Box className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
          <Box className="flex items-center space-x-3 relative z-10">
            <img
              className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
              src={user.avatar.startsWith("http") ? user.avatar : undefined}
            />
            <Box>
              <Text.Title className="text-gray-900 font-bold text-lg">{user.name}</Text.Title>
              <Text size="small" className="text-gray-700 opacity-95">
                ID: {user.id}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Settings List */}
        <Box className="mt-4 mx-4 bg-section rounded-2xl overflow-hidden ">
          <Box className="px-4 pt-3 pb-2 bg-gray-50">
            <Text size="xSmall" className="text-gray-600 font-semibold tracking-wide">QUẢN LÝ</Text>
          </Box>
          <List>
            <List.Item
              prefix={<Icon icon="zi-user" className="text-blue-600" size={22} />}
              title="Quản lý ví"
              suffix={<Icon icon="zi-chevron-right" className="text-gray-400" />}
              onClick={() => navigate("/manage-wallets")}
            />
            <List.Item
              prefix={<Icon icon="zi-list-1" className="text-purple-600" size={22} />}
              title="Quản lý danh mục"
              suffix={<Icon icon="zi-chevron-right" className="text-gray-400" />}
              onClick={() => navigate("/manage-categories")}
            />
            <List.Item
              prefix={<Icon icon="zi-star" className="text-amber-500" size={22} />}
              title="Quản lý ngân sách"
              suffix={<Icon icon="zi-chevron-right" className="text-gray-400" />}
              onClick={() => navigate("/budget")}
            />
            <List.Item
              prefix={<Icon icon="zi-calendar" className="text-yellow-600" size={22} />}
              title="Lịch sử giao dịch"
              suffix={<Icon icon="zi-chevron-right" className="text-gray-400" />}
              onClick={() => navigate("/history")}
            />
          </List>
        </Box>

        <Box className="mt-3 mx-4 bg-section rounded-2xl overflow-hidden ">
          <Box className="px-4 pt-3 pb-2 bg-gray-50">
            <Text size="xSmall" className="text-gray-600 font-semibold tracking-wide">HỖ TRỢ</Text>
          </Box>
          <List>
            <List.Item
              prefix={<Icon icon="zi-help-circle" className="text-orange-500" size={22} />}
              title="Hướng dẫn sử dụng"
              suffix={<Icon icon="zi-chevron-right" className="text-gray-400" />}
              onClick={() => navigate("/guide")}
            />
            <List.Item
              prefix={<Icon icon="zi-info-circle" className="text-cyan-600" size={22} />}
              title="Giới thiệu"
              suffix={<Icon icon="zi-chevron-right" className="text-gray-400" />}
              onClick={() => {
                openSnackbar({
                  text: "Quản lý Chi Tiêu v1.0.0",
                });
              }}
            />
          </List>
        </Box>

        {/* Danger Zone */}
        <Box className="px-4 mt-4 mb-4">
          <Box className="bg-section rounded-2xl p-4 ">
            <Box className="mb-3">
              <Text size="xSmall" className="text-red-600 font-semibold tracking-wide">VÙNG NGUY HIỂM</Text>
            </Box>
            <Button
              variant="secondary"
              fullWidth
              onClick={handleClearData}
              className="border-red-300 text-red-600 active:bg-red-50"
              prefixIcon={<Icon icon="zi-delete" />}
            >
              Xóa toàn bộ dữ liệu
            </Button>
          </Box>
        </Box>

        {/* Footer */}
        <Box className="px-4 pb-4 text-center">
          <Text size="xSmall" className="text-gray-500 block">
            Phiên bản 1.0.0
          </Text>
          <Text size="xSmall" className="text-gray-400 block mt-1">
            © 2025 Quản Lý Chi Tiêu
          </Text>
        </Box>
      </Box>
    </Page>
  );
};

export default SettingsPage;
