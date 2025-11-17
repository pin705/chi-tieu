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
    <Box className="px-4 pt-4 pb-2">
      {/* Total Balance Card */}
      <Box className="bg-white rounded-2xl p-6 mb-3 shadow-md relative overflow-hidden">
        <Box className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
        <Box className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />
        <Box className="relative">
          <Box className="flex items-center mb-1">
            <Icon icon="zi-user-circle" className="opacity-90 mr-2" size={18} />
            <Text size="xSmall" className="opacity-90 font-medium">
              Tổng số dư
            </Text>
          </Box>
          <Text.Title size="large" className="mt-1 font-bold text-3xl">
            {formatCurrency(totalBalance)}
          </Text.Title>
        </Box>
      </Box>

      {/* Budget Alert */}
      {budgetStatus.hasBudget && budgetStatus.isExceeded && (
        <Box className="bg-red-50  rounded-2xl p-4 mb-3 flex items-start space-x-3">
          <Box className="bg-red-100 rounded-full p-2 flex items-center justify-center">
            <Icon icon="zi-warning-solid" className="text-red-600" size={20} />
          </Box>
          <Box className="flex-1">
            <Text className="text-red-800 font-semibold text-sm">
              Vượt ngân sách!
            </Text>
            <Text size="xSmall" className="text-red-600 mt-0.5">
              Chi tiêu vượt {formatCurrency(Math.abs(budgetStatus.remaining))} so với ngân sách
            </Text>
          </Box>
        </Box>
      )}

      {/* Budget Progress */}
      {budgetStatus.hasBudget && (
        <Box className="bg-white rounded-2xl p-5 mb-3 ">
          <Box className="flex items-center justify-between mb-3">
            <Box className="flex items-center">
              <Box className="bg-blue-50 rounded-full p-2 mr-2">
                <Icon icon="zi-poll" className="text-blue-600" size={18} />
              </Box>
              <Text.Title size="small" className="font-semibold">Ngân sách tháng</Text.Title>
            </Box>
            <Box
              className="flex items-center text-blue-600 cursor-pointer active:opacity-70 transition-opacity"
              onClick={() => navigate("/budget")}
            >
              <Text size="xSmall" className="font-medium">Chi tiết</Text>
              <Icon icon="zi-arrow-right" size={16} className="ml-1" />
            </Box>
          </Box>
          <Box className="flex justify-between items-center mb-2">
            <Text size="xSmall" className="text-gray-600 font-medium">
              {formatCurrency(budgetStatus.spent)} / {formatCurrency(budgetStatus.budget)}
            </Text>
            <Text size="small" className={`font-bold ${budgetStatus.isExceeded ? "text-red-600" : "text-emerald-600"}`}>
              {budgetStatus.percentage.toFixed(1)}%
            </Text>
          </Box>
          <Box className="w-full bg-gray-100 rounded-full h-2">
            <Box
              className={`h-2 rounded-full transition-all duration-300 ${
                budgetStatus.isExceeded ? "bg-red-500" : "bg-yellow-500"
              }`}
              style={{
                width: `${Math.min(budgetStatus.percentage, 100)}%`,
              }}
            />
          </Box>
          {!budgetStatus.isExceeded && (
            <Text size="xSmall" className="text-gray-600 mt-2 flex items-center">
              <Icon icon="zi-check-circle" className="text-emerald-500 mr-1" size={14} />
              Còn lại: {formatCurrency(budgetStatus.remaining)}
            </Text>
          )}
        </Box>
      )}

      {/* Monthly Stats */}
      <Box className="bg-white rounded-2xl p-5 ">
        <Box className="flex items-center mb-4">
          <Box className="bg-gray-50 rounded-full p-2 mr-2">
            <Icon icon="zi-clock-2" className="text-gray-700" size={18} />
          </Box>
          <Text.Title size="small" className="font-semibold">Tháng này</Text.Title>
        </Box>
        <Box className="grid grid-cols-2 gap-3">
          <Box className="bg-green-50 rounded-xl p-4 ">
            <Box className="flex items-center mb-2">
              <Icon icon="zi-plus-circle" className="text-green-600 mr-1.5" size={16} />
              <Text size="xSmall" className="text-green-700 font-medium">
                Thu nhập
              </Text>
            </Box>
            <Text.Title size="small" className="text-green-600 font-bold">
              {formatCurrency(stats.income)}
            </Text.Title>
          </Box>
          <Box className="bg-red-50 rounded-xl p-4 ">
            <Box className="flex items-center mb-2">
              <Icon icon="zi-minus-circle" className="text-red-600 mr-1.5" size={16} />
              <Text size="xSmall" className="text-red-700 font-medium">
                Chi tiêu
              </Text>
            </Box>
            <Text.Title size="small" className="text-red-600 font-bold">
              {formatCurrency(stats.expense)}
            </Text.Title>
          </Box>
        </Box>
        <Box className="mt-3 pt-3 border-t border-gray-200">
          <Box className="flex justify-between items-center bg-gray-50 rounded-xl p-3">
            <Box className="flex items-center">
              <Icon icon="zi-poll" className="text-gray-600 mr-2" size={16} />
              <Text size="small" className="text-gray-700 font-medium">
                Còn lại
              </Text>
            </Box>
            <Text.Title
              size="small"
              className={`font-bold ${stats.balance >= 0 ? "text-emerald-600" : "text-red-600"}`}
            >
              {stats.balance >= 0 ? "+" : ""}{formatCurrency(stats.balance)}
            </Text.Title>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
