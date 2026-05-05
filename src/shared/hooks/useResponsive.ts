import { useState, useEffect } from 'react';

// 断点配置 - 与TailwindCSS保持一致
export const BREAKPOINTS = {
  xs: 475,   // 超小屏幕
  sm: 640,   // 小屏幕
  md: 768,   // 平板/移动分界
  lg: 1024,  // 桌面
  xl: 1280,  // 大桌面
  '2xl': 1536 // 超大桌面
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveState {
  width: number;
  height: number;
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: Breakpoint;
  breakpoints: {
    [K in Breakpoint]: boolean;
  };
}

/**
 * 响应式设计Hook - 提供屏幕尺寸和设备类型检测
 * 与现有hooks保持一致的API风格
 */
export function useResponsive(): ResponsiveState {
  const [windowSize, setWindowSize] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  }));

  const [breakpoint, setBreakpoint] = useState<Breakpoint>('md');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    // SSR兼容处理
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({ width, height });

      // 计算当前断点
      let currentBreakpoint: Breakpoint = 'xs';
      for (const [bp, size] of Object.entries(BREAKPOINTS)) {
        if (width >= size) {
          currentBreakpoint = bp as Breakpoint;
        } else {
          break;
        }
      }
      setBreakpoint(currentBreakpoint);

      // 计算设备类型
      if (width < BREAKPOINTS.md) {
        setDeviceType('mobile');
      } else if (width < BREAKPOINTS.lg) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // 初始检测
    handleResize();

    // 监听窗口变化（添加防抖优化性能）
    let resizeTimer: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // 计算各断点状态
  const breakpoints = {
    xs: windowSize.width >= BREAKPOINTS.xs,
    sm: windowSize.width >= BREAKPOINTS.sm,
    md: windowSize.width >= BREAKPOINTS.md,
    lg: windowSize.width >= BREAKPOINTS.lg,
    xl: windowSize.width >= BREAKPOINTS.xl,
    '2xl': windowSize.width >= BREAKPOINTS['2xl'],
  };

  return {
    ...windowSize,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    breakpoint,
    breakpoints,
  };
}

/**
 * 简化的移动端检测Hook
 * @returns 是否是移动设备（包括平板）
 */
export function useIsMobile(): boolean {
  const { isMobile, isTablet } = useResponsive();
  return isMobile || isTablet;
}

/**
 * 简化的桌面端检测Hook
 * @returns 是否是桌面设备
 */
export function useIsDesktop(): boolean {
  const { isDesktop } = useResponsive();
  return isDesktop;
}

/**
 * 特定断点检测Hook
 * @param breakpoint 要检测的断点
 * @returns 是否达到该断点
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const { breakpoints } = useResponsive();
  return breakpoints[breakpoint];
}
