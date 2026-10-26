# MiniShoppe — Sàn Thương Mại Điện Tử Mô Phỏng (Interactive Prototype)

> **Lưu ý:** Đây là đồ án mô phỏng phong cách sàn thương mại điện tử phục vụ học tập và báo cáo, không liên kết với Shopee. Ứng dụng hoạt động hoàn toàn ở client, không dùng backend thật hay cổng thanh toán thật.

## 1. Giới thiệu
MiniShoppe là ứng dụng thương mại điện tử mô phỏng đầy đủ chu trình mua bán hàng COD với 4 vai trò (Customer, Seller, Admin, Shipper), tích hợp hệ thống Mock Authentication (Đăng ký / Đăng nhập sử dụng Web Crypto PBKDF2) và giao diện phong cách marketplace Việt Nam hiện đại.

## 2. Công nghệ sử dụng
- **Core:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (Roboto font, tông màu `#EE4D2D`, Shopee marketplace UI)
- **Routing:** React Router v6 (BrowserRouter + cấu hình SPA rewrite)
- **State & Storage:** Zustand persist (`localStorage` schema v2, dữ liệu giỏ hàng và đơn mua phân lập theo từng tài khoản)
- **Security Mock:** Web Crypto API (PBKDF2 SHA-256 derivation)
- **Icons:** `lucide-react`

## 3. Cách chạy dự án tại Local
```bash
# 1. Cài đặt dependencies
npm install

# 2. Khởi chạy môi trường phát triển
npm run dev

# Mở trình duyệt tại: http://localhost:5173

# 3. Build kiểm tra production
npm run build
```

## 4. Tài khoản Demo & 4 Vai trò (Mật khẩu: `demo12345`)
- **Khách hàng (`customer`):** `khachhang@demo.vn` — Mua hàng COD, giỏ hàng riêng, theo dõi tiến trình đơn.
- **Người bán (`seller`):** `nguoiban@demo.vn` — Đăng sản phẩm mới (chờ duyệt), xác nhận đơn hàng, đóng gói.
- **Quản trị viên (`admin`):** `admin@demo.vn` — Kiểm duyệt phê duyệt / từ chối sản phẩm của Người bán.
- **Shipper (`shipper`):** `shipper@demo.vn` — Tiếp nhận đơn vận chuyển và xác nhận giao hàng thành công.
- *Có thể tự đăng ký tài khoản Khách hàng mới tại `/register` hoặc sử dụng Demo Mode dropdown trên Header.*

## 5. Giới hạn Mock Auth & Dữ liệu
- Toàn bộ dữ liệu (tài khoản, mật khẩu băm PBKDF2, giỏ hàng, đơn hàng, sản phẩm) lưu trong `localStorage`.
- Đổi trình duyệt hoặc bấm nút "Khôi phục dữ liệu mẫu ban đầu" sẽ khôi phục lại bộ 30 sản phẩm và 4 tài khoản mặc định.

## 6. Triển khai Vercel
- Cấu hình SPA rewrite đã có trong file `vercel.json`.
- Output directory khi deploy: `dist`.
