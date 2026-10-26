import { OrderStatus, ProductStatus } from '../types';

export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

export const PRODUCT_STATUS_MAP: Record<ProductStatus, { label: string; bg: string; text: string; border: string }> = {
  APPROVED: {
    label: 'Đã duyệt',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  PENDING: {
    label: 'Chờ duyệt',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  REJECTED: {
    label: 'Từ chối',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
  },
};

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; stepIndex: number; bg: string; text: string; description: string }> = {
  PENDING_CONFIRMATION: {
    label: 'Chờ xác nhận',
    stepIndex: 0,
    bg: 'bg-amber-100 text-amber-800',
    text: 'text-amber-600',
    description: 'Người bán đang kiểm tra và xác nhận đơn hàng',
  },
  PREPARING: {
    label: 'Đang chuẩn bị hàng',
    stepIndex: 1,
    bg: 'bg-blue-100 text-blue-800',
    text: 'text-blue-600',
    description: 'Người bán đang đóng gói sản phẩm',
  },
  AWAITING_PICKUP: {
    label: 'Chờ Shipper lấy hàng',
    stepIndex: 2,
    bg: 'bg-purple-100 text-purple-800',
    text: 'text-purple-600',
    description: 'Đã đóng gói, sẵn sàng bàn giao cho đơn vị vận chuyển',
  },
  IN_TRANSIT: {
    label: 'Đang giao hàng',
    stepIndex: 3,
    bg: 'bg-indigo-100 text-indigo-800',
    text: 'text-indigo-600',
    description: 'Shipper đang trên đường giao hàng đến bạn',
  },
  DELIVERED: {
    label: 'Giao hàng thành công',
    stepIndex: 4,
    bg: 'bg-emerald-100 text-emerald-800',
    text: 'text-emerald-600',
    description: 'Đơn hàng đã được giao và thanh toán COD thành công',
  },
  CANCELLED: {
    label: 'Đã hủy',
    stepIndex: -1,
    bg: 'bg-rose-100 text-rose-800',
    text: 'text-rose-600',
    description: 'Đơn hàng đã bị hủy',
  },
};

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80';
