import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,           // 首页
  FileText,       // 医案分享
  Stethoscope,    // 寻医问药
  Users,          // 专病社区
  MessageCircle,  // 消息
  User            // 我的
} from 'lucide-react';

export default function MobileBottomNav() {
  const navItems = [
    { 
      path: '/mobile/home', 
      label: '首页', 
      icon: Home
    },
    { 
      path: '/mobile/cases', 
      label: '医案分享', 
      icon: FileText
    },
    { 
      path: '/mobile/consult', 
      label: '寻医问药', 
      icon: Stethoscope
    },
    { 
      path: '/mobile/community', 
      label: '专病社区', 
      icon: Users
    },
    { 
      path: '/mobile/messages', 
      label: '消息', 
      icon: MessageCircle
    },
    { 
      path: '/mobile/profile', 
      label: '我的', 
      icon: User
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
      <div className="flex justify-between items-center h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 min-w-0 h-full px-0.5 ${
                  isActive 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-600 hover:text-blue-500'
                } transition-colors duration-200`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] leading-tight text-center break-words w-full px-0.5">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}