import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm!</h2>
        <p className="text-xs text-gray-500 mb-6">Sản phẩm bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 bg-orange-600 text-white font-semibold text-xs rounded-xl shadow-md"
        >
          Trở về Trang chủ
        </Link>
      </div>
    );
  }

  // Check visibility for non-approved products
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link to="/" className="hover:text-orange-600">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/?cat=${encodeURIComponent(product.category)}`} className="hover:text-orange-600">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Moderation Warning Banner if not approved */}
      {isNotApproved && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-amber-900">
              Trạng thái sản phẩm: {PRODUCT_STATUS_MAP[product.status].label}
            </p>
            <p className="text-amber-700 mt-0.5">
              {product.status === 'PENDING'
                ? 'Sản phẩm này đang chờ Ban Quản Trị MiniMall phê duyệt và chưa hiển thị công khai cho khách hàng.'
                : `Sản phẩm bị từ chối duyệt. Lý do: ${product.rejectReason || 'Không có lý do cụ thể.'}`}
            </p>
            {currentUser.role === 'admin' && (
              <div className="mt-2">
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

      {/* Main Product Info Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <img
                src={currentDisplayImg}
                alt={product.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <div className="absolute top-4 right-4 bg-orange-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-md">
                  Giảm {discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnail selector if multiple */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImg(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      currentDisplayImg === img ? 'border-orange-600 scale-105' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-orange-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                  Mall Chính Hãng
                </span>
                <span className="text-xs text-gray-500">{product.category}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                {product.title}
              </h1>

              {/* Rating & Sold */}
              <div className="flex items-center gap-4 text-xs mt-3 text-gray-500">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>{product.soldCount} Đã bán</span>
                <span>•</span>
                <span className={product.stock > 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                  {product.stock > 0 ? `Còn ${product.stock} trong kho` : 'Hết hàng'}
                </span>
              </div>

              {/* Pricing Box */}
              <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 flex items-baseline gap-4">
                <span className="text-2xl sm:text-3xl font-black text-orange-600">
                  {formatVND(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-orange-700 bg-orange-200/60 px-2 py-0.5 rounded">
                    Tiết kiệm {discountPercent}%
                  </span>
                )}
              </div>

              {/* Delivery and policy highlights */}
              <div className="mt-6 space-y-3 border-t border-b border-gray-100 py-4 text-xs text-gray-600">
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-800">Vận chuyển:</strong> Phí cố định 25.000₫ toàn quốc. Miễn phí với mã FREESHIP.
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-800">Thanh toán:</strong> Thanh toán tiền mặt khi nhận hàng (COD). Kiểm tra hàng trước khi thanh toán.
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div>
                    <strong className="text-gray-800">Đổi trả:</strong> Trả hàng miễn phí 7 ngày nếu lỗi từ nhà sản xuất.
                  </div>
                </div>
              </div>

              {/* Quantity Picker */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs font-bold text-gray-700">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || product.stock <= 0}
                    className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-40 transition-colors"
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
                    className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {product.stock} sản phẩm có sẵn
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 transition-all ${
                  product.stock <= 0
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    : isSuccessAnim
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-orange-50 border-orange-600 text-orange-600 hover:bg-orange-100'
                }`}
              >
                {isSuccessAnim ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Đã thêm vào giỏ!</span>
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
                className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 text-white shadow-lg transition-all ${
                  product.stock <= 0
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/30'
                }`}
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Mua Ngay (COD)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seller info card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{product.sellerName}</h3>
            <p className="text-xs text-gray-500">Gian hàng đối tác uy tín • Phản hồi 100%</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/seller"
            className="px-4 py-2 rounded-xl border border-orange-600 text-orange-600 hover:bg-orange-50 text-xs font-semibold transition-colors"
          >
            Xem Kênh Người Bán
          </Link>
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
          Mô Tả Chi Tiết Sản Phẩm
        </h2>
        <div className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line space-y-3">
          <p>{product.description}</p>
          <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
            <p><strong>Mã sản phẩm:</strong> {product.id}</p>
            <p><strong>Ngày niêm yết:</strong> {new Date(product.createdAt).toLocaleDateString('vi-VN')}</p>
            <p><strong>Cam kết:</strong> Sản phẩm mới 100%, bảo hành tiêu chuẩn từ nhà cung cấp.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
