import React, { FC } from "react";
import { Route, Routes } from "react-router";
import { Box } from "zmp-ui";
import { Navigation } from "./navigation";
import ExpenseHomePage from "pages/expense-home";
import AddTransactionPage from "pages/add-transaction";
import HistoryPage from "pages/history";
import ReportsPage from "pages/reports";
import SettingsPage from "pages/settings";
import BudgetPage from "pages/budget";
import ManageWalletsPage from "pages/manage-wallets";
import ManageCategoriesPage from "pages/manage-categories";
import GuidePage from "pages/guide";
import ExportPage from "pages/export";
import BackupPage from "pages/backup";
import { getSystemInfo } from "zmp-sdk";
import { ScrollRestoration } from "./scroll-restoration";
import { useHandlePayment } from "hooks";

if (import.meta.env.DEV) {
  document.body.style.setProperty("--zaui-safe-area-inset-top", "24px");
} else if (getSystemInfo().platform === "android") {
  const statusBarHeight =
    window.ZaloJavaScriptInterface?.getStatusBarHeight() ?? 0;
  const androidSafeTop = Math.round(statusBarHeight / window.devicePixelRatio);
  document.body.style.setProperty(
    "--zaui-safe-area-inset-top",
    `${androidSafeTop}px`
  );
}

export const Layout: FC = () => {
  useHandlePayment();

  return (
    <Box flex flexDirection="column" className="h-screen">
      <ScrollRestoration />
      <Box className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<ExpenseHomePage />}></Route>
          <Route path="/add-transaction" element={<AddTransactionPage />}></Route>
          <Route path="/history" element={<HistoryPage />}></Route>
          <Route path="/reports" element={<ReportsPage />}></Route>
          <Route path="/budget" element={<BudgetPage />}></Route>
          <Route path="/settings" element={<SettingsPage />}></Route>
          <Route path="/manage-wallets" element={<ManageWalletsPage />}></Route>
          <Route path="/manage-categories" element={<ManageCategoriesPage />}></Route>
          <Route path="/guide" element={<GuidePage />}></Route>
          <Route path="/export" element={<ExportPage />}></Route>
          <Route path="/backup" element={<BackupPage />}></Route>
        </Routes>
      </Box>
      <Navigation />
    </Box>
  );
};
