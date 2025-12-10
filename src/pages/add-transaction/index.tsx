import React, { FC, useState, useEffect } from "react";
import { Page, Box, Text, Input, Button, Sheet, Icon, useSnackbar } from "zmp-ui";
import AppHeader from "components/app-header";
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
import { suggestCategoryWithLearning, learnFromHistory } from "services/ai-categorization";
import { formatCurrency } from "utils/format";

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
  const [suggestedCategory, setSuggestedCategory] = useState<ExpenseCategory | null>(null);

  const categories =
    type === "expense" ? expenseCategories : incomeCategories;

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  // AI category suggestion based on note
  useEffect(() => {
    if (note.trim().length > 2 && type === "expense") {
      const patterns = learnFromHistory(transactions, expenseCategories);
      const suggested = suggestCategoryWithLearning(note, patterns, expenseCategories);
      setSuggestedCategory(suggested);
    } else {
      setSuggestedCategory(null);
    }
  }, [note, type, transactions, expenseCategories]);

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
    <Page className="flex flex-col bg-background dark:bg-dark-background">
      <AppHeader title="Thêm giao dịch" />
      <Box className="flex-1 overflow-auto p-4">
        {/* Type Toggle with modern gradient buttons */}
        <Box className="grid grid-cols-2 gap-3 mb-6 animate-fade-in">
          <Box
            onClick={() => setType("expense")}
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 transform ${
              type === "expense" 
                ? "shadow-lg scale-105" 
                : "shadow-soft hover:shadow-md active:scale-98"
            }`}
            style={{
              background: type === "expense"
                ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
                : 'white',
            }}
          >
            <Box className="flex items-center justify-center">
              <Icon 
                icon="zi-minus-circle" 
                className={type === "expense" ? "text-white" : "text-rose-500"} 
                size={24} 
              />
              <Text 
                className={`ml-2 font-bold ${type === "expense" ? "text-white" : "text-gray-700"}`}
              >
                Chi tiêu
              </Text>
            </Box>
          </Box>
          <Box
            onClick={() => setType("income")}
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 transform ${
              type === "income" 
                ? "shadow-lg scale-105" 
                : "shadow-soft hover:shadow-md active:scale-98"
            }`}
            style={{
              background: type === "income"
                ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                : 'white',
            }}
          >
            <Box className="flex items-center justify-center">
              <Icon 
                icon="zi-plus-circle" 
                className={type === "income" ? "text-white" : "text-emerald-500"} 
                size={24} 
              />
              <Text 
                className={`ml-2 font-bold ${type === "income" ? "text-white" : "text-gray-700"}`}
              >
                Thu nhập
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Amount Input with gradient card */}
        <Box 
          className="mb-6 p-6 rounded-3xl shadow-card animate-slide-up"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          }}
        >
          <Box className="flex items-center mb-3">
            <Box className="bg-white/20 rounded-full p-2 mr-2">
              <Icon icon="zi-star" className="text-white" size={20} />
            </Box>
            <Text size="small" className="text-white/90 font-semibold">
              Số tiền
            </Text>
          </Box>
          <Input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-4xl font-bold bg-white/10 border-white/20 text-white placeholder-white/50 rounded-2xl"
          />
        </Box>

        {/* Category Selection */}
        <Box
          className="mb-4 p-5 bg-white dark:bg-dark-surface rounded-2xl cursor-pointer transition-all duration-200 shadow-card hover:shadow-lg active:scale-98 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
          onClick={() => setShowCategorySheet(true)}
        >
          <Box className="flex items-center mb-3">
            <Box className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl p-2 mr-2">
              <Icon icon="zi-more-grid" className="text-indigo-600" size={20} />
            </Box>
            <Text size="small" className="text-gray-700 dark:text-dark-textSecondary font-bold">
              Danh mục
            </Text>
          </Box>
          {selectedCategoryData ? (
            <Box className="flex items-center space-x-3">
              <Box
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${selectedCategoryData.color}15 0%, ${selectedCategoryData.color}25 100%)`,
                }}
              >
                <Icon
                  icon={selectedCategoryData.icon as any}
                  style={{ color: selectedCategoryData.color }}
                  size={26}
                />
              </Box>
              <Text className="font-bold text-gray-900 dark:text-dark-text">{selectedCategoryData.name}</Text>
            </Box>
          ) : (
            <Text className="text-gray-400 dark:text-dark-textSecondary font-medium">Chọn danh mục</Text>
          )}
        </Box>

        {/* AI Category Suggestion */}
        {suggestedCategory && selectedCategory !== suggestedCategory.id && (
          <Box 
            className="mb-4 p-4 rounded-2xl shadow-soft animate-fade-in"
            style={{
              background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
            }}
          >
            <Box className="flex items-center justify-between">
              <Box className="flex items-center space-x-2 flex-1">
                <Box className="bg-indigo-500 rounded-full p-1.5">
                  <Icon icon="zi-star" className="text-white" size={16} />
                </Box>
                <Text size="small" className="text-indigo-900 font-semibold">
                  Đề xuất: <strong>{suggestedCategory.name}</strong>
                </Text>
              </Box>
              <Box
                onClick={() => setSelectedCategory(suggestedCategory.id)}
                className="px-4 py-2 bg-indigo-600 rounded-xl cursor-pointer active:scale-95 transition-transform"
              >
                <Text size="small" className="text-white font-semibold">Áp dụng</Text>
              </Box>
            </Box>
          </Box>
        )}

        {/* Wallet Selection */}
        <Box
          className="mb-4 p-5 bg-white dark:bg-dark-surface rounded-2xl cursor-pointer transition-all duration-200 shadow-card hover:shadow-lg active:scale-98 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
          onClick={() => setShowWalletSheet(true)}
        >
          <Box className="flex items-center mb-3">
            <Box className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-2 mr-2">
              <Icon icon="zi-user-circle" className="text-purple-600" size={20} />
            </Box>
            <Text size="small" className="text-gray-700 dark:text-dark-textSecondary font-bold">
              Ví
            </Text>
          </Box>
          {selectedWalletData ? (
            <Box className="flex items-center space-x-3">
              <Box
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${selectedWalletData.color}15 0%, ${selectedWalletData.color}25 100%)`,
                }}
              >
                <Icon
                  icon={selectedWalletData.icon as any}
                  style={{ color: selectedWalletData.color }}
                  size={26}
                />
              </Box>
              <Text className="font-bold text-gray-900 dark:text-dark-text">{selectedWalletData.name}</Text>
            </Box>
          ) : (
            <Text className="text-gray-400 dark:text-dark-textSecondary font-medium">Chọn ví</Text>
          )}
        </Box>

        {/* Date Input */}
        <Box className="mb-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
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
        <Box className="mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Box className="flex items-center mb-2">
            <Box className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-2 mr-2">
              <Icon icon="zi-note" className="text-gray-600" size={18} />
            </Box>
            <Text size="small" className="text-gray-700 dark:text-dark-textSecondary font-bold">
              Ghi chú
            </Text>
          </Box>
          <Input
            placeholder="Thêm ghi chú (không bắt buộc)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-white dark:bg-dark-surface dark:text-dark-text rounded-2xl shadow-soft"
          />
        </Box>

        {/* Submit Button with gradient */}
        <Box
          onClick={handleSubmit}
          className="p-5 rounded-2xl cursor-pointer transition-all duration-200 transform active:scale-98 shadow-floating hover:shadow-lg animate-slide-up mb-4"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            animationDelay: '0.5s',
          }}
        >
          <Box className="flex items-center justify-center">
            <Icon icon="zi-check-circle" className="text-white mr-2" size={24} />
            <Text className="text-white text-lg font-bold">Lưu giao dịch</Text>
          </Box>
        </Box>
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
        <Box className="p-6 dark:bg-dark-surface">
          <Text.Title size="small" className="mb-5 text-center dark:text-dark-text font-bold">
            Chọn danh mục
          </Text.Title>
          <Box className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <Box
                key={category.id}
                className={`p-4 rounded-2xl cursor-pointer text-center transition-all duration-200 transform active:scale-95 ${
                  selectedCategory === category.id
                    ? "shadow-lg"
                    : "bg-gray-50 dark:bg-dark-surfaceVariant hover:bg-gray-100 dark:hover:bg-gray-700 shadow-soft"
                }`}
                style={{
                  background: selectedCategory === category.id
                    ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'
                    : undefined,
                }}
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
                  className={`font-bold ${
                    selectedCategory === category.id
                      ? "text-white"
                      : "text-gray-700 dark:text-dark-text"
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
        <Box className="p-6 dark:bg-dark-surface">
          <Text.Title size="small" className="mb-5 text-center dark:text-dark-text font-bold">
            Chọn ví
          </Text.Title>
          <Box className="space-y-3">
            {wallets.map((wallet) => (
              <Box
                key={wallet.id}
                className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-200 transform active:scale-98 ${
                  selectedWallet === wallet.id 
                    ? "shadow-lg" 
                    : "bg-gray-50 dark:bg-dark-surfaceVariant hover:bg-gray-100 dark:hover:bg-gray-700 shadow-soft"
                }`}
                style={{
                  background: selectedWallet === wallet.id
                    ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'
                    : undefined,
                }}
                onClick={() => {
                  setSelectedWallet(wallet.id);
                  setShowWalletSheet(false);
                }}
              >
                <Box className="flex items-center space-x-3">
                  <Box
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{
                      background:
                        selectedWallet === wallet.id
                          ? "rgba(255, 255, 255, 0.2)"
                          : `linear-gradient(135deg, ${wallet.color}15 0%, ${wallet.color}25 100%)`,
                    }}
                  >
                    <Icon
                      icon={wallet.icon as any}
                      style={{
                        color:
                          selectedWallet === wallet.id ? "white" : wallet.color,
                      }}
                      size={24}
                    />
                  </Box>
                  <Box>
                    <Text
                      className={`font-bold ${
                        selectedWallet === wallet.id
                          ? "text-white"
                          : "text-gray-900 dark:text-dark-text"
                      }`}
                    >
                      {wallet.name}
                    </Text>
                    <Text
                      size="xSmall"
                      className={`${
                        selectedWallet === wallet.id
                          ? "text-white/80"
                          : "text-gray-500 dark:text-dark-textSecondary"
                      }`}
                    >
                      {formatCurrency(wallet.balance)}
                    </Text>
                  </Box>
                </Box>
                {selectedWallet === wallet.id && (
                  <Icon icon="zi-check-circle-solid" className="text-white" size={24} />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Sheet>
    </Page>
  );
};
      >
        <Box className="p-5 dark:bg-dark-surface">
          <Text.Title size="small" className="mb-4 text-center dark:text-dark-text">
            Chọn danh mục
          </Text.Title>
          <Box className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <Box
                key={category.id}
                className={`p-4 rounded-2xl cursor-pointer text-center transition-all duration-200 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? "bg-yellow-500 text-white shadow-lg"
                    : "bg-gray-50 dark:bg-dark-surfaceVariant hover:bg-gray-100 dark:hover:bg-gray-700"
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
                      : "text-gray-700 dark:text-dark-text"
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
        <Box className="p-5 dark:bg-dark-surface">
          <Text.Title size="small" className="mb-4 text-center dark:text-dark-text">
            Chọn ví
          </Text.Title>
          <Box className="space-y-3">
            {wallets.map((wallet) => (
              <Box
                key={wallet.id}
                className={`p-4 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-200 transform hover:scale-102 ${
                  selectedWallet === wallet.id 
                    ? "bg-yellow-500 shadow-lg" 
                    : "bg-gray-50 dark:bg-dark-surfaceVariant hover:bg-gray-100 dark:hover:bg-gray-700"
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
                        : "text-gray-700 dark:text-dark-text"
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
                      : "text-gray-600 dark:text-dark-textSecondary"
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
