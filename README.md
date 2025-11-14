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

### Phase 2: Tính năng nâng cao (Đã hoàn thành) ✅

- [x] Thiết lập ngân sách theo tháng/danh mục
- [x] Cảnh báo khi vượt ngân sách
- [x] Biểu đồ xu hướng theo thời gian
- [ ] Sao lưu đám mây (Tính năng tương lai)
- [ ] Sổ chi tiêu chung (gia đình) (Tính năng tương lai)
- [ ] Tích hợp ZaloPay (Tính năng tương lai)

#### Hoàn thành trong Phase 2:

**Quản lý ngân sách** ✅
- Thiết lập ngân sách theo tháng
- Thiết lập ngân sách theo từng danh mục chi tiêu
- Theo dõi tiến độ chi tiêu so với ngân sách
- Cảnh báo tự động khi vượt ngân sách
- Hiển thị thanh tiến độ (progress bar) trực quan
- Thống kê chi tiêu so với ngân sách trong báo cáo

**Biểu đồ xu hướng** ✅
- Biểu đồ cột theo tuần (trong tháng hiện tại)
- Biểu đồ đường xu hướng 6 tháng
- So sánh thu - chi theo tháng với thanh tiến độ
- Chuyển đổi linh hoạt giữa xem theo danh mục và xu hướng

### Phase 3: Phân tích nâng cao (Đã hoàn thành) ✅

- [x] So sánh nhiều tháng
- [x] Xu hướng chi tiêu theo tuần/tháng
- [x] Phân tích danh mục chi tiêu hàng đầu
- [x] Biểu đồ timeline thu nhập vs chi tiêu

#### Hoàn thành trong Phase 3:

**Phân tích và Báo cáo nâng cao** ✅
- Xem xu hướng chi tiêu theo tuần trong tháng
- Xem xu hướng thu/chi trong 6 tháng gần nhất
- So sánh thu nhập và chi tiêu qua các tháng
- Biểu đồ trực quan với màu sắc phân biệt
- Chuyển đổi giữa biểu đồ cột và biểu đồ đường

### Phase 4: Cải thiện trải nghiệm người dùng (Đã hoàn thành) ✅

- [x] Tìm kiếm và lọc giao dịch
- [x] Bộ lọc đa điều kiện (loại, danh mục, ví)
- [x] Hiển thị trực quan các bộ lọc đang áp dụng
- [ ] Xuất dữ liệu (Tính năng tương lai)
- [ ] Chế độ tối (Tính năng tương lai)
- [ ] Hệ thống thông báo (Tính năng tương lai)

#### Hoàn thành trong Phase 4:

**Tìm kiếm và Lọc nâng cao** ✅
- Tìm kiếm giao dịch theo ghi chú, danh mục, số tiền
- Lọc theo loại giao dịch (thu nhập/chi tiêu)
- Lọc theo danh mục chi tiêu
- Lọc theo ví
- Hiển thị số lượng bộ lọc đang áp dụng
- Xóa từng bộ lọc hoặc xóa tất cả
- Giao diện lọc thân thiện với người dùng

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
    - `budget`: Quản lý ngân sách (Phase 2)
    - `settings`: Cài đặt ứng dụng
  - **`types`**: TypeScript type definitions
    - `transaction.ts`: Định nghĩa giao dịch
    - `expense-category.ts`: Danh mục chi tiêu/thu nhập
    - `wallet.ts`: Ví tiền
    - `budget.ts`: Ngân sách (Phase 2)
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
