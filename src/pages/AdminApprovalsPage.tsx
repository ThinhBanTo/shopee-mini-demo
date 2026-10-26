import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Boxes,
  Package,
  Store,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatVND, PRODUCT_STATUS_MAP, FALLBACK_IMAGE } from '../lib/formatters';
import { useToast } from '../components/Toast';
import { Product } from '../types';

export const AdminApprovalsPage: React.FC = () => {
  const { showToast } = useToast();
  const currentUser = useAppStore((state) => state.currentUser);
  const switchRole = useAppStore((state) => state.switchRole);
  const products = useAppStore((state) => state.products);
  const orders = useAppStore((state) => state.orders);
  const adminApproveProduct = useAppStore((state) => state.adminApproveProduct);
  const adminRejectProduct = useAppStore((state) => state.adminRejectProduct);

  const [filterTab, setFilterTab] = useState<'PENDING' | 'ALL' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [rejectingProduct, setRejectingProduct] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState('Thông tin hoặc hình ảnh chưa đáp ứng tiêu chuẩn sàn.');

  const isAdminRole = currentUser?.role === 'admin';

  const pendingProducts = products.filter((p) => p.status === 'PENDING');
  const approvedProducts = products.filter((p) => p.status === 'APPROVED');
  const rejectedProducts = products.filter((p) => p.status === 'REJECTED');

  const filteredProducts = products.filter((p) => {
    if (filterTab === 'ALL') return true;
    return p.status === filterTab;
  });

  const handleApprove = (product: Product) => {
    const res = adminApproveProduct(product.id);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleConfirmReject = () => {
    if (!rejectingProduct) return;
    const res = adminRejectProduct(rejectingProduct.id, rejectReason.trim());
    if (res.success) {
      showToast(res.message, 'info');
      setRejectingProduct(null);
      setRejectReason('Thông tin hoặc hình ảnh chưa đáp ứng tiêu chuẩn sàn.');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Warning Banner if not Admin */}
      {!isAdminRole && (
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-purple-900">
            <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <span>
              Bạn đang xem Bảng Quản Trị với vai trò <strong>{currentUser?.role || 'khách'}</strong>. Hãy chuyển sang vai trò Quản trị viên để thực hiện phê duyệt/từ chối sản phẩm.
            </span>
          </div>
          <button
            onClick={() => switchRole('admin')}
            className="px-3.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold whitespace-nowrap shadow-sm"
          >
            Chuyển sang Quản trị viên ngay
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Ban Quản Trị — Kiểm Duyệt Sản Phẩm Sàn MiniShoppe
            </h1>
            <p className="text-xs text-gray-500">
              Quản trị viên: <strong>{currentUser?.name || 'Admin'}</strong> • Giám sát sản phẩm và chất lượng niêm yết
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-gray-500">Cần phê duyệt gấp</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600">{pendingProducts.length}</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-[11px] text-gray-400">Sản phẩm người bán mới đăng</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-gray-500">Đã phê duyệt (Đang bán)</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600">{approvedProducts.length}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[11px] text-gray-400">Hiển thị cho toàn bộ khách hàng</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-gray-500">Bị từ chối duyệt</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600">{rejectedProducts.length}</span>
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
          <p className="text-[11px] text-gray-400">Yêu cầu sửa đổi hoặc vi phạm</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-gray-500">Tổng đơn hàng toàn sàn</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-600">{orders.length}</span>
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-[11px] text-gray-400">Tất cả đơn COD trong hệ thống</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterTab('PENDING')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
            filterTab === 'PENDING'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Chờ duyệt ({pendingProducts.length})</span>
        </button>

        <button
          onClick={() => setFilterTab('APPROVED')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
            filterTab === 'APPROVED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã duyệt ({approvedProducts.length})</span>
        </button>

        <button
          onClick={() => setFilterTab('REJECTED')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
            filterTab === 'REJECTED'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <XCircle className="w-4 h-4" />
          <span>Đã từ chối ({rejectedProducts.length})</span>
        </button>

        <button
          onClick={() => setFilterTab('ALL')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
            filterTab === 'ALL'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Toàn bộ sản phẩm ({products.length})</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900">
          Danh Sách Sản Phẩm — {filterTab === 'PENDING' ? 'Đang Chờ Phê Duyệt' : filterTab}
        </h2>

        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Sản phẩm</th>
                  <th className="p-3">Gian hàng bán</th>
                  <th className="p-3">Danh mục</th>
                  <th className="p-3">Giá & Tồn</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3 text-right">Hành động duyệt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const statusConfig = PRODUCT_STATUS_MAP[p.status];
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || FALLBACK_IMAGE}
                            alt={p.title}
                            className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                          />
                          <div className="min-w-0 max-w-sm">
                            <p className="font-bold text-gray-900 line-clamp-2">{p.title}</p>
                            <span className="text-[10px] text-gray-400 font-mono">{p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium text-gray-800">
                          <Store className="w-3.5 h-3.5 text-orange-600" />
                          <span>{p.sellerName}</span>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">{p.category}</td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-bold text-gray-900">{formatVND(p.price)}</div>
                        <span className="text-[11px] text-gray-400">Kho: {p.stock}</span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                          {statusConfig.label}
                        </span>
                        {p.status === 'REJECTED' && p.rejectReason && (
                          <p className="text-[10px] text-rose-600 mt-1 max-w-xs">{p.rejectReason}</p>
                        )}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/products/${p.id}`}
                            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                            title="Xem trang sản phẩm"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Approval Controls */}
                          {p.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(p)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Phê duyệt</span>
                              </button>
                              <button
                                onClick={() => setRejectingProduct(p)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Từ chối</span>
                              </button>
                            </>
                          )}

                          {p.status === 'REJECTED' && (
                            <button
                              onClick={() => handleApprove(p)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs hover:bg-emerald-100 border border-emerald-200"
                            >
                              Duyệt lại
                            </button>
                          )}

                          {p.status === 'APPROVED' && (
                            <button
                              onClick={() => setRejectingProduct(p)}
                              className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-medium"
                            >
                              Gỡ niêm yết
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-400">
            Không có sản phẩm nào ở trạng thái này.
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              Từ chối duyệt sản phẩm
            </h3>
            <p className="text-xs text-gray-600">
              Sản phẩm: <strong>{rejectingProduct.title}</strong>
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Lý do từ chối (hiển thị cho người bán):
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:bg-white focus:border-rose-500 resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectingProduct(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
