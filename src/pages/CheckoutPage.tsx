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
  const getUserCart = useAppStore((state) => state.getUserCart);
  const products = useAppStore((state) => state.products);
  const vouchers = useAppStore((state) => state.vouchers);
  const appliedVoucherCode = useAppStore((state) => state.appliedVoucherCode);
  const createOrder = useAppStore((state) => state.createOrder);

  const cart = getUserCart();

  // Form state
  const [recipientName, setRecipientName] = useState(currentUser?.name || 'Nguyễn Văn An');
  const [recipientPhone, setRecipientPhone] = useState(currentUser?.phone || '0912345678');
  const [recipientAddress, setRecipientAddress] = useState(
    currentUser?.address || 'Số 45, Đường Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh'
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
      <div className="max-w-2xl mx-auto px-4 py-16 text-center font-['Roboto',Arial,sans-serif]">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-base font-bold text-gray-800 mb-1">Không có sản phẩm để thanh toán</h2>
        <p className="text-xs text-gray-500 mb-5">Giỏ hàng của bạn đang trống, vui lòng chọn sản phẩm trước.</p>
        <Link
          to="/"
          className="px-5 py-2 rounded-[2px] bg-[#ee4d2d] text-white font-medium text-xs"
        >
          Trở về mua sắm
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
    if (!recipientAddress.trim() || recipientAddress.trim().length < 8) {
      showToast('Vui lòng nhập địa chỉ nhận hàng chi tiết.', 'error');
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
    <div className="max-w-6xl mx-auto px-4 py-5 space-y-4 font-['Roboto',Arial,sans-serif]">
      {/* Top Banner */}
      <div className="bg-white rounded-[2px] border border-[#e8e8e8] p-4 shadow-sm flex items-center gap-3">
        <Link to="/cart" className="p-1 hover:bg-gray-100 rounded text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-[#222222]">Thanh Toán Đơn Hàng</h1>
          <p className="text-xs text-[#757575]">Vui lòng kiểm tra kỹ thông tin người nhận và đơn hàng COD</p>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="space-y-4">
        {/* 1. Shopee Delivery Address Box with red-blue striped border style */}
        <div className="bg-white rounded-[2px] border border-[#e8e8e8] shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-500 via-blue-500 to-red-500" />
          <div className="p-5 space-y-4">
            <h2 className="text-sm font-bold text-[#ee4d2d] flex items-center gap-2 uppercase tracking-wide">
              <MapPin className="w-4 h-4" />
              Địa Chỉ Nhận Hàng
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Họ và tên người nhận <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#e8e8e8] rounded-[2px] outline-none focus:border-[#ee4d2d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#e8e8e8] rounded-[2px] outline-none focus:border-[#ee4d2d]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Địa chỉ chi tiết <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh thành phố..."
                  className="w-full px-3 py-2 text-xs border border-[#e8e8e8] rounded-[2px] outline-none focus:border-[#ee4d2d]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Lời nhắn cho Người bán / Shipper
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Lưu ý khi giao hàng (ví dụ: giao giờ hành chính, gọi trước khi đến...)"
                  className="w-full px-3 py-2 text-xs border border-[#e8e8e8] rounded-[2px] outline-none focus:border-[#ee4d2d]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Products List in Order */}
        <div className="bg-white rounded-[2px] border border-[#e8e8e8] p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-[#222222] border-b border-[#e8e8e8] pb-2.5">
            Sản Phẩm Đặt Mua ({enrichedCart.length})
          </h2>

          <div className="divide-y divide-[#e8e8e8]">
            {enrichedCart.map((item) => (
              <div key={item.productId} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={item.product.images?.[0] || FALLBACK_IMAGE}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-[2px] object-cover bg-gray-50 border flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-normal text-gray-900 line-clamp-1">{item.product.title}</p>
                    <span className="text-gray-400 text-[11px]">Gian hàng: {item.product.sellerName}</span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-6 flex-shrink-0">
                  <span className="text-gray-600">x{item.quantity}</span>
                  <span className="font-bold text-[#ee4d2d] min-w-[80px]">
                    {formatVND(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Payment Method: COD */}
        <div className="bg-white rounded-[2px] border border-[#e8e8e8] p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-[#222222] flex items-center gap-2 border-b border-[#e8e8e8] pb-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Phương Thức Thanh Toán
          </h2>

          <div className="p-3.5 rounded-[2px] border-2 border-[#ee4d2d] bg-orange-50/30 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#ee4d2d] flex-shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-gray-900">
                  Thanh toán khi nhận hàng (COD)
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-[2px]">
                  Bảo đảm
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Người mua thanh toán tiền mặt trực tiếp cho Shipper khi kiện hàng được giao đến đúng địa chỉ và kiểm tra an toàn.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Order Total Breakdown & CTA */}
        <div className="bg-white rounded-[2px] border border-[#e8e8e8] p-5 shadow-sm space-y-3">
          <div className="max-w-md ml-auto space-y-2 text-xs text-[#757575]">
            <div className="flex justify-between">
              <span>Tổng tiền hàng:</span>
              <span className="font-medium text-[#222222]">{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển:</span>
              <span className="font-medium text-[#222222]">{formatVND(shippingFee)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Voucher giảm giá ({appliedVoucherCode}):</span>
                <span>-{formatVND(discount)}</span>
              </div>
            )}
            <div className="border-t border-[#e8e8e8] pt-2.5 flex justify-between items-baseline font-bold text-sm text-[#222222]">
              <span>Tổng thanh toán COD:</span>
              <span className="text-2xl font-bold text-[#ee4d2d]">{formatVND(totalAmount)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#e8e8e8] pt-4 gap-4">
            <p className="text-[11px] text-gray-500">
              Nhấn "Đặt Hàng Ngay" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản MiniShoppe.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-8 py-3 rounded-[2px] font-bold text-sm text-white uppercase shadow-sm transition-all ${
                isSubmitting ? 'bg-orange-300 cursor-not-allowed' : 'bg-[#ee4d2d] hover:bg-[#d73211]'
              }`}
            >
              {isSubmitting ? 'Đang tạo đơn hàng...' : 'Đặt Hàng Ngay'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
