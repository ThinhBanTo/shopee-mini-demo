import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShoppingBag,
  Store,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatVND, FALLBACK_IMAGE } from '../lib/formatters';
import { useToast } from '../components/Toast';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const cart = useAppStore((state) => state.cart);
  const products = useAppStore((state) => state.products);
  const updateCartQuantity = useAppStore((state) => state.updateCartQuantity);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const appliedVoucherCode = useAppStore((state) => state.appliedVoucherCode);
  const applyVoucher = useAppStore((state) => state.applyVoucher);
  const removeVoucher = useAppStore((state) => state.removeVoucher);
  const vouchers = useAppStore((state) => state.vouchers);

  const [inputVoucher, setInputVoucher] = useState('');

  // Cart item enrichment with real-time product data
  const enrichedCart = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product: product || {
        id: item.productId,
        title: 'Sản phẩm không xác định',
        price: 0,
        stock: 0,
        images: [FALLBACK_IMAGE],
        sellerName: 'Không rõ',
        status: 'APPROVED',
      },
    };
  });

  const subtotal = enrichedCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = cart.length > 0 ? 25000 : 0;

  // Calculate discount
  let discount = 0;
  if (appliedVoucherCode) {
    const voucher = vouchers.find((v) => v.code === appliedVoucherCode);
    if (voucher && subtotal >= voucher.minOrderValue) {
      if (voucher.code === 'FREESHIP') {
        discount = Math.min(shippingFee, voucher.maxDiscount);
      } else {
        discount = Math.min(Math.round((subtotal * voucher.discountPercent) / 100), voucher.maxDiscount);
      }
    }
  }

  const totalAmount = Math.max(0, subtotal + shippingFee - discount);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVoucher.trim()) return;
    const res = applyVoucher(inputVoucher.trim());
    if (res.success) {
      showToast(res.message, 'success');
      setInputVoucher('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleQuickSelectVoucher = (code: string) => {
    const res = applyVoucher(code);
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-gray-500 mb-6">
          Hãy khám phá hàng ngàn sản phẩm chất lượng và nhận ưu đãi giảm giá ngay hôm nay!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-lg shadow-orange-600/30 transition-all"
        >
          <span>Khám phá mua sắm ngay</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
          <span>Giỏ Hàng Của Bạn</span>
          <span className="text-sm font-semibold text-gray-500">({cart.length} món)</span>
        </h1>
        <Link to="/" className="text-xs font-semibold text-orange-600 hover:underline">
          + Thêm sản phẩm khác
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm space-y-4">
            {enrichedCart.map((item) => {
              const lineTotal = item.product.price * item.quantity;
              const isOverStock = item.quantity > item.product.stock;

              return (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <img
                      src={item.product.images?.[0] || FALLBACK_IMAGE}
                      alt={item.product.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                      className="w-20 h-20 rounded-xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                    />

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[10px] text-gray-500">
                        <Store className="w-3 h-3 text-orange-600" />
                        <span className="font-medium truncate">{item.product.sellerName}</span>
                      </div>

                      <Link
                        to={`/products/${item.productId}`}
                        className="text-xs sm:text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2"
                      >
                        {item.product.title}
                      </Link>

                      <div className="text-xs font-bold text-orange-600">
                        {formatVND(item.product.price)}
                      </div>

                      {isOverStock && (
                        <p className="text-[11px] text-rose-600 font-semibold">
                          Kho chỉ còn {item.product.stock} sản phẩm!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    {/* Quantity Picker */}
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.product.stock}
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="p-1.5 hover:bg-gray-100 text-gray-600 disabled:opacity-40 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right min-w-[90px]">
                      <div className="text-xs sm:text-sm font-black text-gray-900">
                        {formatVND(lineTotal)}
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Xóa khỏi giỏ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Available Vouchers Quick Tap */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-orange-600" />
              Mã giảm giá khả dụng cho bạn
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vouchers.map((v) => {
                const isApplied = appliedVoucherCode === v.code;
                const isEligible = subtotal >= v.minOrderValue;
                return (
                  <div
                    key={v.code}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      isApplied
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-orange-200 bg-orange-50/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-orange-600 font-black">{v.code}</strong>
                        {isApplied && (
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">
                            Đang dùng
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">{v.description}</p>
                    </div>

                    <button
                      type="button"
                      disabled={!isEligible && !isApplied}
                      onClick={() => (isApplied ? removeVoucher() : handleQuickSelectVoucher(v.code))}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs whitespace-nowrap transition-all ${
                        isApplied
                          ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          : isEligible
                          ? 'bg-orange-600 hover:bg-orange-700 text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isApplied ? 'Hủy' : 'Áp dụng'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Tóm tắt đơn hàng
            </h3>

            {/* Voucher input form */}
            <form onSubmit={handleApplyVoucher} className="space-y-2">
              <label className="text-xs font-semibold text-gray-700">Mã ưu đãi / Voucher</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập DEMO10 hoặc FREESHIP"
                  value={inputVoucher}
                  onChange={(e) => setInputVoucher(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 outline-none focus:bg-white focus:border-orange-500 uppercase font-semibold"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </form>

            {/* Price Breakdown */}
            <div className="space-y-2.5 text-xs text-gray-600 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span>Tạm tính tiền hàng:</span>
                <span className="font-semibold text-gray-800">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển toàn quốc:</span>
                <span className="font-semibold text-gray-800">{formatVND(shippingFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Giảm giá voucher ({appliedVoucherCode}):</span>
                  <span>-{formatVND(discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Tổng thanh toán:</span>
                <span className="text-xl font-black text-orange-600">{formatVND(totalAmount)}</span>
              </div>
              <p className="text-[10px] text-gray-400 text-right">
                (Đã bao gồm VAT và áp dụng hình thức COD)
              </p>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>Mua Hàng (COD)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Thanh toán COD an toàn khi nhận hàng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
