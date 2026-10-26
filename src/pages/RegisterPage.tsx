import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { BrandLogo, MiniShoppeIcon } from '../components/BrandLogo';
import { useAppStore } from '../store/useAppStore';
import { useToast } from '../components/Toast';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const register = useAppStore((state) => state.register);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) {
      errs.name = 'Vui lòng nhập họ và tên của bạn.';
    } else if (name.trim().length < 2) {
      errs.name = 'Họ và tên phải có ít nhất 2 ký tự.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Vui lòng nhập địa chỉ email.';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Email không hợp lệ (ví dụ: yourname@email.com).';
    }

    if (!password) {
      errs.password = 'Vui lòng nhập mật khẩu.';
    } else if (password.length < 8) {
      errs.password = 'Mật khẩu phải có tối thiểu 8 ký tự.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Mật khẩu xác nhận không trùng khớp.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await register(name, email, password);
      setIsLoading(false);

      if (res.success) {
        showToast(res.message, 'success');
        navigate('/', { replace: true });
      } else {
        setGlobalError(res.message);
      }
    } catch {
      setIsLoading(false);
      setGlobalError('Đã xảy ra lỗi trong quá trình tạo tài khoản. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col font-['Roboto',Arial,sans-serif]">
      {/* Auth Simple Header */}
      <header className="bg-white border-b border-[#e8e8e8] py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo variant="on-white" size="md" asLink />
            <span className="text-lg font-medium text-[#222222] pl-3 border-l border-gray-300">
              Đăng ký
            </span>
          </div>
          <Link to="/" className="text-xs text-[#ee4d2d] hover:underline font-medium">
            Về trang chủ
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 bg-[#ee4d2d] py-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Illustration */}
          <div className="hidden lg:flex lg:col-span-7 flex-col items-center justify-center text-white text-center p-6 space-y-4">
            <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center mb-2 shadow-inner">
              <MiniShoppeIcon className="w-14 h-14" bagColor="#ffffff" monogramColor="#ee4d2d" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              Tạo Tài Khoản Khách Hàng MiniShoppe
            </h1>
            <p className="text-white/90 text-sm max-w-md leading-relaxed">
              Nhận ngay voucher ưu đãi DEMO10 và mã FREESHIP, quản lý giỏ hàng và theo dõi đơn mua thuận tiện.
            </p>
            <div className="pt-4 flex items-center gap-4 text-xs font-medium text-amber-200">
              <span>✓ Mua sắm tiện lợi</span>
              <span>•</span>
              <span>✓ Giỏ hàng riêng biệt</span>
            </div>
          </div>

          {/* Right: Register Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto bg-white rounded-sm p-6 sm:p-8 shadow-md">
            <h2 className="text-xl font-bold text-[#222222] mb-6">Đăng ký tài khoản</h2>

            {globalError && (
              <div className="mb-4 p-3 rounded-sm bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                {globalError}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Name */}
              <div>
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  className={`w-full px-3 py-2.5 text-xs sm:text-sm bg-white border ${
                    errors.name ? 'border-rose-500' : 'border-[#e8e8e8]'
                  } rounded-sm outline-none focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d] transition-all`}
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`w-full px-3 py-2.5 text-xs sm:text-sm bg-white border ${
                    errors.email ? 'border-rose-500' : 'border-[#e8e8e8]'
                  } rounded-sm outline-none focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d] transition-all`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    className={`w-full px-3 py-2.5 pr-10 text-xs sm:text-sm bg-white border ${
                      errors.password ? 'border-rose-500' : 'border-[#e8e8e8]'
                    } rounded-sm outline-none focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d] transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }}
                    className={`w-full px-3 py-2.5 pr-10 text-xs sm:text-sm bg-white border ${
                      errors.confirmPassword ? 'border-rose-500' : 'border-[#e8e8e8]'
                    } rounded-sm outline-none focus:border-[#ee4d2d] focus:ring-1 focus:ring-[#ee4d2d] transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-[#ee4d2d] hover:bg-[#d73211] text-white font-medium text-sm rounded-sm transition-colors shadow-sm uppercase flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang đăng ký...</span>
                  </>
                ) : (
                  <span>Đăng ký</span>
                )}
              </button>
            </form>

            <div className="mt-4 text-[11px] text-gray-500 text-center leading-relaxed">
              Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của MiniShoppe.
            </div>

            {/* Link to Login */}
            <div className="mt-6 text-center text-xs text-gray-600 pt-4 border-t border-[#f1f1f1]">
              Bạn đã có tài khoản?{' '}
              <Link to="/login" className="text-[#ee4d2d] font-bold hover:underline">
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
