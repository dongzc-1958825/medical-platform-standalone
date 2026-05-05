// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onCancel: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',  // 使用 username 字段
    phone: '',
    password: '',
    gender: 'male' as 'male' | 'female',
    age: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 创建用户对象，确保字段匹配
    const user: User = {
      id: Date.now().toString(),
      name: formData.username || formData.phone, // 使用 username 或 phone 作为 name
      username: formData.username, // 保留 username 字段
      email: `${formData.phone}@example.com`, // 临时邮箱
      password: formData.password,
      joinTime: new Date().toISOString(),
      medicalCases: 0,
      consultations: 0,
      role: 'user',
      isActive: true,
      phone: formData.phone,
      gender: formData.gender,
      age: parseInt(formData.age) || 0
    };
    
    onLogin(user);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-6">
          {isLogin ? '登录' : '注册'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                用户名
              </label>
              <input
                type="text"
                required={!isLogin}
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="请输入用户名"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              手机号
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="请输入手机号"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="请输入密码"
            />
          </div>
          
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  性别
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value as 'male' | 'female'})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  年龄
                </label>
                <input
                  type="number"
                  required={!isLogin}
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="请输入年龄"
                />
              </div>
            </>
          )}
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isLogin ? '登录' : '注册'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:text-blue-600 text-sm"
          >
            {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;