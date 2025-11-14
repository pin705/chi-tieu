import React, { FC, useState, useEffect } from "react";
import {
  Page,
  Header,
  Box,
  Text,
  Input,
  Button,
  Sheet,
  Icon,
  useSnackbar,
} from "zmp-ui";
import DatePicker from "zmp-ui/date-picker";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  transactionsState,
  walletsState,
  expenseCategoriesState,
  incomeCategoriesState,
} from "expense-state";
import { Transaction, TransactionType } from "types/transaction";
import { ExpenseCategory } from "types/expense-category";
import { Wallet } from "types/wallet";

const AddTransactionPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSnackbar } = useSnackbar();

  // Get type from URL query params
  const searchParams = new URLSearchParams(location.search);
  const initialType = (searchParams.get("type") as TransactionType) || "expense";

  const [transactions, setTransactions] = useRecoilState(transactionsState);
  const [wallets, setWallets] = useRecoilState(walletsState);
  const expenseCategories = useRecoilValue(expenseCategoriesState);
  const incomeCategories = useRecoilValue(incomeCategoriesState);

  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedWallet, setSelectedWallet] = useState<string>(
    wallets[0]?.id || ""
  );
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [showWalletSheet, setShowWalletSheet] = useState(false);

  const categories =
    type === "expense" ? expenseCategories : incomeCategories;

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const handleSubmit = () => {
    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      openSnackbar({
        type: "error",
        text: "Vui lòng nhập số tiền hợp lệ",
      });
      return;
    }

    if (!selectedCategory) {
      openSnackbar({
        type: "error",
        text: "Vui lòng chọn danh mục",
      });
      return;
    }

    if (!selectedWallet) {
      openSnackbar({
        type: "error",
        text: "Vui lòng chọn ví",
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      type,
      categoryId: selectedCategory,
      walletId: selectedWallet,
      date: date.getTime(),
      note: note.trim(),
      createdAt: Date.now(),
    };

    // Update transactions
    setTransactions([...transactions, transaction]);

    // Update wallet balance
    const updatedWallets = wallets.map((wallet) => {
      if (wallet.id === selectedWallet) {
        return {
          ...wallet,
          balance:
            type === "income"
              ? wallet.balance + transaction.amount
              : wallet.balance - transaction.amount,
        };
      }
      return wallet;
    });
    setWallets(updatedWallets);

    openSnackbar({
      type: "success",
      text: `Đã thêm ${type === "income" ? "thu nhập" : "chi tiêu"}`,
    });

    navigate("/");
  };

  const selectedCategoryData = categories.find(
    (c) => c.id === selectedCategory
  );
  const selectedWalletData = wallets.find((w) => w.id === selectedWallet);

  return (
    <Page className="flex flex-col">
      <Header title="Thêm giao dịch" showBackIcon={true} />
      <Box className="flex-1 overflow-auto p-4">
        {/* Type Toggle */}
        <Box className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant={type === "expense" ? "primary" : "secondary"}
            onClick={() => setType("expense")}
            className={`transition-all duration-200 ${
              type === "expense" 
                ? "shadow-md transform scale-105" 
                : "hover:bg-gray-200"
            }`}
          >
            <Icon icon="zi-minus-circle" className="mr-1" />
            Chi tiêu
          </Button>
          <Button
            variant={type === "income" ? "primary" : "secondary"}
            onClick={() => setType("income")}
            className={`transition-all duration-200 ${
              type === "income" 
                ? "shadow-md transform scale-105" 
                : "hover:bg-gray-200"
            }`}
          >
            <Icon icon="zi-plus-circle" className="mr-1" />
            Thu nhập
          </Button>
        </Box>

        {/* Amount Input */}
        <Box className="mb-6 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200">
          <Text size="small" className="text-gray-700 mb-3 font-medium">
            💰 Số tiền
          </Text>
          <Input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-3xl font-bold"
          />
        </Box>

        {/* Category Selection */}
        <Box
          className="mb-4 p-4 bg-white rounded-xl cursor-pointer border-2 border-gray-100 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => setShowCategorySheet(true)}
        >
          <Text size="small" className="text-gray-700 mb-2 font-medium">
            📂 Danh mục
          </Text>
          {selectedCategoryData ? (
            <Box className="flex items-center space-x-3">
              <Box
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: `${selectedCategoryData.color}20`,
                }}
              >
                <Icon
                  icon={selectedCategoryData.icon as any}
                  style={{ color: selectedCategoryData.color }}
                  size={24}
                />
              </Box>
              <Text className="font-medium">{selectedCategoryData.name}</Text>
            </Box>
          ) : (
            <Text className="text-gray-400">Chọn danh mục</Text>
          )}
        </Box>

        {/* Wallet Selection */}
        <Box
          className="mb-4 p-4 bg-white rounded-xl cursor-pointer border-2 border-gray-100 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={() => setShowWalletSheet(true)}
        >
          <Text size="small" className="text-gray-700 mb-2 font-medium">
            👛 Ví
          </Text>
          {selectedWalletData ? (
            <Box className="flex items-center space-x-3">
              <Box
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
                style={{
                  backgroundColor: `${selectedWalletData.color}20`,
                }}
              >
                <Icon
                  icon={selectedWalletData.icon as any}
                  style={{ color: selectedWalletData.color }}
                  size={24}
                />
              </Box>
              <Text className="font-medium">{selectedWalletData.name}</Text>
            </Box>
          ) : (
            <Text className="text-gray-400">Chọn ví</Text>
          )}
        </Box>

        {/* Date Input */}
        <Box className="mb-4">
          <DatePicker
            label="Ngày"
            placeholder="Chọn ngày giao dịch"
            value={date}
            onChange={(value) => setDate(value)}
            dateFormat="dd/mm/yyyy"
            columnsFormat="DD-MM-YYYY"
            title="Chọn ngày giao dịch"
            locale="vi-VN"
            mask
            maskClosable
          />
        </Box>

        {/* Note Input */}
        <Box className="mb-6">
          <Text size="small" className="text-gray-700 mb-2 font-medium">
            📝 Ghi chú
          </Text>
          <Input
            placeholder="Thêm ghi chú (không bắt buộc)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-white border-2 border-gray-100 rounded-xl"
          />
        </Box>

        {/* Submit Button */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          className="mb-4 h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          ✓ Lưu giao dịch
        </Button>
      </Box>

      {/* Category Selection Sheet */}
      <Sheet
        visible={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="p-5">
          <Text.Title size="small" className="mb-4 text-center">
            Chọn danh mục
          </Text.Title>
          <Box className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <Box
                key={category.id}
                className={`p-4 rounded-2xl cursor-pointer text-center transition-all duration-200 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setShowCategorySheet(false);
                }}
              >
                <Icon
                  icon={category.icon as any}
                  className="text-3xl mb-2"
                  style={{
                    color:
                      selectedCategory === category.id
                        ? "white"
                        : category.color,
                  }}
                />
                <Text
                  size="xSmall"
                  className={`font-medium ${
                    selectedCategory === category.id
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {category.name}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Sheet>

      {/* Wallet Selection Sheet */}
      <Sheet
        visible={showWalletSheet}
        onClose={() => setShowWalletSheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="p-5">
          <Text.Title size="small" className="mb-4 text-center">
            Chọn ví
          </Text.Title>
          <Box className="space-y-3">
            {wallets.map((wallet) => (
              <Box
                key={wallet.id}
                className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-200 transform hover:scale-102 ${
                  selectedWallet === wallet.id 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg" 
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedWallet(wallet.id);
                  setShowWalletSheet(false);
                }}
              >
                <Box className="flex items-center space-x-3">
                  <Box
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor:
                        selectedWallet === wallet.id
                          ? "white"
                          : `${wallet.color}20`,
                    }}
                  >
                    <Icon
                      icon={wallet.icon as any}
                      style={{
                        color:
                          selectedWallet === wallet.id
                            ? wallet.color
                            : wallet.color,
                      }}
                      size={24}
                    />
                  </Box>
                  <Text
                    className={`font-medium ${
                      selectedWallet === wallet.id
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {wallet.name}
                  </Text>
                </Box>
                <Text
                  size="small"
                  className={`font-semibold ${
                    selectedWallet === wallet.id
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(wallet.balance)}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Sheet>
    </Page>
  );
};

export default AddTransactionPage;
