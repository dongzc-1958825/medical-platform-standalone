import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { isMobileDevice } from '@/shared/utils/device';
import { LogIn, UserPlus, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const { login, register } = useAuth();

  // 根据URL参数设置表单模式
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const formType = searchParams.get('form');
    const fromParam = searchParams.get('from');
    
    console.log('🔍 URL参数分析:', { formType, fromParam });
    
    if (formType === 'register') {
      setIsRegister(true);
      console.log('🎯 设置为注册模式');
    } else {
      setIsRegister(false);
      console.log('🎯 设置为登录模式');
    }
    
    // 如果有成功消息，显示它
    if (location.state?.message) {
      setMessage(location.state.message);
      setTimeout(() => setMessage(''), 3000);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const success = await login(username, password);
      if (success) {
        console.log('✅ 登录成功，执行智能重定向...');
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // 验证输入
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    if (!email.includes('@')) {
      setError('请输入有效的邮箱地址');
      return;
    }

    if (password.length < 6) {
      setError('密码至少需要6位');
      return;
    }

    try {
      const success = await register(username, password, email);
      if (success) {
        console.log('✅ 注册成功');
        // 注册成功后的处理
        setMessage('🎉 注册成功！请使用您的账号登录');
        // 自动切换到登录表单，并预填用户名
        setIsRegister(false);
        // 不清除用户名，方便用户直接登录
      } else {
        setError('注册失败，用户名可能已存在');
      }
    } catch (err) {
      setError('注册失败，请重试');
      console.error('注册错误:', err);
    }
  };

  /**
   * 智能重定向路径决策
   * 优先级：哈希路径 > 来源参数 > 设备检测
   */
  const getSmartRedirectPath = () => {
    const currentHash = window.location.hash;
    console.log(`📍 当前哈希路径: ${currentHash}`);
    
    // 🔧 增强规则1：哈希路径识别（多种模式匹配）
    if (currentHash) {
      console.log('🔍 开始哈希路径分析...');
      
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
    
    // 规则2：来源参数识别（URL参数中的来源）
    const searchParams = new URLSearchParams(location.search);
    const from = searchParams.get('from');
    if (from) {
      console.log(`📍 智能重定向规则2：来源参数 "${from}"`);
      return from;
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
            <div className={`p-3 rounded-full ${isRegister ? 'bg-green-100' : 'bg-blue-100'}`}>
              {isRegister ? (
                <UserPlus className="w-10 h-10 text-green-600" />
              ) : (
                <LogIn className="w-10 h-10 text-blue-600" />
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isRegister ? '创建账户' : '欢迎回来'}
          </h1>
          <p className="text-gray-600">
            {isRegister ? '注册医疗知识平台新账户' : '登录您的医疗知识平台账户'}
          </p>
        </div>

        {/* 表单切换标签 */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              !isRegister 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              isRegister 
                ? 'border-b-2 border-green-500 text-green-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            注册
          </button>
        </div>

        {/* 成功消息 */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              {message}
            </div>
          </div>
        )}

        {/* 错误消息 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </div>
          </div>
        )}

        {isRegister ? (
          /* 注册表单 */
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名 *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="设置用户名"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱 *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="输入邮箱地址"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码 *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="设置密码（至少6位）"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认密码 *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                placeholder="再次输入密码"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              注册
            </button>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                已有账户？返回登录
              </button>
            </div>
          </form>
        ) : (
          /* 登录表单 */
          <form onSubmit={handleLogin} className="space-y-6">
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
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              登录
            </button>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                没有账户？立即注册
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            医疗知识共享平台 · {isRegister ? '安全注册系统' : '安全登录系统'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;