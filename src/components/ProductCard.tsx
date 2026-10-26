import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { Product } from '../types';
import { formatVND, FALLBACK_IMAGE } from '../lib/formatters';
import { useAppStore } from '../store/useAppStore';
import { useToast } from './Toast';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const [imgSrc, setImgSrc] = useState(product.images[0] || FALLBACK_IMAGE);
  const [isAdded, setIsAdded] = useState(false);
  const addToCart = useAppStore((state) => state.addToCart);
  const { showToast } = useToast();

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const result = addToCart(product.id, 1);
    if (result.success) {
      setIsAdded(true);
      showToast(`Đã thêm "${product.title.slice(0, 30)}..." vào giỏ!`, 'success');
      setTimeout(() => setIsAdded(false), 1500);
    } else {
      showToast(result.message, 'error');
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-xl border border-gray-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imgSrc}
          alt={product.title}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isOutOfStock ? 'grayscale opacity-60' : ''
          }`}
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          <span className="bg-orange-600 text-white font-bold text-[10px] uppercase px-1.5 py-0.5 rounded shadow-sm">
            Mall
          </span>
          {isOutOfStock && (
            <span className="bg-rose-600 text-white font-bold text-[10px] uppercase px-1.5 py-0.5 rounded shadow-sm">
              Hết hàng
            </span>
          )}
        </div>

        {discountPercent > 0 && (
          <div className="absolute top-0 right-0 bg-amber-400 text-orange-950 font-black text-xs px-2 py-1 rounded-bl-lg shadow-sm flex flex-col items-center leading-none">
            <span className="text-[11px] text-red-600">GIẢM</span>
            <span className="text-[13px]">{discountPercent}%</span>
          </div>
        )}
      </Link>

      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug">
            {product.title}
          </h3>
        </Link>

        <div className="mt-2.5">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-orange-600">
              {formatVND(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatVND(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Rating and Sold */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1.5">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
            </div>
            <span>Đã bán {product.soldCount > 1000 ? `${(product.soldCount / 1000).toFixed(1)}k` : product.soldCount}</span>
          </div>

          {/* Seller & stock notice */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[10px]">
            <span className="text-gray-500 truncate max-w-[110px]" title={product.sellerName}>
              {product.sellerName}
            </span>

            {product.stock > 0 && product.stock <= 5 ? (
              <span className="text-rose-600 font-semibold">Chỉ còn {product.stock}</span>
            ) : (
              <span className="text-emerald-600 font-medium">Kho: {product.stock}</span>
            )}
          </div>

          {/* Action button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            className={`w-full mt-3 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white border border-orange-200 hover:border-orange-600'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Đã thêm!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{isOutOfStock ? 'Tạm hết hàng' : 'Thêm vào giỏ'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
