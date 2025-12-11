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
    <Box className="px-4 pt-6 pb-2 -mt-4 relative z-10">
      {/* Total Balance Card with Gradient */}
      <Box 
        className="rounded-3xl p-6 mb-4 shadow-card relative overflow-hidden animate-scale-in"
        style={{
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        }}
      >
        <Box className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
        <Box className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16" />
        <Box className="relative">
          <Box className="flex items-center mb-2">
            <Box className="bg-white/20 rounded-full p-2 mr-2">
              <Icon icon="zi-user-circle" className="text-white" size={20} />
            </Box>
            <Text size="small" className="text-white/90 font-semibold">
              Tổng số dư
            </Text>
          </Box>
          <Text.Title className="mt-2 font-bold text-white" style={{ fontSize: '32px' }}>
            {formatCurrency(totalBalance)}
          </Text.Title>
        </Box>
      </Box>

      {/* Budget Alert with modern styling */}
      {budgetStatus.hasBudget && budgetStatus.isExceeded && (
        <Box className="bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl p-4 mb-4 flex items-start space-x-3 shadow-soft animate-slide-up">
          <Box className="bg-red-500 rounded-2xl p-2.5 flex items-center justify-center shadow-md">
            <Icon icon="zi-warning-solid" className="text-white" size={22} />
          </Box>
          <Box className="flex-1">
            <Text className="text-red-800 font-bold text-sm mb-1">
              ⚠️ Vượt ngân sách!
            </Text>
            <Text size="xSmall" className="text-red-600 font-medium">
              Chi tiêu vượt {formatCurrency(Math.abs(budgetStatus.remaining))} so với kế hoạch
            </Text>
          </Box>
        </Box>
      )}

      {/* Budget Progress Card */}
      {budgetStatus.hasBudget && (
        <Box className="bg-white dark:bg-dark-surface rounded-2xl p-5 mb-4 shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center">
              <Box className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl p-2.5 mr-3 shadow-sm">
                <Icon icon="zi-poll" className="text-indigo-600" size={20} />
              </Box>
              <Text.Title size="small" className="font-bold text-gray-900 dark:text-white">
                Ngân sách tháng này
              </Text.Title>
            </Box>
            <Box
              className="flex items-center px-3 py-1.5 rounded-full bg-indigo-50 cursor-pointer active:scale-95 transition-transform"
              onClick={() => navigate("/budget")}
            >
              <Text size="xSmall" className="text-indigo-600 font-semibold mr-1">Chi tiết</Text>
              <Icon icon="zi-arrow-right" size={14} className="text-indigo-600" />
            </Box>
          </Box>
          <Box className="flex justify-between items-center mb-3">
            <Text size="small" className="text-gray-600 dark:text-gray-400 font-semibold">
              {formatCurrency(budgetStatus.spent)} / {formatCurrency(budgetStatus.budget)}
            </Text>
            <Box className={`px-3 py-1 rounded-full ${budgetStatus.isExceeded ? 'bg-red-100' : 'bg-indigo-100'}`}>
              <Text size="small" className={`font-bold ${budgetStatus.isExceeded ? "text-red-600" : "text-indigo-600"}`}>
                {budgetStatus.percentage.toFixed(0)}%
              </Text>
            </Box>
          </Box>
          <Box className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <Box
              className={`h-3 rounded-full transition-all duration-500 ${
                budgetStatus.isExceeded 
                  ? "bg-gradient-to-r from-red-500 to-red-600" 
                  : "bg-gradient-to-r from-indigo-500 to-indigo-600"
              }`}
              style={{
                width: `${Math.min(budgetStatus.percentage, 100)}%`,
              }}
            />
          </Box>
          {!budgetStatus.isExceeded && (
            <Box className="flex items-center mt-3 px-3 py-2 bg-emerald-50 rounded-xl">
              <Icon icon="zi-check-circle" className="text-emerald-500 mr-2" size={16} />
              <Text size="xSmall" className="text-emerald-700 font-semibold">
                Còn lại: {formatCurrency(budgetStatus.remaining)}
              </Text>
            </Box>
          )}
        </Box>
      )}

      {/* Monthly Stats Card */}
      <Box className="bg-white dark:bg-dark-surface rounded-2xl p-5 shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Box className="flex items-center mb-4">
          <Box className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-2.5 mr-3 shadow-sm">
            <Icon icon="zi-clock-2" className="text-gray-700" size={20} />
          </Box>
          <Text.Title size="small" className="font-bold text-gray-900 dark:text-white">
            Tháng này
          </Text.Title>
        </Box>
        <Box className="grid grid-cols-2 gap-3 mb-4">
          <Box className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 shadow-sm">
            <Box className="flex items-center mb-2">
              <Icon icon="zi-plus-circle" className="text-emerald-600 mr-2" size={18} />
              <Text size="xSmall" className="text-emerald-700 font-bold">
                Thu nhập
              </Text>
            </Box>
            <Text.Title size="small" className="text-emerald-600 font-bold">
              {formatCurrency(stats.income)}
            </Text.Title>
          </Box>
          <Box className="bg-gradient-to-br from-rose-50 to-red-50 rounded-2xl p-4 shadow-sm">
            <Box className="flex items-center mb-2">
              <Icon icon="zi-minus-circle" className="text-rose-600 mr-2" size={18} />
              <Text size="xSmall" className="text-rose-700 font-bold">
                Chi tiêu
              </Text>
            </Box>
            <Text.Title size="small" className="text-rose-600 font-bold">
              {formatCurrency(stats.expense)}
            </Text.Title>
          </Box>
        </Box>
        <Box className="pt-3 border-t border-gray-100 dark:border-gray-700">
          <Box className="flex justify-between items-center bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4">
            <Box className="flex items-center">
              <Icon icon="zi-poll" className="text-gray-600 dark:text-gray-300 mr-2" size={18} />
              <Text size="small" className="text-gray-700 dark:text-gray-200 font-bold">
                Còn lại
              </Text>
            </Box>
            <Text.Title
              size="small"
              className={`font-bold ${stats.balance >= 0 ? "text-indigo-600 dark:text-indigo-400" : "text-red-600 dark:text-red-400"}`}
            >
              {stats.balance >= 0 ? "+" : ""}{formatCurrency(stats.balance)}
            </Text.Title>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
