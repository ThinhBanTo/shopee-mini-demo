import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  BookOpen,
  ChevronDown,
  LogOut,
  Package,
  Bell,
  HelpCircle,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAppStore } from '../store/useAppStore';
import { UserRole } from '../types';
import { SEED_USERS } from '../data/seed';
import { ResetConfirmModal } from './ResetConfirmModal';
import { useToast } from './Toast';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentUser, switchRole, logout, getUserCart } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const userCart = getUserCart();
  const cartCount = userCart.reduce((sum, item) => sum + item.quantity, 0);

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
    setIsDemoMenuOpen(false);
    showToast(`Đã chuyển sang vai trò: ${role.toUpperCase()}`, 'info');

    if (role === 'seller') navigate('/seller');
    else if (role === 'admin') navigate('/admin');
    else if (role === 'shipper') navigate('/shipper');
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    showToast('Đã đăng xuất khỏi tài khoản.', 'info');
    navigate('/');
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'seller':
        return 'Người bán';
      case 'admin':
        return 'Quản trị viên';
      case 'shipper':
        return 'Shipper';
      default:
        return 'Khách hàng';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#ee4d2d] text-white shadow-sm font-['Roboto',Arial,sans-serif]">
        {/* Tier 1: Top Navigation Bar */}
        <div className="max-w-6xl mx-auto px-4 text-[12px] flex items-center justify-between py-1.5 border-b border-white/10">
          {/* Left Top Links */}
          <div className="flex items-center gap-3">
            <Link to="/seller" className="hover:text-white/80 transition-colors flex items-center gap-1">
              <Store className="w-3.5 h-3.5" />
              <span>Kênh Người Bán</span>
            </Link>
            <span className="text-white/30">|</span>
            <Link to="/demo-guide" className="hover:text-white/80 transition-colors flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kịch bản Demo 6 bước</span>
            </Link>
            <span className="text-white/30 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-white/80">Kết nối: Facebook, Instagram</span>
          </div>

          {/* Right Top Links */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-white/90">
              <div className="flex items-center gap-1 hover:text-white cursor-pointer">
                <Bell className="w-3.5 h-3.5" />
                <span>Thông Báo</span>
              </div>
              <div className="flex items-center gap-1 hover:text-white cursor-pointer">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Hỗ Trợ</span>
              </div>
            </div>

            {/* Discreet Demo Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/20 hover:bg-black/30 text-amber-200 font-semibold text-[11px] transition-colors"
                title="Chế độ Demo 4 vai trò"
              >
                <span>Demo Mode</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isDemoMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white text-gray-800 rounded shadow-xl border border-gray-100 py-1.5 z-50 animate-scale-up text-xs">
                  <div className="px-3 py-1.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <span className="font-bold text-[11px] text-gray-500 uppercase">Chuyển vai trò demo</span>
                    <button
                      onClick={() => {
                        setIsDemoMenuOpen(false);
                        setIsResetModalOpen(true);
                      }}
                      className="text-[10px] text-rose-600 hover:underline font-bold flex items-center gap-0.5"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      Reset
                    </button>
                  </div>
                  {SEED_USERS.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleRoleSelect(u.role)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-orange-50 transition-colors ${
                        currentUser?.role === u.role ? 'text-[#ee4d2d] font-bold bg-orange-50/60' : 'text-gray-700'
                      }`}
                    >
                      <img src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover border" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs">{u.name}</p>
                        <span className="text-[10px] text-gray-400 font-normal">({getRoleLabel(u.role)})</span>
                      </div>
                    </button>
                  ))}

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <Link
                      to="/demo-guide"
                      onClick={() => setIsDemoMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-[#ee4d2d] hover:bg-orange-50 font-medium transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Kịch bản Demo 6 bước</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <span className="text-white/30">|</span>

            {/* Auth section */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 hover:text-white/80 font-medium"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/40"
                  />
                  <span className="truncate max-w-[110px]">{currentUser.name}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-xl border border-gray-100 py-1 z-50 text-xs animate-scale-up">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="font-bold text-gray-900 truncate">{currentUser.name}</p>
                      <span className="text-[10px] text-gray-400 font-medium">{currentUser.email}</span>
                      <span className="block mt-1 text-[10px] font-bold text-[#ee4d2d] uppercase">
                        Vai trò: {getRoleLabel(currentUser.role)}
                      </span>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#ee4d2d]"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Đơn Mua</span>
                    </Link>

                    {currentUser.role === 'seller' && (
                      <Link
                        to="/seller"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-emerald-700 hover:bg-emerald-50 font-medium"
                      >
                        <Store className="w-3.5 h-3.5" />
                        <span>Kênh Người Bán</span>
                      </Link>
                    )}

                    {currentUser.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-purple-700 hover:bg-purple-50 font-medium"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Ban Quản Trị</span>
                      </Link>
                    )}

                    {currentUser.role === 'shipper' && (
                      <Link
                        to="/shipper"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-blue-700 hover:bg-blue-50 font-medium"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Cổng Shipper</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-rose-600 hover:bg-rose-50 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 font-medium">
                <Link to="/register" className="hover:text-white/80">
                  Đăng Ký
                </Link>
                <span className="text-white/30">|</span>
                <Link to="/login" className="hover:text-white/80">
                  Đăng Nhập
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tier 2: Main Search & Brand Header */}
        <div className="max-w-6xl mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between gap-4 sm:gap-8">
            {/* Signature Brand Logo */}
            <BrandLogo variant="on-orange" size="md" asLink />

            {/* Large Search Bar */}
            <div className="flex-1 max-w-3xl">
              <form onSubmit={handleSearch} className="flex bg-white rounded-sm p-1 shadow-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Shopee bao ship 0Đ - Đăng ký nhận ngay voucher 50k..."
                  className="w-full px-3 text-[14px] text-gray-800 placeholder-gray-400 outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white rounded-sm transition-colors flex items-center justify-center flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Sub-search keywords */}
              <div className="hidden lg:flex items-center gap-3 mt-1 text-[11px] text-white/90">
                <Link to="/?q=Tai+nghe" className="hover:text-amber-200">Tai nghe Bluetooth</Link>
                <Link to="/?q=Bàn+phím" className="hover:text-amber-200">Bàn phím cơ</Link>
                <Link to="/?q=Áo+thun" className="hover:text-amber-200">Áo thun Cotton</Link>
                <Link to="/?q=Bình+giữ+nhiệt" className="hover:text-amber-200">Bình giữ nhiệt</Link>
                <Link to="/?q=Giày" className="hover:text-amber-200">Giày sneaker</Link>
                <Link to="/?q=Son" className="hover:text-amber-200">Son môi lì</Link>
              </div>
            </div>

            {/* Shopping Cart Button */}
            <div className="flex items-center flex-shrink-0">
              <Link
                to="/cart"
                className="relative p-2 text-white hover:text-white/90 transition-transform hover:scale-105 group"
                aria-label="Giỏ hàng"
              >
                <ShoppingCart className="w-7 h-7" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-1 bg-white text-[#ee4d2d] font-bold text-[11px] rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 border border-[#ee4d2d] shadow">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} />
    </>
  );
};
