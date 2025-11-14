import React, { FC, useState, useMemo } from "react";
import { Page, Header, Box, Text, Icon, Input, Select, Sheet, Button } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { sortedTransactionsState, categoriesState, walletsState } from "expense-state";
import { formatCurrency } from "utils/format";
import { Transaction } from "types/transaction";

const HistoryPage: FC = () => {
  const transactions = useRecoilValue(sortedTransactionsState);
  const categories = useRecoilValue(categoriesState);
  const wallets = useRecoilValue(walletsState);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterWallet, setFilterWallet] = useState<string>("all");
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Type filter
      if (filterType !== "all" && transaction.type !== filterType) {
        return false;
      }

      // Category filter
      if (filterCategory !== "all" && transaction.categoryId !== filterCategory) {
        return false;
      }

      // Wallet filter
      if (filterWallet !== "all" && transaction.walletId !== filterWallet) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const category = categories.find((c) => c.id === transaction.categoryId);
        const searchLower = searchTerm.toLowerCase();
        
        const matchesNote = transaction.note?.toLowerCase().includes(searchLower);
        const matchesCategory = category?.name.toLowerCase().includes(searchLower);
        const matchesAmount = transaction.amount.toString().includes(searchTerm);

        return matchesNote || matchesCategory || matchesAmount;
      }

      return true;
    });
  }, [transactions, searchTerm, filterType, filterCategory, filterWallet, categories]);

  const activeFiltersCount = [
    filterType !== "all",
    filterCategory !== "all",
    filterWallet !== "all",
  ].filter(Boolean).length;

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const dateKey = date.toLocaleDateString("vi-VN");

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const clearFilters = () => {
    setFilterType("all");
    setFilterCategory("all");
    setFilterWallet("all");
    setSearchTerm("");
  };

  return (
    <Page className="flex flex-col">
      <Header title="Lịch sử giao dịch" showBackIcon={true} />
      
      {/* Search and Filter Bar */}
      <Box className="p-4 bg-white border-b border-gray-100">
        <Box className="flex gap-2 mb-3">
          <Input
            type="text"
            placeholder="Tìm kiếm giao dịch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
            prefix={<Icon icon="zi-search" />}
            clearable
          />
          <Box
            className={`px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
              activeFiltersCount > 0 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setShowFilterSheet(true)}
          >
            <Icon icon="zi-filter" />
            {activeFiltersCount > 0 && (
              <Box className="bg-white text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                {activeFiltersCount}
              </Box>
            )}
          </Box>
        </Box>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <Box className="flex flex-wrap gap-2">
            {filterType !== "all" && (
              <Box className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <Text size="xSmall">
                  {filterType === "income" ? "Thu nhập" : "Chi tiêu"}
                </Text>
                <Box className="cursor-pointer" onClick={() => setFilterType("all")}>
                  <Icon icon="zi-close" size={12} />
                </Box>
              </Box>
            )}
            {filterCategory !== "all" && (
              <Box className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <Text size="xSmall">
                  {categories.find((c) => c.id === filterCategory)?.name}
                </Text>
                <Box className="cursor-pointer" onClick={() => setFilterCategory("all")}>
                  <Icon icon="zi-close" size={12} />
                </Box>
              </Box>
            )}
            {filterWallet !== "all" && (
              <Box className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <Text size="xSmall">
                  {wallets.find((w) => w.id === filterWallet)?.name}
                </Text>
                <Box className="cursor-pointer" onClick={() => setFilterWallet("all")}>
                  <Icon icon="zi-close" size={12} />
                </Box>
              </Box>
            )}
            <Box
              className="text-blue-600 px-3 py-1 text-xs cursor-pointer"
              onClick={clearFilters}
            >
              <Text size="xSmall" className="text-blue-600">Xóa tất cả</Text>
            </Box>
          </Box>
        )}
      </Box>

      <Box className="flex-1 overflow-auto">
        {Object.keys(groupedTransactions).length === 0 ? (
          <Box className="text-center py-12">
            <Icon icon="zi-search" size={48} className="text-gray-300 mb-3" />
            <Text className="text-gray-400">
              {searchTerm || activeFiltersCount > 0
                ? "Không tìm thấy giao dịch nào"
                : "Chưa có giao dịch nào"}
            </Text>
          </Box>
        ) : (
          Object.entries(groupedTransactions).map(([dateKey, dayTransactions]) => {
            const dayTotal = dayTransactions.reduce((sum, t) => {
              return t.type === "income" ? sum + t.amount : sum - t.amount;
            }, 0);

            return (
              <Box key={dateKey} className="mb-4">
                <Box className="px-4 py-2 bg-gray-50 flex justify-between items-center">
                  <Text size="small" className="font-medium">
                    {dateKey}
                  </Text>
                  <Text
                    size="small"
                    className={`font-medium ${
                      dayTotal >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {dayTotal >= 0 ? "+" : ""}
                    {formatCurrency(dayTotal)}
                  </Text>
                </Box>
                <Box className="px-4">
                  {dayTransactions.map((transaction) => {
                    const category = categories.find(
                      (c) => c.id === transaction.categoryId
                    );
                    const time = new Date(transaction.date).toLocaleTimeString(
                      "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    );

                    return (
                      <Box
                        key={transaction.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100"
                      >
                        <Box className="flex items-center space-x-3 flex-1">
                          <Box
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: `${category?.color}20`,
                            }}
                          >
                            <Icon
                              icon={(category?.icon || "zi-more-grid") as any}
                              style={{ color: category?.color }}
                            />
                          </Box>
                          <Box className="flex-1 min-w-0">
                            <Text size="small" className="font-medium">
                              {category?.name || "Khác"}
                            </Text>
                            <Text size="xSmall" className="text-gray-500">
                              {time}
                              {transaction.note && ` • ${transaction.note}`}
                            </Text>
                          </Box>
                        </Box>
                        <Text
                          size="small"
                          className={`font-semibold flex-shrink-0 ml-2 ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </Text>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* Filter Sheet */}
      <Sheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="p-4">
          <Text.Title className="mb-4">Bộ lọc</Text.Title>

          {/* Type Filter */}
          <Box className="mb-4">
            <Text size="small" className="mb-2 text-gray-600">
              Loại giao dịch
            </Text>
            <Box className="flex gap-2">
              {[
                { value: "all", label: "Tất cả" },
                { value: "income", label: "Thu nhập" },
                { value: "expense", label: "Chi tiêu" },
              ].map((option) => (
                <Box
                  key={option.value}
                  className={`flex-1 py-2 px-4 rounded-lg text-center cursor-pointer transition-all ${
                    filterType === option.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => setFilterType(option.value as any)}
                >
                  <Text size="small" className={filterType === option.value ? "text-white" : "text-gray-600"}>
                    {option.label}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Category Filter */}
          <Box className="mb-4">
            <Text size="small" className="mb-2 text-gray-600">
              Danh mục
            </Text>
            <Select
              value={filterCategory}
              onChange={(value) => setFilterCategory(value as string)}
            >
              <Select.Option value="all" title="Tất cả danh mục" />
              {categories.map((category) => (
                <Select.Option
                  key={category.id}
                  value={category.id}
                  title={category.name}
                />
              ))}
            </Select>
          </Box>

          {/* Wallet Filter */}
          <Box className="mb-4">
            <Text size="small" className="mb-2 text-gray-600">
              Ví
            </Text>
            <Select
              value={filterWallet}
              onChange={(value) => setFilterWallet(value as string)}
            >
              <Select.Option value="all" title="Tất cả ví" />
              {wallets.map((wallet) => (
                <Select.Option
                  key={wallet.id}
                  value={wallet.id}
                  title={wallet.name}
                />
              ))}
            </Select>
          </Box>

          {/* Action Buttons */}
          <Box className="flex gap-2">
            <Button
              fullWidth
              variant="secondary"
              onClick={() => {
                clearFilters();
                setShowFilterSheet(false);
              }}
            >
              Xóa bộ lọc
            </Button>
            <Button fullWidth onClick={() => setShowFilterSheet(false)}>
              Áp dụng
            </Button>
          </Box>
        </Box>
      </Sheet>
    </Page>
  );
};

export default HistoryPage;
