import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Store,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatVND, formatDateTime, ORDER_STATUS_MAP, FALLBACK_IMAGE } from '../lib/formatters';

export const OrdersPage: React.FC = () => {
  const currentUser = useAppStore((state) => state.currentUser);
  const orders = useAppStore((state) => state.orders);

  const [activeTab, setActiveTab] = useState<string>('ALL');

  // Customer orders (in demo, filter by current customer or show all orders placed by customer role)
  const myOrders = orders.filter((o) => o.customerId === currentUser.id || currentUser.role !== 'customer');

  const filteredOrders = myOrders.filter((order) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return order.status === 'PENDING_CONFIRMATION';
    if (activeTab === 'PROCESSING') return order.status === 'PREPARING' || order.status === 'AWAITING_PICKUP';
    if (activeTab === 'SHIPPING') return order.status === 'IN_TRANSIT';
    if (activeTab === 'COMPLETED') return order.status === 'DELIVERED';
    if (activeTab === 'CANCELLED') return order.status === 'CANCELLED';
    return true;
  });

  const tabs = [
    { id: 'ALL', label: 'Tất cả đơn' },
    { id: 'PENDING', label: 'Chờ xác nhận' },
    { id: 'PROCESSING', label: 'Đang xử lý' },
    { id: 'SHIPPING', label: 'Đang giao' },
    { id: 'COMPLETED', label: 'Đã giao' },
    { id: 'CANCELLED', label: 'Đã hủy' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-600" />
            <span>Đơn Mua Của Bạn</span>
          </h1>
          <p className="text-xs text-gray-500">Quản lý và theo dõi tiến trình giao nhận hàng COD</p>
        </div>
        <Link
          to="/"
          className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
        >
          <span>Tiếp tục mua hàng</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Order List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = ORDER_STATUS_MAP[order.status];
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Store className="w-4 h-4 text-orange-600" />
                    <span className="font-bold text-gray-900">{order.sellerName}</span>
                    <span className="text-gray-300">•</span>
                    <span className="font-mono text-gray-500">{order.id}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusConfig.bg}`}>
                    {statusConfig.label}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={item.image || FALLBACK_IMAGE}
                        alt={item.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                        className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-bold text-gray-900 line-clamp-1">{item.title}</p>
                        <div className="flex items-center justify-between text-gray-500 mt-1">
                          <span>Số lượng: x{item.quantity}</span>
                          <span className="font-bold text-gray-800">{formatVND(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer and CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100 pt-3 text-xs">
                  <div className="text-gray-500 text-[11px]">
                    Đặt ngày: <span className="font-medium text-gray-700">{formatDateTime(order.createdAt)}</span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div>
                      <span className="text-gray-500 mr-2">Tổng tiền (COD):</span>
                      <span className="text-base font-black text-orange-600">
                        {formatVND(order.totalAmount)}
                      </span>
                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs transition-colors border border-orange-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem chi tiết & Tracking</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Chưa có đơn hàng nào</h3>
          <p className="text-xs text-gray-500 mb-5">
            Không tìm thấy đơn hàng nào ở mục "{tabs.find((t) => t.id === activeTab)?.label}".
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs inline-block shadow-md shadow-orange-600/20"
          >
            Mua sắm ngay
          </Link>
        </div>
      )}
    </div>
  );
};
