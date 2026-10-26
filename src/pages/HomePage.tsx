import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Zap,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import {
  FlashSaleClockIcon,
  FreeShippingTruckIcon,
  VoucherDiscountIcon,
  MallStoreIcon,
  TopTrendingStarIcon,
  AuthenticShieldIcon,
} from '../components/QuickServiceIcons';
import { useAppStore } from '../store/useAppStore';
import { CATEGORIES_WITH_IMAGE } from '../data/seed';
import { ProductCard } from '../components/ProductCard';
import { formatVND } from '../lib/formatters';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const currentCategory = searchParams.get('cat') || 'Tất cả';

  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const products = useAppStore((state) => state.products);

  // Filter approved products only for storefront
  const approvedProducts = useMemo(() => {
    return products.filter((p) => p.status === 'APPROVED');
  }, [products]);

  // Flash Sale products
  const flashSaleProducts = useMemo(() => {
    return approvedProducts.filter((p) => p.isFlashSale || (p.originalPrice && p.originalPrice > p.price)).slice(0, 6);
  }, [approvedProducts]);

  // Mall products
  const mallProducts = useMemo(() => {
    return approvedProducts.filter((p) => p.isMall).slice(0, 6);
  }, [approvedProducts]);

  // Filter & sort for "Gợi Ý Hôm Nay"
  const filteredProducts = useMemo(() => {
    return approvedProducts
      .filter((p) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        if (currentCategory && currentCategory !== 'Tất cả') {
          if (p.category !== currentCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return b.soldCount - a.soldCount;
      });
  }, [approvedProducts, searchQuery, currentCategory, sortBy]);

  // Banner slide auto rotation
  const banners = [
    {
      title: 'Shopee Siêu Sale Lương Về - Miễn Phí Vận Chuyển 0Đ',
      subtitle: 'Voucher giảm 10% toàn sàn với mã DEMO10',
      badge: 'SIÊU SALE THÁNG 11',
      bg: 'bg-gradient-to-r from-[#ee4d2d] to-[#ff7337]',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1000&q=80',
    },
    {
      title: 'Hàng Công Nghệ & Phụ Kiện Điện Tử Giảm Đến 50%',
      subtitle: 'Bàn phím cơ, tai nghe chống ồn, sạc nhanh chính hãng',
      badge: 'CÔNG NGHỆ CHÍNH HÃNG',
      bg: 'bg-gradient-to-r from-[#0052cc] to-[#2684ff]',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleCategoryClick = (categoryName: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryName === 'Tất cả' || currentCategory === categoryName) {
      params.delete('cat');
    } else {
      params.set('cat', categoryName);
    }
    setSearchParams(params);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 space-y-5 font-['Roboto',Arial,sans-serif]">
      {/* 1. Shopee Top Banners Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Main Carousel Banner */}
        <div className="lg:col-span-2 relative h-[230px] sm:h-[260px] rounded-[2px] overflow-hidden group shadow-sm">
          <div className={`w-full h-full relative transition-all duration-500`}>
            <img
              src={banners[activeBannerIndex].image}
              alt={banners[activeBannerIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
              <span className="inline-block bg-[#ee4d2d] text-white text-[10px] font-bold px-2 py-0.5 rounded-[2px] w-max mb-1 uppercase tracking-wider">
                {banners[activeBannerIndex].badge}
              </span>
              <h2 className="text-lg sm:text-xl font-bold leading-snug">
                {banners[activeBannerIndex].title}
              </h2>
              <p className="text-xs text-white/90 mt-0.5">{banners[activeBannerIndex].subtitle}</p>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveBannerIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeBannerIndex === idx ? 'bg-[#ee4d2d] w-5' : 'bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 2 Side Stacked Banners */}
        <div className="hidden lg:grid grid-rows-2 gap-2 h-[260px]">
          <div className="relative rounded-[2px] overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white flex flex-col justify-center shadow-sm">
            <span className="text-[10px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded-[2px] w-max uppercase">
              Mã FREESHIP
            </span>
            <h3 className="font-bold text-sm mt-1">Miễn Phí Vận Chuyển 25.000₫</h3>
            <p className="text-[11px] text-white/90 mt-0.5">Áp dụng cho đơn hàng từ 150.000₫</p>
          </div>

          <div className="relative rounded-[2px] overflow-hidden bg-gradient-to-r from-rose-500 to-[#ee4d2d] p-4 text-white flex flex-col justify-center shadow-sm">
            <span className="text-[10px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded-[2px] w-max uppercase">
              Voucher Giảm 10%
            </span>
            <h3 className="font-bold text-sm mt-1">Nhập Mã DEMO10</h3>
            <p className="text-[11px] text-white/90 mt-0.5">Giảm tối đa 50.000₫ cho mọi khách hàng</p>
          </div>
        </div>
      </div>

      {/* 2. Shopee Quick Service Features Bar */}
      <div className="bg-white rounded-[2px] p-4 shadow-sm border border-[#e8e8e8]">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-2 text-center">
          <Link
            to="/?q=Sale"
            className="group flex flex-col items-center gap-2 p-1.5 rounded transition-all duration-200"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#fff5f1] border border-[#fde4db] flex items-center justify-center text-[#ee4d2d] transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-sm">
              <FlashSaleClockIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[12px] sm:text-[13px] font-normal text-[#222222] group-hover:text-[#ee4d2d] transition-colors line-clamp-2 leading-tight max-w-[110px]">
              Khung Giờ Săn Sale
            </span>
          </Link>

          <Link
            to="/?q=Freeship"
            className="group flex flex-col items-center gap-2 p-1.5 rounded transition-all duration-200"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#fff5f1] border border-[#fde4db] flex items-center justify-center text-[#ee4d2d] transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-sm">
              <FreeShippingTruckIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[12px] sm:text-[13px] font-normal text-[#222222] group-hover:text-[#ee4d2d] transition-colors line-clamp-2 leading-tight max-w-[110px]">
              Miễn Phí Vận Chuyển
            </span>
          </Link>

          <Link
            to="/cart"
            className="group flex flex-col items-center gap-2 p-1.5 rounded transition-all duration-200"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#fff5f1] border border-[#fde4db] flex items-center justify-center text-[#ee4d2d] transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-sm">
              <VoucherDiscountIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[12px] sm:text-[13px] font-normal text-[#222222] group-hover:text-[#ee4d2d] transition-colors line-clamp-2 leading-tight max-w-[110px]">
              Mã Giảm Giá 10%
            </span>
          </Link>

          <Link
            to="/?q=Mall"
            className="group flex flex-col items-center gap-2 p-1.5 rounded transition-all duration-200"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#fff5f1] border border-[#fde4db] flex items-center justify-center text-[#ee4d2d] transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-sm">
              <MallStoreIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[12px] sm:text-[13px] font-normal text-[#222222] group-hover:text-[#ee4d2d] transition-colors line-clamp-2 leading-tight max-w-[110px]">
              MiniShoppe Mall
            </span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setSortBy('popular');
              const el = document.getElementById('products-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex flex-col items-center gap-2 p-1.5 rounded transition-all duration-200 cursor-pointer"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#fff5f1] border border-[#fde4db] flex items-center justify-center text-[#ee4d2d] transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-sm">
              <TopTrendingStarIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[12px] sm:text-[13px] font-normal text-[#222222] group-hover:text-[#ee4d2d] transition-colors line-clamp-2 leading-tight max-w-[110px]">
              Top Bán Chạy
            </span>
          </button>

          <Link
            to="/?q=Chính+hãng"
            className="group flex flex-col items-center gap-2 p-1.5 rounded transition-all duration-200"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#fff5f1] border border-[#fde4db] flex items-center justify-center text-[#ee4d2d] transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-sm">
              <AuthenticShieldIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <span className="text-[12px] sm:text-[13px] font-normal text-[#222222] group-hover:text-[#ee4d2d] transition-colors line-clamp-2 leading-tight max-w-[110px]">
              Hàng Chính Hãng 100%
            </span>
          </Link>
        </div>
      </div>

      {/* 3. Shopee Categories Grid */}
      <div className="bg-white rounded-[2px] border border-[#e8e8e8] shadow-sm p-4">
        <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-2.5 mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#757575]">
            DANH MỤC NGÀNH HÀNG
          </h2>
          {currentCategory !== 'Tất cả' && (
            <button
              onClick={() => handleCategoryClick('Tất cả')}
              className="text-xs text-[#ee4d2d] hover:underline font-medium"
            >
              Xem tất cả danh mục
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5 text-center">
          {CATEGORIES_WITH_IMAGE.map((cat) => {
            const isSelected = currentCategory === cat.name;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className={`flex flex-col items-center p-2 rounded-[2px] transition-all hover:shadow-sm ${
                  isSelected
                    ? 'border-2 border-[#ee4d2d] bg-orange-50/50'
                    : 'border border-transparent hover:border-gray-200 bg-white'
                }`}
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 mb-1.5 flex items-center justify-center border border-gray-100">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[11px] leading-tight text-gray-700 font-normal line-clamp-2">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. FLASH SALE Section */}
      {flashSaleProducts.length > 0 && !searchQuery && currentCategory === 'Tất cả' && (
        <div className="bg-white rounded-[2px] border border-[#e8e8e8] shadow-sm p-4">
          <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[#ee4d2d] font-black text-lg uppercase tracking-tight">
                <Zap className="w-5 h-5 fill-current" />
                <span>FLASH SALE</span>
              </div>
              {/* Countdown badge */}
              <div className="flex items-center gap-1 text-xs font-bold text-white">
                <span className="bg-black px-1.5 py-0.5 rounded-[2px]">02</span>
                <span className="text-black">:</span>
                <span className="bg-black px-1.5 py-0.5 rounded-[2px]">45</span>
                <span className="text-black">:</span>
                <span className="bg-black px-1.5 py-0.5 rounded-[2px]">18</span>
              </div>
            </div>

            <span className="text-xs text-[#ee4d2d] hover:underline cursor-pointer flex items-center gap-0.5">
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {flashSaleProducts.map((p) => {
              const discount = p.originalPrice
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                : 25;
              return (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group flex flex-col justify-between border border-transparent hover:border-[#ee4d2d] rounded-[2px] p-2 hover:shadow-shopee-hover transition-all bg-white"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50 mb-2">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-0 right-0 bg-[#ffd839] text-[#ee4d2d] font-bold text-[10px] px-1 py-0.5">
                      -{discount}%
                    </div>
                  </div>
                  <div>
                    <div className="text-center">
                      <span className="text-sm font-bold text-[#ee4d2d]">{formatVND(p.price)}</span>
                    </div>
                    {/* Fire progress bar */}
                    <div className="mt-1.5 bg-[#ffbda6] rounded-full h-3.5 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute left-0 top-0 bottom-0 bg-[#ee4d2d] rounded-full w-[65%]" />
                      <span className="relative z-10 text-[9px] text-white font-bold uppercase tracking-wider">
                        ĐÃ BÁN {p.soldCount > 0 ? p.soldCount : 45}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. MINISHOPPE MALL Section */}
      {mallProducts.length > 0 && !searchQuery && currentCategory === 'Tất cả' && (
        <div className="bg-white rounded-[2px] border border-[#e8e8e8] shadow-sm p-4">
          <div className="flex flex-wrap items-center justify-between border-b border-[#e8e8e8] pb-3 mb-3 gap-2">
            <div className="flex items-center gap-3">
              <span className="text-base font-black text-[#d0011b] tracking-wider uppercase">
                MINISHOPPE MALL
              </span>
              <div className="hidden sm:flex items-center gap-3 text-xs text-gray-600 pl-3 border-l border-gray-300">
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-[#d0011b]" /> 7 Ngày Miễn Phí Trả Hàng
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d0011b]" /> 100% Hàng Chính Hãng
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#d0011b]" /> Miễn Phí Vận Chuyển
                </span>
              </div>
            </div>
            <span className="text-xs text-[#d0011b] hover:underline cursor-pointer flex items-center gap-0.5 font-medium">
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {mallProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* 6. GỢI Ý HÔM NAY (Daily Discover) Section */}
      <div id="products-section" className="space-y-3">
        {/* Sticky section header tab */}
        <div className="bg-white rounded-[2px] border-b-2 border-[#ee4d2d] p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm sm:text-base font-bold text-[#ee4d2d] uppercase tracking-wide">
            GỢI Ý HÔM NAY
          </h2>

          {/* Sort controls */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#757575] mr-1 hidden sm:inline">Sắp xếp:</span>
            <button
              type="button"
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1 rounded-[2px] transition-colors ${
                sortBy === 'popular' ? 'bg-[#ee4d2d] text-white font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Phổ biến
            </button>
            <button
              type="button"
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1 rounded-[2px] transition-colors ${
                sortBy === 'newest' ? 'bg-[#ee4d2d] text-white font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mới nhất
            </button>
            <button
              type="button"
              onClick={() => setSortBy('price-asc')}
              className={`px-3 py-1 rounded-[2px] transition-colors ${
                sortBy === 'price-asc' ? 'bg-[#ee4d2d] text-white font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Giá Thấp ➔ Cao
            </button>
            <button
              type="button"
              onClick={() => setSortBy('price-desc')}
              className={`px-3 py-1 rounded-[2px] transition-colors ${
                sortBy === 'price-desc' ? 'bg-[#ee4d2d] text-white font-medium' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Giá Cao ➔ Thấp
            </button>
          </div>
        </div>

        {/* Active search / category note */}
        {(searchQuery || currentCategory !== 'Tất cả') && (
          <div className="bg-white rounded-[2px] border border-[#e8e8e8] p-3 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Kết quả lọc:</span>
              {searchQuery && (
                <span className="bg-orange-50 text-[#ee4d2d] px-2 py-0.5 rounded font-medium">
                  Từ khóa: "{searchQuery}"
                </span>
              )}
              {currentCategory !== 'Tất cả' && (
                <span className="bg-orange-50 text-[#ee4d2d] px-2 py-0.5 rounded font-medium">
                  Ngành hàng: "{currentCategory}"
                </span>
              )}
              <span className="text-gray-400">({filteredProducts.length} sản phẩm)</span>
            </div>

            <button
              onClick={() => setSearchParams({})}
              className="text-[#ee4d2d] hover:underline font-medium"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Product Grid: 6 cols on desktop, 4 on tablet, 2 on mobile */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2px] border border-[#e8e8e8] p-12 text-center text-xs text-gray-500 space-y-3">
            <p className="text-base font-bold text-gray-700">Không tìm thấy sản phẩm phù hợp</p>
            <p>Vui lòng thử tìm kiếm bằng từ khóa khác hoặc xóa bộ lọc danh mục.</p>
            <button
              onClick={() => setSearchParams({})}
              className="px-5 py-2 bg-[#ee4d2d] text-white font-medium rounded-[2px] hover:bg-[#d73211]"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
