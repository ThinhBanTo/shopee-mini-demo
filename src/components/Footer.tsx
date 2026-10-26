import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 text-gray-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-gray-900">
                Mini<span className="text-orange-600">Mall</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Ứng dụng mô phỏng sàn thương mại điện tử 4 vai trò (Khách hàng, Người bán, Quản trị viên, Shipper) phục vụ nghiên cứu và trình bày đồ án.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Chế độ Demo Tự trị (Local)</span>
            </div>
          </div>

          {/* Role navigation */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">
              Khám phá theo vai trò
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-orange-600 transition-colors">
                  🛒 Khách hàng (Mua sắm & Đơn mua)
                </Link>
              </li>
              <li>
                <Link to="/seller" className="hover:text-orange-600 transition-colors">
                  🏪 Kênh Người Bán (Đăng hàng & Đóng gói)
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-orange-600 transition-colors">
                  🛡️ Ban Quản Trị (Kiểm duyệt sản phẩm)
                </Link>
              </li>
              <li>
                <Link to="/shipper" className="hover:text-orange-600 transition-colors">
                  🚚 Cổng Vận Chuyển (Giao nhận hàng COD)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links & Demo guide */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">
              Hỗ trợ & Hướng dẫn
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/demo-guide" className="hover:text-orange-600 transition-colors font-medium text-orange-600">
                  📖 Kịch bản 6 bước chấm điểm giáo viên
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-orange-600 transition-colors">
                  🛍️ Giỏ hàng & Voucher giảm giá
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-orange-600 transition-colors">
                  📦 Theo dõi hành trình đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">
              Tuyên bố từ chối trách nhiệm
            </h4>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-500 leading-relaxed">
              <p className="font-semibold text-gray-700 mb-1">
                Dự án mô phỏng phục vụ học tập — không liên kết với Shopee.
              </p>
              Mọi dữ liệu thanh toán COD, thông tin cá nhân và sản phẩm trên ứng dụng đều là dữ liệu giả lập lưu trên trình duyệt (localStorage).
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 MiniMall. Thiết kế và phát triển với mục đích học tập.</p>
          <div className="flex items-center gap-1 text-gray-500">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>React + Vite + TypeScript + Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
