export type UserRole = 'customer' | 'seller' | 'admin' | 'shipper';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  shopName?: string;
  phone?: string;
  address?: string;
  passwordHash?: string;
  passwordSalt?: string;
  createdAt?: string;
}

export type ProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  images: string[];
  rating: number;
  soldCount: number;
  sellerId: string;
  sellerName: string;
  status: ProductStatus;
  rejectReason?: string;
  createdAt: string;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  isMall?: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  sellerId: string;
  userId: string; // Isolated per user account
}

export type OrderStatus =
  | 'PENDING_CONFIRMATION'
  | 'PREPARING'
  | 'AWAITING_PICKUP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderEvent {
  id: string;
  status: OrderStatus;
  title: string;
  timestamp: string;
  note: string;
  actorRole: UserRole;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string; // e.g. "ORD-20261026-8812"
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  voucherCode?: string;
  totalAmount: number;
  paymentMethod: 'COD';
  status: OrderStatus;
  timeline: OrderEvent[];
  createdAt: string;
  updatedAt: string;
  shipperId?: string;
  shipperName?: string;
}

export interface Voucher {
  code: string;
  description: string;
  discountPercent: number;
  maxDiscount: number;
  minOrderValue: number;
}
