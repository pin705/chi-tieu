import React, { FC, useState } from "react";
import {
  Page,
  Header,
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
import { useRecoilValue, useRecoilState } from "recoil";
import {
  budgetsState,
  expenseCategoriesState,
  currentMonthBudgetState,
  currentMonthCategoryBudgetsState,
} from "expense-state";
import { Budget, BudgetFormData } from "types/budget";
import { formatCurrency } from "utils/format";

const BudgetPage: FC = () => {
  const { openSnackbar } = useSnackbar();
  const [budgets, setBudgets] = useRecoilState(budgetsState);
  const expenseCategories = useRecoilValue(expenseCategoriesState);
  const monthlyBudget = useRecoilValue(currentMonthBudgetState);
  const categoryBudgets = useRecoilValue(currentMonthCategoryBudgetsState);

  const [showAddSheet, setShowAddSheet] = useState(false);
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
    <Page className="flex flex-col">
      <Header title="Quản lý ngân sách" />
      <Box className="flex-1 overflow-auto pb-4">
        {/* Monthly Budget Section */}
        <Box className="p-4">
          <Box className="flex items-center justify-between mb-3">
            <Text.Title size="small">Ngân sách tháng</Text.Title>
            <Button
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
            >
              <Icon icon="zi-plus" className="mr-1" />
              {monthlyBudget ? "Sửa" : "Thêm"}
            </Button>
          </Box>

          {monthlyBudget ? (
            <Box className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
              <Text size="xSmall" className="opacity-90">
                {getMonthName(monthlyBudget.month)} {monthlyBudget.year}
              </Text>
              <Text.Title size="large" className="mt-2">
                {formatCurrency(monthlyBudget.amount)}
              </Text.Title>
              <Button
                size="small"
                variant="secondary"
                className="mt-3 bg-white text-blue-600"
                onClick={() => handleDeleteBudget(monthlyBudget.id)}
              >
                <Icon icon="zi-delete" className="mr-1" />
                Xóa
              </Button>
            </Box>
          ) : (
            <Box className="p-6 bg-gray-50 rounded-xl text-center">
              <Text className="text-gray-500">
                Chưa thiết lập ngân sách cho tháng này
              </Text>
            </Box>
          )}
        </Box>

        {/* Category Budgets Section */}
        <Box className="p-4">
          <Box className="flex items-center justify-between mb-3">
            <Text.Title size="small">Ngân sách theo danh mục</Text.Title>
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
                setShowAddSheet(true);
              }}
            >
              <Icon icon="zi-plus" className="mr-1" />
              Thêm
            </Button>
          </Box>

          {categoryBudgets.length === 0 ? (
            <Box className="p-6 bg-gray-50 rounded-xl text-center">
              <Text className="text-gray-500">
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
                    subtitle={`${getMonthName(budget.month)} ${budget.year}`}
                    suffix={
                      <Box className="flex items-center space-x-2">
                        <Text className="font-semibold">
                          {formatCurrency(budget.amount)}
                        </Text>
                        <Icon
                          icon="zi-delete"
                          className="text-red-500 cursor-pointer"
                          onClick={() => handleDeleteBudget(budget.id)}
                        />
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
        <Box className="p-4">
          <Text.Title className="mb-4">
            {formData.type === "monthly"
              ? "Ngân sách tháng"
              : "Ngân sách danh mục"}
          </Text.Title>

          {formData.type === "category" && (
            <Box className="mb-4">
              <Text size="small" className="mb-2 text-gray-600">
                Danh mục
              </Text>
              <Select
                value={formData.categoryId}
                onChange={(value) =>
                  setFormData({ ...formData, categoryId: value as string })
                }
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

          <Box className="mb-4">
            <Text size="small" className="mb-2 text-gray-600">
              Số tiền (VNĐ)
            </Text>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="Nhập số tiền"
            />
          </Box>

          <Box className="flex space-x-2">
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setShowAddSheet(false)}
            >
              Hủy
            </Button>
            <Button fullWidth onClick={handleAddBudget}>
              Lưu
            </Button>
          </Box>
        </Box>
      </Sheet>
    </Page>
  );
};

export default BudgetPage;
