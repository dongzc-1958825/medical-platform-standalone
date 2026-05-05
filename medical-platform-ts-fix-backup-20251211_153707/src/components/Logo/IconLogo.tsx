// src/components/Logo/IconLogo.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface IconLogoProps {
  size?: number;
}

const IconLogo: React.FC<IconLogoProps> = ({ size = 32 }) => {
  return (
    <Link 
      to="/" 
      className="inline-flex items-center justify-center hover:opacity-80 transition-opacity"
      aria-label="返回医案平台首页"
    >
      <div 
        className="bg-blue-600 rounded-lg flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-white font-bold" style={{ fontSize: size * 0.6 }}>
          医
        </span>
      </div>
    </Link>
  );
};

export default IconLogo;