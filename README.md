# MiniShoppe

Website mô phỏng sàn thương mại điện tử phục vụ học tập.

## Giới thiệu

MiniShoppe là đồ án xây dựng ứng dụng mô phỏng quy trình nghiệp vụ mua bán trực tuyến trên sàn thương mại điện tử. Ứng dụng tập trung vào tương tác giữa các bên liên quan trong chu trình xử lý đơn hàng theo hình thức thanh toán khi nhận hàng (COD). Toàn bộ luồng hoạt động chạy trực tiếp trên trình duyệt để phục vụ việc trình bày và đánh giá môn học.

## Chức năng chính

- Khách hàng: Xem danh mục sản phẩm, tìm kiếm, quản lý giỏ hàng, áp dụng mã giảm giá, đặt hàng COD và theo dõi trạng thái đơn hàng.
- Người bán: Đăng sản phẩm mới chờ phê duyệt, quản lý danh sách sản phẩm, xác nhận đơn hàng và chuẩn bị hàng giao cho bên vận chuyển.
- Quản trị viên: Kiểm duyệt danh sách sản phẩm do người bán đăng ký (phê duyệt hoặc từ chối kèm lý do).
- Đơn vị vận chuyển: Tiếp nhận đơn hàng cần giao, cập nhật tiến trình vận chuyển và xác nhận giao hàng thành công.

## Công nghệ sử dụng

- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- localStorage

## Cài đặt và chạy

Cài đặt các thư viện phụ thuộc:

```bash
npm install
```

Chạy môi trường phát triển:

```bash
npm run dev
```

Kiểm tra bản dựng:

```bash
npm run build
```

## Tài khoản demo

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Khách hàng | khachhang@demo.vn | demo12345 |
| Người bán | nguoiban@demo.vn | demo12345 |
| Quản trị viên | admin@demo.vn | demo12345 |
| Đơn vị vận chuyển | shipper@demo.vn | demo12345 |

Người dùng có thể chuyển đổi nhanh giữa các vai trò bằng thanh công cụ chuyển vai trò (Demo Mode) trên thanh điều hướng hoặc tự đăng ký tài khoản khách hàng mới.

## Demo

Địa chỉ triển khai: https://shopee-mini-demo.vercel.app

Quy trình trải nghiệm mẫu:
Người bán đăng sản phẩm -> Quản trị viên duyệt -> Khách hàng đặt hàng -> Đơn vị vận chuyển giao hàng.

## Lưu ý

- Ứng dụng lưu trữ toàn bộ dữ liệu mẫu trong localStorage của trình duyệt.
- Chức năng đăng nhập, thanh toán và xử lý đơn hàng chỉ phục vụ mô phỏng luồng nghiệp vụ.
- Dữ liệu giữa các trình duyệt hoặc thiết bị khác nhau không tự động đồng bộ.
