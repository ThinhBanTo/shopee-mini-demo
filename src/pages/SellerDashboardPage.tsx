import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Store,
  Package,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  TrendingUp,
  Boxes,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatVND, formatDateTime, PRODUCT_STATUS_MAP, ORDER_STATUS_MAP, FALLBACK_IMAGE } from '../lib/formatters';
import { useToast } from '../components/Toast';
import { CATEGORIES } from '../data/seed';

interface Props {
  defaultTab?: 'overview' | 'products' | 'new-product' | 'orders';
}

export const SellerDashboardPage: React.FC<Props> = ({ defaultTab = 'overview' }) => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || defaultTab;
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'new-product' | 'orders'>(initialTab);

  const { showToast } = useToast();
  const currentUser = useAppStore((state) => state.currentUser);
  const switchRole = useAppStore((state) => state.switchRole);
  const products = useAppStore((state) => state.products);
  const orders = useAppStore((state) => state.orders);
  const createProduct = useAppStore((state) => state.createProduct);
  const sellerConfirmOrder = useAppStore((state) => state.sellerConfirmOrder);
  const sellerReadyForPickup = useAppStore((state) => state.sellerReadyForPickup);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<string>(CATEGORIES[1]);
  const [newPrice, setNewPrice] = useState<number>(350000);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(490000);
  const [newStock, setNewStock] = useState<number>(20);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Auto switch to seller if not already seller or allow test
  const isSellerRole = currentUser?.role === 'seller';
  const sellerId = currentUser?.id || 'u-seller-001';
  const sellerName = currentUser?.shopName || currentUser?.name || 'Shop Người Bán';

  // Seller's own items
  const myProducts = products.filter((p) => p.sellerId === sellerId || currentUser?.role === 'seller');
  const myOrders = orders.filter((o) => o.sellerId === sellerId || currentUser?.role === 'seller');

  const pendingApprovalProducts = myProducts.filter((p) => p.status === 'PENDING');
  const approvedProducts = myProducts.filter((p) => p.status === 'APPROVED');
  const rejectedProducts = myProducts.filter((p) => p.status === 'REJECTED');

  const pendingConfirmOrders = myOrders.filter((o) => o.status === 'PENDING_CONFIRMATION');
  const preparingOrders = myOrders.filter((o) => o.status === 'PREPARING');
  const completedOrders = myOrders.filter((o) => o.status === 'DELIVERED');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.subtotal, 0);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Vui lòng nhập tên sản phẩm.', 'error');
      return;
    }
    if (newPrice <= 0) {
      showToast('Giá sản phẩm phải lớn hơn 0.', 'error');
      return;
    }
    if (newStock < 0) {
      showToast('Số lượng tồn kho không được âm.', 'error');
      return;
    }

    setIsCreating(true);
    const result = createProduct({
      title: newTitle.trim(),
      description: newDescription.trim() || 'Sản phẩm mới chính hãng từ ' + sellerName,
      price: newPrice,
      originalPrice: newOriginalPrice > newPrice ? newOriginalPrice : undefined,
      stock: newStock,
      category: newCategory,
      images: newImageUrl.trim() ? [newImageUrl.trim()] : ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'],
      sellerId,
      sellerName,
    });

    setIsCreating(false);

    if (result.success) {
      showToast(result.message, 'success');
      // Reset form
      setNewTitle('');
      setNewDescription('');
      setNewImageUrl('');
      // Navigate to products tab
      setActiveTab('products');
    } else {
      showToast(result.message, 'error');
    }
  };

  const handleConfirmOrder = (orderId: string) => {
    const res = sellerConfirmOrder(orderId);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleReadyForPickup = (orderId: string) => {
    const res = sellerReadyForPickup(orderId);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner and Role Warning */}
      {!isSellerRole && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              Bạn đang xem Kênh Người Bán với tài khoản <strong>{currentUser?.name || 'Khách'}</strong> ({currentUser?.role || 'Chưa đăng nhập'}). Hãy chuyển sang vai trò Người bán để thao tác đầy đủ.
            </span>
          </div>
          <button
            onClick={() => switchRole('seller')}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold whitespace-nowrap"
          >
            Chuyển sang Người bán ngay
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Kênh Quản Lý Người Bán
            </h1>
            <p className="text-xs text-gray-500">
              Gian hàng: <strong>{currentUser?.shopName || 'Mai Store Chính Hãng'}</strong> • Mã người bán: {currentUser?.id || 'u-seller-001'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('new-product')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Tổng quan Shop</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Sản phẩm của Shop ({myProducts.length})</span>
          {pendingApprovalProducts.length > 0 && (
            <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingApprovalProducts.length} chờ duyệt
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Xử lý đơn hàng ({myOrders.length})</span>
          {pendingConfirmOrders.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
              {pendingConfirmOrders.length} cần xác nhận
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('new-product')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'new-product'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Đăng sản phẩm mới</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-gray-500">Tổng sản phẩm</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-gray-900">{myProducts.length}</span>
                <Boxes className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-gray-400">
                {approvedProducts.length} đã duyệt • {pendingApprovalProducts.length} chờ duyệt • {rejectedProducts.length} từ chối
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-gray-500">Đơn chờ xác nhận</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-orange-600">{pendingConfirmOrders.length}</span>
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-[11px] text-gray-400">Cần tiếp nhận và đóng gói</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-gray-500">Đang chuẩn bị hàng</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-blue-600">{preparingOrders.length}</span>
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-[11px] text-gray-400">Sẵn sàng bàn giao cho Shipper</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
              <span className="text-xs font-semibold text-gray-500">Doanh thu giao thành công</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-600">{formatVND(totalRevenue)}</span>
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-gray-400">{completedOrders.length} đơn đã giao nhận hoàn tất</p>
            </div>
          </div>

          {/* Quick action banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-between shadow-md">
              <div className="space-y-1">
                <h3 className="font-bold text-base">Đăng sản phẩm mới</h3>
                <p className="text-xs text-emerald-100">
                  Thử nghiệm luồng P0: Đăng hàng ➔ Trạng thái PENDING ➔ Chuyển Admin duyệt.
                </p>
                <button
                  onClick={() => setActiveTab('new-product')}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow"
                >
                  <span>Thêm sản phẩm ngay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-between shadow-md">
              <div className="space-y-1">
                <h3 className="font-bold text-base">Xử lý đơn đặt COD mới</h3>
                <p className="text-xs text-orange-100">
                  Xem danh sách đơn khách vừa đặt và bấm xác nhận chuyển sang Shipper.
                </p>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-white text-orange-800 font-bold text-xs rounded-xl shadow"
                >
                  <span>Xem {myOrders.length} đơn hàng</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products List */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Danh Sách Sản Phẩm Thuộc Gian Hàng</h2>
              <p className="text-xs text-gray-500">Kiểm tra trạng thái duyệt và mức tồn kho thực tế</p>
            </div>
            <button
              onClick={() => setActiveTab('new-product')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Đăng thêm</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Sản phẩm</th>
                  <th className="p-3">Danh mục</th>
                  <th className="p-3">Giá bán</th>
                  <th className="p-3">Tồn kho</th>
                  <th className="p-3">Trạng thái duyệt</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myProducts.map((p) => {
                  const statusConfig = PRODUCT_STATUS_MAP[p.status];
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || FALLBACK_IMAGE}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-gray-900 line-clamp-1">{p.title}</p>
                            <span className="text-[10px] text-gray-400 font-mono">{p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 whitespace-nowrap">{p.category}</td>
                      <td className="p-3 whitespace-nowrap font-bold text-gray-900">{formatVND(p.price)}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={p.stock <= 5 ? 'text-rose-600 font-bold' : 'font-medium'}>
                          {p.stock} cái
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                          {statusConfig.label}
                        </span>
                        {p.status === 'REJECTED' && p.rejectReason && (
                          <p className="text-[10px] text-rose-600 mt-0.5">Lý do: {p.rejectReason}</p>
                        )}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap">
                        <Link
                          to={`/products/${p.id}`}
                          className="px-2.5 py-1 text-xs font-semibold text-orange-600 hover:underline"
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Create Product Form */}
      {activeTab === 'new-product' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900">Đăng Bán Sản Phẩm Mới (Luồng P0 Flow A)</h2>
            <p className="text-xs text-gray-500 mt-1">
              Sản phẩm sau khi bấm đăng sẽ mang trạng thái <strong>PENDING (Chờ duyệt)</strong>. Admin phải kiểm duyệt và phê duyệt thì sản phẩm mới xuất hiện trên trang Khách hàng.
            </p>
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Tên sản phẩm <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ví dụ: Tai nghe Demo 2026 Chống ồn Không dây"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 text-xs sm:text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-800 mb-1">Ngành hàng / Danh mục</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-semibold"
                >
                  {CATEGORIES.filter((c) => c !== 'Tất cả').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Số lượng tồn kho ban đầu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Giá bán (VND) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={1000}
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-black text-emerald-700"
                />
                <span className="text-[11px] text-gray-400 mt-0.5 block">{formatVND(newPrice)}</span>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Giá gốc niêm yết (Gạch ngang nếu có)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={newOriginalPrice}
                  onChange={(e) => setNewOriginalPrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500"
                />
                <span className="text-[11px] text-gray-400 mt-0.5 block">{formatVND(newOriginalPrice)}</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">
                Đường dẫn hình ảnh (URL Unsplash hoặc bất kỳ, có fallback)
              </label>
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1">Mô tả sản phẩm</label>
              <textarea
                rows={4}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Mô tả công năng, chất liệu, phụ kiện đi kèm, bảo hành..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 resize-none leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/30 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isCreating ? 'Đang tạo...' : 'Gửi Phê Duyệt Sản Phẩm'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-gray-900">Quản Lý Đơn Bán Của Shop (Fulfillment)</h2>
                <p className="text-xs text-gray-500">
                  Xác nhận đơn và chuẩn bị hàng để bàn giao cho đối tác vận chuyển
                </p>
              </div>
            </div>

            {myOrders.length > 0 ? (
              <div className="space-y-4">
                {myOrders.map((order) => {
                  const statusConfig = ORDER_STATUS_MAP[order.status];
                  return (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-2xl p-5 space-y-4 hover:border-emerald-300 transition-colors"
                    >
                      {/* Top order info */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div className="text-xs">
                          <span className="font-mono font-bold text-gray-900 text-sm">{order.id}</span>
                          <span className="text-gray-400 ml-2">({formatDateTime(order.createdAt)})</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusConfig.bg}`}>
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Customer info */}
                      <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl space-y-1">
                        <p><strong>Người nhận:</strong> {order.customerName} ({order.customerPhone})</p>
                        <p><strong>Địa chỉ:</strong> {order.customerAddress}</p>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-gray-800 font-medium">
                              {item.title} <strong className="text-orange-600">x{item.quantity}</strong>
                            </span>
                            <span className="font-bold text-gray-900">{formatVND(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                        <div className="text-xs">
                          <span className="text-gray-500">Thu tiền COD: </span>
                          <strong className="text-orange-600 text-sm font-black">
                            {formatVND(order.totalAmount)}
                          </strong>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/orders/${order.id}`}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold"
                          >
                            Xem Tracking
                          </Link>

                          {/* Step 1 button: Confirm order */}
                          {order.status === 'PENDING_CONFIRMATION' && (
                            <button
                              onClick={() => handleConfirmOrder(order.id)}
                              className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Xác nhận & Chuẩn bị hàng</span>
                            </button>
                          )}

                          {/* Step 2 button: Ready for pickup */}
                          {order.status === 'PREPARING' && (
                            <button
                              onClick={() => handleReadyForPickup(order.id)}
                              className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Đã đóng gói xong - Chờ Shipper</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-400">
                Gian hàng chưa có đơn hàng nào cần xử lý.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
