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

  const getUserCart = useAppStore((state) => state.getUserCart);
  const products = useAppStore((state) => state.products);
  const updateCartQuantity = useAppStore((state) => state.updateCartQuantity);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const appliedVoucherCode = useAppStore((state) => state.appliedVoucherCode);
  const applyVoucher = useAppStore((state) => state.applyVoucher);
  const removeVoucher = useAppStore((state) => state.removeVoucher);
  const vouchers = useAppStore((state) => state.vouchers);

  const [inputVoucher, setInputVoucher] = useState('');

  const cart = getUserCart();

  // Enrich cart with real-time product data
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center font-['Roboto',Arial,sans-serif]">
        <div className="w-20 h-20 rounded-full bg-orange-50 text-[#ee4d2d] flex items-center justify-center mx-auto mb-3">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-base font-bold text-gray-800 mb-1">Giỏ hàng của bạn còn trống</h2>
        <p className="text-xs text-gray-500 mb-5">
          Khám phá ngay hàng ngàn sản phẩm chất lượng trên MiniShoppe!
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-medium text-xs rounded-[2px] transition-all"
        >
          <span>MUA NGAY</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 space-y-4 font-['Roboto',Arial,sans-serif]">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3 bg-white p-4 rounded-[2px] shadow-sm">
        <h1 className="text-base sm:text-lg font-bold text-[#222222] flex items-center gap-2">
          <span>Giỏ Hàng MiniShoppe</span>
          <span className="text-xs font-normal text-[#757575]">({cart.length} sản phẩm)</span>
        </h1>
        <Link to="/" className="text-xs text-[#ee4d2d] hover:underline font-medium">
          + Tiếp tục chọn thêm sản phẩm
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Cart Items (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-white rounded-[2px] border border-[#e8e8e8] p-4 shadow-sm space-y-3">
            {/* Header row desktop */}
            <div className="hidden sm:grid grid-cols-12 text-xs text-[#757575] border-b border-[#e8e8e8] pb-2 font-medium">
              <span className="col-span-6">Sản phẩm</span>
              <span className="col-span-2 text-center">Đơn giá</span>
              <span className="col-span-2 text-center">Số lượng</span>
              <span className="col-span-2 text-right">Số tiền</span>
            </div>

            {enrichedCart.map((item) => {
              const lineTotal = item.product.price * item.quantity;
              const isOverStock = item.quantity > item.product.stock;

              return (
                <div
                  key={item.productId}
                  className="sm:grid sm:grid-cols-12 items-center gap-2 py-3 border-b border-[#e8e8e8] last:border-b-0 space-y-3 sm:space-y-0"
                >
                  {/* Col 1-6: Product info */}
                  <div className="sm:col-span-6 flex items-center gap-3">
                    <img
                      src={item.product.images?.[0] || FALLBACK_IMAGE}
                      alt={item.product.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                      }}
                      className="w-16 h-16 rounded-[2px] object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#757575]">
                        <Store className="w-3 h-3 text-[#ee4d2d]" />
                        <span className="truncate">{item.product.sellerName}</span>
                      </div>
                      <Link
                        to={`/products/${item.productId}`}
                        className="text-xs font-normal text-[#222222] hover:text-[#ee4d2d] transition-colors line-clamp-2 leading-snug"
                      >
                        {item.product.title}
                      </Link>
                      {isOverStock && (
                        <p className="text-[10px] text-rose-600 font-bold">
                          Kho chỉ còn {item.product.stock} sản phẩm!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Col 7-8: Price */}
                  <div className="sm:col-span-2 text-left sm:text-center text-xs font-medium text-gray-700">
                    {formatVND(item.product.price)}
                  </div>

                  {/* Col 9-10: Quantity Picker */}
                  <div className="sm:col-span-2 flex items-center justify-start sm:justify-center">
                    <div className="flex items-center border border-[#e8e8e8] rounded-[2px] overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.product.stock}
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Col 11-12: Total line & Remove */}
                  <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3 text-right">
                    <span className="text-xs font-bold text-[#ee4d2d]">
                      {formatVND(lineTotal)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-400 hover:text-rose-600 p-1"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vouchers Selection */}
          <div className="bg-white rounded-[2px] border border-[#e8e8e8] p-4 shadow-sm space-y-2.5">
            <h3 className="text-xs font-bold text-[#222222] uppercase tracking-wide flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-[#ee4d2d]" />
              Mã Ưu Đãi MiniShoppe Khả Dụng
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vouchers.map((v) => {
                const isApplied = appliedVoucherCode === v.code;
                const isEligible = subtotal >= v.minOrderValue;
                return (
                  <div
                    key={v.code}
                    className={`p-2.5 rounded-[2px] border flex items-center justify-between gap-2 text-xs ${
                      isApplied ? 'border-[#ee4d2d] bg-orange-50/40' : 'border-[#e8e8e8] bg-white'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[#ee4d2d]">{v.code}</span>
                      <p className="text-[11px] text-gray-600 mt-0.5">{v.description}</p>
                    </div>

                    <button
                      type="button"
                      disabled={!isEligible && !isApplied}
                      onClick={() => (isApplied ? removeVoucher() : handleQuickSelectVoucher(v.code))}
                      className={`px-3 py-1 rounded-[2px] text-xs font-medium whitespace-nowrap ${
                        isApplied
                          ? 'bg-rose-100 text-rose-700'
                          : isEligible
                          ? 'bg-[#ee4d2d] text-white hover:bg-[#d73211]'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isApplied ? 'Bỏ chọn' : 'Áp dụng'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Checkout Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-[2px] border border-[#e8e8e8] p-4 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#222222] border-b border-[#e8e8e8] pb-2">
              Tóm Tắt Đơn Hàng
            </h3>

            {/* Custom Voucher Input Form */}
            <form onSubmit={handleApplyVoucher} className="space-y-1.5">
              <label className="text-xs text-[#757575]">Nhập mã ưu đãi:</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="DEMO10 hoặc FREESHIP"
                  value={inputVoucher}
                  onChange={(e) => setInputVoucher(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#e8e8e8] rounded-[2px] outline-none uppercase font-bold text-gray-800 focus:border-[#ee4d2d]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-[2px] hover:bg-black"
                >
                  Áp dụng
                </button>
              </div>
            </form>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-[#757575] border-t border-[#e8e8e8] pt-3">
              <div className="flex justify-between">
                <span>Tiền hàng:</span>
                <span className="font-medium text-[#222222]">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-medium text-[#222222]">{formatVND(shippingFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Giảm giá voucher ({appliedVoucherCode}):</span>
                  <span>-{formatVND(discount)}</span>
                </div>
              )}
              <div className="border-t border-[#e8e8e8] pt-2.5 flex justify-between items-baseline font-bold text-sm text-[#222222]">
                <span>Tổng thanh toán:</span>
                <span className="text-xl font-bold text-[#ee4d2d]">{formatVND(totalAmount)}</span>
              </div>
              <p className="text-[10px] text-gray-400 text-right">
                (Thanh toán khi nhận hàng COD)
              </p>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-2.5 px-4 rounded-[2px] bg-[#ee4d2d] hover:bg-[#d73211] text-white font-bold text-sm uppercase transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Mua Hàng (COD)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#757575] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Bảo vệ quyền lợi người mua hàng 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
