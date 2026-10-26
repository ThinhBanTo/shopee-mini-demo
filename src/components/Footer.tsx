import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#e8e8e8] mt-10 text-[#757575] text-[13px] font-['Roboto',Arial,sans-serif]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <BrandLogo variant="on-white" size="sm" asLink />
            <p className="text-[13px] text-gray-500 pt-1">
              Website mô phỏng sàn thương mại điện tử phục vụ học tập.
            </p>
          </div>

          <nav className="flex items-center flex-wrap justify-center gap-5 sm:gap-6 text-[13px]" aria-label="Liên kết điều hướng">
            <Link to="/" className="text-gray-600 hover:text-[#ee4d2d] transition-colors">
              Trang chủ
            </Link>
            <Link to="/seller" className="text-gray-600 hover:text-[#ee4d2d] transition-colors">
              Kênh Người Bán
            </Link>
            <Link to="/orders" className="text-gray-600 hover:text-[#ee4d2d] transition-colors">
              Đơn Mua
            </Link>
            <Link to="/cart" className="text-gray-600 hover:text-[#ee4d2d] transition-colors">
              Giỏ Hàng
            </Link>
          </nav>
        </div>

        <div className="border-t border-[#f0f0f0] mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-gray-400">
          <p>Dự án học tập, không liên kết với Shopee.</p>
          <p>© 2026 MiniShoppe. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};
