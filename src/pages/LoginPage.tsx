import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { BrandLogo, MiniShoppeIcon } from '../components/BrandLogo';
import { useAppStore } from '../store/useAppStore';
import { useToast } from '../components/Toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const login = useAppStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập email.');
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập mật khẩu.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      setIsLoading(false);

      if (res.success) {
        showToast(res.message, 'success');
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setIsLoading(false);
      setErrorMessage('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
    }
  };

  const fillQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo12345');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col font-['Roboto',Arial,sans-serif]">
      {/* Auth Simple Header */}
      <header className="bg-white border-b border-[#e8e8e8] py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo variant="on-white" size="md" asLink />
            <span className="text-lg font-medium text-[#222222] pl-3 border-l border-gray-300">
              Đăng nhập
            </span>
          </div>
          <Link to="/demo-guide" className="text-xs text-[#ee4d2d] hover:underline font-medium">
            Bạn cần trợ giúp?
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 bg-[#ee4d2d] py-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Illustration & Brand Highlights */}
          <div className="hidden lg:flex lg:col-span-7 flex-col items-center justify-center text-white text-center p-6 space-y-4">
            <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center mb-2 shadow-inner">
              <MiniShoppeIcon className="w-14 h-14" bagColor="#ffffff" monogramColor="#ee4d2d" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              Nền Tảng Mua Sắm & Điều Phối 4 Vai Trò
            </h1>
            <p className="text-white/90 text-sm max-w-md leading-relaxed">
              Trải nghiệm thực tế toàn trình từ Người bán đăng hàng, Quản trị viên duyệt, Khách hàng mua COD đến Shipper giao nhận.
            </p>
            <div className="pt-4 flex items-center gap-4 text-xs font-medium text-amber-200">
              <span>✓ Flash Sale giá tốt</span>
              <span>•</span>
              <span>✓ Miễn phí vận chuyển</span>
              <span>•</span>
              <span>✓ Hàng chính hãng 100%</span>
            </div>
          </div>

          {/* Right: Login Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto bg-white rounded-sm p-6 sm:p-8 shadow-md">
            <h2 className="text-xl font-bold text-[#222222] mb-6">Đăng nhập</h2>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-sm bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email đăng ký"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white border border-[#e8e8e8] rounded-sm outline-none focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d] transition-all"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full px-3 py-2.5 pr-10 text-xs sm:text-sm bg-white border border-[#e8e8e8] rounded-sm outline-none focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-medium text-sm rounded-sm transition-colors shadow-sm uppercase flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Đăng nhập</span>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Assistant */}
            <div className="mt-5 pt-4 border-t border-[#f1f1f1] text-[11px] text-gray-500 space-y-2">
              <span className="font-bold text-gray-700 block">Chọn nhanh tài khoản Demo (Mật khẩu: demo12345):</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('khachhang@demo.vn')}
                  className="px-2 py-1 text-left bg-gray-50 hover:bg-orange-50 hover:text-[#ee4d2d] rounded-sm border border-gray-200 truncate"
                >
                  👤 Khách hàng
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('nguoiban@demo.vn')}
                  className="px-2 py-1 text-left bg-gray-50 hover:bg-orange-50 hover:text-[#ee4d2d] rounded-sm border border-gray-200 truncate"
                >
                  🏪 Người bán
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin@demo.vn')}
                  className="px-2 py-1 text-left bg-gray-50 hover:bg-orange-50 hover:text-[#ee4d2d] rounded-sm border border-gray-200 truncate"
                >
                  🛡️ Quản trị viên
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('shipper@demo.vn')}
                  className="px-2 py-1 text-left bg-gray-50 hover:bg-orange-50 hover:text-[#ee4d2d] rounded-sm border border-gray-200 truncate"
                >
                  🚚 Shipper
                </button>
              </div>
            </div>

            {/* Link to Register */}
            <div className="mt-6 text-center text-xs text-gray-600">
              Bạn mới biết đến MiniShoppe?{' '}
              <Link to="/register" className="text-[#ee4d2d] font-bold hover:underline">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
