import { useVirtualKeyboardVisible } from "hooks";
import React, { FC, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { MenuItem } from "types/menu";
import { BottomNavigation, Icon, Box } from "zmp-ui";

const tabs: Record<string, MenuItem> = {
  "/": {
    label: "Trang chủ",
    icon: <Icon icon="zi-home" />,
  },
  "/history": {
    label: "Lịch sử",
    icon: <Icon icon="zi-calendar" />,
  },
  "/reports": {
    label: "Báo cáo",
    icon: <Icon icon="zi-poll" />,
  },
  "/settings": {
    label: "Cài đặt",
    icon: <Icon icon="zi-setting" />,
  },
};

export type TabKeys = keyof typeof tabs;

export const NO_BOTTOM_NAVIGATION_PAGES = [
  "/add-transaction",
  "/manage-wallets",
  "/manage-categories",
  "/guide",
];

export const Navigation: FC = () => {
  const keyboardVisible = useVirtualKeyboardVisible();
  const navigate = useNavigate();
  const location = useLocation();

  const noBottomNav = useMemo(() => {
    return NO_BOTTOM_NAVIGATION_PAGES.includes(location.pathname);
  }, [location]);

  if (noBottomNav || keyboardVisible) {
    return <></>;
  }

  const tabKeys = Object.keys(tabs) as TabKeys[];
  const firstHalf = tabKeys.slice(0, 2);
  const secondHalf = tabKeys.slice(2);

  return (
    <Box className="relative">
      {/* Floating Add Button with gradient */}
      <Box
        className="absolute left-1/2 -translate-x-1/2 -top-8 z-50"
        onClick={() => navigate("/add-transaction")}
      >
        <Box 
          className="w-16 h-16 rounded-full shadow-floating flex items-center justify-center cursor-pointer active:scale-90 transition-all duration-200 border-4 border-white"
          style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4), 0 4px 12px rgba(79, 70, 229, 0.3)',
          }}
        >
          <Icon icon="zi-plus" size={32} className="text-white" />
        </Box>
      </Box>

      <Box className="glass border-t border-gray-200/50">
        <BottomNavigation
          id="footer"
          activeKey={location.pathname}
          onChange={navigate}
          className="z-50 bg-transparent"
        >
          {firstHalf.map((path: TabKeys) => (
            <BottomNavigation.Item
              key={path}
              label={tabs[path].label}
              icon={tabs[path].icon}
              activeIcon={tabs[path].activeIcon}
            />
          ))}
          
          {/* Spacer for floating button */}
          <Box className="flex-1" style={{ minWidth: '80px' }} />
          
          {secondHalf.map((path: TabKeys) => (
            <BottomNavigation.Item
              key={path}
              label={tabs[path].label}
              icon={tabs[path].icon}
              activeIcon={tabs[path].activeIcon}
            />
          ))}
        </BottomNavigation>
      </Box>
    </Box>
  );
};
