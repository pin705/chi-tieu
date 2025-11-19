import React, { FC, useState, useMemo } from "react";
import { Page, Box, Text, Icon, Input, Select, Sheet, Button } from "zmp-ui";
import AppHeader from "components/app-header";
import DatePicker from "zmp-ui/date-picker";
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
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(undefined);
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(undefined);
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

      // Date range filter
      if (filterStartDate) {
        const startOfDay = new Date(filterStartDate);
        startOfDay.setHours(0, 0, 0, 0);
        if (transaction.date < startOfDay.getTime()) {
          return false;
        }
      }

      if (filterEndDate) {
        const endOfDay = new Date(filterEndDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (transaction.date > endOfDay.getTime()) {
          return false;
        }
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
  }, [transactions, searchTerm, filterType, filterCategory, filterWallet, filterStartDate, filterEndDate, categories]);

  const activeFiltersCount = [
    filterType !== "all",
    filterCategory !== "all",
    filterWallet !== "all",
    filterStartDate !== undefined,
    filterEndDate !== undefined,
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
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
    setSearchTerm("");
  };

  return (
    <Page className="flex flex-col bg-background">
      <AppHeader title="Lịch sử giao dịch" />
      
      {/* Search and Filter Bar */}
      <Box className="p-4 bg-white ">
          <Box className="flex gap-2.5 mb-3">
          <Input
            type="text"
            placeholder="Tìm kiếm giao dịch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white border-2 border-gray-200 rounded-xl shadow-sm"
            prefix={<Icon icon="zi-search" />}
            clearable
          />
          <Box
            className={`px-5 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 ${
              activeFiltersCount > 0 
                ? "bg-yellow-500 text-white" 
                : "bg-white text-gray-600 border-2 border-gray-200"
            }`}
            onClick={() => setShowFilterSheet(true)}
          >
            <Icon icon="zi-filter" />
            {activeFiltersCount > 0 && (
              <Box className="bg-white text-yellow-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-sm">
                {activeFiltersCount}
              </Box>
            )}
          </Box>
        </Box>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <Box className="flex flex-wrap gap-2 animate-fadeIn">
            {filterType !== "all" && (
              <Box className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-sm">
                <Text size="xSmall" className="font-medium">
                  {filterType === "income" ? "Thu nhập" : "Chi tiêu"}
                </Text>
                <Box className="cursor-pointer hover:bg-yellow-200 rounded-full p-0.5 transition-colors" onClick={() => setFilterType("all")}>
                  <Icon icon="zi-close" size={12} />
                </Box>
              </Box>
            )}
            {filterCategory !== "all" && (
              <Box className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-sm">
                <Text size="xSmall" className="font-medium">
                  {categories.find((c) => c.id === filterCategory)?.name}
                </Text>
                <Box className="cursor-pointer hover:bg-yellow-200 rounded-full p-0.5 transition-colors" onClick={() => setFilterCategory("all")}>
                  <Icon icon="zi-close" size={12} />
                </Box>
              </Box>
            )}
            {filterWallet !== "all" && (
              <Box className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-sm">
                <Text size="xSmall" className="font-medium">
                  {wallets.find((w) => w.id === filterWallet)?.name}
                </Text>
                <Box className="cursor-pointer hover:bg-yellow-200 rounded-full p-0.5 transition-colors" onClick={() => setFilterWallet("all")}>
                  <Icon icon="zi-close" size={12} />
                </Box>
              </Box>
            )}
            {filterStartDate && (
              <Box className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-sm">
                <Text size="xSmall" className="font-medium">
                  Từ {filterStartDate.toLocaleDateString("vi-VN")}
                </Text>
                <Box className="cursor-pointer hover:bg-yellow-200 rounded-full p-0.5 transition-colors" onClick={() => setFilterStartDate(undefined)}>
                  <Icon icon="zi-close" size={12} />
                </Box>
              </Box>
            )}
            {filterEndDate && (
              <Box className="bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-sm">
                <Text size="xSmall" className="font-medium">
                  Đến {filterEndDate.toLocaleDateString("vi-VN")}
                </Text>
                <Box className="cursor-pointer hover:bg-yellow-200 rounded-full p-0.5 transition-colors" onClick={() => setFilterEndDate(undefined)}>
                  <Icon icon="zi-close" size={12} />
                </Box>
              </Box>
            )}
            <Box
              className="text-yellow-600 px-3 py-1.5 text-xs cursor-pointer hover:bg-yellow-50 rounded-full transition-colors font-medium"
              onClick={clearFilters}
            >
              <Text size="xSmall" className="text-yellow-600">✕ Xóa tất cả</Text>
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
              <Box key={dateKey} className="mb-6">
                <Box className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-50 flex justify-between items-center rounded-t-xl">
                  <Text size="small" className="font-semibold text-gray-700">
                    {dateKey}
                  </Text>
                  <Text
                    size="small"
                    className={`font-bold px-3 py-1 rounded-full ${
                      dayTotal >= 0 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {dayTotal >= 0 ? "+" : ""}
                    {formatCurrency(dayTotal)}
                  </Text>
                </Box>
                <Box className="px-4 bg-section rounded-b-xl shadow-sm">
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
                        className="flex items-center justify-between py-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors rounded-lg px-2"
                      >
                        <Box className="flex items-center space-x-3 flex-1">
                          <Box
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                            style={{
                              backgroundColor: `${category?.color}20`,
                            }}
                          >
                            <Icon
                              icon={(category?.icon || "zi-more-grid") as any}
                              style={{ color: category?.color }}
                              size={22}
                            />
                          </Box>
                          <Box className="flex-1 min-w-0">
                            <Text size="small" className="font-semibold text-gray-800">
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
                          className={`font-bold flex-shrink-0 ml-2 ${
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
        <Box className="p-5">
          <Text.Title className="mb-5 text-center">🔍 Bộ lọc</Text.Title>

          {/* Type Filter */}
          <Box className="mb-5">
            <Text size="small" className="mb-3 text-gray-700 font-medium">
              Loại giao dịch
            </Text>
            <Box className="flex gap-2">
              {[
                { value: "all", label: "Tất cả", icon: "zi-list" },
                { value: "income", label: "Thu nhập", icon: "zi-plus-circle" },
                { value: "expense", label: "Chi tiêu", icon: "zi-minus-circle" },
              ].map((option) => (
                <Box
                  key={option.value}
                  className={`flex-1 py-3 px-4 rounded-xl text-center cursor-pointer transition-all duration-200 shadow-sm ${
                    filterType === option.value
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md transform scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setFilterType(option.value as any)}
                >
                  <Icon icon={option.icon as any} className="mb-1" />
                  <Text size="xSmall" className={`font-medium ${filterType === option.value ? "text-white" : "text-gray-600"}`}>
                    {option.label}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Category Filter */}
          <Box className="mb-5">
            <Text size="small" className="mb-3 text-gray-700 font-medium">
              Danh mục
            </Text>
            <Select
              value={filterCategory}
              onChange={(value) => setFilterCategory(value as string)}
              className="bg-white border-2 border-gray-200 rounded-xl"
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
          <Box className="mb-5">
            <Text size="small" className="mb-3 text-gray-700 font-medium">
              Ví
            </Text>
            <Select
              value={filterWallet}
              onChange={(value) => setFilterWallet(value as string)}
              className="bg-white border-2 border-gray-200 rounded-xl"
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

          {/* Date Range Filter */}
          <Box className="mb-5">
            <Text size="small" className="mb-3 text-gray-700 font-medium">
              Khoảng thời gian
            </Text>
            <Box className="space-y-3">
              <DatePicker
                placeholder="Từ ngày"
                value={filterStartDate}
                onChange={(value) => setFilterStartDate(value)}
                dateFormat="dd/mm/yyyy"
                columnsFormat="DD-MM-YYYY"
                title="Chọn ngày bắt đầu"
                locale="vi-VN"
                mask
                maskClosable
                inputClass="bg-white border-2 border-gray-200 rounded-xl"
              />
              <DatePicker
                placeholder="Đến ngày"
                value={filterEndDate}
                onChange={(value) => setFilterEndDate(value)}
                dateFormat="dd/mm/yyyy"
                columnsFormat="DD-MM-YYYY"
                title="Chọn ngày kết thúc"
                locale="vi-VN"
                mask
                maskClosable
                startDate={filterStartDate}
                inputClass="bg-white border-2 border-gray-200 rounded-xl"
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box className="flex gap-3">
            <Button
              fullWidth
              variant="secondary"
              onClick={() => {
                clearFilters();
                setShowFilterSheet(false);
              }}
              className="h-12 font-semibold shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
              prefixIcon={<Icon icon="zi-delete" />}
            >
              Xóa bộ lọc
            </Button>
            <Button 
              fullWidth 
              onClick={() => setShowFilterSheet(false)}
              className="h-12 font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
              prefixIcon={<Icon icon="zi-check-circle" />}
            >
              Áp dụng
            </Button>
          </Box>
        </Box>
      </Sheet>
    </Page>
  );
};

export default HistoryPage;
