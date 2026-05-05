import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Key, Trash2, AlertTriangle, LogOut } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== '确认删除') {
      alert('请输入"确认删除"以确认删除账户');
      return;
    }
    
    const userStr = localStorage.getItem('current-user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    if (user) {
      // 从注册用户列表中删除
      const users = JSON.parse(localStorage.getItem('medical-registered-users') || '[]');
      const filteredUsers = users.filter(u => u.id !== user.id);
      localStorage.setItem('medical-registered-users', JSON.stringify(filteredUsers));
      
      // 清除登录状态
      localStorage.removeItem('current-user');
      
      alert('账户已删除');
      window.location.href = '/medical-platform/#/login';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('current-user');
    window.location.href = '/medical-platform/#/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center p-4">
          <button onClick={() => navigate('/mobile/profile')} className="text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">账户设置</h1>
          <div className="w-5"></div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* 修改密码（暂时禁用，后续可扩展） */}
        <div className="bg-white rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-gray-500" />
            <span className="text-gray-800">修改密码</span>
          </div>
          <span className="text-xs text-gray-400">暂未开放</span>
        </div>

        {/* 退出登录 */}
        <button
          onClick={handleLogout}
          className="w-full bg-white rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
        >
          <LogOut className="w-5 h-5 text-orange-500" />
          <span className="text-orange-600">退出登录</span>
        </button>

        {/* 删除账户 */}
        <div className="bg-white rounded-xl overflow-hidden">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full p-4 flex items-center gap-3 hover:bg-red-50 transition-colors text-left"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
            <span className="text-red-600">删除账户</span>
          </button>
        </div>
      </div>

      {/* 删除账户确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">删除账户</h3>
                <p className="text-sm text-gray-500">此操作不可恢复</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">
              删除账户后，您的所有个人数据将被永久删除，无法恢复。
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                请输入 <span className="text-red-600 font-bold">"确认删除"</span> 以确认
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="输入：确认删除"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 border rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
