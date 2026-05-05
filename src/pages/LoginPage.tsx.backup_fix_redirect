import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isLoading } = useAuth();
  
  const searchParams = new URLSearchParams(location.search);
  const showRegisterFromUrl = searchParams.get('form') === 'register';
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (showRegisterFromUrl) {
      setIsLogin(false);
    }
  }, [showRegisterFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isLogin) {
      // 注册验证
      if (!formData.username.trim()) {
        setError('请输入用户名');
        return;
      }
      if (!formData.email.trim()) {
        setError('请输入邮箱');
        return;
      }
      if (!formData.password.trim()) {
        setError('请输入密码');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }
    }

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('邮箱和密码不能为空');
      return;
    }

    try {
      if (isLogin) {
        console.log('🔐 开始登录，邮箱:', formData.email);
        
        const result = await login(formData.email, formData.password);
        console.log('📊 登录API返回结果:', result);
        
        if (result.success) {
          console.log('🎉 登录成功！立即跳转到首页');
          
          // 关键修复：立即跳转，不使用setTimeout
          navigate('/mobile/home', { replace: true });
          
          // 清空表单
          setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
          });
          
          // 立即返回，不执行后续代码
          return;
        } else {
          console.log('❌ 登录失败:', result.message);
          // 确保错误信息是字符串
          setError(String(result.message || '登录失败'));
        }
      } else {
        console.log('📝 开始注册，邮箱:', formData.email);
        
        const result = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'patient', // 默认角色
          specialties: [],
        });
        
        console.log('📊 注册API返回结果:', result);
        
        if (result.success) {
          setSuccess('注册成功！请登录');
          setIsLogin(true); // 切换到登录表单
          
          // 保留邮箱，清空其他字段
          setFormData({
            username: '',
            email: formData.email, // 保留注册的邮箱
            password: '',
            confirmPassword: '',
            phone: '',
          });
        } else {
          setError(String(result.message || '注册失败'));
        }
      }
    } catch (err: any) {
      console.error('💥 认证过程异常:', err);
      // 安全地显示错误信息
      const errorMsg = err?.message || err?.toString() || '操作失败，请重试';
      setError(String(errorMsg).substring(0, 100));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    if (!isLogin) {
      setFormData(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? '用户登录' : '用户注册'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? '登录众创医案平台' : '创建新账户'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {/* 关键修复：安全显示错误信息，避免问号 */}
            {(() => {
              try {
                const errorStr = String(error);
                // 只显示ASCII字符，避免乱码
                return errorStr.replace(/[^\x00-\x7F]/g, '');
              } catch {
                return '操作失败';
              }
            })()}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  用户名
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required={!isLogin}
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入用户名"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入邮箱"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  手机号（可选）
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请输入手机号"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入密码"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  确认密码
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required={!isLogin}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="请再次输入密码"
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleForm}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              {isLogin ? '没有账户？点击注册' : '已有账户？点击登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;