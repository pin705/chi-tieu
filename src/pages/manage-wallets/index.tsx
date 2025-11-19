import React, { FC, useState } from "react";
import {
  Page,
  Header,
  Box,
  Text,
  Button,
  Icon,
  useSnackbar,
  Sheet,
  Input,
  Select,
} from "zmp-ui";
import { useRecoilState } from "recoil";
import { walletsState } from "expense-state";
import { Wallet } from "types/wallet";
import { formatCurrency } from "utils/format";

const WALLET_ICONS = [
  { value: "zi-star", label: "Ngôi sao" },
  { value: "zi-user-circle", label: "Người dùng" },
  { value: "zi-user-circle-solid", label: "Người dùng (đậm)" },
  { value: "zi-home", label: "Nhà" },
  { value: "zi-wallet", label: "Ví" },
  { value: "zi-card", label: "Thẻ" },
];

const WALLET_COLORS = [
  { value: "#10b981", label: "Xanh lá" },
  { value: "#3b82f6", label: "Xanh dương" },
  { value: "#006af5", label: "Xanh Zalo" },
  { value: "#f59e0b", label: "Cam" },
  { value: "#ef4444", label: "Đỏ" },
  { value: "#8b5cf6", label: "Tím" },
  { value: "#ec4899", label: "Hồng" },
];

const ManageWalletsPage: FC = () => {
  const [wallets, setWallets] = useRecoilState(walletsState);
  const { openSnackbar } = useSnackbar();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    balance: "0",
    icon: "zi-wallet",
    color: "#10b981",
  });

  const handleOpenAddSheet = () => {
    setEditingWallet(null);
    setFormData({
      name: "",
      balance: "0",
      icon: "zi-wallet",
      color: "#10b981",
    });
    setSheetVisible(true);
  };

  const handleOpenEditSheet = (wallet: Wallet) => {
    setEditingWallet(wallet);
    setFormData({
      name: wallet.name,
      balance: wallet.balance.toString(),
      icon: wallet.icon,
      color: wallet.color,
    });
    setSheetVisible(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      openSnackbar({
        type: "error",
        text: "Vui lòng nhập tên ví",
      });
      return;
    }

    const balance = parseFloat(formData.balance) || 0;

    if (editingWallet) {
      // Update existing wallet
      setWallets(
        wallets.map((w) =>
          w.id === editingWallet.id
            ? {
                ...w,
                name: formData.name,
                balance,
                icon: formData.icon,
                color: formData.color,
              }
            : w
        )
      );
      openSnackbar({
        type: "success",
        text: "Cập nhật ví thành công",
      });
    } else {
      // Add new wallet
      const newWallet: Wallet = {
        id: Date.now().toString(),
        name: formData.name,
        balance,
        icon: formData.icon,
        color: formData.color,
      };
      setWallets([...wallets, newWallet]);
      openSnackbar({
        type: "success",
        text: "Thêm ví thành công",
      });
    }

    setSheetVisible(false);
  };

  const handleDelete = (walletId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa ví này?")) {
      setWallets(wallets.filter((w) => w.id !== walletId));
      openSnackbar({
        type: "success",
        text: "Xóa ví thành công",
      });
    }
  };

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  return (
    <Page className="flex flex-col bg-background">
      <Header title="Quản lý ví" showBackIcon={true} />
      <Box className="flex-1 overflow-auto pb-24">
        {/* Total Balance */}
        <Box className="rounded-2xl m-4 bg-section p-6 relative overflow-hidden">
          <Box className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
          <Box className="relative z-10">
            <Text size="xSmall" className="text-gray-900 opacity-90 mb-1">
              Tổng số dư
            </Text>
            <Text.Title className="text-gray-900 text-3xl font-bold mb-2">
              {formatCurrency(totalBalance)}
            </Text.Title>
            <Text size="xSmall" className="text-gray-900 opacity-90">
              {wallets.length} ví
            </Text>
          </Box>
        </Box>

        {/* Wallets List */}
        <Box className="p-4 space-y-2.5">
          {wallets.length === 0 ? (
            <Box className="bg-section rounded-2xl p-12 text-center ">
              <Box className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Icon icon="zi-home" size={40} className="text-gray-400" />
              </Box>
              <Text className="text-gray-600 font-medium">Chưa có ví nào</Text>
              <Text size="xSmall" className="text-gray-400 mt-2">
                Nhấn nút + bên dưới để thêm ví
              </Text>
            </Box>
          ) : (
            wallets.map((wallet) => (
              <Box
                key={wallet.id}
                className="bg-section rounded-2xl p-4 "
              >
                <Box className="flex items-center justify-between">
                  <Box className="flex items-center flex-1">
                    <Box
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mr-3.5"
                      style={{ backgroundColor: wallet.color + "15" }}
                    >
                      <Icon
                        icon={wallet.icon as any}
                        size={26}
                        style={{ color: wallet.color }}
                      />
                    </Box>
                    <Box className="flex-1">
                      <Text className="font-semibold text-gray-900 mb-0.5">
                        {wallet.name}
                      </Text>
                      <Text className="text-lg font-bold" style={{ color: wallet.color }}>
                        {formatCurrency(wallet.balance)}
                      </Text>
                    </Box>
                  </Box>
                  <Box className="flex gap-2">
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => handleOpenEditSheet(wallet)}
                      className="border-gray-200 active:bg-gray-100"
                      icon={<Icon icon="zi-edit" size={18} className="text-gray-700" />}
                    />
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => handleDelete(wallet.id)}
                      className="border-red-200 text-red-600 active:bg-red-50"
                      icon={<Icon icon="zi-delete" size={18} />}
                    />
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* Add Button */}
        <Box className="fixed bottom-24 right-5 z-10">
          <Button
            variant="primary"
            onClick={handleOpenAddSheet}
            className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center bg-yellow-500 border-0 active:scale-95 transition-transform"
            icon={<Icon icon="zi-plus" size={28} className="text-white" />}
          />
        </Box>

        {/* Add/Edit Sheet */}
        <Sheet
          visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
          autoHeight
          mask
          handler
          swipeToClose
        >
          <Box className="p-4 pb-8">
            <Text.Title className="mb-4">
              {editingWallet ? "Chỉnh sửa ví" : "Thêm ví mới"}
            </Text.Title>

            <Box className="space-y-4">
              <Box>
                <Text size="small" className="mb-2 text-gray-700">
                  Tên ví <span className="text-red-500">*</span>
                </Text>
                <Input
                  type="text"
                  placeholder="VD: Tiền mặt, Ngân hàng..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </Box>

              <Box>
                <Text size="small" className="mb-2 text-gray-700">
                  Số dư ban đầu
                </Text>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.balance}
                  onChange={(e) =>
                    setFormData({ ...formData, balance: e.target.value })
                  }
                />
              </Box>

              <Box>
                <Text size="small" className="mb-2 text-gray-700">
                  Biểu tượng
                </Text>
                <Select
                  value={formData.icon}
                  onChange={(value) =>
                    setFormData({ ...formData, icon: value as string })
                  }
                >
                  {WALLET_ICONS.map((icon) => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box>
                <Text size="small" className="mb-2 text-gray-700">
                  Màu sắc
                </Text>
                <Box className="grid grid-cols-7 gap-2">
                  {WALLET_COLORS.map((color) => (
                    <Box
                      key={color.value}
                      className={`w-10 h-10 rounded-full cursor-pointer border-2 ${
                        formData.color === color.value
                          ? "border-gray-800"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() =>
                        setFormData({ ...formData, color: color.value })
                      }
                    />
                  ))}
                </Box>
              </Box>

              <Box className="flex gap-2 pt-2">
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={() => setSheetVisible(false)}
                >
                  Hủy
                </Button>
                <Button fullWidth variant="primary" onClick={handleSave}>
                  {editingWallet ? "Cập nhật" : "Thêm"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Sheet>
      </Box>
    </Page>
  );
};

export default ManageWalletsPage;
