// src/pages/mobile/admin/UserManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search,
  User,
  Mail,
  Calendar,
  Shield,
  Ban,
  AlertTriangle,
  Check,
  X,
  Eye,
  MoreVertical,
  Filter,
  UserCog,
  Lock,
  Unlock,
  Star
} from 'lucide-react';

import { adminService } from '../../../shared/services/admin/adminService';
import { User as UserType } from '../../../contexts/AuthContext';

interface ExtendedUser extends UserType {
  createdAt?: string;
  lastActive?: string;
  status?: 'active' | 'banned' | 'inactive';
  banReason?: string;
}

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();
    const getCurrentUser = () => {
    const userStr = localStorage.getItem('current-user');
    return userStr ? JSON.parse(userStr) : null;
  };
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';
  const adminInfo = isAdmin ? { userId: currentUser?.id, role: currentUser?.role } : null;
  const hasPermission = () => isAdmin;
  const loading = false;
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUser[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState<'permanent' | '7days' | '30days'>('7days');

useEffect(() => {
  console.log('🔄 useEffect 执行, isAdmin =', isAdmin);
  if (!isAdmin) {
    console.log('⛔ 不是管理员，准备跳转');
    navigate('/mobile/profile');
    return;
  }
  console.log('✅ 加载用户数据');
  loadUsers();
}, [isAdmin, navigate]);

  const loadUsers = () => {
    // 从 localStorage 获取注册用户
    const registeredUsers = JSON.parse(localStorage.getItem('medical-registered-users') || '[]');
    
    // 增强用户数据，添加模拟的注册时间和状态
    const enhancedUsers = registeredUsers.map((user: ExtendedUser) => ({
      ...user,
      createdAt: user.createdAt || new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: user.lastActive || new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: user.status || 'active'
    }));
    
    setUsers(enhancedUsers);
    applyFilters(enhancedUsers, searchKeyword, selectedRole, selectedStatus);
  };

  const applyFilters = (
    userList: ExtendedUser[],
    keyword: string,
    role: string,
    status: string
  ) => {
    let filtered = [...userList];

    if (keyword) {
      const term = keyword.toLowerCase();
      filtered = filtered.filter(u => 
        u.username?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.id?.toLowerCase().includes(term)
      );
    }

    if (role !== 'all') {
      filtered = filtered.filter(u => u.role === role);
    }

    if (status !== 'all') {
      filtered = filtered.filter(u => u.status === status);
    }

    setFilteredUsers(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    applyFilters(users, keyword, selectedRole, selectedStatus);
  };

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    applyFilters(users, searchKeyword, role, selectedStatus);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    applyFilters(users, searchKeyword, selectedRole, status);
  };

  const handleBanUser = () => {
    if (!selectedUser) return;

    // 更新用户状态
    const updatedUsers = users.map(u => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          status: 'banned',
          banReason: banReason,
          bannedAt: new Date().toISOString(),
          bannedBy: adminInfo?.userId,
          banExpiry: banDuration === '7days' 
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            : banDuration === '30days'
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : undefined
        };
      }
      return u;
    });

    // 更新 localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('medical-registered-users') || '[]');
    const updatedRegistered = registeredUsers.map((u: ExtendedUser) => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          status: 'banned'
        };
      }
      return u;
    });
    localStorage.setItem('medical-registered-users', JSON.stringify(updatedRegistered));

    setUsers(updatedUsers as ExtendedUser[]);
    applyFilters(updatedUsers as ExtendedUser[], searchKeyword, selectedRole, selectedStatus);
    
    // 记录审计日志
    adminService['logAudit'](adminInfo?.userId || '', 'ban_user', 'user', selectedUser.id, banReason);

    setShowBanModal(false);
    setShowDetail(false);
    setSelectedUser(null);
    setBanReason('');
  };

  const handleUnbanUser = (user: ExtendedUser) => {
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          status: 'active',
          banReason: undefined,
          bannedAt: undefined,
          bannedBy: undefined,
          banExpiry: undefined
        };
      }
      return u;
    });

    const registeredUsers = JSON.parse(localStorage.getItem('medical-registered-users') || '[]');
    const updatedRegistered = registeredUsers.map((u: ExtendedUser) => {
      if (u.id === user.id) {
        return {
          ...u,
          status: 'active'
        };
      }
      return u;
    });
    localStorage.setItem('medical-registered-users', JSON.stringify(updatedRegistered));

    setUsers(updatedUsers as ExtendedUser[]);
    applyFilters(updatedUsers as ExtendedUser[], searchKeyword, selectedRole, selectedStatus);
    
    adminService['logAudit'](adminInfo?.userId || '', 'unban_user', 'user', user.id, '解封用户');
    setShowDetail(false);
  };

  const handleChangeRole = (user: ExtendedUser, newRole: 'patient' | 'doctor' | 'admin') => {
    const updatedUsers = users.map(u => {
      if (u.id === user.id) {
        return { ...u, role: newRole };
      }
      return u;
    });

    const registeredUsers = JSON.parse(localStorage.getItem('medical-registered-users') || '[]');
    const updatedRegistered = registeredUsers.map((u: ExtendedUser) => {
      if (u.id === user.id) {
        return { ...u, role: newRole };
      }
      return u;
    });
    localStorage.setItem('medical-registered-users', JSON.stringify(updatedRegistered));

    // 如果是设为管理员，还要在管理员系统中创建记录
    if (newRole === 'admin') {
      // 检查是否已经是管理员
      const admins = adminService.getAllAdmins();
      if (!admins.some(a => a.userId === user.id)) {
        adminService.createAdmin(adminInfo?.userId || '', {
          userId: user.id,
          role: 'community',
          permissions: [
            { resource: 'content', actions: ['read', 'approve', 'reject'] },
            { resource: 'report', actions: ['read', 'process'] }
          ]
        });
      }
    }

    setUsers(updatedUsers as ExtendedUser[]);
    applyFilters(updatedUsers as ExtendedUser[], searchKeyword, selectedRole, selectedStatus);
    setShowDetail(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '未知';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin': return { bg: 'bg-red-100', text: 'text-red-700', label: '管理员' };
      case 'doctor': return { bg: 'bg-blue-100', text: 'text-blue-700', label: '医生' };
      default: return { bg: 'bg-green-100', text: 'text-green-700', label: '患者' };
    }
  };

  const getStatusBadge = (status?: string) => {
    switch(status) {
      case 'banned': return { bg: 'bg-gray-100', text: 'text-gray-600', label: '已封禁' };
      case 'inactive': return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '未激活' };
      default: return { bg: 'bg-green-100', text: 'text-green-700', label: '正常' };
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center p-4">
          <button onClick={() => navigate('/mobile/profile')}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">用户管理</h1>
          <div className="w-5"></div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="p-4 grid grid-cols-4 gap-2">
        <div className="bg-white rounded-xl p-2 text-center">
          <div className="text-lg font-bold text-gray-900">{users.length}</div>
          <div className="text-xs text-gray-500">总用户</div>
        </div>
        <div className="bg-white rounded-xl p-2 text-center">
          <div className="text-lg font-bold text-blue-600">{users.filter(u => u.role === 'doctor').length}</div>
          <div className="text-xs text-gray-500">医生</div>
        </div>
        <div className="bg-white rounded-xl p-2 text-center">
          <div className="text-lg font-bold text-green-600">{users.filter(u => u.role === 'patient').length}</div>
          <div className="text-xs text-gray-500">患者</div>
        </div>
        <div className="bg-white rounded-xl p-2 text-center">
          <div className="text-lg font-bold text-red-600">{users.filter(u => u.role === 'admin').length}</div>
          <div className="text-xs text-gray-500">管理员</div>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="px-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearch}
            placeholder="搜索用户名、邮箱..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedRole}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="flex-1 p-2 border rounded-lg text-sm bg-white"
          >
            <option value="all">全部角色</option>
            <option value="admin">管理员</option>
            <option value="doctor">医生</option>
            <option value="patient">患者</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="flex-1 p-2 border rounded-lg text-sm bg-white"
          >
            <option value="all">全部状态</option>
            <option value="active">正常</option>
            <option value="banned">已封禁</option>
            <option value="inactive">未激活</option>
          </select>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="p-4 space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">暂无用户</p>
          </div>
        ) : (
          filteredUsers.map(user => {
            const roleBadge = getRoleBadge(user.role);
            const statusBadge = getStatusBadge(user.status);

            return (
              <div
                key={user.id}
                onClick={() => {
                  setSelectedUser(user);
                  setShowDetail(true);
                }}
                className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {user.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{user.username}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge.bg} ${roleBadge.text}`}>
                        {roleBadge.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-1">{user.email}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>注册: {formatDate(user.createdAt)}</span>
                      {user.status === 'banned' && user.banReason && (
                        <>
                          <Ban className="w-3 h-3 ml-2 text-red-400" />
                          <span className="text-red-400">{user.banReason}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 用户详情弹窗 */}
      {showDetail && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b sticky top-0 bg-white flex justify-between items-center">
              <h2 className="text-lg font-semibold">用户详情</h2>
              <button onClick={() => setShowDetail(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.username}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">用户ID</span>
                  <span className="text-gray-900 text-sm">{selectedUser.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">当前角色</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getRoleBadge(selectedUser.role).bg} ${getRoleBadge(selectedUser.role).text}`}>
                    {getRoleBadge(selectedUser.role).label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">当前状态</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(selectedUser.status).bg} ${getStatusBadge(selectedUser.status).text}`}>
                    {getStatusBadge(selectedUser.status).label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">注册时间</span>
                  <span className="text-gray-900">{formatDate(selectedUser.createdAt)}</span>
                </div>
                {selectedUser.lastActive && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">最后活跃</span>
                    <span className="text-gray-900">{formatDate(selectedUser.lastActive)}</span>
                  </div>
                )}
                {selectedUser.specialties && selectedUser.specialties.length > 0 && (
                  <div>
                    <span className="text-gray-500 block mb-1">专业领域</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedUser.specialties.map(s => (
                        <span key={s} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedUser.status === 'banned' && selectedUser.banReason && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-red-700 mb-1">
                      <Ban className="w-4 h-4" />
                      <span className="font-medium">封禁原因</span>
                    </div>
                    <p className="text-sm text-red-600">{selectedUser.banReason}</p>
                    {selectedUser.banExpiry && (
                      <p className="text-xs text-red-500 mt-1">
                        解封时间: {new Date(selectedUser.banExpiry).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 管理操作 */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">管理操作</h3>

                {/* 角色修改 */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-sm text-gray-500 block mb-2">修改角色</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleChangeRole(selectedUser, 'patient')}
                      disabled={selectedUser.role === 'patient'}
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        selectedUser.role === 'patient'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      患者
                    </button>
                    <button
                      onClick={() => handleChangeRole(selectedUser, 'doctor')}
                      disabled={selectedUser.role === 'doctor'}
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        selectedUser.role === 'doctor'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      医生
                    </button>
                    <button
                      onClick={() => handleChangeRole(selectedUser, 'admin')}
                      disabled={selectedUser.role === 'admin'}
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        selectedUser.role === 'admin'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      管理员
                    </button>
                  </div>
                </div>

                {/* 封禁/解封操作 */}
                {selectedUser.status === 'banned' ? (
                  <button
                    onClick={() => handleUnbanUser(selectedUser)}
                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    解封用户
                  </button>
                ) : (
                  <button
                    onClick={() => setShowBanModal(true)}
                    className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                  >
                    <Ban className="w-4 h-4" />
                    封禁用户
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 封禁弹窗 */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">封禁用户</h2>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  封禁时长
                </label>
                <select
                  value={banDuration}
                  onChange={(e) => setBanDuration(e.target.value as any)}
                  className="w-full p-3 border rounded-lg bg-white"
                >
                  <option value="7days">7天</option>
                  <option value="30days">30天</option>
                  <option value="permanent">永久封禁</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  封禁原因
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="请输入封禁原因..."
                  rows={3}
                  className="w-full p-3 border rounded-lg resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBanModal(false)}
                  className="flex-1 py-3 border rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleBanUser}
                  disabled={!banReason.trim()}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  确认封禁
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;

