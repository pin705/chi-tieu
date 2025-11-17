import React, { FC, useState } from "react";
import { Page, Header, Box, Text, Icon, Button } from "zmp-ui";
import { useNavigate } from "react-router-dom";

interface GuideStep {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    icon: "zi-user-circle",
    title: "Trang chủ",
    description: "Xem tổng quan tài chính, số dư ví và giao dịch gần đây. Sử dụng nút ghi chép nhanh để thêm chi tiêu/thu nhập nhanh chóng.",
    color: "#3b82f6",
  },
  {
    icon: "zi-plus-circle",
    title: "Thêm giao dịch",
    description: "Nhấn vào nút Chi tiêu hoặc Thu nhập màu đỏ/xanh trên trang chủ. Chọn danh mục, ví, nhập số tiền và ghi chú.",
    color: "#10b981",
  },
  {
    icon: "zi-calendar",
    title: "Lịch sử giao dịch",
    description: "Xem tất cả giao dịch đã thực hiện, lọc theo ngày. Bạn có thể xem chi tiết, chỉnh sửa hoặc xóa giao dịch.",
    color: "#f59e0b",
  },
  {
    icon: "zi-poll",
    title: "Báo cáo",
    description: "Xem biểu đồ và thống kê chi tiêu theo danh mục, theo thời gian. Giúp bạn hiểu rõ thói quen chi tiêu của mình.",
    color: "#8b5cf6",
  },
  {
    icon: "zi-star",
    title: "Quản lý ngân sách",
    description: "Đặt giới hạn chi tiêu cho từng danh mục theo tháng. Ứng dụng sẽ cảnh báo khi bạn sắp vượt ngân sách.",
    color: "#ec4899",
  },
  {
    icon: "zi-user",
    title: "Quản lý ví",
    description: "Tạo và quản lý các ví khác nhau như Tiền mặt, Ngân hàng, ZaloPay. Theo dõi số dư từng ví.",
    color: "#06b6d4",
  },
  {
    icon: "zi-list-1",
    title: "Quản lý danh mục",
    description: "Tùy chỉnh danh mục chi tiêu và thu nhập theo nhu cầu. Thêm, sửa, xóa danh mục và đổi màu sắc, icon.",
    color: "#ef4444",
  },
];

const TIPS = [
  "Ghi chép mọi chi tiêu hàng ngày để theo dõi chính xác",
  "Đặt ngân sách cho từng danh mục để kiểm soát chi tiêu",
  "Xem báo cáo thường xuyên để hiểu thói quen tiêu dùng",
  "Sử dụng nhiều ví để quản lý nguồn tiền hiệu quả",
  "Thêm ghi chú cho giao dịch để dễ nhớ mục đích chi tiêu",
];

const GuidePage: FC = () => {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <Page className="flex flex-col bg-gray-50">
      <Header title="Hướng dẫn sử dụng" showBackIcon={true} />
      <Box className="flex-1 overflow-auto pb-24">
        {/* Welcome Section */}
        <Box className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 p-8 relative overflow-hidden">
          <Box className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
          <Box className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />
          <Box className="flex items-center justify-center mb-4 relative z-10">
            <Box className="bg-white bg-opacity-25 rounded-full p-4 backdrop-blur-sm">
              <Icon icon="zi-help-circle" size={40} className="text-white" />
            </Box>
          </Box>
          <Text.Title className="text-white text-center text-2xl font-bold mb-2 relative z-10">
            Chào mừng đến với<br/>Heo Chi Tiêu
          </Text.Title>
          <Text className="text-white text-center opacity-95 relative z-10">
            Ứng dụng quản lý tài chính cá nhân thông minh
          </Text>
        </Box>

        {/* Guide Steps */}
        <Box className="px-4 pt-4">
          <Box className="mb-3">
            <Text.Title size="small" className="text-gray-800 mb-1 font-semibold">
              Các tính năng chính
            </Text.Title>
            <Text size="small" className="text-gray-600">
              Tìm hiểu cách sử dụng từng tính năng của ứng dụng
            </Text>
          </Box>

          <Box className="space-y-2.5">
            {GUIDE_STEPS.map((step, index) => (
              <Box
                key={index}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all "
                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
              >
                <Box className="p-4 flex items-start">
                  <Box
                    className="w-12 h-12 rounded-xl flex items-center justify-center mr-3 flex-shrink-0"
                    style={{ backgroundColor: step.color + "15" }}
                  >
                    <Icon icon={step.icon as any} size={22} style={{ color: step.color }} />
                  </Box>
                  <Box className="flex-1">
                    <Text className="font-semibold text-gray-900 mb-0.5">
                      {index + 1}. {step.title}
                    </Text>
                    {expandedStep === index && (
                      <Text size="small" className="text-gray-600 mt-2 leading-relaxed">
                        {step.description}
                      </Text>
                    )}
                  </Box>
                  <Icon
                    icon={expandedStep === index ? "zi-chevron-up" : "zi-chevron-down"}
                    size={20}
                    className="text-gray-400 ml-2 flex-shrink-0"
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Tips Section */}
        <Box className="px-4 pt-4">
          <Box className="mb-3">
            <Text.Title size="small" className="text-gray-800 font-semibold">
              Mẹo sử dụng hiệu quả
            </Text.Title>
          </Box>
          <Box className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
            <Box className="space-y-3">
              {TIPS.map((tip, index) => (
                <Box key={index} className="flex items-start">
                  <Box className="bg-amber-100 rounded-full p-1.5 mr-3 mt-0.5 flex-shrink-0">
                    <Icon icon="zi-check-circle" size={14} className="text-amber-600" />
                  </Box>
                  <Text size="small" className="text-gray-700 flex-1 leading-relaxed">
                    {tip}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Quick Start */}
        <Box className="px-4 pt-4">
          <Box className="bg-white rounded-2xl p-5 ">
            <Text.Title size="small" className="text-gray-800 mb-4 font-semibold">
              Bắt đầu ngay
            </Text.Title>
            <Box className="space-y-2.5">
              <Button
                fullWidth
                variant="primary"
                onClick={() => navigate("/add-transaction?type=expense")}
                className="flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-600 border-0"
              >
                <Icon icon="zi-plus-circle" className="mr-2" />
                Thêm giao dịch đầu tiên
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => navigate("/manage-wallets")}
                className="flex items-center justify-center border-gray-200"
              >
                <Icon icon="zi-user" className="mr-2" />
                Thiết lập ví
              </Button>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => navigate("/budget")}
                className="flex items-center justify-center border-gray-200"
              >
                <Icon icon="zi-star" className="mr-2" />
                Đặt ngân sách
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Contact Support */}
        <Box className="px-4 pt-4 pb-4">
          <Box className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
            <Box className="flex items-start">
              <Box className="bg-blue-100 rounded-full p-2.5 mr-3 flex-shrink-0">
                <Icon icon="zi-chat" size={20} className="text-blue-600" />
              </Box>
              <Box className="flex-1">
                <Text className="font-semibold text-gray-900 mb-1">
                  Cần hỗ trợ?
                </Text>
                <Text size="small" className="text-gray-600 leading-relaxed">
                  Nếu bạn gặp khó khăn hoặc có câu hỏi, hãy liên hệ với chúng tôi qua phần Cài đặt.
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Page>
  );
};

export default GuidePage;
