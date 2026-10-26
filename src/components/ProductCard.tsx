import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { formatVND, FALLBACK_IMAGE } from '../lib/formatters';
import { useAppStore } from '../store/useAppStore';
import { useToast } from './Toast';

interface Props {
  product: Product;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const [imgSrc, setImgSrc] = useState(product.images[0] || FALLBACK_IMAGE);
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
      showToast(`Đã thêm vào giỏ: "${product.title.slice(0, 24)}..."`, 'success');
    } else {
      showToast(result.message, 'error');
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white rounded-[2px] border border-[#e8e8e8] hover:border-[#ee4d2d] hover:shadow-shopee-hover transition-all duration-200 flex flex-col justify-between overflow-hidden relative font-['Roboto',Arial,sans-serif]">
      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={imgSrc}
          alt={product.title}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isOutOfStock ? 'grayscale opacity-60' : ''
          }`}
          loading="lazy"
        />

        {/* Shopee-style badges */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1 items-start z-10">
          {product.isMall ? (
            <span className="bg-[#d0011b] text-white font-bold text-[9px] uppercase px-1 py-0.5 rounded-[2px] leading-none shadow-sm">
              Mall
            </span>
          ) : (
            <span className="bg-[#ee4d2d] text-white font-medium text-[9px] px-1 py-0.5 rounded-[2px] leading-none shadow-sm">
              Yêu thích
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-800 text-white font-bold text-[9px] uppercase px-1 py-0.5 rounded-[2px] leading-none">
              Hết hàng
            </span>
          )}
        </div>

        {discountPercent > 0 && (
          <div className="absolute top-0 right-0 bg-[#ffd839]/90 text-[#ee4d2d] font-bold text-[10px] px-1.5 py-0.5 flex flex-col items-center leading-tight">
            <span>-{discountPercent}%</span>
            <span className="text-[8px] text-white bg-[#ee4d2d] px-0.5 rounded-[1px] uppercase">Giảm</span>
          </div>
        )}
      </Link>

      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-[12px] sm:text-[13px] font-normal text-[#222222] line-clamp-2 leading-snug group-hover:text-[#ee4d2d] transition-colors">
            {product.title}
          </h3>
        </Link>

        <div className="mt-2 space-y-1.5">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[14px] sm:text-[16px] font-bold text-[#ee4d2d]">
              {formatVND(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-[11px] text-[#757575] line-through truncate">
                {formatVND(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Rating, Sold & Location */}
          <div className="flex items-center justify-between text-[11px] text-[#757575]">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-[#222222] text-[10px]">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-[10px]">
              Đã bán {product.soldCount > 1000 ? `${(product.soldCount / 1000).toFixed(1)}k` : product.soldCount}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[10px] text-[#757575]">
            <span className="truncate max-w-[90px]">{product.sellerName}</span>
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleQuickAdd}
              className="text-[#ee4d2d] hover:bg-orange-50 p-1 rounded transition-colors disabled:opacity-40"
              title="Thêm nhanh vào giỏ"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
