// src/components/auth/LoginModal.tsx（修复后）
import React, { useState } from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLogin: boolean;
  isLoading: boolean;
  onLogin: (username: string, password: string) => void;
  onRegister: (userData: any) => void;
  onSwitchMode: () => void;
  formErrors: Record<string, string>;
  userCount: number;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  isLogin, 
  isLoading, 
  onLogin, 
  onRegister, 
  onSwitchMode, 
  formErrors, 
  userCount 
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(username, password);
    } else {
      onRegister({ username, email, phone, password, confirmPassword });
    }
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? '登录' : '注册'}
            </h2>
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          {/* 用户统计信息 */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <strong>平台用户统计</strong><br />
              已注册用户: <span className="font-bold text-blue-600">{userCount}</span> 人
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名输入框 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                用户名 *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入用户名"
                disabled={isLoading}
              />
              {formErrors.username && (
                <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
              )}
            </div>

            {/* 邮箱输入框 - 仅注册时显示 */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入邮箱"
                  disabled={isLoading}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
            )}

            {/* 手机号输入框 - 仅注册时显示 */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  手机号
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入手机号"
                  disabled={isLoading}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>
            )}

            {/* 密码输入框 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码 *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入密码"
                disabled={isLoading}
              />
              {formErrors.password && (
                <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
              )}
            </div>

            {/* 确认密码输入框 - 仅注册时显示 */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  确认密码 *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                  placeholder="请再次输入密码"
                  disabled={isLoading}
                />
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* 测试账号提示 */}
            {isLogin && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>测试账号：</strong><br />
                  用户名：<span className="font-mono bg-yellow-100 px-1 rounded">testuser</span><br />
                  密码：<span className="font-mono bg-yellow-100 px-1 rounded">123456</span>
                </p>
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLogin ? '登录中...' : '注册中...'}
                </>
              ) : (
                isLogin ? '登录' : '注册'
              )}
            </button>
          </form>

          {/* 切换登录/注册模式 */}
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                resetForm();
                onSwitchMode();
              }}
              className="text-blue-600 hover:text-blue-700 text-sm"
              disabled={isLoading}
            >
              {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;