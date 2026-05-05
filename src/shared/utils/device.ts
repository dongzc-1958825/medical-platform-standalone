// src/shared/utils/device.ts

/**
 * 设备检测工具函数
 * 提供多种设备检测方法，支持服务端渲染
 */

// 移动端UserAgent关键字
const MOBILE_USER_AGENTS = [
  'Android', 'webOS', 'iPhone', 'iPad', 'iPod', 'BlackBerry', 'Windows Phone'
];

/**
 * 检测是否是移动设备（基于UserAgent）
 * 可用于服务端渲染或初始检测
 */
export function isMobileUserAgent(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // 检查是否为移动设备
  for (const agent of MOBILE_USER_AGENTS) {
    if (userAgent.indexOf(agent) !== -1) return true;
  }
  
  return false;
}

/**
 * 检测屏幕宽度是否低于某个断点
 * @param breakpoint 断点宽度（px）
 */
export function isScreenWidthBelow(breakpoint: number): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= breakpoint;
}

/**
 * 检测是否是触摸设备
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window ||
         navigator.maxTouchPoints > 0 ||
         (navigator as any).msMaxTouchPoints > 0;
}

/**
 * 综合设备检测：结合UserAgent和屏幕宽度
 * 优先使用UserAgent，如果无法确定则使用屏幕宽度
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // 1. 首先检查UserAgent（更准确判断设备类型）
  const userAgentMobile = isMobileUserAgent();
  
  // 2. 检查屏幕宽度
  const screenWidthMobile = window.innerWidth <= 768;
  
  // 3. 如果是移动设备UserAgent，或者小屏幕且是触摸设备，则认为是移动设备
  if (userAgentMobile) {
    return true;
  }
  
  // 4. 如果屏幕宽度小于768且是触摸设备，也认为是移动设备
  if (screenWidthMobile && isTouchDevice()) {
    return true;
  }
  
  return false;
};

/**
 * 获取设备信息摘要
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTouch: false,
      userAgent: 'server-side',
      screenWidth: 0,
      screenHeight: 0
    };
  }
  
  return {
    isMobile: isMobileDevice(),
    isTouch: isTouchDevice(),
    userAgent: navigator.userAgent,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  };
}

/**
 * 获取设备类型（用于日志和调试）
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  const isMobile = isMobileDevice();
  
  if (isMobile) {
    if (width <= 480) return 'mobile';
    return 'tablet';
  }
  
  return 'desktop';
}
