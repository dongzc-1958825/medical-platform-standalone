// 📁 src/shared/constants/navigation.ts
// 统一的导航配置

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  description?: string;
  // 设备显示控制
  showInMobileNav: boolean;    // 是否在移动端底部导航显示
  showInDesktopNav: boolean;   // 是否在桌面端顶部导航显示
  isCoreFunction: boolean;     // 是否核心功能
  order: number;               // 显示顺序
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: '首页',
    icon: '🏠',
    path: '/home',
    description: '平台首页',
    showInMobileNav: false,    // 移动端通过logo点击进入
    showInDesktopNav: true,
    isCoreFunction: true,
    order: 1
  },
  {
    id: 'cases',
    label: '医案分享',
    icon: '📋',
    path: '/cases',
    description: '医案管理与分享',
    showInMobileNav: true,
    showInDesktopNav: true,
    isCoreFunction: true,
    order: 2
  },
  {
    id: 'community',
    label: '专病社区',
    icon: '👥',
    path: '/community',
    description: '疾病专项讨论社区',
    showInMobileNav: true,
    showInDesktopNav: true,
    isCoreFunction: true,
    order: 3
  },
  {
    id: 'consult',
    label: '寻医问药',
    icon: '❓',
    path: '/consult',
    description: '在线问诊与咨询',
    showInMobileNav: true,
    showInDesktopNav: true,
    isCoreFunction: true,
    order: 4
  },
  {
    id: 'messages',
    label: '消息',
    icon: '📢',
    path: '/messages',
    description: '消息与通知中心',
    showInMobileNav: true,
    showInDesktopNav: true,
    isCoreFunction: true,
    order: 5
  },
  {
    id: 'profile',
    label: '我的',
    icon: '👤',
    path: '/profile',
    description: '个人中心与设置',
    showInMobileNav: true,
    showInDesktopNav: true,
    isCoreFunction: true,
    order: 6
  },
];

// 获取移动端底部导航项（5个固定功能）
export function getMobileBottomNavItems(): NavItem[] {
  return NAV_ITEMS
    .filter(item => item.showInMobileNav)
    .sort((a, b) => a.order - b.order);
}

// 获取桌面端顶部导航项
export function getDesktopTopNavItems(): NavItem[] {
  return NAV_ITEMS
    .filter(item => item.showInDesktopNav)
    .sort((a, b) => a.order - b.order);
}

// 获取核心功能项
export function getCoreFunctions(): NavItem[] {
  return NAV_ITEMS
    .filter(item => item.isCoreFunction)
    .sort((a, b) => a.order - b.order);
}
