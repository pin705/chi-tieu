import React, { FC, useState } from "react";
import {
  Page,
  Box,
  Text,
  List,
  Icon,
  Button,
  Sheet,
  Input,
  Select,
  useSnackbar,
} from "zmp-ui";
import DatePicker from "zmp-ui/date-picker";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  budgetsState,
  expenseCategoriesState,
  currentMonthBudgetState,
  currentMonthCategoryBudgetsState,
} from "expense-state";
import { Budget, BudgetFormData } from "types/budget";
import { formatCurrency } from "utils/format";
import AppHeader from "components/app-header";

const BudgetPage: FC = () => {
  const { openSnackbar } = useSnackbar();
  const [budgets, setBudgets] = useRecoilState(budgetsState);
  const expenseCategories = useRecoilValue(expenseCategoriesState);
  const monthlyBudget = useRecoilValue(currentMonthBudgetState);
  const categoryBudgets = useRecoilValue(currentMonthCategoryBudgetsState);

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState<BudgetFormData>({
    type: "monthly",
    amount: "",
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const handleAddBudget = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      openSnackbar({
        type: "error",
        text: "Vui lòng nhập số tiền hợp lệ",
      });
      return;
    }

    if (formData.type === "category" && !formData.categoryId) {
      openSnackbar({
        type: "error",
        text: "Vui lòng chọn danh mục",
      });
      return;
    }

    // Check if budget already exists
    const existingBudget = budgets.find(
      (b) =>
        b.month === formData.month &&
        b.year === formData.year &&
        b.type === formData.type &&
        (formData.type === "monthly" || b.categoryId === formData.categoryId)
    );

    if (existingBudget) {
      // Update existing budget
      setBudgets(
        budgets.map((b) =>
          b.id === existingBudget.id
            ? { ...b, amount: parseFloat(formData.amount) }
            : b
        )
      );
      openSnackbar({
        type: "success",
        text: "Đã cập nhật ngân sách",
      });
    } else {
      // Add new budget
      const newBudget: Budget = {
        id: Date.now().toString(),
        type: formData.type,
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        month: formData.month,
        year: formData.year,
        createdAt: Date.now(),
      };

      setBudgets([...budgets, newBudget]);
      openSnackbar({
        type: "success",
        text: "Đã thêm ngân sách",
      });
    }

    setShowAddSheet(false);
    setFormData({
      type: "monthly",
      amount: "",
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    });
    setSelectedDate(new Date());
  };

  const handleDeleteBudget = (budgetId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa ngân sách này?")) {
      setBudgets(budgets.filter((b) => b.id !== budgetId));
      openSnackbar({
        type: "success",
        text: "Đã xóa ngân sách",
      });
    }
  };

  const getMonthName = (month: number): string => {
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];
    return months[month];
  };

  return (
    <Page className="flex flex-col bg-background">
      <AppHeader title="Quản lý ngân sách" />
      <Box className="flex-1 overflow-auto pb-20">
        {/* Monthly Budget Section */}
        <Box className="px-4 pt-4">
          <Box className="flex items-center justify-between mb-3">
            <Text.Title size="small" className="font-semibold">Ngân sách tháng</Text.Title>
            <Button
              className="flex"
              size="small"
              onClick={() => {
                setFormData({
                  type: "monthly",
                  amount: monthlyBudget?.amount.toString() || "",
                  month: new Date().getMonth(),
                  year: new Date().getFullYear(),
                });
                setShowAddSheet(true);
              }}
              prefixIcon={<Icon icon="zi-plus" />}
            >
              {monthlyBudget ? "Sửa" : "Thêm"}
            </Button>
          </Box>

          {monthlyBudget ? (
            <Box className="p-5 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl text-white shadow-lg">
              <Text size="small" className="opacity-90">
                {getMonthName(monthlyBudget.month)} {monthlyBudget.year}
              </Text>
              <Text.Title size="large" className="mt-3 mb-4 font-bold">
                {formatCurrency(monthlyBudget.amount)}
              </Text.Title>
              <Button
                className="flex bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-md"
                size="small"
                variant="secondary"
                onClick={() => handleDeleteBudget(monthlyBudget.id)}
                prefixIcon={<Icon icon="zi-delete" />}
              >
                Xóa ngân sách
              </Button>
            </Box>
          ) : (
            <Box className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl text-center border-2 border-dashed border-gray-300">
              <Icon icon="zi-calendar" size={48} className="text-gray-400 mb-3" />
              <Text className="text-gray-500 font-medium">
                Chưa thiết lập ngân sách cho tháng này
              </Text>
            </Box>
          )}
        </Box>

        {/* Category Budgets Section */}
        <Box className="p-4">
          <Box className="flex items-center justify-between mb-4">
            <Text.Title size="small">💳 Ngân sách theo danh mục</Text.Title>
            <Button
              size="small"
              onClick={() => {
                setFormData({
                  type: "category",
                  amount: "",
                  categoryId: expenseCategories[0]?.id,
                  month: new Date().getMonth(),
                  year: new Date().getFullYear(),
                });
                setSelectedDate(new Date());
                setShowAddSheet(true);
              }}
              className="shadow-sm flex hover:shadow-md transition-shadow"
              prefixIcon={<Icon icon="zi-plus" />}
            >
              Thêm
            </Button>
          </Box>

          {categoryBudgets.length === 0 ? (
            <Box className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl text-center border-2 border-dashed border-gray-300">
              <Icon icon="zi-more-grid" size={48} className="text-gray-400 mb-3" />
              <Text className="text-gray-500 font-medium">
                Chưa có ngân sách theo danh mục
              </Text>
            </Box>
          ) : (
            <List>
              {categoryBudgets.map((budget) => {
                const category = expenseCategories.find(
                  (c) => c.id === budget.categoryId
                );
                return (
                  <List.Item
                    key={budget.id}
                    prefix={
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
                    }
                    title={category?.name || "Khác"}
                    subTitle={`${getMonthName(budget.month)} ${budget.year}`}
                    suffix={
                      <Box className="flex items-center space-x-2">
                        <Text className="font-semibold">
                          {formatCurrency(budget.amount)}
                        </Text>
                        <Box
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDeleteBudget(budget.id)}
                        >
                          <Icon icon="zi-delete" />
                        </Box>
                      </Box>
                    }
                  />
                );
              })}
            </List>
          )}
        </Box>
      </Box>

      {/* Add/Edit Budget Sheet */}
      <Sheet
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="p-5">
          <Box className="flex items-center justify-center mb-5">
            <Icon 
              icon={formData.type === "monthly" ? "zi-star" : "zi-more-grid"} 
              className="mr-2" 
              size={24}
            />
            <Text.Title>
              {formData.type === "monthly"
                ? "Ngân sách tháng"
                : "Ngân sách danh mục"}
            </Text.Title>
          </Box>

          {formData.type === "category" && (
            <Box className="mb-5">
              <Text size="small" className="mb-3 text-gray-700 font-medium">
                Danh mục
              </Text>
              <Select
                value={formData.categoryId}
                onChange={(value) =>
                  setFormData({ ...formData, categoryId: value as string })
                }
                className="bg-white border-2 border-gray-200 rounded-xl"
              >
                {expenseCategories.map((category) => (
                  <Select.Option
                    key={category.id}
                    value={category.id}
                    title={category.name}
                  />
                ))}
              </Select>
            </Box>
          )}

          <Box className="mb-5">
            <Text size="small" className="mb-3 text-gray-700 font-medium">
              Số tiền (VNĐ)
            </Text>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="Nhập số tiền"
              className="bg-white border-2 border-gray-200 rounded-xl"
            />
          </Box>

          <Box className="mb-5">
            <DatePicker
              label="Tháng/Năm"
              placeholder="Chọn tháng và năm"
              value={selectedDate}
              onChange={(value) => {
                setSelectedDate(value);
                setFormData({ 
                  ...formData, 
                  month: value.getMonth(), 
                  year: value.getFullYear() 
                });
              }}
              dateFormat="mm/yyyy"
              columnsFormat="MM-DD-YYYY"
              title="Chọn tháng và năm"
              locale="vi-VN"
              mask
              maskClosable
              inputClass="bg-white border-2 border-gray-200 rounded-xl"
            />
          </Box>

          <Box className="flex space-x-3">
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setShowAddSheet(false)}
              className="h-12 font-semibold shadow-sm hover:shadow-md transition-shadow"
            >
              Hủy
            </Button>
            <Button 
              fullWidth 
              onClick={handleAddBudget}
              className="h-12 font-semibold shadow-md hover:shadow-lg transition-shadow flex items-center justify-center"
              prefixIcon={<Icon icon="zi-check-circle" />}
            >
              Lưu
            </Button>
          </Box>
        </Box>
      </Sheet>
    </Page>
  );
};

export default BudgetPage;
