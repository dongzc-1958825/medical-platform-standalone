import React, { useState } from 'react';
// import { ForgotPasswordData } from '../../types'; // 移除这行，因为类型不存在
import { resetPassword } from '../../utils/userService';

// 定义本地类型（修复错误1和2）
interface ForgotPasswordData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

interface ForgotPasswordModalProps {
  onClose: () => void;
  onSuccess: (message: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose, onSuccess }) => {
  // 修正拼写错误：ForggotPasswordData → ForgotPasswordData
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = resetPassword(formData);
      if (result.success) {
        onSuccess(result.message);
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('重置密码失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 修复错误3：为prev参数添加类型
  const handleChange = (field: keyof ForgotPasswordData, value: string) => {
    setFormData((prev: ForgotPasswordData) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">重置密码</h3>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                注册邮箱
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入注册时使用的邮箱"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                新密码
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入新密码"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                确认新密码
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="请再次输入新密码"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? '处理中...' : '重置密码'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
