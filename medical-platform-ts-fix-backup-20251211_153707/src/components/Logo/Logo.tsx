// src/components/Logo/Logo.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  mobileSize?: 'small' | 'medium' | 'large'; // 新增：移动端单独控制
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', mobileSize }) => {
  // 尺寸配置
  const sizeConfig = {
    small: {
      container: 'h-8 w-8',
      text: 'text-base'
    },
    medium: {
      container: 'h-12 w-12',
      text: 'text-xl'
    },
    large: {
      container: 'h-16 w-16',
      text: 'text-2xl'
    }
  };

  const currentSize = sizeConfig[size];
  // 如果没有指定mobileSize，使用与桌面端相同的尺寸
  const mobileCurrentSize = mobileSize ? sizeConfig[mobileSize] : currentSize;

  return (
    <Link 
      to="/" 
      className="flex items-center space-x-3 no-underline hover:opacity-80 transition-opacity"
      aria-label="返回医案平台首页"
    >
      {/* Logo图标容器 - 使用logo.png图片 */}
      {/* 移动端使用较小尺寸 */}
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
      
      {/* Logo文字 - 在手机上隐藏文字，只显示图标 */}
      <div className="flex flex-col">
        <span className={`
          font-bold text-gray-800 
          ${currentSize.text}
          hidden sm:block  /* 在小屏幕隐藏 */
        `}>
          众创医案平台
        </span>
        <span className="text-xs text-gray-500 hidden sm:block">
          共享医学智慧
        </span>
      </div>
    </Link>
  );
};

export default Logo;
