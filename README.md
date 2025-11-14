# Quản Lý Chi Tiêu - Expense Tracker

<p style="display: flex; flex-wrap: wrap; gap: 4px">
  <img alt="react" src="https://img.shields.io/github/package-json/dependency-version/pin705/chi-tieu/react" />
  <img alt="zmp-ui" src="https://img.shields.io/github/package-json/dependency-version/pin705/chi-tieu/zmp-ui" />
  <img alt="zmp-sdk" src="https://img.shields.io/github/package-json/dependency-version/pin705/chi-tieu/zmp-sdk" />
  <img alt="recoil" src="https://img.shields.io/github/package-json/dependency-version/pin705/chi-tieu/recoil" />
  <img alt="tailwindcss" src="https://img.shields.io/github/package-json/dependency-version/pin705/chi-tieu/dev/tailwindcss" />
</p>

Ứng dụng quản lý chi tiêu cá nhân trên nền tảng Zalo Mini App.

## Tính năng

### Phase 1: MVP (Đã hoàn thành) ✅

- **Ghi nhận giao dịch**: Thêm nhanh các giao dịch thu/chi
- **Quản lý danh mục**: 
  - 8 danh mục chi tiêu mặc định (Ăn uống, Di chuyển, Mua sắm, Giải trí, Hóa đơn, Sức khỏe, Giáo dục, Khác)
  - 5 danh mục thu nhập mặc định (Lương, Thưởng, Quà tặng, Đầu tư, Khác)
- **Quản lý ví**: Hỗ trợ nhiều ví (Tiền mặt, Ngân hàng, ZaloPay)
- **Lịch sử giao dịch**: Xem danh sách giao dịch theo ngày
- **Báo cáo**: 
  - Tổng quan thu/chi trong tháng
  - Phân tích chi tiêu theo danh mục
  - Progress bar hiển thị tỷ lệ phần trăm
- **Lưu trữ dữ liệu**: Sử dụng ZMP Storage API để lưu trữ local

### Phase 2: Tính năng nâng cao (Kế hoạch)

- [ ] Thiết lập ngân sách theo tháng/danh mục
- [ ] Cảnh báo khi vượt ngân sách
- [ ] Biểu đồ xu hướng theo thời gian
- [ ] Sao lưu đám mây
- [ ] Sổ chi tiêu chung (gia đình)
- [ ] Tích hợp ZaloPay

## Cài đặt

### Sử dụng Zalo Mini App Extension

1. Cài đặt [Visual Studio Code](https://code.visualstudio.com/download) và [Zalo Mini App Extension](https://mini.zalo.me/docs/dev-tools)
2. Nhấn **Create Project** > Chọn template này > Đợi dự án được tạo
3. **Cấu hình App ID** và **Cài đặt Dependencies**, sau đó vào **Run panel** > **Start** 🚀

### Sử dụng Zalo Mini App CLI

1. [Cài đặt Node.js](https://nodejs.org/en/download/)
2. [Cài đặt Mini App DevTools CLI](https://mini.zalo.me/docs/dev-tools/cli/intro/)
3. Clone repository này
4. Cài đặt dependencies:
   ```bash
   npm install
   ```
5. Build CSS:
   ```bash
   npm run build:css
   ```
6. Start dev server:
   ```bash
   zmp start
   ```
7. Mở `localhost:3000` trên trình duyệt 🔥

## Cấu trúc dự án

- **`src`**: Mã nguồn của Mini App
  - **`components`**: Các component React.JS tái sử dụng
  - **`css`**: Stylesheets (Tailwind CSS)
  - **`pages`**: Các trang của ứng dụng
    - `expense-home`: Trang chủ với tổng quan
    - `add-transaction`: Form thêm giao dịch
    - `history`: Lịch sử giao dịch
    - `reports`: Báo cáo và thống kê
    - `settings`: Cài đặt ứng dụng
  - **`types`**: TypeScript type definitions
    - `transaction.ts`: Định nghĩa giao dịch
    - `expense-category.ts`: Danh mục chi tiêu/thu nhập
    - `wallet.ts`: Ví tiền
  - **`utils`**: Utility functions
  - **`expense-state.ts`**: State management với Recoil
  - **`app.ts`**: Entry point

- **`app-config.json`**: [Cấu hình toàn cục](https://mini.zalo.me/intro/getting-started/app-config/)

## Công nghệ sử dụng

- **Framework**: React 18
- **State Management**: Recoil
- **UI Components**: ZMP UI (Zalo Mini Program UI)
- **Storage**: ZMP SDK Storage API
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Language**: TypeScript

## Triển khai

1. Tạo một Mini App trên [Zalo Mini App Center](https://mini.zalo.me/)
2. Triển khai bằng `zmp-cli`:
   ```bash
   zmp login
   zmp deploy
   ```
3. Quét mã QR bằng Zalo để xem Mini App

## License

Copyright (c) 2024. All rights reserved.
