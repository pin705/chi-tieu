export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string; // Zalo icon name like "zi-home", "zi-clock", etc.
  color: string; // hex color
  type: "income" | "expense";
}

export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: "food",
    name: "Ăn uống",
    icon: "zi-home",
    color: "#ef4444",
    type: "expense",
  },
  {
    id: "transport",
    name: "Di chuyển",
    icon: "zi-location",
    color: "#f59e0b",
    type: "expense",
  },
  {
    id: "shopping",
    name: "Mua sắm",
    icon: "zi-gallery",
    color: "#ec4899",
    type: "expense",
  },
  {
    id: "entertainment",
    name: "Giải trí",
    icon: "zi-play",
    color: "#8b5cf6",
    type: "expense",
  },
  {
    id: "bills",
    name: "Hóa đơn",
    icon: "zi-note",
    color: "#06b6d4",
    type: "expense",
  },
  {
    id: "health",
    name: "Sức khỏe",
    icon: "zi-heart",
    color: "#10b981",
    type: "expense",
  },
  {
    id: "education",
    name: "Giáo dục",
    icon: "zi-bookmark",
    color: "#3b82f6",
    type: "expense",
  },
  {
    id: "housing",
    name: "Nhà ở",
    icon: "zi-home",
    color: "#059669",
    type: "expense",
  },
  {
    id: "clothing",
    name: "Quần áo",
    icon: "zi-user",
    color: "#d946ef",
    type: "expense",
  },
  {
    id: "beauty",
    name: "Làm đẹp",
    icon: "zi-star",
    color: "#f472b6",
    type: "expense",
  },
  {
    id: "sports",
    name: "Thể thao",
    icon: "zi-poll",
    color: "#0ea5e9",
    type: "expense",
  },
  {
    id: "travel",
    name: "Du lịch",
    icon: "zi-location-solid",
    color: "#14b8a6",
    type: "expense",
  },
  {
    id: "communication",
    name: "Liên lạc",
    icon: "zi-call",
    color: "#3b82f6",
    type: "expense",
  },
  {
    id: "insurance",
    name: "Bảo hiểm",
    icon: "zi-shield-solid",
    color: "#6366f1",
    type: "expense",
  },
  {
    id: "family",
    name: "Gia đình",
    icon: "zi-group",
    color: "#f59e0b",
    type: "expense",
  },
  {
    id: "pets",
    name: "Thú cưng",
    icon: "zi-heart-solid",
    color: "#84cc16",
    type: "expense",
  },
  {
    id: "gifts",
    name: "Quà tặng",
    icon: "zi-photo",
    color: "#f43f5e",
    type: "expense",
  },
  {
    id: "other-expense",
    name: "Khác",
    icon: "zi-more-grid",
    color: "#6b7280",
    type: "expense",
  },
];

export const DEFAULT_INCOME_CATEGORIES: ExpenseCategory[] = [
  {
    id: "salary",
    name: "Lương",
    icon: "zi-star",
    color: "#10b981",
    type: "income",
  },
  {
    id: "bonus",
    name: "Thưởng",
    icon: "zi-star-solid",
    color: "#f59e0b",
    type: "income",
  },
  {
    id: "gift",
    name: "Quà tặng",
    icon: "zi-photo",
    color: "#ec4899",
    type: "income",
  },
  {
    id: "investment",
    name: "Đầu tư",
    icon: "zi-poll",
    color: "#3b82f6",
    type: "income",
  },
  {
    id: "business",
    name: "Kinh doanh",
    icon: "zi-poll-solid",
    color: "#8b5cf6",
    type: "income",
  },
  {
    id: "part-time",
    name: "Làm thêm",
    icon: "zi-clock-2",
    color: "#06b6d4",
    type: "income",
  },
  {
    id: "refund",
    name: "Hoàn tiền",
    icon: "zi-reply",
    color: "#14b8a6",
    type: "income",
  },
  {
    id: "rental",
    name: "Cho thuê",
    icon: "zi-home",
    color: "#84cc16",
    type: "income",
  },
  {
    id: "other-income",
    name: "Khác",
    icon: "zi-more-grid",
    color: "#6b7280",
    type: "income",
  },
];
