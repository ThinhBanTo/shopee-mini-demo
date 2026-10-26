import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatVND, FALLBACK_IMAGE } from '../lib/formatters';
import { useToast } from '../components/Toast';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const currentUser = useAppStore((state) => state.currentUser);
  const cart = useAppStore((state) => state.cart);
  const products = useAppStore((state) => state.products);
  const vouchers = useAppStore((state) => state.vouchers);
  const appliedVoucherCode = useAppStore((state) => state.appliedVoucherCode);
  const createOrder = useAppStore((state) => state.createOrder);

  // Form state initialized with demo user info
  const [recipientName, setRecipientName] = useState(currentUser.name || 'Nguyễn Văn An');
  const [recipientPhone, setRecipientPhone] = useState(currentUser.phone || '0912345678');
  const [recipientAddress, setRecipientAddress] = useState(
    currentUser.address || 'Số 45, Đường Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
  );
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enrich cart
  const enrichedCart = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product: product || {
        id: item.productId,
        title: 'Sản phẩm không rõ',
        price: 0,
        stock: 0,
        images: [FALLBACK_IMAGE],
        sellerName: 'Gian hàng đối tác',
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

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Không có sản phẩm để thanh toán</h2>
        <p className="text-xs text-gray-500 mb-6">Giỏ hàng của bạn đang trống, vui lòng chọn sản phẩm trước.</p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-md"
        >
          Trở về trang mua sắm
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientName.trim()) {
      showToast('Vui lòng nhập họ và tên người nhận hàng.', 'error');
      return;
    }
    if (!recipientPhone.trim() || recipientPhone.trim().length < 9) {
      showToast('Vui lòng nhập số điện thoại hợp lệ.', 'error');
      return;
    }
    if (!recipientAddress.trim() || recipientAddress.trim().length < 10) {
      showToast('Vui lòng nhập địa chỉ nhận hàng chi tiết (tối thiểu 10 ký tự).', 'error');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = createOrder({
        customerName: recipientName.trim(),
        customerPhone: recipientPhone.trim(),
        customerAddress: recipientAddress.trim(),
        paymentMethod: 'COD',
      });

      if (result.success && result.orderId) {
        showToast('Đặt hàng COD thành công! Mã đơn: ' + result.orderId, 'success');
        navigate(`/orders/${result.orderId}`);
      } else {
        showToast(result.message || 'Lỗi khi tạo đơn hàng.', 'error');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      showToast('Đã xảy ra lỗi: ' + err.message, 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/cart" className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Thanh Toán Đơn Hàng (COD)</h1>
          <p className="text-xs text-gray-500">Kiểm tra thông tin giao nhận và xác nhận đặt hàng</p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Shipping Address & Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <MapPin className="w-4 h-4 text-orange-600" />
              Địa chỉ nhận hàng (Demo)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Họ và tên người nhận <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số điện thoại liên hệ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Địa chỉ giao nhận chi tiết <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:bg-white focus:border-orange-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ghi chú cho Shipper (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến 15 phút..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Option */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Phương thức thanh toán
            </h2>

            <div className="p-4 rounded-xl border-2 border-orange-500 bg-orange-50/40 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Khuyên dùng
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bạn chỉ phải thanh toán số tiền <strong>{formatVND(totalAmount)}</strong> cho Shipper sau khi đã nhận và kiểm tra kiện hàng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Products in checkout & Confirmation */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
              Sản phẩm ({enrichedCart.length})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {enrichedCart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.images?.[0] || FALLBACK_IMAGE}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-lg object-cover bg-gray-50 flex-shrink-0 border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 line-clamp-1">{item.product.title}</p>
                    <div className="flex items-center justify-between text-gray-500 mt-1">
                      <span>SL: x{item.quantity}</span>
                      <span className="font-bold text-gray-900">{formatVND(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Tiền hàng:</span>
                <span className="font-semibold text-gray-800">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold text-gray-800">{formatVND(shippingFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Voucher giảm giá ({appliedVoucherCode}):</span>
                  <span>-{formatVND(discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Tổng thanh toán COD:</span>
                <span className="text-xl font-black text-orange-600">{formatVND(totalAmount)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all ${
                isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang khởi tạo đơn hàng...' : 'Đặt Hàng Ngay'}</span>
            </button>

            <p className="text-[10px] text-gray-400 text-center leading-tight">
              Nhấn "Đặt Hàng Ngay" đồng nghĩa với việc bạn đồng ý với các điều khoản demo của MiniMall.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
