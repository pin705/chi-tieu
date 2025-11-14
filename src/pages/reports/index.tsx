import React, { FC, useState } from "react";
import { Page, Header, Box, Text, Tabs, Icon } from "zmp-ui";
import { useRecoilValue } from "recoil";
import {
  monthlyStatsState,
  transactionsByCategoryState,
  categoriesState,
  categoryBudgetStatusState,
  monthlyTrendState,
  weeklyTrendState,
} from "expense-state";
import { formatCurrency } from "utils/format";
import { ExpenseCategory } from "types/expense-category";
import { TrendChart } from "components/trend-chart";

interface CategoryStatItemProps {
  stat: { categoryId: string; amount: number; percentage: number };
  category?: ExpenseCategory;
  showBudget: boolean;
}

const CategoryStatItem: FC<CategoryStatItemProps> = ({
  stat,
  category,
  showBudget,
}) => {
  const budgetStatus = useRecoilValue(
    categoryBudgetStatusState(stat.categoryId)
  );

  return (
    <Box className="p-4 bg-gray-50 rounded-xl">
      <Box className="flex items-center justify-between mb-2">
        <Box className="flex items-center space-x-3">
          <Box
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `${category?.color}20`,
            }}
          >
            <Icon
              icon={(category?.icon || "zi-more-grid") as any}
              style={{ color: category?.color }}
            />
          </Box>
          <Box>
            <Text size="small" className="font-medium">
              {category?.name || "Khác"}
            </Text>
            {showBudget && budgetStatus.hasBudget && (
              <Text size="xSmall" className="text-gray-500">
                Ngân sách: {formatCurrency(budgetStatus.budget)}
              </Text>
            )}
          </Box>
        </Box>
        <Box className="text-right">
          <Text size="small" className="font-semibold">
            {formatCurrency(stat.amount)}
          </Text>
          <Text size="xSmall" className="text-gray-500">
            {stat.percentage.toFixed(1)}%
          </Text>
          {showBudget && budgetStatus.hasBudget && budgetStatus.isExceeded && (
            <Text size="xSmall" className="text-red-600">
              Vượt ngân sách!
            </Text>
          )}
        </Box>
      </Box>
      {/* Progress Bar */}
      <Box className="w-full bg-gray-200 rounded-full h-2">
        <Box
          className="h-2 rounded-full"
          style={{
            width: `${stat.percentage}%`,
            backgroundColor: category?.color,
          }}
        />
      </Box>
      {/* Budget Progress Bar */}
      {showBudget && budgetStatus.hasBudget && (
        <Box className="mt-2">
          <Box className="flex justify-between items-center mb-1">
            <Text size="xSmall" className="text-gray-600">
              So với ngân sách
            </Text>
            <Text
              size="xSmall"
              className={budgetStatus.isExceeded ? "text-red-600" : "text-blue-600"}
            >
              {budgetStatus.percentage.toFixed(1)}%
            </Text>
          </Box>
          <Box className="w-full bg-gray-200 rounded-full h-1.5">
            <Box
              className={`h-1.5 rounded-full ${
                budgetStatus.isExceeded ? "bg-red-600" : "bg-blue-600"
              }`}
              style={{
                width: `${Math.min(budgetStatus.percentage, 100)}%`,
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

const ReportsPage: FC = () => {
  const stats = useRecoilValue(monthlyStatsState);
  const categories = useRecoilValue(categoriesState);
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [viewMode, setViewMode] = useState<"category" | "trend">("category");

  const categoryStats = useRecoilValue(
    transactionsByCategoryState(activeTab)
  );
  
  const monthlyTrend = useRecoilValue(monthlyTrendState(6));
  const weeklyTrend = useRecoilValue(weeklyTrendState);

  const getMonthName = (month: number): string => {
    const months = [
      "T1", "T2", "T3", "T4", "T5", "T6",
      "T7", "T8", "T9", "T10", "T11", "T12",
    ];
    return months[month];
  };

  return (
    <Page className="flex flex-col">
      <Header title="Báo cáo" showBackIcon={false} />
      <Box className="flex-1 overflow-auto">
        {/* Monthly Summary */}
        <Box className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
          <Text size="xSmall" className="text-white opacity-90 mb-2">
            Tháng này
          </Text>
          <Box className="grid grid-cols-3 gap-4 text-white">
            <Box>
              <Text size="xSmall" className="opacity-90">
                Thu nhập
              </Text>
              <Text.Title size="small" className="mt-1">
                {formatCurrency(stats.income)}
              </Text.Title>
            </Box>
            <Box>
              <Text size="xSmall" className="opacity-90">
                Chi tiêu
              </Text>
              <Text.Title size="small" className="mt-1">
                {formatCurrency(stats.expense)}
              </Text.Title>
            </Box>
            <Box>
              <Text size="xSmall" className="opacity-90">
                Còn lại
              </Text>
              <Text.Title size="small" className="mt-1">
                {formatCurrency(stats.balance)}
              </Text.Title>
            </Box>
          </Box>
        </Box>

        {/* Tabs for Expense/Income */}
        <Box className="p-4">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as "expense" | "income")}
          >
            <Tabs.Tab key="expense" label="Chi tiêu" />
            <Tabs.Tab key="income" label="Thu nhập" />
          </Tabs>
        </Box>

        {/* View Mode Toggle */}
        <Box className="px-4 pb-4">
          <Box className="flex gap-2">
            <Box
              className={`flex-1 py-2 px-4 rounded-lg text-center cursor-pointer transition-all ${
                viewMode === "category"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setViewMode("category")}
            >
              <Text size="small" className={viewMode === "category" ? "text-white" : "text-gray-600"}>
                Theo danh mục
              </Text>
            </Box>
            <Box
              className={`flex-1 py-2 px-4 rounded-lg text-center cursor-pointer transition-all ${
                viewMode === "trend"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setViewMode("trend")}
            >
              <Text size="small" className={viewMode === "trend" ? "text-white" : "text-gray-600"}>
                Xu hướng
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Category Breakdown */}
        {viewMode === "category" && (
          <Box className="px-4 pb-4">
            {categoryStats.length === 0 ? (
              <Box className="text-center py-8">
                <Text className="text-gray-400">
                  Chưa có {activeTab === "expense" ? "chi tiêu" : "thu nhập"} nào
                  trong tháng này
                </Text>
              </Box>
            ) : (
              <Box className="space-y-3">
                {categoryStats.map((stat) => {
                  const category = categories.find(
                    (c) => c.id === stat.categoryId
                  );

                  return (
                    <CategoryStatItem
                      key={stat.categoryId}
                      stat={stat}
                      category={category}
                      showBudget={activeTab === "expense"}
                    />
                  );
                })}
              </Box>
            )}
          </Box>
        )}

        {/* Trend Charts */}
        {viewMode === "trend" && (
          <Box className="px-4 pb-4">
            {/* Weekly Trend */}
            <Box className="mb-6">
              <Text.Title size="small" className="mb-3">
                Xu hướng theo tuần (Tháng này)
              </Text.Title>
              <Box className="bg-white rounded-xl p-4 shadow-sm">
                <TrendChart
                  data={weeklyTrend.map((w) => ({
                    label: `T${w.week}`,
                    value: activeTab === "expense" ? w.expense : w.income,
                    color: activeTab === "expense" ? "#EF4444" : "#10B981",
                  }))}
                  height={150}
                  type="bar"
                />
              </Box>
            </Box>

            {/* Monthly Trend */}
            <Box className="mb-6">
              <Text.Title size="small" className="mb-3">
                Xu hướng 6 tháng
              </Text.Title>
              <Box className="bg-white rounded-xl p-4 shadow-sm">
                <TrendChart
                  data={monthlyTrend.map((m) => ({
                    label: getMonthName(m.month),
                    value: activeTab === "expense" ? m.expense : m.income,
                    color: activeTab === "expense" ? "#EF4444" : "#10B981",
                  }))}
                  height={180}
                  type="line"
                />
              </Box>
            </Box>

            {/* Comparison Chart */}
            <Box>
              <Text.Title size="small" className="mb-3">
                So sánh Thu - Chi (6 tháng)
              </Text.Title>
              <Box className="bg-white rounded-xl p-4 shadow-sm">
                <Box className="space-y-4">
                  {monthlyTrend.map((m, i) => (
                    <Box key={i}>
                      <Box className="flex justify-between items-center mb-2">
                        <Text size="small" className="font-medium">
                          {getMonthName(m.month)} {m.year}
                        </Text>
                        <Text size="xSmall" className={m.income >= m.expense ? "text-green-600" : "text-red-600"}>
                          {formatCurrency(m.income - m.expense)}
                        </Text>
                      </Box>
                      <Box className="flex gap-2">
                        <Box className="flex-1">
                          <Box className="flex justify-between mb-1">
                            <Text size="xSmall" className="text-green-600">Thu</Text>
                            <Text size="xSmall" className="text-green-600">{formatCurrency(m.income)}</Text>
                          </Box>
                          <Box className="w-full bg-gray-100 rounded-full h-2">
                            <Box
                              className="h-2 rounded-full bg-green-600"
                              style={{
                                width: `${Math.max(...monthlyTrend.map(t => t.income)) > 0 ? (m.income / Math.max(...monthlyTrend.map(t => t.income))) * 100 : 0}%`,
                              }}
                            />
                          </Box>
                        </Box>
                        <Box className="flex-1">
                          <Box className="flex justify-between mb-1">
                            <Text size="xSmall" className="text-red-600">Chi</Text>
                            <Text size="xSmall" className="text-red-600">{formatCurrency(m.expense)}</Text>
                          </Box>
                          <Box className="w-full bg-gray-100 rounded-full h-2">
                            <Box
                              className="h-2 rounded-full bg-red-600"
                              style={{
                                width: `${Math.max(...monthlyTrend.map(t => t.expense)) > 0 ? (m.expense / Math.max(...monthlyTrend.map(t => t.expense))) * 100 : 0}%`,
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Page>
  );
};

export default ReportsPage;
