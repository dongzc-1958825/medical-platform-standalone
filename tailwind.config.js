// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 扩展安全区域工具类
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      // 移动端特定断点
      screens: {
        'xs': '320px',
        'sm-mobile': '375px',
        'md-mobile': '414px',
        'mobile-lg': '480px',
      },
      // 移动端优化动画
      animation: {
        'mobile-pulse': 'mobilePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        mobilePulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [
    // 自定义插件添加移动端工具类
    function({ addUtilities }) {
      const newUtilities = {
        '.touch-callout-none': {
          '-webkit-touch-callout': 'none',
        },
        '.tap-highlight-transparent': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        '.ios-scroll-smooth': {
          '-webkit-overflow-scrolling': 'touch',
        },
        '.hardware-accelerate': {
          'transform': 'translateZ(0)',
          '-webkit-transform': 'translateZ(0)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}