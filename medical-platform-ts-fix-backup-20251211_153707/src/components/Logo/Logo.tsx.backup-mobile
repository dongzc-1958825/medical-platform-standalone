// src/components/Logo/Logo.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
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

  return (
    <Link 
      to="/" 
      className="flex items-center space-x-3 no-underline hover:opacity-80 transition-opacity"
      aria-label="返回医案平台首页"
    >
      {/* Logo图标容器 - 使用logo.png图片 */}
      <div className={`${currentSize.container} flex items-center justify-center`}>
        <img 
          src="/medical-platform/logo.png"
          alt="众创医案平台Logo"
          className="h-full w-full object-contain"
        />
      </div>
      
      {/* Logo文字 */}
      <div className="flex flex-col">
        <span className={`font-bold text-gray-800 ${currentSize.text}`}>
          众创医案平台
        </span>
        <span className="text-xs text-gray-500">
          共享医学智慧
        </span>
      </div>
    </Link>
  );
};

export default Logo;