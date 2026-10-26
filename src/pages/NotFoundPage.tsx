import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center">
        <span className="text-6xl font-black text-orange-600">404</span>
        <h2 className="text-xl font-bold text-gray-900 mt-2 mb-2">Trang không tồn tại</h2>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          Đường dẫn bạn yêu cầu không tồn tại hoặc đã được di chuyển trong hệ thống MiniShoppe.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/25 transition-all"
          >
            <Home className="w-4 h-4" />
            Về Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};
