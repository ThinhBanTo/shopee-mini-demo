import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Tag,
  AlertCircle,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { CATEGORIES } from '../data/seed';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const currentCategory = searchParams.get('cat') || 'Tất cả';

  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'newest'>('popular');
  const [priceRange, setPriceRange] = useState<'all' | 'under-200k' | '200k-500k' | 'over-500k'>('all');

  const products = useAppStore((state) => state.products);

  // Filter approved products only for public/customer view
  const approvedProducts = useMemo(() => {
    return products.filter((p) => p.status === 'APPROVED');
  }, [products]);

  // Apply search, category, price range, and sort
  const filteredProducts = useMemo(() => {
    return approvedProducts
      .filter((p) => {
        // Search filter
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        // Category filter
        if (currentCategory && currentCategory !== 'Tất cả') {
          if (p.category !== currentCategory) return false;
        }

        // Price range filter
        if (priceRange === 'under-200k' && p.price >= 200000) return false;
        if (priceRange === '200k-500k' && (p.price < 200000 || p.price > 500000)) return false;
        if (priceRange === 'over-500k' && p.price <= 500000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return b.soldCount - a.soldCount; // default popular
      });
  }, [approvedProducts, searchQuery, currentCategory, priceRange, sortBy]);

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'Tất cả') {
      params.delete('cat');
    } else {
      params.set('cat', category);
    }
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setSortBy('popular');
    setPriceRange('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Hero Banner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Banner */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white p-6 sm:p-10 flex flex-col justify-between min-h-[220px] shadow-lg shadow-orange-500/20">
          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Sàn TMĐT MiniMall Demo 2026
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Trải nghiệm Mua sắm & Xử lý Đơn Hàng 4 Vai Trò
            </h1>
            <p className="mt-2 text-white/90 text-xs sm:text-sm leading-relaxed">
              Từ Người bán đăng hàng ➔ Quản trị viên duyệt ➔ Khách hàng đặt COD ➔ Shipper nhận và giao hàng thực tế.
            </p>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/demo-guide"
              className="px-5 py-2.5 rounded-xl bg-white text-orange-600 font-bold text-xs sm:text-sm hover:bg-orange-50 shadow-md transition-all flex items-center gap-2"
            >
              Xem kịch bản Demo 6 bước
            </Link>
            <div className="text-xs bg-black/20 px-3 py-2 rounded-xl border border-white/20 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-300" />
              <span>Mã giảm giá: <strong className="text-amber-200 underline">DEMO10</strong> (Giảm 10%)</span>
            </div>
          </div>
        </div>

        {/* Side Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                Miễn phí vận chuyển
              </span>
              <h3 className="font-bold text-gray-900 mt-2 text-sm sm:text-base">Mã FREESHIP</h3>
              <p className="text-xs text-gray-500 mt-1">Giảm ngay 25.000₫ phí ship</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/30">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Kiểm duyệt an toàn
              </span>
              <h3 className="font-bold text-gray-900 mt-2 text-sm sm:text-base">Duyệt hàng bởi Admin</h3>
              <p className="text-xs text-gray-500 mt-1">Sản phẩm phải qua duyệt mới mở bán</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
            Danh mục ngành hàng
          </h2>
          {currentCategory !== 'Tất cả' && (
            <button
              onClick={() => handleCategoryClick('Tất cả')}
              className="text-xs font-semibold text-orange-600 hover:underline"
            >
              Xem tất cả
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = (currentCategory === cat) || (!currentCategory && cat === 'Tất cả');
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Sorting Header */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Left: Result count & search label */}
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="font-bold text-gray-900">{filteredProducts.length}</span>
          <span className="text-gray-500">sản phẩm phù hợp</span>
          {searchQuery && (
            <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md font-medium text-xs">
              Từ khóa: "{searchQuery}"
            </span>
          )}
          {currentCategory !== 'Tất cả' && (
            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-medium text-xs">
              Danh mục: {currentCategory}
            </span>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Price Range Filter */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <span className="text-gray-400 pl-2 text-[11px] font-medium hidden sm:inline">Lọc giá:</span>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as any)}
              className="bg-transparent text-gray-700 font-semibold px-2 py-1 outline-none cursor-pointer"
            >
              <option value="all">Tất cả mức giá</option>
              <option value="under-200k">Dưới 200.000₫</option>
              <option value="200k-500k">Từ 200.000₫ - 500.000₫</option>
              <option value="over-500k">Trên 500.000₫</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <span className="text-gray-400 pl-2 text-[11px] font-medium hidden sm:inline">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-gray-700 font-semibold px-2 py-1 outline-none cursor-pointer"
            >
              <option value="popular">Bán chạy nhất</option>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
          </div>

          {(searchQuery || currentCategory !== 'Tất cả' || priceRange !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-rose-600 hover:underline font-semibold px-2 py-1"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm nào!</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            Không có sản phẩm nào phù hợp với bộ lọc hoặc từ khóa tìm kiếm của bạn. Hãy thử thay đổi danh mục hoặc từ khóa tìm kiếm khác.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 rounded-xl bg-orange-600 text-white font-semibold text-xs hover:bg-orange-700 transition-colors shadow-md shadow-orange-600/20"
          >
            Xem toàn bộ sản phẩm
          </button>
        </div>
      )}
    </div>
  );
};
