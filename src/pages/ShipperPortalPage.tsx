import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Package,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  Store,
  Navigation,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatVND } from '../lib/formatters';
import { useToast } from '../components/Toast';

export const ShipperPortalPage: React.FC = () => {
  const { showToast } = useToast();
  const currentUser = useAppStore((state) => state.currentUser);
  const switchRole = useAppStore((state) => state.switchRole);
  const orders = useAppStore((state) => state.orders);
  const shipperAcceptDelivery = useAppStore((state) => state.shipperAcceptDelivery);
  const shipperCompleteDelivery = useAppStore((state) => state.shipperCompleteDelivery);

  const [activeTab, setActiveTab] = useState<'PICKUP' | 'IN_TRANSIT' | 'DELIVERED'>('PICKUP');

  const isShipperRole = currentUser?.role === 'shipper';
  const shipperId = currentUser?.id || 'u-shipper-001';
  const shipperName = currentUser?.name || 'Nguyễn Văn Giao';

  const pickupOrders = orders.filter((o) => o.status === 'AWAITING_PICKUP');
  const inTransitOrders = orders.filter((o) => o.status === 'IN_TRANSIT');
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED');

  const totalCodCollected = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleAcceptPickup = (orderId: string) => {
    const res = shipperAcceptDelivery(orderId, shipperId, shipperName);
    if (res.success) {
      showToast(res.message, 'success');
      setActiveTab('IN_TRANSIT');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleCompleteDelivery = (orderId: string) => {
    const res = shipperCompleteDelivery(orderId);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Banner if not Shipper */}
      {!isShipperRole && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-900">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span>
              Bạn đang xem Cổng Vận Chuyển với vai trò <strong>{currentUser?.role || 'khách'}</strong>. Hãy chuyển sang vai trò Shipper để thực hiện nhận đơn và giao hàng.
            </span>
          </div>
          <button
            onClick={() => switchRole('shipper')}
            className="px-3.5 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold whitespace-nowrap shadow-sm"
          >
            Chuyển sang Shipper ngay
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Cổng Điều Phối Vận Chuyển & Giao Hàng COD
            </h1>
            <p className="text-xs text-gray-500">
              Tài xế đối tác: <strong>{currentUser?.name || 'Tài xế Shopee/MiniShoppe'}</strong> • Khu vực: TP. Hồ Chí Minh
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-gray-500">Đơn chờ lấy tại shop</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-purple-600">{pickupOrders.length}</span>
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-[11px] text-gray-400">Shop đã đóng gói xong</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-gray-500">Đang trên đường giao</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-blue-600">{inTransitOrders.length}</span>
            <Navigation className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-[11px] text-gray-400">Đang giao đến người nhận</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-gray-500">Tiền COD đã thu</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600">{formatVND(totalCodCollected)}</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-[11px] text-gray-400">{deliveredOrders.length} đơn hoàn tất</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('PICKUP')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'PICKUP'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Sẵn sàng lấy hàng ({pickupOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('IN_TRANSIT')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'IN_TRANSIT'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Đang đi giao ({inTransitOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('DELIVERED')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'DELIVERED'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Đã giao thành công ({deliveredOrders.length})</span>
        </button>
      </div>

      {/* Orders List for Selected Tab */}
      <div className="space-y-4">
        {activeTab === 'PICKUP' && (
          <div className="space-y-4">
            {pickupOrders.length > 0 ? (
              pickupOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Store className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-gray-900">Lấy tại: {order.sellerName}</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-mono text-gray-500">{order.id}</span>
                    </div>
                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Chờ lấy hàng
                    </span>
                  </div>

                  {/* Delivery destination */}
                  <div className="text-xs text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl">
                    <div>
                      <span className="font-bold text-gray-800 block">Địa chỉ giao:</span>
                      <p className="mt-0.5 leading-relaxed">{order.customerAddress}</p>
                    </div>
                    <div>
                      <span className="font-bold text-gray-800 block">Người nhận & SĐT:</span>
                      <p className="mt-0.5 font-medium">{order.customerName} - {order.customerPhone}</p>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-gray-600 space-y-1">
                    <p className="font-bold text-gray-700">Kiện hàng gồm ({order.items.length} món):</p>
                    {order.items.map((i, idx) => (
                      <p key={idx} className="truncate">
                        • {i.title} (x{i.quantity})
                      </p>
                    ))}
                  </div>

                  {/* Footer & Action */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs">
                    <div>
                      <span className="text-gray-500">Cần thu tiền COD: </span>
                      <strong className="text-orange-600 text-sm font-black">
                        {formatVND(order.totalAmount)}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/orders/${order.id}`}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold"
                      >
                        Chi tiết
                      </Link>
                      <button
                        onClick={() => handleAcceptPickup(order.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-600/20 transition-all"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Nhận Đơn & Bắt Đầu Giao</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-xs text-gray-400">
                Hiện không có đơn hàng nào đang chờ shipper đến lấy.
              </div>
            )}
          </div>
        )}

        {activeTab === 'IN_TRANSIT' && (
          <div className="space-y-4">
            {inTransitOrders.length > 0 ? (
              inTransitOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-gray-900">Đơn đang vận chuyển</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-mono text-gray-500">{order.id}</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                      Đang giao hàng
                    </span>
                  </div>

                  {/* Customer information */}
                  <div className="text-xs text-gray-700 bg-blue-50/50 border border-blue-100 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-blue-950">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{order.customerAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>{order.customerName} - <strong>{order.customerPhone}</strong></span>
                    </div>
                  </div>

                  {/* Footer & Action */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs">
                    <div>
                      <span className="text-gray-500">Số tiền thu khách (COD): </span>
                      <strong className="text-orange-600 text-base font-black">
                        {formatVND(order.totalAmount)}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/orders/${order.id}`}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold"
                      >
                        Tracking
                      </Link>
                      <button
                        onClick={() => handleCompleteDelivery(order.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Xác Nhận Đã Giao & Thu Tiền COD</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-xs text-gray-400">
                Không có đơn hàng nào đang trên đường giao.
              </div>
            )}
          </div>
        )}

        {activeTab === 'DELIVERED' && (
          <div className="space-y-4">
            {deliveredOrders.length > 0 ? (
              deliveredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
                    <span className="font-mono font-bold text-gray-900">{order.id}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      ✓ Đã giao thành công
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-gray-600">
                    <div>
                      <p>Khách nhận: <strong>{order.customerName}</strong> ({order.customerPhone})</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">{order.customerAddress}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400">Đã thu COD:</span>
                      <p className="font-black text-emerald-600 text-sm">{formatVND(order.totalAmount)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-xs text-gray-400">
                Chưa có đơn hàng nào hoàn tất giao nhận.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
