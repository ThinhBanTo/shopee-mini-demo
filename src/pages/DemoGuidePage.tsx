import React, { useState } from 'react';
import {
  BookOpen,
  RotateCcw,
  ArrowRight,
  Code,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SEED_USERS } from '../data/seed';
import { ResetConfirmModal } from '../components/ResetConfirmModal';
import { Link } from 'react-router-dom';

export const DemoGuidePage: React.FC = () => {
  const { currentUser, switchRole } = useAppStore();
  const [isResetOpen, setIsResetOpen] = useState(false);

  const steps = [
    {
      step: 1,
      role: 'seller' as const,
      roleTitle: 'Người bán (Seller)',
      action: 'Đăng sản phẩm mới',
      desc: 'Vào "Kênh Người Bán" > Thêm sản phẩm mới (ví dụ "Tai nghe Demo 2026", giá 350.000₫, kho 20). Sản phẩm sẽ có trạng thái PENDING.',
      link: '/seller/products/new',
      linkText: 'Đến trang Đăng sản phẩm',
    },
    {
      step: 2,
      role: 'customer' as const,
      roleTitle: 'Khách hàng (Customer)',
      action: 'Kiểm tra tính bảo mật hiển thị',
      desc: 'Chuyển sang Khách hàng và tìm kiếm "Tai nghe Demo 2026". Sản phẩm PENDING tuyệt đối không được xuất hiện ở trang mua sắm công khai.',
      link: '/',
      linkText: 'Đến Trang chủ tìm kiếm',
    },
    {
      step: 3,
      role: 'admin' as const,
      roleTitle: 'Quản trị viên (Admin)',
      action: 'Kiểm duyệt & Phê duyệt',
      desc: 'Chuyển sang Quản trị viên > Vào "Bảng Quản Trị" duyệt sản phẩm vừa đăng từ PENDING thành APPROVED.',
      link: '/admin',
      linkText: 'Đến trang Duyệt sản phẩm',
    },
    {
      step: 4,
      role: 'customer' as const,
      roleTitle: 'Khách hàng (Customer)',
      action: 'Mua hàng & Áp mã DEMO10',
      desc: 'Quay lại Khách hàng, tìm thấy sản phẩm đã duyệt > Thêm giỏ > Áp mã giảm giá DEMO10 (giảm 10%) > Đặt hàng COD.',
      link: '/cart',
      linkText: 'Đến Giỏ hàng & Checkout',
    },
    {
      step: 5,
      role: 'seller' as const,
      roleTitle: 'Người bán (Seller)',
      action: 'Xử lý đơn & Đóng gói',
      desc: 'Vào Đơn hàng của shop > Thấy đơn mới trạng thái "Chờ xác nhận" > Bấm "Xác nhận đơn" (Chuẩn bị hàng) > Bấm "Sẵn sàng bàn giao" (Chờ shipper).',
      link: '/seller/orders',
      linkText: 'Đến Quản lý đơn bán',
    },
    {
      step: 6,
      role: 'shipper' as const,
      roleTitle: 'Shipper & Khách nhận hàng',
      action: 'Nhận đơn, giao hàng & Tracking',
      desc: 'Shipper tiếp nhận đơn > Cập nhật "Đang giao" > Bấm "Giao hàng thành công". Khách hàng mở mục "Đơn mua" để xem dòng thời gian (Timeline) giao hàng thời gian thực!',
      link: '/shipper',
      linkText: 'Đến Cổng Shipper',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-orange-500/20">
        <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          Kịch bản đánh giá đồ án
        </div>
        <h1 className="text-2xl sm:text-4xl font-black">
          Hướng Dẫn Trình Bày Demo 4 Vai Trò
        </h1>
        <p className="mt-2 text-white/90 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Tài liệu chuẩn hóa các bước thực nghiệm end-to-end từ lúc đăng bán sản phẩm tới khi giao nhận và thu tiền COD thành công trên cùng một nguồn dữ liệu (Single Source of Truth).
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setIsResetOpen(true)}
            className="flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 font-bold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Khôi phục dữ liệu mẫu ban đầu
          </button>
        </div>
      </div>

      {/* 4 Demo Accounts Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
          Danh sách 4 Tài khoản Demo đã cấu hình sẵn
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SEED_USERS.map((user) => {
            const isCurrent = currentUser?.role === user.role;
            return (
              <div
                key={user.id}
                className={`rounded-2xl p-4 border transition-all ${
                  isCurrent
                    ? 'bg-orange-50/50 border-orange-500 shadow-md ring-2 ring-orange-200'
                    : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs truncate max-w-[140px]">{user.name}</h3>
                    <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 space-y-1 mb-4 border-t border-gray-100 pt-2">
                  <p><strong>Email:</strong> {user.email}</p>
                  {user.shopName && <p><strong>Shop:</strong> {user.shopName}</p>}
                </div>

                <button
                  onClick={() => switchRole(user.role)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {isCurrent ? '✓ Đang hoạt động' : 'Chuyển sang vai này'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6 Step Scenario */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
          Kịch bản 6 bước kiểm thử luồng P0
        </h2>

        <div className="space-y-3">
          {steps.map((st) => (
            <div
              key={st.step}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 font-black text-sm flex items-center justify-center flex-shrink-0">
                  {st.step}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                      {st.roleTitle}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm">{st.action}</h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">{st.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                  onClick={() => switchRole(st.role)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold whitespace-nowrap"
                >
                  Switch {st.role}
                </button>
                <Link
                  to={st.link}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sm whitespace-nowrap transition-colors"
                >
                  <span>{st.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech notes */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
          <Code className="w-4 h-4" />
          Kiến trúc kỹ thuật & Lưu trữ
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          - <strong>State & Persistence:</strong> Sử dụng Zustand kết hợp <code>persist</code> middleware đồng bộ tức thời vào <code>localStorage</code> theo schema versioning, không bị mất trạng thái khi F5 hoặc chuyển role.<br />
          - <strong>An toàn dữ liệu:</strong> Trừ tồn kho nguyên tử (atomic) khi đơn tạo thành công; không cho phép mua âm kho; tính toán voucher phía store logic.<br />
          - <strong>Deploy Vercel:</strong> Chạy Vite Single Page App với cấu hình root <code>vercel.json</code> rewrite chuẩn.
        </p>
      </div>

      <ResetConfirmModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
    </div>
  );
};
