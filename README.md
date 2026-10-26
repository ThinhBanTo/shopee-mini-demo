# MiniMall — Demo Sàn Thương Mại Điện Tử (4 Vai Trò)

> **Tuyên bố từ chối trách nhiệm:** Đây là dự án tương tác mô phỏng sàn thương mại điện tử phục vụ mục đích học tập và báo cáo đồ án, không liên kết với Shopee. Không sử dụng logo/tài sản có bản quyền của Shopee. Dữ liệu được lưu trữ trực tiếp trong trình duyệt qua `localStorage` (không dùng backend, database thật, OAuth hay cổng thanh toán trực tuyến thật).

---

## 1. Công nghệ sử dụng
- **Core:** React 18 + TypeScript + Vite 6
- **Styling:** Tailwind CSS (Tone màu cam/trắng phong cách sàn TMĐT hiện đại, responsive mobile và desktop)
- **Routing:** React Router v6 (BrowserRouter kết hợp cấu hình `vercel.json` SPA rewrite)
- **State Management & Persistence:** Zustand kết hợp `persist` middleware đồng bộ tức thời vào `localStorage`, có schema versioning và chức năng Khôi phục dữ liệu mẫu ban đầu (Reset Seed Data).
- **Icons:** `lucide-react`
- **Định dạng tiền tệ:** Chuẩn `vi-VN` (VND)

---

## 2. Các vai trò trong hệ thống (Demo Role Switcher)
Hệ thống tích hợp thanh chuyển đổi vai trò trực quan trên Header:
1. **Khách hàng (`customer`):** Nguyễn Văn An (`khachhang@demo.vn`)
   - Xem danh sách sản phẩm đã được Admin phê duyệt (`APPROVED`), lọc danh mục, tìm kiếm, sắp xếp theo giá/độ phổ biến.
   - Xem chi tiết sản phẩm, chọn số lượng, thêm vào giỏ hàng hoặc bấm "Mua Ngay (COD)".
   - Áp dụng mã giảm giá (`DEMO10`, `FREESHIP`).
   - Đặt hàng thanh toán khi nhận hàng (COD).
   - Quản lý "Đơn mua", theo dõi dòng thời gian (Timeline) giao hàng trực tiếp.
2. **Người bán (`seller`):** Trần Thị Mai — Mai Store Chính Hãng (`nguoiban@demo.vn`)
   - Bảng điều khiển tổng quan gian hàng, doanh thu và các chỉ số vận hành.
   - Đăng bán sản phẩm mới: Tên, giá, tồn kho, ảnh, danh mục. Trạng thái khởi tạo luôn là `PENDING` (Chờ duyệt).
   - Quản lý danh sách sản phẩm: Xem trạng thái `PENDING`, `APPROVED`, `REJECTED`.
   - Xử lý đơn hàng: Tiếp nhận đơn `PENDING_CONFIRMATION` ➔ Chuyển sang `PREPARING` (Đang đóng gói) ➔ `AWAITING_PICKUP` (Sẵn sàng bàn giao cho Shipper).
3. **Quản trị viên (`admin`):** Lê Hoàng Quân (`admin@demo.vn`)
   - Kiểm duyệt các sản phẩm mới đăng của người bán.
   - Phê duyệt (`APPROVED`) để mở bán công khai cho khách hàng.
   - Từ chối (`REJECTED`) kèm lý do giải thích cụ thể cho người bán.
4. **Shipper (`shipper`):** Phạm Tuấn Anh (`shipper@demo.vn`)
   - Xem danh sách các đơn hàng đã được shop đóng gói (`AWAITING_PICKUP`).
   - Nhận đơn và bắt đầu giao (`IN_TRANSIT`).
   - Xác nhận giao hàng thành công và thu tiền mặt COD (`DELIVERED`).

---

## 3. Kịch bản kiểm thử 6 bước (P0 End-to-End Flow)
Truy cập route `/demo-guide` để xem hướng dẫn trực quan ngay trên giao diện web:
1. **Bước 1 (Seller):** Chuyển vai trò sang `Người bán` ➔ Vào Kênh Người Bán ➔ Đăng sản phẩm mới (ví dụ: *"Tai nghe Demo 2026"*, giá 350.000₫, kho 20) ➔ Trạng thái hiển thị là `Chờ duyệt (PENDING)`.
2. **Bước 2 (Customer):** Chuyển vai trò sang `Khách hàng` ➔ Tìm kiếm sản phẩm *"Tai nghe Demo 2026"* ➔ Xác nhận sản phẩm **chưa được hiển thị** cho khách hàng.
3. **Bước 3 (Admin):** Chuyển vai trò sang `Quản trị viên` ➔ Vào mục Duyệt sản phẩm ➔ Bấm **"Phê duyệt"** sản phẩm *"Tai nghe Demo 2026"*.
4. **Bước 4 (Customer):** Chuyển lại `Khách hàng` ➔ Tìm kiếm lại thấy sản phẩm đã mở bán ➔ Bấm vào chi tiết ➔ Thêm giỏ hàng ➔ Nhập mã giảm giá **`DEMO10`** (giảm 10%) ➔ Điền thông tin giao nhận ➔ Xác nhận đặt hàng **COD**.
5. **Bước 5 (Seller):** Chuyển sang `Người bán` ➔ Mở mục Đơn hàng của shop ➔ Thấy đơn mới trạng thái *Chờ xác nhận* ➔ Bấm **"Xác nhận & Chuẩn bị hàng"** ➔ Bấm **"Đã đóng gói xong - Chờ Shipper"**.
6. **Bước 6 (Shipper & Khách):** Chuyển sang `Shipper` ➔ Bấm **"Nhận Đơn & Bắt Đầu Giao"** ➔ Bấm **"Xác Nhận Đã Giao & Thu Tiền COD"** ➔ Chuyển lại `Khách hàng` vào mục *Đơn mua* xem dòng thời gian (Timeline) cập nhật trạng thái *Giao hàng thành công*.

---

## 4. Hướng dẫn chạy tại Local
```bash
# 1. Cài đặt các thư viện
npm install

# 2. Khởi chạy máy chủ phát triển (Development)
npm run dev

# Mở trình duyệt tại: http://localhost:5173/

# 3. Kiểm tra TypeScript & Build sản phẩm
npm run build

# 4. Chạy thử bản production preview
npm run preview
```

---

## 5. Hướng dẫn Deploy lên Vercel
1. Đẩy mã nguồn lên kho lưu trữ GitHub của bạn.
2. Đăng nhập vào [Vercel](https://vercel.com/) và bấm **"Add New Project"** ➔ Chọn repository `shopee-mini-demo`.
3. Cấu hình triển khai:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. File `vercel.json` đã có sẵn cấu hình rewrite SPA:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
5. Bấm **Deploy**. Tất cả các direct URL như `/orders`, `/seller`, `/admin`, `/demo-guide` đều load mượt mà không gặp lỗi 404.
