import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  ShoppingCart,
  Zap,
  Store,
  ChevronRight,
  AlertCircle,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatVND, FALLBACK_IMAGE, PRODUCT_STATUS_MAP } from '../lib/formatters';
import { useToast } from '../components/Toast';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const products = useAppStore((state) => state.products);
  const currentUser = useAppStore((state) => state.currentUser);
  const addToCart = useAppStore((state) => state.addToCart);

  const product = products.find((p) => p.id === id);

  const [selectedImg, setSelectedImg] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSuccessAnim, setIsSuccessAnim] = useState<boolean>(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center font-['Roboto',Arial,sans-serif]">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-base font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm!</h2>
        <p className="text-xs text-gray-500 mb-5">Sản phẩm bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
        <Link
          to="/"
          className="inline-block px-5 py-2 bg-[#ee4d2d] text-white font-medium text-xs rounded-[2px]"
        >
          Trở về Trang chủ
        </Link>
      </div>
    );
  }

  const isNotApproved = product.status !== 'APPROVED';

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const currentDisplayImg = selectedImg || product.images[0] || FALLBACK_IMAGE;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > product.stock) {
        showToast(`Chỉ còn ${product.stock} sản phẩm trong kho!`, 'info');
        return product.stock;
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      showToast('Sản phẩm này tạm thời hết hàng!', 'error');
      return;
    }
    const res = addToCart(product.id, quantity);
    if (res.success) {
      setIsSuccessAnim(true);
      showToast(res.message, 'success');
      setTimeout(() => setIsSuccessAnim(false), 2000);
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) {
      showToast('Sản phẩm này tạm thời hết hàng!', 'error');
      return;
    }
    const res = addToCart(product.id, quantity);
    if (res.success) {
      navigate('/checkout');
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-4 font-['Roboto',Arial,sans-serif]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] text-[#757575]">
        <Link to="/" className="text-[#0055aa] hover:underline">Shopee</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to={`/?cat=${encodeURIComponent(product.category)}`} className="text-[#0055aa] hover:underline">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[#222222] truncate max-w-sm">{product.title}</span>
      </nav>

      {/* Moderation Warning Banner if not approved */}
      {isNotApproved && (
        <div className="p-3.5 rounded-[2px] bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-amber-900">
              Trạng thái sản phẩm: {PRODUCT_STATUS_MAP[product.status].label}
            </p>
            <p className="text-amber-800 mt-0.5">
              {product.status === 'PENDING'
                ? 'Sản phẩm này đang chờ Ban Quản Trị MiniShoppe phê duyệt và chưa hiển thị công khai cho khách hàng.'
                : `Sản phẩm bị từ chối duyệt. Lý do: ${product.rejectReason || 'Chưa đạt tiêu chuẩn niêm yết.'}`}
            </p>
            {currentUser?.role === 'admin' && (
              <div className="mt-1.5">
                <Link
                  to="/admin"
                  className="font-bold underline text-purple-700 hover:text-purple-900"
                >
                  ➔ Đến trang Kiểm duyệt để duyệt sản phẩm này ngay
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Product Details Card */}
      <div className="bg-white rounded-[2px] border border-[#e8e8e8] p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Gallery (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-square rounded-[2px] overflow-hidden bg-gray-50 border border-[#e8e8e8]">
              <img
                src={currentDisplayImg}
                alt={product.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <div className="absolute top-0 right-0 bg-[#ffd839] text-[#ee4d2d] font-bold text-xs px-2 py-1 shadow-sm">
                  -{discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImg(img)}
                    className={`w-16 h-16 rounded-[2px] overflow-hidden border-2 transition-all flex-shrink-0 ${
                      currentDisplayImg === img ? 'border-[#ee4d2d]' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Pricing (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isMall ? (
                  <span className="bg-[#d0011b] text-white font-bold text-[10px] uppercase px-1.5 py-0.5 rounded-[2px]">
                    Shopee Mall
                  </span>
                ) : (
                  <span className="bg-[#ee4d2d] text-white font-medium text-[10px] px-1.5 py-0.5 rounded-[2px]">
                    Yêu thích
                  </span>
                )}
                <span className="text-xs text-[#757575]">{product.category}</span>
              </div>

              <h1 className="text-lg sm:text-xl font-normal text-[#222222] leading-snug">
                {product.title}
              </h1>

              {/* Rating & Sold Row */}
              <div className="flex items-center gap-4 text-xs mt-2.5 pb-3 border-b border-gray-100 text-[#757575]">
                <div className="flex items-center gap-1 text-[#ee4d2d]">
                  <span className="font-bold underline text-sm">{product.rating.toFixed(1)}</span>
                  <div className="flex text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                </div>
                <span>|</span>
                <div>
                  <span className="font-bold text-[#222222]">{product.soldCount}</span> Đã bán
                </div>
                <span>|</span>
                <span className={product.stock > 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                  {product.stock > 0 ? `Còn ${product.stock} trong kho` : 'Tạm hết hàng'}
                </span>
              </div>

              {/* Price Box */}
              <div className="mt-4 p-4 rounded-[2px] bg-[#fafafa] flex items-baseline gap-3">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-[#757575] line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-bold text-[#ee4d2d]">
                  {formatVND(product.price)}
                </span>
                {discountPercent > 0 && (
                  <span className="text-[11px] font-bold text-white bg-[#ee4d2d] px-1.5 py-0.5 rounded-[2px] uppercase">
                    GIẢM {discountPercent}%
                  </span>
                )}
              </div>

              {/* Shipping & Policies */}
              <div className="mt-5 space-y-3 text-xs text-[#757575] border-b border-gray-100 pb-5">
                <div className="flex items-start gap-4">
                  <span className="w-24 flex-shrink-0 text-[#757575]">Vận Chuyển:</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-800 font-medium">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Miễn phí vận chuyển cho đơn từ 150.000₫ (Mã FREESHIP)</span>
                    </div>
                    <p className="text-[11px] text-[#757575]">Phí giao hàng COD cố định: 25.000₫ toàn quốc</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-24 flex-shrink-0 text-[#757575]">Bảo Hiểm:</span>
                  <div className="flex items-center gap-1.5 text-gray-800">
                    <ShieldCheck className="w-4 h-4 text-[#ee4d2d]" />
                    <span>Shopee Đảm Bảo - Trả hàng miễn phí 7 ngày</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-24 flex-shrink-0 text-[#757575]">Thanh Toán:</span>
                  <span className="text-gray-800 font-medium">
                    Thanh toán khi nhận hàng (COD) — Kiểm tra hàng trước khi nhận
                  </span>
                </div>
              </div>

              {/* Quantity Picker */}
              <div className="mt-5 flex items-center gap-4">
                <span className="w-24 flex-shrink-0 text-xs text-[#757575]">Số lượng:</span>
                <div className="flex items-center border border-[#e8e8e8] rounded-[2px] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || product.stock <= 0}
                    className="p-1.5 hover:bg-gray-100 text-gray-600 disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (isNaN(val) || val < 1) setQuantity(1);
                      else if (val > product.stock) setQuantity(product.stock);
                      else setQuantity(val);
                    }}
                    className="w-12 text-center text-xs font-bold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock || product.stock <= 0}
                    className="p-1.5 hover:bg-gray-100 text-gray-600 disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-[#757575]">
                  {product.stock} sản phẩm có sẵn
                </span>
              </div>
            </div>

            {/* Shopee Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                type="button"
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
                className={`py-3 px-6 rounded-[2px] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
                  product.stock <= 0
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : isSuccessAnim
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-[#ff57221a] border-[#ee4d2d] text-[#ee4d2d] hover:bg-[#ff57222a]'
                }`}
              >
                {isSuccessAnim ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã thêm vào giỏ hàng!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Thêm Vào Giỏ Hàng</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={product.stock <= 0}
                onClick={handleBuyNow}
                className={`py-3 px-8 rounded-[2px] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 text-white shadow-sm transition-all ${
                  product.stock <= 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#ee4d2d] hover:bg-[#d73211]'
                }`}
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Mua Ngay (COD)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Shop Card */}
      <div className="bg-white rounded-[2px] border border-[#e8e8e8] p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-[#ee4d2d] flex items-center justify-center font-bold">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">{product.sellerName}</h3>
              <span className="text-[10px] bg-[#ee4d2d] text-white px-1 py-0.2 rounded-[2px]">
                Yêu thích
              </span>
            </div>
            <p className="text-xs text-[#757575] mt-0.5">Online 5 phút trước • Tỉ lệ phản hồi: 99%</p>
          </div>
        </div>

        <Link
          to="/seller"
          className="px-4 py-1.5 rounded-[2px] border border-[#ee4d2d] text-[#ee4d2d] hover:bg-orange-50 text-xs font-medium self-start sm:self-auto"
        >
          Xem Kênh Người Bán
        </Link>
      </div>

      {/* Product Description */}
      <div className="bg-white rounded-[2px] border border-[#e8e8e8] p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-[#222222] bg-[#fafafa] p-3 border-l-4 border-[#ee4d2d]">
          CHI TIẾT SẢN PHẨM
        </h2>
        <div className="text-xs space-y-2 text-[#757575] px-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p><strong>Danh mục:</strong> {product.category}</p>
            <p><strong>Mã sản phẩm:</strong> {product.id}</p>
            <p><strong>Kho hàng:</strong> {product.stock}</p>
            <p><strong>Gửi từ:</strong> TP. Hồ Chí Minh</p>
          </div>
        </div>

        <h2 className="text-sm font-bold uppercase tracking-wide text-[#222222] bg-[#fafafa] p-3 border-l-4 border-[#ee4d2d] mt-4">
          MÔ TẢ SẢN PHẨM
        </h2>
        <div className="text-xs sm:text-[13px] text-[#222222] leading-relaxed whitespace-pre-line px-3 space-y-3">
          <p>{product.description}</p>
          <div className="pt-4 border-t border-gray-100 text-xs text-[#757575] space-y-1">
            <p>• Cam kết sản phẩm chính hãng 100%, bảo hành tiêu chuẩn từ nhà cung cấp.</p>
            <p>• Hỗ trợ đổi trả miễn phí trong 7 ngày nếu có lỗi từ nhà sản xuất.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
