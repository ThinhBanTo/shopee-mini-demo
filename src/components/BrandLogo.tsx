import React from 'react';
import { Link } from 'react-router-dom';

interface BrandLogoProps {
  /** Variant defines color styling based on header/background context */
  variant?: 'on-orange' | 'on-white' | 'pure-icon';
  /** Size of the logo icon badge */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to render the wordmark "MiniShoppe" alongside the icon */
  showText?: boolean;
  /** Whether to wrap the logo in a Link to "/" */
  asLink?: boolean;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Signature MiniShoppe Icon: Stylized Shopping Bag with Monogram "M"
 * Vector path coordinates optimized for crisp rendering at 24px, 32px, 40px+
 */
export const MiniShoppeIcon: React.FC<{
  className?: string;
  bagColor?: string;
  monogramColor?: string;
  size?: number;
}> = ({
  className = 'w-6 h-6',
  bagColor = '#ee4d2d',
  monogramColor = '#ffffff',
  size,
}) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="MiniShoppe Logo"
    >
      {/* Bag Handle (Quai túi) */}
      <path
        d="M 18 15 C 18 8.2 29.8 8.2 29.8 15"
        stroke={bagColor}
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Bag Body (Thân túi) */}
      <path
        d="M 11.5 15 L 36.5 15 C 38.4 15 39.9 16.5 40.2 18.4 L 41.8 38.2 C 42.1 40.5 40.3 42.5 38 42.5 L 10 42.5 C 7.7 42.5 5.9 40.5 6.2 38.2 L 7.8 18.4 C 8.1 16.5 9.6 15 11.5 15 Z"
        fill={bagColor}
      />

      {/* Monogram "M" inside the bag body */}
      <path
        d="M 14.5 37 L 14.5 21 L 19 21 L 23.9 29.5 L 28.8 21 L 33.3 21 L 33.3 37 L 29.3 37 L 29.3 26.5 L 25.4 33.2 L 22.4 33.2 L 18.5 26.5 L 18.5 37 Z"
        fill={monogramColor}
      />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'on-orange',
  size = 'md',
  showText = true,
  asLink = true,
  className = '',
}) => {
  // Size classes for icon badge
  const badgeSizeClasses = {
    sm: 'w-7 h-7 rounded-[4px]',
    md: 'w-9 h-9 sm:w-10 sm:h-10 rounded-[6px]',
    lg: 'w-12 h-12 rounded-[8px]',
    xl: 'w-16 h-16 rounded-[12px]',
  }[size];

  // Icon dimensions
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6 sm:w-7 sm:h-7',
    lg: 'w-8 h-8',
    xl: 'w-11 h-11',
  }[size];

  // Text sizes
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl',
  }[size];

  // Visual badge & colors based on background variant
  let badgeClasses = '';
  let bagColor = '#ee4d2d';
  let monogramColor = '#ffffff';
  let textNode = null;

  if (variant === 'on-orange') {
    // Header on orange #ee4d2d: White badge, orange bag with white M
    badgeClasses = 'bg-white shadow-sm flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105';
    bagColor = '#ee4d2d';
    monogramColor = '#ffffff';

    textNode = showText && (
      <div className="text-left select-none">
        <span className={`${textSizeClasses} font-black tracking-tight text-white block leading-none font-['Roboto',Arial,sans-serif]`}>
          Mini<span className="text-amber-200">Shoppe</span>
        </span>
      </div>
    );
  } else if (variant === 'on-white') {
    // White background (e.g. Login header, Footer): Orange badge, white bag with orange M
    badgeClasses = 'bg-[#ee4d2d] shadow-sm flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105';
    bagColor = '#ffffff';
    monogramColor = '#ee4d2d';

    textNode = showText && (
      <div className="text-left select-none">
        <span className={`${textSizeClasses} font-black tracking-tight text-[#ee4d2d] block leading-none font-['Roboto',Arial,sans-serif]`}>
          Mini<span className="text-[#222222]">Shoppe</span>
        </span>
      </div>
    );
  } else {
    // pure-icon without background badge
    bagColor = '#ee4d2d';
    monogramColor = '#ffffff';
  }

  const content = (
    <div className={`flex items-center gap-2 group flex-shrink-0 ${className}`}>
      {variant !== 'pure-icon' ? (
        <div className={`${badgeSizeClasses} ${badgeClasses}`}>
          <MiniShoppeIcon
            className={iconSizeClasses}
            bagColor={bagColor}
            monogramColor={monogramColor}
          />
        </div>
      ) : (
        <MiniShoppeIcon
          className={iconSizeClasses}
          bagColor={bagColor}
          monogramColor={monogramColor}
        />
      )}
      {textNode}
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" className="inline-flex items-center" aria-label="MiniShoppe Trang chủ">
        {content}
      </Link>
    );
  }

  return content;
};
