import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t-4 border-[#ee4d2d] mt-12 text-[#757575] text-[12px] font-['Roboto',Arial,sans-serif]">
      {/* 5-Column Shopee Information Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
          {/* Col 1 */}
          <div>
            <h4 className="font-bold text-[#222222] mb-3 text-[12px] uppercase tracking-wider">
              Chăm sóc khách hàng
            </h4>
            <ul className="space-y-2">
              <li><Link to="/demo-guide" className="hover:text-[#ee4d2d]">Trung tâm trợ giúp</Link></li>
              <li><Link to="/demo-guide" className="hover:text-[#ee4d2d]">Hướng dẫn mua hàng</Link></li>
              <li><span className="hover:text-[#ee4d2d] cursor-pointer">Thanh toán COD</span></li>
              <li><span className="hover:text-[#ee4d2d] cursor-pointer">Vận chuyển & Giao nhận</span></li>
              <li><span className="hover:text-[#ee4d2d] cursor-pointer">Chính sách bảo hành</span></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-[#222222] mb-3 text-[12px] uppercase tracking-wider">
              Về MiniShoppe
            </h4>
            <ul className="space-y-2">
              <li><Link to="/demo-guide" className="hover:text-[#ee4d2d]">Giới thiệu MiniShoppe</Link></li>
              <li><span className="hover:text-[#ee4d2d] cursor-pointer">Điều khoản dịch vụ</span></li>
              <li><span className="hover:text-[#ee4d2d] cursor-pointer">Chính sách bảo mật</span></li>
              <li><span className="hover:text-[#ee4d2d] cursor-pointer">Chính hãng Mall</span></li>
              <li><Link to="/seller" className="hover:text-[#ee4d2d]">Kênh Người Bán</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-[#222222] mb-3 text-[12px] uppercase tracking-wider">
              Thanh toán & Vận chuyển
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium text-[#222222]">
                <span className="px-2 py-1 bg-gray-100 rounded-[2px] text-[11px] font-bold text-gray-800">
                  COD (Tiền mặt)
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded-[2px] text-[11px] font-bold text-gray-800">
                  Freeship 0Đ
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed mt-1">
                Đơn vị vận chuyển nội bộ mô phỏng trực tiếp quy trình Shipper giao hàng & thu tiền.
              </p>
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-bold text-[#222222] mb-3 text-[12px] uppercase tracking-wider">
              4 Vai trò tương tác
            </h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-[#ee4d2d]">🛒 Khách hàng</Link></li>
              <li><Link to="/seller" className="hover:text-[#ee4d2d]">🏪 Kênh Người Bán</Link></li>
              <li><Link to="/admin" className="hover:text-[#ee4d2d]">🛡️ Ban Quản Trị</Link></li>
              <li><Link to="/shipper" className="hover:text-[#ee4d2d]">🚚 Cổng Shipper</Link></li>
            </ul>
          </div>

          {/* Col 5: App Download & Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <BrandLogo variant="on-white" size="sm" asLink />
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Mô phỏng trải nghiệm sàn thương mại điện tử chuẩn phong cách Shopee Việt Nam.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[2px] bg-orange-50 border border-orange-200 text-[#ee4d2d] text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dữ liệu Local Demo</span>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-[#e8e8e8] mt-8 pt-6 text-center text-[11px] text-[#757575] space-y-2">
          <p className="font-medium text-[#222222]">
            Dự án mô phỏng phục vụ học tập — không liên kết với Shopee.
          </p>
          <p className="text-gray-400">
            Địa chỉ demo: Khu Công Nghệ Cao, TP. Thủ Đức, TP. Hồ Chí Minh. Toàn bộ thông tin tài khoản, sản phẩm và giao dịch COD trên website đều là dữ liệu giả lập lưu trong localStorage trình duyệt.
          </p>
          <p className="text-gray-500">© 2026 MiniShoppe. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};
