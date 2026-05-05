import React, { useState, useEffect } from 'react';

interface AuthForm {
  username: string;
  email: string;
  phone: string;
  idCard: string;
  password: string;
  confirmPassword: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLogin: boolean;
  isLoading: boolean;
  onSubmit: (formData: AuthForm, isLogin: boolean) => void;
  onSwitchMode: () => void;
  onForgotPassword: () => void; // ✅ 新增：找回密码回调
  formErrors: Record<string, string>;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  isLogin,
  isLoading,
  onSubmit,
  onSwitchMode,
  onForgotPassword, // ✅ 新增
  formErrors
}) => {
  const [formData, setFormData] = useState<AuthForm>({
    username: '',
    email: '',
    phone: '',
    idCard: '',
    password: '',
    confirmPassword: ''
  });

  // 当弹窗打开或登录模式改变时，清空表单
  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: '',
        email: '',
        phone: '',
        idCard: '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [isOpen, isLogin]);

  const handleInputChange = (field: keyof AuthForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, isLogin);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? '登录' : '注册'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              disabled={isLoading}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 用户名输入框 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                用户名 *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
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
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
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
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
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

            {/* 身份证号输入框 - 仅注册时显示 */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  身份证号
                </label>
                <input
                  type="text"
                  value={formData.idCard}
                  onChange={(e) => handleInputChange('idCard', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.idCard ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入身份证号（可选）"
                  disabled={isLoading}
                  maxLength={18}
                />
                {formErrors.idCard && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.idCard}</p>
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
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
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
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>测试账号：</strong><br />
                  用户名：<code>testuser</code><br />
                  密码：<code>123456</code>
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

          {/* 底部链接区域 */}
          <div className="mt-4 space-y-2 text-center">
            {/* ✅ 新增：找回密码链接（仅登录模式显示） */}
            {isLogin && (
              <div>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                  disabled={isLoading}
                >
                  忘记密码？
                </button>
              </div>
            )}
            
            {/* 切换登录/注册模式 */}
            <div>
              <button
                onClick={onSwitchMode}
                className="text-blue-600 hover:text-blue-700 text-sm"
                disabled={isLoading}
              >
                {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;