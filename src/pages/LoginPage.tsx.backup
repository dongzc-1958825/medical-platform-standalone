import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { isMobileDevice } from '@/shared/utils/device';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        console.log('✅ 登录成功，执行智能重定向...');
        
        // 智能重定向逻辑
        const redirectPath = getSmartRedirectPath();
        console.log(`📍 智能重定向目标: ${redirectPath}`);
        navigate(redirectPath);
      } else {
        setError('用户名或密码错误');
      }
    } catch (err) {
      setError('登录失败，请重试');
      console.error('登录错误:', err);
    }
  };

  /**
   * 增强版智能重定向路径决策
   * 优先级：哈希路径 > 来源参数 > 设备检测
   */
  const getSmartRedirectPath = () => {
    const currentHash = window.location.hash;
    console.log(`📍 当前哈希路径: ${currentHash}`);
    
    // 🔧 增强规则1：哈希路径识别（多种模式匹配）
    if (currentHash) {
      console.log('🔍 开始哈希路径分析...');
      
      // 🆕 重要修复：从哈希中提取URL参数
      // 哈希格式可能是: #/login?from=/mobile/home 或 #/login?from=/desktop/home
      const hashParts = currentHash.split('?');
      if (hashParts.length > 1) {
        const hashParams = new URLSearchParams(hashParts[1]);
        const fromParam = hashParams.get('from');
        if (fromParam) {
          console.log(`📍 智能重定向规则1-0：哈希参数识别 "${fromParam}"`);
          return fromParam;
        }
      }
      
      // 模式1：完整的移动端路径
      if (currentHash.includes('#/mobile/')) {
        console.log('📍 智能重定向规则1-1：完整移动端路径');
        return '/mobile/home';
      }
      
      // 模式2：从移动端页面来的登录（referrer分析）
      const referrer = document.referrer;
      console.log(`🔍 页面来源referrer: ${referrer}`);
      if (referrer && referrer.includes('/mobile/')) {
        console.log('📍 智能重定向规则1-2：来源页面为移动端');
        return '/mobile/home';
      }
      
      // 模式3：历史哈希记录（localStorage记录的上次访问设备）
      try {
        const lastDevice = localStorage.getItem('last-device-type');
        console.log(`🔍 上次访问设备记录: ${lastDevice}`);
        if (lastDevice === 'mobile') {
          console.log('📍 智能重定向规则1-3：上次访问设备为移动端');
          return '/mobile/home';
        }
      } catch (e) {
        console.log('🔍 无法读取设备历史记录');
      }
    }
    
    // 🆕 规则2：修正来源参数识别（从location中获取）
    // 注意：在HashRouter中，location.search可能是空的，但location.state可能有信息
    const searchParams = new URLSearchParams(location.search);
    const from = searchParams.get('from');
    if (from) {
      console.log(`📍 智能重定向规则2：来源参数 "${from}"`);
      return from;
    }
    
    // 检查location.state（如果有导航状态传递）
    if (location.state && location.state.from) {
      console.log(`📍 智能重定向规则2-2：导航状态来源 "${location.state.from}"`);
      return location.state.from;
    }
    
    // 规则3：设备检测（新增设备类型记录）
    if (isMobileDevice()) {
      console.log('📍 智能重定向规则3：设备检测为移动端');
      // 记录设备类型，供下次参考
      try {
        localStorage.setItem('last-device-type', 'mobile');
      } catch (e) {
        // 忽略localStorage错误
      }
      return '/mobile/home';
    } else {
      console.log('📍 智能重定向规则3：设备检测为桌面端');
      // 记录设备类型，供下次参考
      try {
        localStorage.setItem('last-device-type', 'desktop');
      } catch (e) {
        // 忽略localStorage错误
      }
      return '/desktop/home';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <LogIn className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">欢迎回来</h1>
          <p className="text-gray-600">登录您的医疗知识平台账户</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="请输入用户名"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="请输入密码"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            登录
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            医疗知识共享平台 · 安全登录系统
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;