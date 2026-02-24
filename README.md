
# 👜 Handbag E-Commerce App - React Native (Expo)
**Assignment: Favorite List by using AsyncStorage**

## 📖 1. Project Overview (Tổng quan dự án)
Dự án này là một ứng dụng di động đa nền tảng (iOS & Android) được xây dựng bằng **React Native (Expo)** và **TypeScript**. Ứng dụng đáp ứng đầy đủ các yêu cầu của Assignment: hiển thị danh sách túi xách từ MockAPI, tìm kiếm, lọc theo thương hiệu, sắp xếp theo giá và tính năng Yêu thích (lưu trữ cục bộ với AsyncStorage).

Hệ thống được thiết kế theo tiêu chuẩn **Production-Grade**, áp dụng các patterns hiện đại (Feature-folder, Custom Hooks, Global State) để đảm bảo hiệu năng và dễ dàng mở rộng.

---

## 🛠 2. Tech Stack & Architecture (Công nghệ sử dụng)
Thay vì sử dụng các công cụ cơ bản, dự án áp dụng các thư viện tiêu chuẩn công nghiệp hiện nay để tối ưu UX/UI và Performance:

1. **Core:** React Native (Expo) + **Strict TypeScript** (Đảm bảo an toàn kiểu dữ liệu).
2. **Data Fetching:** `@tanstack/react-query` (Tự động cache dữ liệu, quản lý trạng thái loading/error chuyên nghiệp).
3. **State Management & Storage:** `zustand` kết hợp `persist middleware` + `@react-native-async-storage/async-storage` (Quản lý Global State và tự động đồng bộ danh sách Yêu thích xuống bộ nhớ máy).
4. **Navigation:** `React Navigation v6/v7` (Native Stack & Bottom Tabs) mang lại hiệu ứng chuyển trang mượt mà chuẩn Native.
5. **Performance Optimization:** `@shopify/flash-list` (Thay thế FlatList mặc định, giúp render danh sách hàng ngàn sản phẩm ở 60FPS không giật lag).

---

## 🚀 3. Installation & Setup Guide (Hướng dẫn cài đặt)

**Bước 1: Khởi tạo dự án (Nếu chạy lại từ đầu)**
```bash
npx create-expo-app@latest HandbagApp --template blank-typescript
cd HandbagApp
```

**Bước 2: Cài đặt toàn bộ Dependency (Thư viện)**
Chạy lần lượt các lệnh sau trong terminal:

```bash
# 1. Cài đặt Navigation & UI Context
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-vector-icons

# 2. Cài đặt State Management & Local Storage
npm install zustand
npx expo install @react-native-async-storage/async-storage

# 3. Cài đặt Data Fetching (React Query)
npm install @tanstack/react-query

# 4. Cài đặt High-Performance List (FlashList)
npx expo install @shopify/flash-list
```

**Bước 3: Khởi chạy ứng dụng**
```bash
npx expo start -c
```
*(Lưu ý: Thêm cờ `-c` để xóa cache Metro Bundler, đảm bảo ứng dụng nhận đủ các thư viện Native vừa cài đặt).*

---

## 📂 4. Folder Structure (Cấu trúc thư mục chuẩn Senior)

Dự án áp dụng **Feature-based Pattern** để phân tách rõ ràng UI, Logic và Data. 
*(Lệnh PowerShell để khởi tạo nhanh toàn bộ cấu trúc: `New-Item -ItemType Directory -Force -Path src\api, src\assets, src\components, src\config, src\hooks\queries, src\hooks\core, src\navigation, src\screens\Home, src\screens\Detail, src\screens\Favorite, src\store, src\types, src\utils`)*

```text
📦 HandbagApp
 ┣ 📂 src
 ┃ ┣ 📂 api         # Chứa cấu hình Axios/Fetch gọi lên MockAPI
 ┃ ┣ 📂 assets      # Chứa ảnh cục bộ, custom fonts, icon
 ┃ ┣ 📂 components  # UI Components dùng chung toàn app (SearchBar, Button...)
 ┃ ┣ 📂 constants   # Chứa các hằng số (Colors, Theme, API_URL)
 ┃ ┣ 📂 hooks       # Custom Hooks (Chia thành core và queries để bọc React Query)
 ┃ ┣ 📂 navigation  # Cấu hình AppNavigator, BottomTab, Stack
 ┃ ┣ 📂 screens     # Chứa các màn hình chính (Feature-based pattern)
 ┃ ┃ ┣ 📂 Detail    # Màn hình chi tiết sản phẩm & Đánh giá (Feedback)
 ┃ ┃ ┣ 📂 Favorite  # Màn hình danh sách túi xách Yêu thích
 ┃ ┃ ┗ 📂 Home      # Màn hình chính (Filter, Sort, FlashList)
 ┃ ┣ 📂 store       # Cấu hình Zustand store (useFavoriteStore.ts)
 ┃ ┣ 📂 types       # Toàn bộ TypeScript interfaces (Handbag, Review)
 ┃ ┗ 📂 utils       # Hàm helper phụ trợ (formatCurrency, calculateDiscount)
 ┣ 📜 App.tsx       # Entry point bọc các Providers (QueryClientProvider, NavigationContainer)
 ┣ 📜 app.json      # Config của Expo
 ┗ 📜 package.json
```

---

## 🎯 5. Key Features Implemented (Các tính năng đã hoàn thiện)

*   **Task 1 (UI & Navigation):** Chuyển đổi qua lại giữa Home và Favorite bằng Bottom Tabs nhanh chóng. Màn Detail hiển thị trơn tru đè lên Root Stack.
*   **Task 2 (Detail & Feedback):** Hiển thị chi tiết hình ảnh, giá gốc/giá giảm. Tính năng gộp nhóm Đánh giá (Group Ratings) từ 5 sao xuống 1 sao chuẩn xác. Tích hợp Snackbar (Small tab) cảnh báo điều hướng mượt mà.
*   **Task 3 (Favorite Functionality):** 
    *   Nút thả Tim (Add/Remove) hoạt động đồng bộ giữa màn Home và Detail.
    *   Tự động lưu xuống `AsyncStorage` (Tắt app mở lại không mất data).
    *   Nút "Clear All" xoá toàn bộ yêu thích.
    *   **Thanh tìm kiếm (Real-time Search):** Lọc túi xách theo tên không phân biệt hoa/thường ngay lập tức mà không ảnh hưởng hiệu năng.

***