import React, { FC } from "react";
import { Box, Text, Icon } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { sortedTransactionsState, categoriesState } from "expense-state";
import { formatCurrency } from "utils/format";
import { useNavigate } from "react-router-dom";

export const RecentTransactions: FC = () => {
  const transactions = useRecoilValue(sortedTransactionsState);
  const categories = useRecoilValue(categoriesState);
  const navigate = useNavigate();

  const recentTransactions = transactions.slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <Box className="px-4 pb-4">
        <Box className="flex justify-between items-center mb-3">
          <Text.Title size="small" className="font-semibold">Giao dịch gần đây</Text.Title>
        </Box>
        <Box className="text-center py-12 bg-white rounded-2xl ">
          <Icon icon="zi-clock-2" size={48} className="text-gray-300 mb-2" />
          <Text size="small" className="text-gray-400">Chưa có giao dịch nào</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="px-4 pb-4">
      <Box className="flex justify-between items-center mb-3">
        <Text.Title size="small" className="font-semibold">Giao dịch gần đây</Text.Title>
        <Text
          size="xSmall"
          className="text-emerald-600 cursor-pointer font-medium active:opacity-70"
          onClick={() => navigate("/history")}
        >
          Xem tất cả
        </Text>
      </Box>
      <Box className="space-y-2 bg-white rounded-2xl p-3 ">
        {recentTransactions.map((transaction) => {
          const category = categories.find(
            (c) => c.id === transaction.categoryId
          );
          const date = new Date(transaction.date);

          return (
            <Box
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
            >
              <Box className="flex items-center space-x-3">
                <Box
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${category?.color}15` }}
                >
                  <Icon
                    icon={(category?.icon || "zi-more-grid") as any}
                    style={{ color: category?.color }}
                    size={20}
                  />
                </Box>
                <Box>
                  <Text size="small" className="font-medium text-gray-900">
                    {category?.name || "Khác"}
                  </Text>
                  <Text size="xSmall" className="text-gray-500">
                    {date.toLocaleDateString("vi-VN")}
                  </Text>
                </Box>
              </Box>
              <Text
                size="small"
                className={`font-semibold ${
                  transaction.type === "income"
                    ? "text-emerald-600"
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
};
