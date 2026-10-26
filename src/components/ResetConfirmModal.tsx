import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useToast } from './Toast';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetConfirmModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const resetToSeedData = useAppStore((state) => state.resetToSeedData);
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleReset = () => {
    resetToSeedData();
    showToast('Đã khôi phục toàn bộ dữ liệu mẫu ban đầu!', 'info');
    onClose();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Đặt lại toàn bộ dữ liệu Demo?</h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Hành động này sẽ xóa các đơn hàng mới tạo, các sản phẩm mới thêm, và khôi phục lại danh sách 17 sản phẩm mẫu, 4 tài khoản và 3 đơn hàng chuẩn.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm shadow-md shadow-orange-500/25 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Xác nhận khôi phục
          </button>
        </div>
      </div>
    </div>
  );
};
