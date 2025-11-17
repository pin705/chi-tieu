import React, { FC } from "react";
import { Box, Text, Button, Icon } from "zmp-ui";
import { useNavigate } from "react-router-dom";

export const QuickAdd: FC = () => {
  const navigate = useNavigate();

  return (
    <Box className="px-4 py-4">
      <Text.Title size="small" className="mb-3 text-gray-800 font-semibold">
        Ghi chép nhanh
      </Text.Title>
      <Box className="grid grid-cols-2 gap-3">
        {/* Chi tiêu Button */}
        <Box
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-4 shadow-md active:scale-95 transition-transform cursor-pointer"
          onClick={() => navigate("/add-transaction?type=expense")}
        >
          <Box className="flex flex-col items-center justify-center h-24 relative z-10">
            <Box className="bg-white bg-opacity-25 rounded-full p-3 mb-2 backdrop-blur-sm">
              <Icon icon="zi-minus-circle" size={26} className="text-white" />
            </Box>
            <Text className="text-white font-semibold text-base">Chi tiêu</Text>
          </Box>
          {/* Decorative circles */}
          <Box className="absolute -right-8 -top-8 w-28 h-28 bg-white opacity-10 rounded-full"></Box>
          <Box className="absolute -left-4 -bottom-4 w-20 h-20 bg-white opacity-10 rounded-full"></Box>
        </Box>

        {/* Thu nhập Button */}
        <Box
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-4 shadow-md active:scale-95 transition-transform cursor-pointer"
          onClick={() => navigate("/add-transaction?type=income")}
        >
          <Box className="flex flex-col items-center justify-center h-24 relative z-10">
            <Box className="bg-white bg-opacity-25 rounded-full p-3 mb-2 backdrop-blur-sm">
              <Icon icon="zi-plus-circle" size={26} className="text-white" />
            </Box>
            <Text className="text-white font-semibold text-base">Thu nhập</Text>
          </Box>
          {/* Decorative circles */}
          <Box className="absolute -right-8 -top-8 w-28 h-28 bg-white opacity-10 rounded-full"></Box>
          <Box className="absolute -left-4 -bottom-4 w-20 h-20 bg-white opacity-10 rounded-full"></Box>
        </Box>
      </Box>
    </Box>
  );
};
