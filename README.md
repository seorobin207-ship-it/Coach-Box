# CoachBox — Nền tảng học Boxing (Web Admin & App di động)

Hệ thống gồm **2 ứng dụng** trong cùng một monorepo:

- **CoachBox Admin** — Web quản trị (Next.js) để quản lý nội dung học tập: bài học, danh mục, ngân hàng câu hỏi, người dùng.
- **CoachBox App** — Ứng dụng di động (Expo / React Native) giúp người dùng học kỹ thuật boxing qua bài học, làm trắc nghiệm, trò chuyện với Chatbot AI huấn luyện viên, và theo dõi xếp hạng.

> Repo có thể vẫn mang tên thư mục / package nội bộ cũ (`nextjs-base` cho web, `green-hub` cho mobile) — tên sản phẩm hiện tại là **CoachBox**.

---

## Mục lục

- [Tổng quan tính năng](#tổng-quan-tính-năng)
  - [CoachBox Admin (Web)](#coachbox-admin-web)
  - [CoachBox App (Mobile)](#coachbox-app-mobile)
- [Công nghệ](#công-nghệ)
- [Cấu trúc monorepo](#cấu-trúc-monorepo)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Biến môi trường](#biến-môi-trường)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Scripts](#scripts)
- [Ghi chú phát triển](#ghi-chú-phát-triển)
- [License](#license)

---

## Tổng quan tính năng

### CoachBox Admin (Web)

Hệ thống quản lý nội dung học tập môi trường (dashboard quản trị dùng Next.js).

| Khu vực | Mô tả |
|---|---|
| **Dashboard** | Tổng quan số liệu: số bài học, số câu hỏi, số người dùng; danh sách bài học gần đây & bài thực hành gần đây |
| **Người dùng** | Danh sách tài khoản, tìm theo tên/email, phân quyền (Admin / Người dùng), phân trang |
| **Bài học → Danh sách bài học** | Thêm / sửa / xoá bài học, lọc theo danh mục & trạng thái (Đã xuất bản / …), tìm kiếm theo tên |
| **Bài học → Danh mục bài học** | Quản lý danh mục phân loại nội dung (vd. *Kỹ Thuật Cơ Bản*), thêm / sửa / xoá, lọc theo trạng thái |
| **Bài học → Bộ câu hỏi** | Quản lý ngân hàng câu hỏi trắc nghiệm/thực hành: cấp độ (Cơ bản…), trạng thái, thêm / sửa / xoá |
| **Xác thực** | Đăng nhập quản trị viên |

### CoachBox App (Mobile)

Ứng dụng học boxing dạng gamification — bài học, kiểm tra kiến thức, luyện tập, và huấn luyện viên AI.

| Tab | Mô tả |
|---|---|
| **Khám phá** (Home) | Danh mục bài học, tiến độ theo danh mục (vd. `0/2`), thẻ "Đang học" để tiếp tục bài dở, danh sách bài học (khoá / mở khoá) |
| **Trò chơi** | Trò chơi trắc nghiệm theo cấp độ (Cơ bản…), danh sách bộ câu hỏi kèm điểm số đạt được, khoá/mở khoá theo tiến độ |
| **Hoạt động** | Chatbot AI — "Huấn luyện viên Boxing của riêng bạn": trò chuyện, gợi ý câu hỏi nhanh, hỗ trợ xây dựng giáo án & kỹ thuật |
| **Xếp hạng** | Cấp bậc người dùng (Lính Mới → Nhà Vô Địch → Huyền Thoại) theo điểm, bảng xếp hạng theo Học tập / Trò chơi |

**Chi tiết bài học & luyện tập:**
- Màn chi tiết bài học: mục tiêu bài học, nội dung lý thuyết theo bước (tư thế, kỹ thuật…), nút **Luyện tập**
- **Kiểm tra nhanh**: màn giới thiệu trước khi làm bài → câu hỏi trắc nghiệm nhiều lựa chọn → phản hồi đúng/sai kèm giải thích
- **Thực hành**: dạng câu hỏi/luyện tập có đáp án đúng, hiển thị giải thích, nút **Hoàn thành**

**Tài khoản & cài đặt:**
- Đăng nhập / Đăng ký
- Cài đặt hồ sơ: đổi tên người dùng, ảnh đại diện, đổi mật khẩu, giới thiệu, hỗ trợ
- Thẻ tổng quan cá nhân: xếp hạng Thực hành, điểm Học tập
- Đăng xuất

---

## Công nghệ

### Web — CoachBox Admin

| Công nghệ | Ghi chú |
|---|---|
| **Next.js 13** | Framework React (SSR/SSG) |
| **React 18 + TypeScript** | Toàn bộ mã nguồn |
| **Redux Toolkit + Redux Persist** | Quản lý state toàn cục |
| **React Query** | Cache & fetch dữ liệu server |
| **Ant Design + MUI (Material UI)** | Component UI |
| **Tailwind CSS + Sass** | Styling |
| **CKEditor 5** | Soạn thảo nội dung bài học (rich text) |
| **React Hook Form + Yup** | Quản lý & validate form |
| **Firebase** | Xác thực / lưu trữ dữ liệu (xem thêm phần Backend) |
| **i18next** | Đa ngôn ngữ |
| **Axios** | Gọi API |
| **ESLint (Airbnb config) + Prettier + Husky** | Lint, format, pre-commit hook |
| **Jest + Testing Library** | Unit test |

### Mobile — CoachBox App

| Công nghệ | Ghi chú |
|---|---|
| **Expo SDK 53** | Toolchain & native modules |
| **React Native 0.79 + React 19** | UI đa nền tảng |
| **TypeScript** | Toàn bộ mã nguồn |
| **Expo Router v5** | File-based routing |
| **NativeWind v4** | Tailwind cho React Native |
| **Redux Toolkit + React Redux** | State toàn cục |
| **TanStack Query v5** | Server state / cache |
| **Zustand** | State cục bộ nhẹ (một số màn) |
| **React Hook Form + Zod** | Form & validate |
| **Axios** | Gọi API |
| **expo-image, expo-image-picker, expo-audio, expo-blur, lottie-react-native** | Media, hiệu ứng, avatar |
| **iconsax-react-native, @expo/vector-icons** | Icon |
| **react-native-render-html** | Hiển thị nội dung bài học dạng rich text |
| **jest-expo** | Unit test |

> Ghi chú: dependency `chess.js` / `react-native-chessboard` xuất hiện trong `package.json` mobile nhưng hiện không có tính năng cờ vua trong sản phẩm — có thể là phần thử nghiệm/di sản, cân nhắc loại bỏ nếu không dùng.

---

## Cấu trúc monorepo

Cấu trúc thư mục dưới đây là **đề xuất chung** cho một monorepo gồm 2 app — hãy đối chiếu và chỉnh lại theo cấu trúc thật của bạn (tên thư mục `apps/*` có thể khác):

```
coachbox/
├── apps/
│   ├── admin/                  # CoachBox Admin — Next.js
│   │   ├── src/
│   │   │   ├── app/ hoặc pages/    # Routing Next.js
│   │   │   ├── components/         # UI dùng chung (Ant Design/MUI)
│   │   │   ├── features/           # Người dùng, Bài học, Danh mục, Câu hỏi
│   │   │   ├── services/           # Gọi API / Firebase
│   │   │   ├── store/               # Redux Toolkit + Persist
│   │   │   ├── hooks/
│   │   │   ├── locales/            # i18next
│   │   │   └── utils/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── mobile/                 # CoachBox App — Expo / React Native
│       ├── src/
│       │   ├── app/                # Expo Router (file-based routing)
│       │   │   ├── (auth)/          # Đăng nhập, đăng ký
│       │   │   └── (tabs)/          # Khám phá, Trò chơi, Hoạt động, Xếp hạng
│       │   ├── components/
│       │   ├── services/           # Gọi API / Firebase
│       │   ├── store/               # Redux Toolkit / Zustand
│       │   ├── hooks/
│       │   └── utils/
│       ├── assets/
│       └── package.json
│
├── packages/                   # (tuỳ chọn) mã dùng chung: types, config, UI kit
│   ├── shared-types/
│   └── eslint-config/
│
├── backend/                    # (nếu có API riêng ngoài Firebase)
│
└── README.md                   # File này
```

---

## Yêu cầu hệ thống

- **Node.js** 20 LTS+
- **Yarn**
- Tài khoản dịch vụ backend (Firebase project hoặc tương đương) cho cả 2 app
- Với mobile: **iOS Simulator / Android Emulator / thiết bị thật**
- Với các thư viện native (image picker, audio, …): sau khi cài dependency mới, chạy `npx expo run:ios` hoặc `run:android` (hoặc dev build tương đương)

---

## Cài đặt

### 1. Clone & cài dependency

```bash
git clone <repository-url> coachbox
cd coachbox

# Cài cho web admin
cd apps/admin
yarn bootstrap   # hoặc: yarn install

# Cài cho mobile
cd ../mobile
yarn install
```

### 2. Biến môi trường

Mỗi app dùng file `.env` riêng — sao chép từ `.env.example` (nếu có) và điền giá trị thật.

---

## Biến môi trường

> Ghi chú chung: dự án dùng dịch vụ backend (ví dụ Firebase) cho xác thực và lưu trữ dữ liệu. Điền đúng theo dự án backend thực tế của bạn — dưới đây là khung tham khảo.

**`apps/admin/.env`**

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

**`apps/mobile/.env`**

```env
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

# Tuỳ chọn — nếu dùng cho Chatbot AI
EXPO_PUBLIC_AI_API_KEY=
```

> **Lưu ý:** Không commit file `.env` hoặc khoá thật lên git.

---

## Chạy ứng dụng

### Web — CoachBox Admin

```bash
cd apps/admin

yarn dev       # Dev server (Next.js)
yarn build     # Build production
yarn start     # Chạy bản build
yarn lint      # ESLint
yarn prettier  # Kiểm tra format
```

### Mobile — CoachBox App

```bash
cd apps/mobile

yarn start     # Dev server (Expo)
yarn ios       # Chạy trên iOS (native)
yarn android   # Chạy trên Android
yarn lint      # ESLint
yarn prebuild  # Prebuild native (clean)
```

Mở app bằng Expo Go (một số tính năng native có thể cần dev build), hoặc build native như trên.

---

## Scripts

### `apps/admin`

| Lệnh | Mô tả |
|---|---|
| `yarn bootstrap` | Cài dependency (frozen lockfile) |
| `yarn dev` | Chạy dev server |
| `yarn build` | Build production |
| `yarn start` | Chạy bản build |
| `yarn lint` / `lint:fix` | Kiểm tra / tự sửa lỗi lint |
| `yarn prettier` / `prettier:fix` | Kiểm tra / tự format code |
| `yarn check-types` | Kiểm tra kiểu TypeScript |
| `yarn pre-commit` | Lint + format + check types (chạy trước khi commit) |
| `yarn test-all` | Lint + format + check types + build |
| `yarn analyze` | Phân tích bundle size |

### `apps/mobile`

| Lệnh | Mô tả |
|---|---|
| `yarn start` | Khởi động Metro / Expo |
| `yarn ios` | Chạy trên iOS |
| `yarn android` | Chạy trên Android |
| `yarn web` | Chạy bản web (Expo web) |
| `yarn lint` | ESLint |
| `yarn prebuild` | Prebuild native (clean) |
| `yarn test` | Chạy test (Jest) |
| `yarn format-code` | Format code với Prettier |

---

## Ghi chú phát triển

- **Đồng bộ dữ liệu giữa Admin & App:** nội dung tạo/sửa ở CoachBox Admin (bài học, danh mục, câu hỏi) cần hiển thị đúng và kịp thời trên app di động — kiểm tra kỹ tầng cache (React Query / TanStack Query) khi publish nội dung mới.
- **Nội dung bài học:** Admin dùng CKEditor để soạn nội dung rich text; phía mobile hiển thị lại bằng `react-native-render-html` — cần thống nhất định dạng HTML được phép để tránh lỗi hiển thị.
- **Chatbot AI:** cần cấu hình khoá API cho dịch vụ AI (biến môi trường riêng), nên có xử lý giới hạn/fallback khi API lỗi hoặc hết hạn mức.
- **Dependency dư thừa:** rà soát lại `chess.js` / `react-native-chessboard` trong mobile app — dường như không liên quan đến tính năng boxing hiện tại.
- **Quyền & bảo mật:** đảm bảo phân quyền Admin / Người dùng được kiểm soát chặt ở tầng backend (rules Firebase hoặc middleware API), không chỉ ẩn/hiện ở giao diện.

---

## License

KITE Academy