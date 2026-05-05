import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Phone, Mail, Save } from 'lucide-react';

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 加载当前用户信息
    const userStr = localStorage.getItem('current-user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setFormData({
        username: user.username || '',
        phone: user.phone || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 更新 current-user
      const userStr = localStorage.getItem('current-user');
      const user = userStr ? JSON.parse(userStr) : {};
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('current-user', JSON.stringify(updatedUser));
      
      // 更新注册用户列表
      const users = JSON.parse(localStorage.getItem('medical-registered-users') || '[]');
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('medical-registered-users', JSON.stringify(updatedUsers));
      
      alert('个人信息已更新');
      navigate('/mobile/profile');
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center p-4">
          <button onClick={() => navigate('/mobile/profile')} className="text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">编辑资料</h1>
          <button onClick={handleSubmit} disabled={loading} className="text-blue-600">
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
            <User className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="flex-1 outline-none"
              placeholder="请输入姓名"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">手机号</label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="flex-1 outline-none"
              placeholder="请输入手机号"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="flex-1 outline-none"
              placeholder="请输入邮箱"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;
