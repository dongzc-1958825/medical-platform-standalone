// src/components/Logo/Logo.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isMobileDevice } from '../../shared/utils/device';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  mobileSize?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', mobileSize }) => {
  const navigate = useNavigate();
  const isMobile = isMobileDevice();

  const sizeConfig = {
    small: { container: 'h-8 w-8' },
    medium: { container: 'h-12 w-12' },
    large: { container: 'h-16 w-16' }
  };

  const currentSize = sizeConfig[size];
  const mobileCurrentSize = mobileSize ? sizeConfig[mobileSize] : currentSize;

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isMobile) {
      navigate('/mobile/cases', { replace: true });
    } else {
      navigate('/desktop/cases', { replace: true });
    }
  };

  return (
    <div
      onClick={handleLogoClick}
      className="no-underline hover:opacity-80 transition-opacity cursor-pointer"
      aria-label="返回医案平台首页"
    >
      {/* 只保留图片，删除文字部分 */}
      <div className={`
        ${currentSize.container}
        md:${mobileCurrentSize.container}
        flex items-center justify-center
      `}>
        <img
          src="/medical-platform/logo.png"
          alt="众创医案平台Logo"
          className="h-full w-full object-contain"
        />
      </div>
      {/* 删除整个flex flex-col文字部分 */}
    </div>
  );
};

export default Logo;