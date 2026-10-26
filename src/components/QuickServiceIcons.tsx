import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

/** 1. Khung Giờ Săn Sale: Đồng hồ kết hợp price tag / tia sale nhỏ */
export const FlashSaleClockIcon: React.FC<IconProps> = ({
  className = 'w-7 h-7',
  size,
  color = '#ee4d2d',
}) => {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Clock Outer Rim */}
      <circle cx="17" cy="19" r="13" stroke={color} strokeWidth="2" />
      {/* Clock Hands at 10:10 */}
      <path d="M 17 19 L 17 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M 17 19 L 22 17" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="17" cy="19" r="1.5" fill={color} />
      {/* Top Alarm Bells or Tag Accent */}
      <path d="M 8 9 L 6 7" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Sale Lightning / Spark on Top Right */}
      <path
        d="M 28 4 L 24 11 L 28 11 L 25 17 L 32 9 L 28 9 Z"
        fill={color}
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/** 2. Miễn Phí Vận Chuyển: Xe tải giao hàng với nét chuyển động nhanh */
export const FreeShippingTruckIcon: React.FC<IconProps> = ({
  className = 'w-7 h-7',
  size,
  color = '#ee4d2d',
}) => {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Motion / Speed Lines Behind Truck */}
      <path d="M 3 13 L 8 13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 1 17 L 7 17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 4 21 L 9 21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />

      {/* Truck Cargo Body */}
      <path
        d="M 10 10 L 24 10 C 24.6 10 25 10.4 25 11 L 25 24 L 10 24 C 9.4 24 9 23.6 9 23 L 9 11 C 9 10.4 9.4 10 10 10 Z"
        stroke={color}
        strokeWidth="2"
      />

      {/* Truck Cabin & Hood */}
      <path
        d="M 25 14 L 30 14 C 30.6 14 31.1 14.3 31.4 14.8 L 34 19 L 34 23 C 34 23.6 33.6 24 33 24 L 25 24 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Cabin Window */}
      <path
        d="M 26.5 16 L 29.5 16 L 31.5 19.5 L 26.5 19.5 Z"
        fill={color}
        opacity="0.3"
      />

      {/* Wheels */}
      <circle cx="14.5" cy="25.5" r="3" stroke={color} strokeWidth="2" fill="#ffffff" />
      <circle cx="14.5" cy="25.5" r="1" fill={color} />
      <circle cx="28.5" cy="25.5" r="3" stroke={color} strokeWidth="2" fill="#ffffff" />
      <circle cx="28.5" cy="25.5" r="1" fill={color} />
    </svg>
  );
};

/** 3. Mã Giảm Giá 10%: Coupon / Voucher với ký hiệu % rõ ràng */
export const VoucherDiscountIcon: React.FC<IconProps> = ({
  className = 'w-7 h-7',
  size,
  color = '#ee4d2d',
}) => {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Ticket Body with Notches */}
      <path
        d="M 5 11 C 5 9.9 5.9 9 7 9 L 29 9 C 30.1 9 31 9.9 31 11 L 31 15 C 29.3 15 28 16.3 28 18 C 28 19.7 29.3 21 31 21 L 31 25 C 31 26.1 30.1 27 29 27 L 7 27 C 5.9 27 5 26.1 5 25 L 5 21 C 6.7 21 8 19.7 8 18 C 8 16.3 6.7 15 5 15 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Perforated Divider */}
      <path
        d="M 14 11 L 14 25"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="2 2"
        strokeLinecap="round"
      />

      {/* Percentage Sign "%" on right section */}
      <circle cx="19.5" cy="15" r="1.5" fill={color} />
      <path d="M 25 14 L 19 22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="24.5" cy="21" r="1.5" fill={color} />

      {/* Left Star Accent */}
      <path
        d="M 9.5 15.5 L 10.2 17 L 11.8 17.2 L 10.6 18.3 L 11 20 L 9.5 19.1 L 8 20 L 8.4 18.3 L 7.2 17.2 L 8.8 17 Z"
        fill={color}
      />
    </svg>
  );
};

/** 4. MiniShoppe Mall: Gian hàng chính hãng với mái hiên sang trọng */
export const MallStoreIcon: React.FC<IconProps> = ({
  className = 'w-7 h-7',
  size,
  color = '#ee4d2d',
}) => {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Store Awning / Canopy Roof */}
      <path
        d="M 5 14 L 7 8 L 29 8 L 31 14 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Scalloped Awning Edge */}
      <path
        d="M 5 14 C 6.5 16 8.5 16 10 14 C 11.5 16 13.5 16 15 14 C 16.5 16 18.5 16 20 14 C 21.5 16 23.5 16 25 14 C 26.5 16 28.5 16 31 14"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
      />

      {/* Building Walls */}
      <path d="M 8 16 L 8 27 L 28 27 L 28 16" stroke={color} strokeWidth="2" />

      {/* Store Entrance / Glass Doors */}
      <path
        d="M 14 27 L 14 19 C 14 18.4 14.4 18 15 18 L 21 18 C 21.6 18 22 18.4 22 19 L 22 27"
        stroke={color}
        strokeWidth="1.8"
      />

      {/* "M" Letter Mall Monogram on Top Canopy */}
      <path
        d="M 16 12.5 L 16 10 L 18 11.5 L 20 10 L 20 12.5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ground Foundation Line */}
      <path d="M 4 28 L 32 28" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

/** 5. Top Bán Chạy: Bục vinh quang xếp hạng kết hợp ngôi sao */
export const TopTrendingStarIcon: React.FC<IconProps> = ({
  className = 'w-7 h-7',
  size,
  color = '#ee4d2d',
}) => {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* 5-Pointed Star at Top */}
      <path
        d="M 18 5 L 20.3 10.5 L 26.2 11 L 21.7 15 L 23 20.8 L 18 17.8 L 13 20.8 L 14.3 15 L 9.8 11 L 15.7 10.5 Z"
        fill={color}
        stroke={color}
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Ranking Ribbon / Crown Rays */}
      <path
        d="M 11 23 L 13 20.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M 25 23 L 23 20.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Podium #1 Pedestal */}
      <path
        d="M 12 25 L 24 25 C 24.6 25 25 25.4 25 26 L 25 30 L 11 30 L 11 26 C 11 25.4 11.4 25 12 25 Z"
        stroke={color}
        strokeWidth="1.8"
      />
      {/* Pedestal Base */}
      <path d="M 7 31 L 29 31" stroke={color} strokeWidth="2" strokeLinecap="round" />

      {/* Number 1 inside pedestal */}
      <path
        d="M 17 28.5 L 18 27 L 18 29.5"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
};

/** 6. Hàng Chính Hãng 100%: Khiên bảo vệ xác thực (Shield-Check) */
export const AuthenticShieldIcon: React.FC<IconProps> = ({
  className = 'w-7 h-7',
  size,
  color = '#ee4d2d',
}) => {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Outer Shield Outline */}
      <path
        d="M 18 5 L 29 9 C 29 18 24.5 25.5 18 29 C 11.5 25.5 7 18 7 9 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Inner Decorative Shield Fill/Accent */}
      <path
        d="M 18 8.5 L 26 11.5 C 26 18 22.5 23.5 18 26 C 13.5 23.5 10 18 10 11.5 Z"
        fill={color}
        opacity="0.1"
      />

      {/* Bold Checkmark */}
      <path
        d="M 13.5 16.5 L 16.5 19.5 L 22.5 13.5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Small 100% guarantee dot */}
      <circle cx="18" cy="23.5" r="1.2" fill={color} />
    </svg>
  );
};
