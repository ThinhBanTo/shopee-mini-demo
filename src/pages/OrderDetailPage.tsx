import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Package,
  MapPin,
  Clock,
  Truck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Store,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatVND, formatDateTime, ORDER_STATUS_MAP, FALLBACK_IMAGE } from '../lib/formatters';
import { useToast } from '../components/Toast';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const orders = useAppStore((state) => state.orders);
  const cancelOrder = useAppStore((state) => state.cancelOrder);
  const switchRole = useAppStore((state) => state.switchRole);

  const order = orders.find((o) => o.id === id);

  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng!</h2>
        <p className="text-xs text-gray-500 mb-6">Mã đơn hàng "{id}" không tồn tại trong hệ thống demo.</p>
        <Link
          to="/orders"
          className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md"
        >
          Trở về Đơn mua
        </Link>
      </div>
    );
  }

  const currentStatusConfig = ORDER_STATUS_MAP[order.status];

  // 5 Step progression for visual tracker
  const steps = [
    { key: 'PENDING_CONFIRMATION', label: 'Đặt hàng COD', icon: Clock },
    { key: 'PREPARING', label: 'Shop xác nhận & Đóng gói', icon: Store },
    { key: 'AWAITING_PICKUP', label: 'Chờ Shipper lấy hàng', icon: Package },
    { key: 'IN_TRANSIT', label: 'Đang vận chuyển', icon: Truck },
    { key: 'DELIVERED', label: 'Giao hàng thành công', icon: CheckCircle2 },
  ];

  const currentStepIndex = currentStatusConfig.stepIndex;

  const handleCancelOrder = () => {
    if (!cancelReason.trim()) {
      showToast('Vui lòng nhập lý do hủy đơn.', 'error');
      return;
    }
    const res = cancelOrder(order.id, cancelReason.trim());
    if (res.success) {
      showToast(res.message, 'success');
      setShowCancelModal(false);
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleSwitchToSeller = () => {
    switchRole('seller');
    navigate('/seller/orders');
    showToast('Đã chuyển sang vai trò Người bán để xử lý đơn này!', 'info');
  };

  const handleSwitchToShipper = () => {
    switchRole('shipper');
    navigate('/shipper');
    showToast('Đã chuyển sang vai trò Shipper để vận chuyển đơn này!', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/orders" className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">Chi Tiết Đơn Hàng</h1>
              <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {order.id}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Thời gian khởi tạo: {formatDateTime(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${currentStatusConfig.bg}`}>
            {currentStatusConfig.label}
          </span>
        </div>
      </div>

      {/* Demo Workflow Quick Switch Assist Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <strong className="text-orange-900 font-bold block">
            💡 Trợ giảng trình bày Demo luồng chuyển trạng thái:
          </strong>
          <span className="text-orange-800">
            {order.status === 'PENDING_CONFIRMATION' && 'Đơn đang chờ Shop xác nhận.'}
            {order.status === 'PREPARING' && 'Shop đang đóng gói, có thể chuyển sang "Chờ Shipper lấy".'}
            {order.status === 'AWAITING_PICKUP' && 'Hàng đã đóng gói xong, đang chờ Shipper tiếp nhận.'}
            {order.status === 'IN_TRANSIT' && 'Shipper đang trên đường giao hàng đến khách.'}
            {order.status === 'DELIVERED' && 'Đơn hàng đã hoàn tất trọn vẹn và thu tiền COD.'}
            {order.status === 'CANCELLED' && 'Đơn hàng đã bị hủy và tồn kho đã hoàn lại.'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {(order.status === 'PENDING_CONFIRMATION' || order.status === 'PREPARING') && (
            <button
              onClick={handleSwitchToSeller}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Chuyển sang Shop xử lý</span>
            </button>
          )}

          {(order.status === 'AWAITING_PICKUP' || order.status === 'IN_TRANSIT') && (
            <button
              onClick={handleSwitchToShipper}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Chuyển sang Shipper giao</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Tracking Stepper */}
      {order.status !== 'CANCELLED' ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">
            Tiến trình vận chuyển đơn hàng (Tracking)
          </h2>

          <div className="relative">
            {/* Step line desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{
                  width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
              {steps.map((st, idx) => {
                const Icon = st.icon;
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div
                    key={st.key}
                    className="flex md:flex-col items-center md:text-center gap-3 md:gap-2"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-orange-600 text-white ring-4 ring-orange-200 shadow-md shadow-orange-600/30'
                          : isPassed
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-400 border border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-bold leading-tight ${
                          isCurrent
                            ? 'text-orange-600'
                            : isPassed
                            ? 'text-gray-900'
                            : 'text-gray-400'
                        }`}
                      >
                        {st.label}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] text-orange-500 font-semibold uppercase tracking-wider">
                          Hiện tại
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div>
            <strong>Đơn hàng này đã bị hủy.</strong>
            <p className="mt-0.5 text-rose-700">Tồn kho các mặt hàng đã được hệ thống hoàn lại nguyên vẹn.</p>
          </div>
        </div>
      )}

      {/* Main Grid: Details & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Delivery address and items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping destination */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <MapPin className="w-4 h-4 text-orange-600" />
              Địa chỉ nhận hàng (COD)
            </h3>
            <div className="text-xs space-y-1.5 text-gray-700">
              <p className="font-bold text-gray-900">{order.customerName} - {order.customerPhone}</p>
              <p className="text-gray-600 leading-relaxed">{order.customerAddress}</p>
              <div className="pt-2 flex items-center gap-2 text-emerald-700 font-medium text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Phương thức: Thanh toán khi nhận hàng (COD)</span>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                <Store className="w-4 h-4 text-orange-600" />
                <span>Gian hàng: {order.sellerName}</span>
              </div>
            </div>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.title}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-50 border flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 line-clamp-1">{item.title}</p>
                      <span className="text-gray-500">Số lượng: x{item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold text-gray-900">{formatVND(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Tổng tiền hàng:</span>
                <span>{formatVND(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>{formatVND(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Giảm giá ({order.voucherCode || 'Ưu đãi'}):</span>
                  <span>-{formatVND(order.discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline font-bold text-sm text-gray-900">
                <span>Tổng số tiền COD phải thu:</span>
                <span className="text-xl font-black text-orange-600">{formatVND(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Cancel Order Action if Pending */}
          {order.status === 'PENDING_CONFIRMATION' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
              >
                Hủy đơn hàng này
              </button>
            </div>
          )}
        </div>

        {/* Right Col: Timeline audit trail */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Clock className="w-4 h-4 text-orange-600" />
              Lịch sử kiện hàng (Audit Trail)
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {order.timeline.map((evt, idx) => (
                <div key={evt.id || idx} className="relative group text-xs">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-orange-600 ring-4 ring-orange-100 flex items-center justify-center" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900">{evt.title}</span>
                      <span className="text-[9px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                        {evt.actorRole}
                      </span>
                    </div>
                    <p className="text-gray-600 text-[11px] leading-relaxed">{evt.note}</p>
                    <span className="text-[10px] text-gray-400 block">{formatDateTime(evt.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Xác nhận hủy đơn hàng</h3>
            <p className="text-xs text-gray-500">
              Vui lòng cho biết lý do bạn muốn hủy đơn hàng "{order.id}":
            </p>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ví dụ: Đổi địa chỉ nhận, đặt nhầm số lượng..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:bg-white focus:border-rose-500 resize-none"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30"
              >
                Xác nhận hủy đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
