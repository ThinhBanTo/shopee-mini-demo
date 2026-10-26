import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  User,
  ShieldCheck,
  Truck,
  Store,
  RotateCcw,
  BookOpen,
  ChevronDown,
  Package,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { UserRole } from '../types';
import { SEED_USERS } from '../data/seed';
import { ResetConfirmModal } from './ResetConfirmModal';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, switchRole, cart } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setIsRoleDropdownOpen(false);

    // Auto navigate to relevant dashboard for the selected role
    if (role === 'seller') {
      navigate('/seller');
    } else if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'shipper') {
      navigate('/shipper');
    } else {
      // customer
      if (location.pathname.startsWith('/seller') || location.pathname.startsWith('/admin') || location.pathname.startsWith('/shipper')) {
        navigate('/');
      }
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'seller':
        return { label: 'Người bán', icon: Store, color: 'bg-emerald-500' };
      case 'admin':
        return { label: 'Quản trị viên', icon: ShieldCheck, color: 'bg-purple-600' };
      case 'shipper':
        return { label: 'Shipper', icon: Truck, color: 'bg-blue-600' };
      default:
        return { label: 'Khách hàng', icon: User, color: 'bg-orange-500' };
    }
  };

  const currentRoleInfo = getRoleBadge(currentUser.role);
  const RoleIcon = currentRoleInfo.icon;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        {/* Top bar with Role switcher and Demo instructions */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white text-xs py-1.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <span className="bg-black/20 text-white px-2 py-0.5 rounded font-bold tracking-wide uppercase text-[10px]">
                Demo sàn TMĐT
              </span>
              <Link to="/demo-guide" className="hover:underline flex items-center gap-1 font-medium">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Kịch bản 6 bước chấm điểm</span>
              </Link>
              <Link to="/seller" className="hidden md:flex items-center gap-1 hover:underline text-white/90">
                <Store className="w-3.5 h-3.5" />
                <span>Kênh Người Bán</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {/* Role Switcher Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-full text-white font-medium transition-colors"
                >
                  <span className="text-[10px] uppercase font-bold text-amber-200">Chuyển vai trò (Demo):</span>
                  <span className="font-bold underline decoration-dotted">{currentRoleInfo.label}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-scale-up">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Chọn tài khoản thực nghiệm
                      </p>
                    </div>
                    {SEED_USERS.map((user) => {
                      const badge = getRoleBadge(user.role);
                      const isSelected = currentUser.role === user.role;
                      return (
                        <button
                          key={user.id}
                          onClick={() => handleRoleSelect(user.role)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs transition-colors ${
                            isSelected ? 'bg-orange-50 font-bold text-orange-600' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-7 h-7 rounded-full object-cover border border-gray-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate">{user.name}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded text-white font-semibold ${badge.color}`}
                              >
                                {badge.label}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Reset Data Button */}
              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white/95 px-2 py-1 rounded transition-colors text-xs"
                title="Khôi phục dữ liệu demo ban đầu"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Đặt lại demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-orange-600 transition-colors">
                  Mini<span className="text-orange-600">Mall</span>
                </span>
                <span className="hidden sm:block text-[10px] font-semibold text-gray-400 -mt-1 tracking-wider uppercase">
                  Sàn TMĐT 4 vai trò
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm, thương hiệu, danh mục..."
                  className="w-full pl-4 pr-24 py-2.5 rounded-xl bg-gray-100 border border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs flex items-center gap-1 transition-colors shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tìm</span>
                </button>
              </div>

              {/* Quick tags */}
              <div className="hidden lg:flex items-center gap-3 mt-1.5 text-[11px] text-gray-500">
                <span className="text-gray-400">Gợi ý:</span>
                <Link to="/?q=Tai+nghe" className="hover:text-orange-600">Tai nghe Bluetooth</Link>
                <Link to="/?q=Bàn+phím" className="hover:text-orange-600">Bàn phím cơ</Link>
                <Link to="/?q=Áo+thun" className="hover:text-orange-600">Áo thun Cotton</Link>
                <Link to="/?q=Bình+giữ+nhiệt" className="hover:text-orange-600">Bình giữ nhiệt Inox</Link>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
              {/* Role specific quick link */}
              {currentUser.role === 'customer' && (
                <Link
                  to="/orders"
                  className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <Package className="w-4 h-4 text-orange-600" />
                  <span>Đơn mua</span>
                </Link>
              )}

              {currentUser.role === 'seller' && (
                <Link
                  to="/seller"
                  className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                >
                  <Store className="w-4 h-4" />
                  <span>Quản lý Shop</span>
                </Link>
              )}

              {currentUser.role === 'admin' && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Duyệt sản phẩm</span>
                </Link>
              )}

              {currentUser.role === 'shipper' && (
                <Link
                  to="/shipper"
                  className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                >
                  <Truck className="w-4 h-4" />
                  <span>Cổng giao hàng</span>
                </Link>
              )}

              {/* Cart Button */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-600 transition-colors flex items-center justify-center group"
                aria-label="Giỏ hàng"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white font-black text-[11px] rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 border-2 border-white shadow-sm">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User Avatar & name badge */}
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-orange-200 ring-2 ring-orange-100"
                />
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-gray-800 truncate max-w-[120px]">{currentUser.name}</p>
                  <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                    <RoleIcon className="w-3 h-3 text-orange-600 inline" />
                    {currentRoleInfo.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Confirmation modal for reset */}
      <ResetConfirmModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} />
    </>
  );
};
