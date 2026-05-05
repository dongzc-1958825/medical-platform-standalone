import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService';
import { User } from '../shared/types/user';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // 安全获取显示名称的辅助函数
  const getDisplayName = (user: User | null) => {
    if (!user) return '用户';
    
    if (user.name) return user.name;
    if (user.displayName) return user.displayName;
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    
    return '用户';
  };

  // 获取首字母
  const getInitial = (user: User | null) => {
    const name = getDisplayName(user);
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  // 初始化编辑状态
  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  // 处理编辑保存
  const handleSave = async () => {
    if (!editedUser) return;
    
    setSaveStatus('saving');
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus('success');
      setIsEditing(false);
      
      // 2秒后重置状态
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('保存用户信息失败:', error);
      setSaveStatus('error');
      
      // 3秒后重置错误状态
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: keyof User, value: string) => {
    if (!editedUser) return;
    
    setEditedUser({
      ...editedUser,
      [field]: value
    });
  };

  // 处理登出
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 如果没有用户登录，显示登录提示
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              个人中心
            </h1>
            <p className="text-gray-600 mb-6">
              请先登录以查看个人资料
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              前往登录
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* 头部信息 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold mr-4">
                {getInitial(user)}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {getDisplayName(user)}
                </h1>
                <p className="text-gray-600">
                  {user.email || '未设置邮箱'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg transition duration-300"
                  >
                    编辑资料
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg transition duration-300"
                  >
                    退出登录
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg transition duration-300 disabled:opacity-50"
                  >
                    {saveStatus === 'saving' ? '保存中...' : '保存修改'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUser({ ...user });
                      setSaveStatus('idle');
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 md:py-3 md:px-6 rounded-lg transition duration-300"
                  >
                    取消
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 保存状态提示 */}
          {saveStatus === 'success' && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
              个人信息保存成功！
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              保存失败，请稍后重试
            </div>
          )}
        </div>

        {/* 详细信息卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本信息卡片 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              基本信息
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  显示名称
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser?.name || editedUser?.displayName || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="请输入显示名称"
                  />
                ) : (
                  <p className="text-gray-800">
                    {user.name || user.displayName || '未设置'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  电子邮箱
                </label>
                <p className="text-gray-800">
                  {user.email || '未设置邮箱'}
                </p>
              </div>
              
              {user.medicalLicense && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    执业证书
                  </label>
                  <p className="text-gray-800">
                    {user.medicalLicense}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 专业信息卡片 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              专业信息
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  身份类型
                </label>
                <div className="flex items-center">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.isDoctor 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.isDoctor ? '医生' : '普通用户'}
                  </div>
                </div>
              </div>
              
              {user.specialty && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    专业领域
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={user.specialty}
                      onChange={(e) => handleInputChange('specialty', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="请输入专业领域"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {user.specialty}
                    </p>
                  )}
                </div>
              )}
              
              {user.bio && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    个人简介
                  </label>
                  {isEditing ? (
                    <textarea
                      value={user.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      rows={3}
                      placeholder="请输入个人简介"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {user.bio}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 统计信息卡片 */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              我的贡献
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
                <div className="text-sm text-gray-600">发布的医案</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-1">47</div>
                <div className="text-sm text-gray-600">参与讨论</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-1">8</div>
                <div className="text-sm text-gray-600">收藏的医案</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-3xl font-bold text-yellow-600 mb-1">23</div>
                <div className="text-sm text-gray-600">获得的赞</div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作区域 */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">账户设置</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/settings/privacy')}
              className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">隐私设置</div>
                  <div className="text-sm text-gray-600">管理您的隐私和数据设置</div>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/settings/notifications')}
              className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">通知设置</div>
                  <div className="text-sm text-gray-600">管理邮件和推送通知</div>
                </div>
                <div className="text-gray-400">›</div>
              </div>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full text-left p-4 hover:bg-red-50 text-red-600 rounded-lg transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">退出登录</div>
                  <div className="text-sm">安全退出当前账户</div>
                </div>
                <div className="text-red-400">›</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
