# MASTER PROMPT — Dán vào Antigravity sau khi mở thư mục `shopee-mini-demo`

Bạn là Senior Frontend Engineer + UI/UX Designer + QA Engineer. Hãy **trực tiếp tạo và sửa file code trong workspace hiện tại**, chạy lệnh và sửa lỗi để có website demo trước ngày 27/10/2026.

## 0. Cách làm việc bắt buộc
- Đọc `AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/PROJECT_HISTORY.md` trước khi viết code.
- Workspace hiện tại là root frontend, không tạo thêm thư mục `frontend`, `app` hay monorepo, không động tới project khác.
- Nếu có tài liệu `Shopee_Chuc_Nang_Va_Anh_Giao_Dien.docx` trong workspace, đọc để đối chiếu nghiệp vụ: 6 nhóm, 18 use case tổng quát, 36 mục ảnh. Không cố biến tất cả thành 36 route.
- Implement theo **4 phase** phía dưới, ưu tiên P0. Chủ động quyết định thiết kế nhỏ, không hỏi liên tục. Không chỉ lập kế hoạch mà phải code ngay.
- Sau MỖI phase hoàn thành: chạy build, cập nhật `docs/PROJECT_STATE.md` và append milestone ngắn vào `docs/PROJECT_HISTORY.md`; báo những gì đã kiểm chứng. Nếu bị giới hạn ngữ cảnh/token, cập nhật state trước khi dừng.
- Không ghi "done" cho thứ chưa kiểm chứng. Nếu npm install/browser test bị chặn, ghi blocker thực tế và hướng dẫn người dùng xử lý.
- Chỉ tạo thêm tài liệu khi thật cần; không tạo `task.md`, `plan.md`, `walkthrough.md` trùng lặp.

## 1. Mục tiêu và stack
Tạo một website marketplace tương tác lấy cảm hứng Shopee, **không phải website Shopee chính thức**. Nhãn UI đề xuất "MiniMall — Demo sàn TMĐT", footer ghi "Dự án mô phỏng phục vụ học tập — không liên kết với Shopee".

Stack bắt buộc: React + Vite + TypeScript + Tailwind CSS + React Router + lucide-react. Có thể dùng Zustand `persist` để xử lý global state/localStorage nếu giúp giảm code và đồng bộ dữ liệu; phiên bản Tailwind phải cấu hình khớp thư viện thực cài. Không dùng Next.js, backend, Java Spring, Docker, Supabase, Firebase, OAuth, thanh toán online thật hay API server. Không lưu password. Không lộ secret. Tất cả đều deploy được trên Vercel ở root với `npm run build` và output `dist`.

Thiết kế: desktop-first nhưng responsive mobile. Phối màu cam/trắng, hiện đại, tinh gọn, nhìn như sản phẩm đã hoàn thành. Header sticky với logo chữ (không dùng logo Shopee), search, giỏ hàng, điều hướng, role demo switcher. Card sản phẩm có ảnh, nhãn giảm giá, giá VND, rating giả lập ghi nhận là dữ liệu demo. Banner, filter, sort, empty/loading states, toast, confirm dialogs, breadcrumbs, trạng thái đơn hàng dạng timeline. Dùng ảnh demo có URL đáng tin cậy và fallback không vỡ layout. Giao diện tiếng Việt.

## 2. Các role — dùng Account Switcher DEMO (không fake authentication)
- `customer`: xem sản phẩm duyệt, tìm kiếm, chi tiết, giỏ hàng, COD checkout, xem đơn và tracking.
- `seller`: tạo/sửa sản phẩm của chính mình, thấy trạng thái PENDING/APPROVED/REJECTED, xử lý đơn của gian hàng.
- `admin`: phê duyệt/từ chối sản phẩm đang chờ, dashboard tổng hợp.
- `shipper`: thấy đơn sẵn sàng giao, nhận hàng, cập nhật đang giao/đã giao.

Dùng 4 tài khoản demo có tên tiếng Việt, switch trực tiếp từ header và lưu role. Ghi rõ "Chuyển vai trò (Demo)". Những trang role-specific chuyển hướng hoặc hiển thị thông báo phù hợp khi không đúng vai trò. Đây chỉ là mô phỏng UI, không phải phân quyền bảo mật phía server.

## 3. Luồng nghiệp vụ bắt buộc — cùng một nguồn dữ liệu
**Flow A — duyệt sản phẩm:** Seller tạo sản phẩm có tên, giá > 0, tồn kho >= 0, danh mục, mô tả, URL hình (fallback). Sản phẩm mới trạng thái `PENDING`. Admin duyệt (`APPROVED`) hoặc từ chối (ghi lý do). Chỉ sản phẩm `APPROVED` và đang bán mới được xuất hiện ở trang khách hàng. Không thể tự duyệt trong seller UI.

**Flow B — đặt COD:** Customer tìm/chọn sản phẩm -> xem chi tiết -> thêm giỏ -> đổi số lượng/xóa -> checkout (tên, số điện thoại, địa chỉ giao hàng, COD) -> voucher `DEMO10` giảm 10%, tối đa 50.000đ nếu áp dụng -> đơn hàng có mã rõ ràng, total = subtotal + shipping - discount -> hiện trong Đơn mua; giỏ được xóa mục đã đặt. Không cho mua vượt tồn kho, số lượng <=0, giá không hợp lệ, checkout rỗng. Deduct/reserve stock exactly once on successful order creation; do not mutate stock on validation error. Shipping fee ví dụ cố định 25.000đ và được hiển thị minh bạch.

**Flow C — fulfillment:** Seller xác nhận đơn `PENDING_CONFIRMATION` -> `PREPARING` -> `AWAITING_PICKUP`. Shipper chỉ thấy những đơn đã bàn giao, cập nhật `IN_TRANSIT` -> `DELIVERED`. Customer tracking hiển thị lịch sử và trạng thái chính xác. Cấm nhảy bước không hợp lệ. Nếu chọn đơn một seller cho bản MVP, đảm bảo giỏ thanh toán không trộn nhiều seller: giới hạn checkout theo một seller với thông báo rõ ràng, hoặc tách đơn theo seller và tính toán chính xác; chọn cách đơn giản nhất.

**Flow D — persistence:** chuyển role và refresh không mất state. Nút "Đặt lại dữ liệu demo" với confirm để quay về seed ổn định. Phòng thủ dữ liệu localStorage corrupt bằng fallback seed/version. Nếu dữ liệu demo trong tab thay đổi, các màn hình cùng tab phải cập nhật ngay.

## 4. UI và routes ưu tiên
- Public customer: `/`, `/products/:id`, `/cart`, `/checkout`, `/orders`, `/orders/:id`.
- Seller: `/seller`, `/seller/products`, `/seller/products/new`, `/seller/orders`.
- Admin: `/admin`, `/admin/approvals`.
- Shipper: `/shipper`.
- `/demo-guide`: tài khoản demo, kịch bản 6 bước dễ trình bày trước giảng viên và nút reset.
- Route 404 có cách trở về trang chủ.
Có thể gộp màn hình con vào modal/tabs để giảm thời gian, không nhất thiết tạo 14 file page khác nhau.

Seed dữ liệu: tối thiểu 16 sản phẩm Việt Nam, khoảng 4–5 danh mục, 1 sản phẩm chờ duyệt, 1–3 đơn mẫu ở các trạng thái khác nhau (nếu tạo đơn mẫu thì thống nhất user/seller/shipping/tổng tiền), 4 account demo. Product photos không được hiển thị ảnh hỏng. Có sản phẩm nổi bật và giá VND đúng định dạng `vi-VN`.

P1 nếu còn thời gian: profile/địa chỉ nhận hàng, tab đánh giá sản phẩm demo, dashboard seller/admin, voucher đơn giản, filter giá. P2 chỉ vẽ giao diện minh họa và ghi rõ chưa thực hiện: hoàn/huỷ tiền phức tạp, disputes, online payments, Google login.

## 5. Architecture gọn, dễ bảo trì
- `src/components` (shared UI), `src/pages`, `src/data/seed.ts`, `src/store`, `src/types`, `src/lib` (formatters/validation), `src/layouts` nếu cần.
- Typed models: `User`, `Product`, `CartItem`, `Order`, `OrderItem`, `OrderEvent`, `Voucher` và enums/unions cho statuses.
- Business actions ở store/domain layer; UI không tự thay đổi các status tuỳ tiện.
- Persist một state chính có `schemaVersion`, dùng seed + reset; form validation tối thiểu; no hardcoded totals.
- Gọi `.map()` cần `key`, check nulls, có Error Boundary hoặc fallback UI nếu hữu ích.
- Dữ liệu trong state được liên kết bằng id để các vai trò luôn thấy cùng đơn/sản phẩm.

## 6. 4 giai đoạn phải thực thi
### PHASE 1 — nền tảng
1. Khảo sát file, nếu chưa có dự án hãy khởi tạo Vite React TS **mà không xóa** `AGENTS.md`, docs và `vercel.json` đang tồn tại. Có thể tạo cấu hình bằng tay hoặc scaffold vào thư mục tạm rồi chuyển file cần thiết.
2. Cài dependencies. Tạo giao diện design system, layout, responsive header, store persist, seed, account switcher, router.
3. Home + product listing/search + product detail cơ bản. Chạy `npm run build`, sửa lỗi. Cập nhật state/history.

### PHASE 2 — customer
Giỏ hàng -> voucher -> checkout COD -> order history -> order details/tracking. Check tổng tiền, tồn kho, persist và trạng thái chuyển trang. Chạy `npm run build`; cập nhật docs.

### PHASE 3 — multi-role workflow
Seller product create/listing/orders -> Admin approval -> Shipper statuses -> customer tracking. Điều kiện trạng thái nhất quán. Chạy `npm run build`; cập nhật docs.

### PHASE 4 — demo & deploy ready
Tối ưu UI, xử lý loading/empty/error, ảnh fallback, seed reset và `/demo-guide`. Test luồng P0 end-to-end (nếu có browser automation dùng browser; nếu không kiểm tra code và test thủ công bằng hướng dẫn rõ). Chạy `npm run build`. Kiểm tra `vercel.json` rewrite, README hướng dẫn demo, những chức năng chưa có được ghi rõ. Cập nhật state/history.

## 7. Acceptance tests (cần làm thực tế, không chỉ mô tả)
1. Switch Seller -> thêm sản phẩm tên "Tai nghe Demo 2026" -> pending -> Seller product list.
2. Switch Customer -> tìm tên trên -> chưa thấy pending.
3. Switch Admin -> Approve -> Customer tìm lại thấy, mở chi tiết.
4. Thêm vào giỏ 2 sản phẩm -> voucher DEMO10 -> checkout COD với thông tin hợp lệ -> tạo một order và total đúng.
5. Switch Seller -> đơn đó xuất hiện -> confirm -> mark ready/handover.
6. Switch Shipper -> thấy đơn, nhận và giao thành công.
7. Switch Customer -> orders -> detail -> timeline hiển thị Delivered.
8. Refresh -> các trạng thái vẫn giữ; Reset -> seed trở lại.
9. Direct-load `/orders` and `/seller` on hosted Vercel URL không 404.
10. Check responsive viewport mobile + không có nút P0 vô hiệu.

## 8. Definition of Done / handoff
- `npm run build` thành công (không loại trừ lỗi bằng cách xóa type-check).
- Có thể chạy `npm run dev` tại localhost.
- Browser flow A–D hoạt động hoặc nêu rõ phần chưa test/chưa đạt.
- Đọc/cập nhật `docs/PROJECT_STATE.md` + append `docs/PROJECT_HISTORY.md` sau mỗi phase.
- README có scripts, stack, demo flow, limitations: chỉ localStorage trên cùng trình duyệt, không phải xác thực/thanh toán thật.
- Chuẩn bị instructions Vercel: import GitHub repository; framework Vite; build `npm run build`; output `dist`; SPA rewrite.
- Không tự `git push`, deploy, đặt API keys, xóa repo, force push, hay lệnh nguy hiểm mà chưa được chủ repo yêu cầu rõ.

**BẮT ĐẦU THỰC HIỆN PHASE 1 NGAY. Ưu tiên viết file và chạy code hơn lập kế hoạch dài. Sau phase 1, tiếp tục phase 2/3/4 nếu còn tài nguyên; luôn cập nhật state đúng thực tế.**

---

# RESUME PROMPT — dùng nếu Antigravity hết context / đổi conversation

Hãy đọc `AGENTS.md`, `docs/PROJECT_STATE.md`, các entry mới nhất trong `docs/PROJECT_HISTORY.md` và kiểm tra source hiện tại. Không xây dựng lại project từ đầu. Tiếp tục từ mục `Next exact action`, ưu tiên P0. Thực hiện, kiểm tra build, cập nhật state/history, báo file thay đổi và còn gì chưa hoàn thành. Không khẳng định đã test nếu chưa test.

# FINAL QA PROMPT — dùng trước khi push lên GitHub / deploy

Đóng vai QA + release engineer. Đọc `docs/PROJECT_STATE.md` và source. Không thêm feature. Chạy `npm run build` và sửa lỗi; kiểm tra các luồng acceptance trong master prompt, refresh, reset, role switch, số lượng/tổng tiền, route deep link, responsive, ảnh, console lỗi, thiếu import, trạng thái hiển thị. Chỉ sửa lỗi thực tế. Cập nhật PROJECT_STATE/HISTORY ghi rõ PASS/FAIL/NOT RUN. Sau đó hướng dẫn chính xác git add/commit/push và Vercel import/settings. Không tự push hoặc deploy.
