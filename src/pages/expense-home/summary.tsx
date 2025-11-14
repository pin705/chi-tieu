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
      <Box className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl p-6 mb-4 shadow-xl relative overflow-hidden">
        <Box className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
        <Box className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12" />
        <Box className="relative">
          <Box className="flex items-center mb-2">
            <Icon icon="zi-user-circle" className="text-white mr-2" size={20} />
            <Text size="xSmall" className="text-white opacity-90 font-medium">
              Tổng số dư
            </Text>
          </Box>
          <Text.Title size="large" className="text-white mt-1 font-bold">
            {formatCurrency(totalBalance)}
          </Text.Title>
        </Box>
      </Box>

      {/* Budget Alert */}
      {budgetStatus.hasBudget && budgetStatus.isExceeded && (
        <Box className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4 flex items-start space-x-3 shadow-sm">
          <Icon icon="zi-warning-solid" className="text-red-600 text-xl mt-0.5" />
          <Box className="flex-1">
            <Text className="text-red-800 font-semibold">
              ⚠️ Vượt ngân sách!
            </Text>
            <Text size="xSmall" className="text-red-600 mt-1">
              Chi tiêu vượt {formatCurrency(Math.abs(budgetStatus.remaining))} so với ngân sách
            </Text>
          </Box>
        </Box>
      )}

      {/* Budget Progress */}
      {budgetStatus.hasBudget && (
        <Box className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 mb-4 shadow-sm border border-blue-100">
          <Box className="flex items-center justify-between mb-3">
            <Box className="flex items-center">
              <Icon icon="zi-poll" className="text-blue-600 mr-2" size={20} />
              <Text.Title size="small">Ngân sách tháng</Text.Title>
            </Box>
            <Box
              className="flex items-center text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
              onClick={() => navigate("/budget")}
            >
              <Text size="xSmall" className="font-medium">Chi tiết</Text>
              <Icon icon="zi-arrow-right" size={16} className="ml-1" />
            </Box>
          </Box>
          <Box className="flex justify-between items-center mb-2">
            <Text size="xSmall" className="text-gray-700 font-medium">
              {formatCurrency(budgetStatus.spent)} / {formatCurrency(budgetStatus.budget)}
            </Text>
            <Text size="small" className={`font-bold ${budgetStatus.isExceeded ? "text-red-600" : "text-blue-600"}`}>
              {budgetStatus.percentage.toFixed(1)}%
            </Text>
          </Box>
          <Box className="w-full bg-gray-200 rounded-full h-2.5">
            <Box
              className={`h-2.5 rounded-full transition-all duration-300 ${
                budgetStatus.isExceeded ? "bg-red-600" : "bg-gradient-to-r from-blue-500 to-blue-600"
              }`}
              style={{
                width: `${Math.min(budgetStatus.percentage, 100)}%`,
              }}
            />
          </Box>
          {!budgetStatus.isExceeded && (
            <Text size="xSmall" className="text-gray-600 mt-2 flex items-center">
              <Icon icon="zi-check-circle" className="text-green-500 mr-1" size={14} />
              Còn lại: {formatCurrency(budgetStatus.remaining)}
            </Text>
          )}
        </Box>
      )}

      {/* Monthly Stats */}
      <Box className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 shadow-sm border border-gray-200">
        <Box className="flex items-center mb-4">
          <Icon icon="zi-clock-2" className="text-gray-700 mr-2" size={20} />
          <Text.Title size="small">Tháng này</Text.Title>
        </Box>
        <Box className="grid grid-cols-2 gap-4">
          <Box className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <Box className="flex items-center mb-2">
              <Icon icon="zi-plus-circle" className="text-green-500 mr-1" size={18} />
              <Text size="xSmall" className="text-gray-600 font-medium">
                Thu nhập
              </Text>
            </Box>
            <Text.Title size="small" className="text-green-600 font-bold">
              {formatCurrency(stats.income)}
            </Text.Title>
          </Box>
          <Box className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
            <Box className="flex items-center mb-2">
              <Icon icon="zi-minus-circle" className="text-red-500 mr-1" size={18} />
              <Text size="xSmall" className="text-gray-600 font-medium">
                Chi tiêu
              </Text>
            </Box>
            <Text.Title size="small" className="text-red-600 font-bold">
              {formatCurrency(stats.expense)}
            </Text.Title>
          </Box>
        </Box>
        <Box className="mt-4 pt-4 border-t-2 border-gray-200">
          <Box className="flex justify-between items-center bg-white rounded-xl p-3 shadow-sm">
            <Box className="flex items-center">
              <Icon icon="zi-poll" className="text-gray-600 mr-2" size={18} />
              <Text size="small" className="text-gray-700 font-medium">
                Còn lại
              </Text>
            </Box>
            <Text.Title
              size="small"
              className={`font-bold ${stats.balance >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {stats.balance >= 0 ? "+" : ""}{formatCurrency(stats.balance)}
            </Text.Title>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
