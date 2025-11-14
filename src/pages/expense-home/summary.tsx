import React, { FC } from "react";
import { Box, Text, Icon } from "zmp-ui";
import { useRecoilValue } from "recoil";
import { monthlyStatsState, totalBalanceState, budgetStatusState } from "expense-state";
import { formatCurrency } from "utils/format";
import { useNavigate } from "react-router-dom";

export const Summary: FC = () => {
  const stats = useRecoilValue(monthlyStatsState);
  const totalBalance = useRecoilValue(totalBalanceState);
  const budgetStatus = useRecoilValue(budgetStatusState);
  const navigate = useNavigate();

  return (
    <Box className="m-4">
      {/* Total Balance Card */}
      <Box className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-4 shadow-lg">
        <Text size="xSmall" className="text-white opacity-90">
          Tổng số dư
        </Text>
        <Text.Title size="large" className="text-white mt-1">
          {formatCurrency(totalBalance)}
        </Text.Title>
      </Box>

      {/* Budget Alert */}
      {budgetStatus.hasBudget && budgetStatus.isExceeded && (
        <Box className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start space-x-3">
          <Icon icon="zi-warning-solid" className="text-red-600 text-xl" />
          <Box className="flex-1">
            <Text className="text-red-800 font-medium">
              Vượt ngân sách!
            </Text>
            <Text size="xSmall" className="text-red-600 mt-1">
              Chi tiêu vượt {formatCurrency(Math.abs(budgetStatus.remaining))} so với ngân sách
            </Text>
          </Box>
        </Box>
      )}

      {/* Budget Progress */}
      {budgetStatus.hasBudget && (
        <Box className="bg-blue-50 rounded-2xl p-4 mb-4">
          <Box className="flex items-center justify-between mb-2">
            <Text.Title size="small">Ngân sách tháng</Text.Title>
            <Text
              size="xSmall"
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/budget")}
            >
              Chi tiết →
            </Text>
          </Box>
          <Box className="flex justify-between items-center mb-2">
            <Text size="xSmall" className="text-gray-600">
              {formatCurrency(budgetStatus.spent)} / {formatCurrency(budgetStatus.budget)}
            </Text>
            <Text size="xSmall" className={budgetStatus.isExceeded ? "text-red-600" : "text-blue-600"}>
              {budgetStatus.percentage.toFixed(1)}%
            </Text>
          </Box>
          <Box className="w-full bg-gray-200 rounded-full h-2">
            <Box
              className={`h-2 rounded-full transition-all ${
                budgetStatus.isExceeded ? "bg-red-600" : "bg-blue-600"
              }`}
              style={{
                width: `${Math.min(budgetStatus.percentage, 100)}%`,
              }}
            />
          </Box>
          {!budgetStatus.isExceeded && (
            <Text size="xSmall" className="text-gray-600 mt-2">
              Còn lại: {formatCurrency(budgetStatus.remaining)}
            </Text>
          )}
        </Box>
      )}

      {/* Monthly Stats */}
      <Box className="bg-gray-50 rounded-2xl p-4">
        <Text.Title size="small" className="mb-3">
          Tháng này
        </Text.Title>
        <Box className="grid grid-cols-2 gap-4">
          <Box>
            <Text size="xSmall" className="text-gray-600">
              Thu nhập
            </Text>
            <Text.Title size="small" className="text-green-600 mt-1">
              +{formatCurrency(stats.income)}
            </Text.Title>
          </Box>
          <Box>
            <Text size="xSmall" className="text-gray-600">
              Chi tiêu
            </Text>
            <Text.Title size="small" className="text-red-600 mt-1">
              -{formatCurrency(stats.expense)}
            </Text.Title>
          </Box>
        </Box>
        <Box className="mt-4 pt-4 border-t border-gray-200">
          <Box className="flex justify-between items-center">
            <Text size="small" className="text-gray-600">
              Còn lại
            </Text>
            <Text.Title
              size="small"
              className={stats.balance >= 0 ? "text-green-600" : "text-red-600"}
            >
              {formatCurrency(stats.balance)}
            </Text.Title>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
