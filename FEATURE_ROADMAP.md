# Kế hoạch Phát triển Tính năng - Feature Development Roadmap

## Tổng quan (Overview)

Tài liệu này mô tả kế hoạch phát triển các tính năng mới cho ứng dụng Quản Lý Chi Tiêu (Expense Tracker). Các tính năng được phân chia thành các phase với mức độ ưu tiên và timeline rõ ràng.

## Tình trạng hiện tại (Current Status)

### Đã hoàn thành (Completed)
- ✅ Phase 1: MVP - Tính năng cơ bản
- ✅ Phase 2: Tính năng nâng cao (Quản lý ngân sách, Biểu đồ xu hướng)
- ✅ Phase 3: Phân tích nâng cao
- ✅ Phase 4: Cải thiện trải nghiệm người dùng (Tìm kiếm và lọc)

### Các tính năng tương lai đã xác định
- Sao lưu đám mây
- Sổ chi tiêu chung (gia đình)
- Tích hợp ZaloPay
- Xuất dữ liệu
- Chế độ tối
- Hệ thống thông báo

---

## Phase 5: Xuất dữ liệu và Sao lưu 💾

**Mục tiêu**: Cho phép người dùng xuất dữ liệu và sao lưu vào đám mây

**Timeline ước tính**: 3-4 tuần

**Độ ưu tiên**: 🔴 Cao

### 5.1. Xuất dữ liệu (Export Data)

#### Tính năng chi tiết:
- [ ] Xuất dữ liệu ra file CSV
  - Xuất toàn bộ giao dịch
  - Xuất theo khoảng thời gian
  - Xuất theo danh mục
  - Xuất theo ví
- [ ] Xuất dữ liệu ra file Excel (.xlsx)
  - Hỗ trợ nhiều sheet (giao dịch, ngân sách, báo cáo)
  - Định dạng đẹp với màu sắc và border
- [ ] Xuất báo cáo PDF
  - Báo cáo tháng/quý/năm
  - Biểu đồ và thống kê trực quan
  - Logo và thông tin người dùng
- [ ] Chia sẻ file qua Zalo
  - Gửi trực tiếp cho bạn bè
  - Chia sẻ vào nhóm

#### Yêu cầu kỹ thuật:
```typescript
// Dependencies cần thêm
"xlsx": "^0.18.5",           // Xuất Excel
"jspdf": "^2.5.1",           // Xuất PDF
"jspdf-autotable": "^3.6.0", // Bảng trong PDF
```

#### API/Utilities cần tạo:
- `src/utils/export.ts`: Export utilities
- `src/services/export-service.ts`: Export business logic
- `src/pages/settings/export.tsx`: UI cho xuất dữ liệu

#### Thời gian ước tính:
- CSV Export: 3 ngày
- Excel Export: 5 ngày
- PDF Export: 7 ngày
- Zalo Share Integration: 2 ngày

---

### 5.2. Sao lưu đám mây (Cloud Backup)

#### Tính năng chi tiết:
- [ ] Tự động sao lưu vào Zalo Cloud
  - Sao lưu theo lịch (hàng ngày/tuần)
  - Sao lưu thủ công
  - Thông báo khi sao lưu thành công/thất bại
- [ ] Khôi phục dữ liệu
  - Xem danh sách các bản sao lưu
  - Khôi phục về thời điểm cụ thể
  - Xác nhận trước khi khôi phục
- [ ] Quản lý bản sao lưu
  - Xem chi tiết bản sao lưu (ngày, dung lượng)
  - Xóa bản sao lưu cũ
  - Giới hạn số lượng bản sao lưu (5-10 bản)
- [ ] Đồng bộ giữa các thiết bị
  - Tự động đồng bộ khi có thay đổi
  - Xử lý conflict khi có dữ liệu khác nhau

#### Yêu cầu kỹ thuật:
```typescript
// Sử dụng Zalo Cloud Storage API
import { storage } from "zmp-sdk";

// Types mới
interface BackupMetadata {
  id: string;
  timestamp: number;
  version: string;
  size: number;
  deviceId: string;
}

interface BackupData {
  transactions: Transaction[];
  budgets: Budget[];
  wallets: Wallet[];
  settings: Settings;
  version: string;
}
```

#### API/Utilities cần tạo:
- `src/services/backup-service.ts`: Backup logic
- `src/services/sync-service.ts`: Sync logic
- `src/types/backup.ts`: Backup types
- `src/pages/settings/backup.tsx`: UI quản lý backup

#### Thời gian ước tính:
- Cloud Backup Core: 7 ngày
- Restore Function: 4 ngày
- Backup Management UI: 3 ngày
- Auto Sync: 5 ngày

---

## Phase 6: Tính năng Xã hội và Chia sẻ 👥

**Mục tiêu**: Cho phép chia sẻ và quản lý chi tiêu chung

**Timeline ước tính**: 5-6 tuần

**Độ ưu tiên**: 🟡 Trung bình

### 6.1. Sổ chi tiêu chung (Shared Expense Book)

#### Tính năng chi tiết:
- [ ] Tạo sổ chi tiêu nhóm
  - Đặt tên và mô tả cho nhóm
  - Thêm thành viên qua Zalo ID
  - Phân quyền (admin, member, viewer)
- [ ] Quản lý giao dịch nhóm
  - Thêm giao dịch cho nhóm
  - Phân chia chi phí giữa các thành viên
  - Ghi chú người thanh toán
  - Theo dõi nợ giữa các thành viên
- [ ] Thanh toán nợ
  - Tính toán tự động ai nợ ai
  - Đánh dấu đã thanh toán
  - Lịch sử thanh toán
- [ ] Thông báo trong nhóm
  - Thông báo khi có giao dịch mới
  - Thông báo khi được nhắc nhở về nợ
  - Thông báo khi được thanh toán

#### Yêu cầu kỹ thuật:
```typescript
// Types mới
interface ExpenseGroup {
  id: string;
  name: string;
  description: string;
  members: GroupMember[];
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

interface GroupMember {
  userId: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
  joinedAt: number;
}

interface GroupTransaction extends Transaction {
  groupId: string;
  paidBy: string;
  splitBetween: {
    userId: string;
    amount: number;
    paid: boolean;
  }[];
}

interface Debt {
  from: string;
  to: string;
  amount: number;
  transactions: string[];
}
```

#### Backend requirements:
- Cần một backend API để đồng bộ dữ liệu nhóm
- Database để lưu trữ dữ liệu chung
- Real-time sync cho thông báo

#### API/Utilities cần tạo:
- `src/types/group.ts`: Group types
- `src/services/group-service.ts`: Group management
- `src/services/debt-calculator.ts`: Debt calculation logic
- `src/pages/groups/`: UI pages for groups
- `src/components/group/`: Group-related components

#### Thời gian ước tính:
- Group Management: 10 ngày
- Split Transaction: 7 ngày
- Debt Calculation: 5 ngày
- Notifications: 5 ngày
- Backend Integration: 10 ngày

---

### 6.2. Tích hợp ZaloPay

#### Tính năng chi tiết:
- [ ] Liên kết tài khoản ZaloPay
  - OAuth flow với ZaloPay
  - Lưu trữ token an toàn
- [ ] Tự động nhập giao dịch
  - Đồng bộ lịch sử giao dịch từ ZaloPay
  - Phân loại tự động theo merchant
  - Mapping danh mục thông minh
- [ ] Thanh toán qua ZaloPay
  - Thanh toán hóa đơn trực tiếp
  - Chuyển tiền trong nhóm
- [ ] Quản lý ví ZaloPay
  - Hiển thị số dư
  - Cập nhật số dư tự động

#### Yêu cầu kỹ thuật:
```typescript
// ZaloPay Integration
interface ZaloPayAccount {
  id: string;
  phone: string;
  balance: number;
  linkedAt: number;
  lastSync: number;
}

interface ZaloPayTransaction {
  transId: string;
  amount: number;
  description: string;
  merchantName: string;
  type: 'payment' | 'transfer' | 'topup';
  timestamp: number;
}
```

#### Dependencies:
- ZaloPay SDK/API documentation
- OAuth 2.0 implementation

#### Thời gian ước tính:
- ZaloPay OAuth: 5 ngày
- Transaction Sync: 7 ngày
- Payment Integration: 7 ngày
- Testing & Security: 5 ngày

---

## Phase 7: Cải tiến UI/UX và Tính năng bổ sung 🎨

**Mục tiêu**: Nâng cao trải nghiệm người dùng

**Timeline ước tính**: 3-4 tuần

**Độ ưu tiên**: 🟢 Thấp

### 7.1. Chế độ tối (Dark Mode)

#### Tính năng chi tiết:
- [ ] Theme switching
  - Toggle giữa light/dark mode
  - Lưu preference người dùng
  - Tự động theo hệ thống (optional)
- [ ] Dark theme design
  - Thiết kế bảng màu dark mode
  - Đảm bảo contrast ratio phù hợp
  - Icons và biểu đồ phù hợp với dark mode
- [ ] Smooth transition
  - Animation mượt mà khi đổi theme
  - Không flash/flicker

#### Yêu cầu kỹ thuật:
```typescript
// Tailwind CSS dark mode configuration
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  // ...
}

// Theme state
interface ThemeSettings {
  mode: 'light' | 'dark' | 'auto';
  primaryColor?: string;
}
```

#### Thời gian ước tính:
- Design System: 4 ngày
- Implementation: 5 ngày
- Testing: 2 ngày

---

### 7.2. Hệ thống thông báo (Notification System)

#### Tính năng chi tiết:
- [ ] Thông báo ngân sách
  - Cảnh báo khi gần hết ngân sách (80%, 90%, 100%)
  - Thông báo vượt ngân sách
  - Thông báo tổng kết ngân sách cuối tháng
- [ ] Nhắc nhở ghi chép
  - Nhắc ghi chi tiêu hàng ngày
  - Nhắc khi chưa ghi chi tiêu trong X ngày
- [ ] Thông báo insight
  - Chi tiêu bất thường (cao hơn trung bình)
  - Đề xuất tiết kiệm
  - Thành tích (streak, milestone)
- [ ] Cài đặt thông báo
  - Bật/tắt từng loại thông báo
  - Chọn thời gian nhận thông báo
  - Tùy chỉnh âm thanh/rung

#### Yêu cầu kỹ thuật:
```typescript
// Zalo Notification API
import { notification } from "zmp-sdk";

interface NotificationSettings {
  budgetAlerts: boolean;
  dailyReminder: boolean;
  insights: boolean;
  reminderTime: string; // "20:00"
}

interface NotificationSchedule {
  id: string;
  type: 'budget' | 'reminder' | 'insight';
  scheduledAt: number;
  sent: boolean;
}
```

#### Thời gian ước tính:
- Notification Core: 5 ngày
- Smart Insights: 5 ngày
- Settings UI: 3 ngày
- Testing: 2 ngày

---

### 7.3. Giao dịch định kỳ (Recurring Transactions)

#### Tính năng chi tiết:
- [ ] Tạo giao dịch định kỳ
  - Lương hàng tháng
  - Hóa đơn cố định (điện, nước, internet)
  - Chi tiêu định kỳ khác
- [ ] Cấu hình lịch
  - Hàng ngày/tuần/tháng/năm
  - Ngày cụ thể trong tháng
  - Ngày làm việc cuối tháng
- [ ] Tự động tạo giao dịch
  - Tạo tự động theo lịch
  - Thông báo xác nhận
  - Cho phép bỏ qua/chỉnh sửa

#### Yêu cầu kỹ thuật:
```typescript
interface RecurringTransaction {
  id: string;
  template: Omit<Transaction, 'id' | 'date'>;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number; // every N days/weeks/months
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    endDate?: number; // optional end date
  };
  lastCreated?: number;
  active: boolean;
}
```

#### Thời gian ước tính:
- Core Logic: 5 ngày
- UI/UX: 4 ngày
- Background Job: 3 ngày

---

### 7.4. Mục tiêu tiết kiệm (Savings Goals)

#### Tính năng chi tiết:
- [ ] Tạo mục tiêu tiết kiệm
  - Đặt tên và mô tả
  - Số tiền mục tiêu
  - Thời hạn đạt được
- [ ] Theo dõi tiến độ
  - Progress bar
  - Số tiền còn thiếu
  - Thời gian còn lại
- [ ] Đóng góp vào mục tiêu
  - Chuyển tiền từ ví vào mục tiêu
  - Lịch sử đóng góp
- [ ] Thống kê và dự đoán
  - Tốc độ tiết kiệm hiện tại
  - Dự đoán ngày hoàn thành
  - Đề xuất số tiền nên tiết kiệm mỗi tháng

#### Thời gian ước tính:
- Core Feature: 5 ngày
- Analytics: 3 ngày
- UI/UX: 3 ngày

---

## Phase 8: AI và Tự động hóa 🤖

**Mục tiêu**: Sử dụng AI để nâng cao trải nghiệm

**Timeline ước tính**: 6-8 tuần

**Độ ưu tiên**: 🔵 Tương lai xa

### 8.1. Phân loại tự động bằng AI

- [ ] Machine Learning model cho phân loại giao dịch
- [ ] Học từ hành vi người dùng
- [ ] Đề xuất danh mục thông minh
- [ ] Phát hiện giao dịch bất thường

### 8.2. Chatbot tư vấn tài chính

- [ ] Hỏi đáp về chi tiêu
- [ ] Phân tích xu hướng
- [ ] Đề xuất tiết kiệm
- [ ] Tư vấn ngân sách

### 8.3. OCR cho hóa đơn

- [ ] Quét hóa đơn bằng camera
- [ ] Trích xuất thông tin tự động
- [ ] Tạo giao dịch từ hóa đơn

---

## Kết luận và Ưu tiên (Priority Summary)

### Lộ trình đề xuất (Recommended Roadmap)

#### Q1 2025 (Jan - Mar)
- ✅ Phase 5.1: Xuất dữ liệu (Export Data)
- 🔄 Phase 7.1: Chế độ tối (Dark Mode)

#### Q2 2025 (Apr - Jun)
- 🔄 Phase 5.2: Sao lưu đám mây (Cloud Backup)
- 🔄 Phase 7.2: Hệ thống thông báo (Notification System)

#### Q3 2025 (Jul - Sep)
- 🔄 Phase 7.3: Giao dịch định kỳ (Recurring Transactions)
- 🔄 Phase 7.4: Mục tiêu tiết kiệm (Savings Goals)

#### Q4 2025 (Oct - Dec)
- 🔄 Phase 6.1: Sổ chi tiêu chung (Shared Expense Book)

#### 2026
- 🔄 Phase 6.2: Tích hợp ZaloPay
- 🔄 Phase 8: AI và Tự động hóa

### Metrics để đánh giá thành công

- **User Engagement**: DAU/MAU ratio, session time
- **Feature Adoption**: % người dùng sử dụng tính năng mới
- **Data Quality**: % giao dịch được phân loại đúng
- **User Satisfaction**: Rating, feedback, reviews
- **Performance**: Load time, crash rate

---

## Technical Considerations

### Performance
- Lazy loading cho các tính năng nâng cao
- Code splitting để giảm bundle size
- Caching cho dữ liệu thường xuyên truy cập

### Security
- Mã hóa dữ liệu nhạy cảm
- Secure token storage
- API rate limiting
- Input validation

### Testing
- Unit tests cho business logic
- Integration tests cho API
- E2E tests cho user flows quan trọng
- Performance testing

### Documentation
- API documentation
- User guides
- Developer guides
- Release notes

---

## Resources Required

### Development Team
- 2 Frontend Developers
- 1 Backend Developer (for shared features)
- 1 UI/UX Designer
- 1 QA Engineer

### Tools & Services
- Zalo Mini App Platform
- Cloud storage service
- Analytics platform
- Testing tools

### Budget Estimation
- Phase 5: ~15 person-days
- Phase 6: ~30 person-days
- Phase 7: ~20 person-days
- Phase 8: ~40 person-days

---

_Document version: 1.0_  
_Last updated: 2025-12-10_  
_Next review: 2025-01-10_
