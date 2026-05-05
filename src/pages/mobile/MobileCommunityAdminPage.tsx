// src/pages/mobile/MobileCommunityAdminPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Edit,
  AlertCircle,
  CheckCircle,
  X,
  Search,
  Shield,
  User
} from 'lucide-react';
import { useAuth } from '../../shared/hooks/useAuth';
import { communityAdminService, CommunityInfo } from '../../shared/services/communityAdminService';

// ========== 创建社区弹窗 ==========
const CreateCommunityModal: React.FC<{
  onClose: () => void;
  onCreate: (community: CommunityInfo) => void;
  user: any;
}> = ({ onClose, onCreate, user }) => {
  const [name, setName] = useState('');
  const [communityType, setCommunityType] = useState<'disease' | 'other'>('disease');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('请输入社区名称');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newCommunity = communityAdminService.createCommunity(name.trim(), user.id, communityType);
      // 设置社区类型
      newCommunity.type = communityType;
      onCreate(newCommunity);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl">
        <div className="p-4 border-b flex justify-between">
          <h2 className="text-lg font-semibold">创建新社区</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              社区名称
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：哮喘、痛风、帕金森"
              className="w-full p-3 border rounded-lg"
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              社区类型
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCommunityType('disease')}
                className={`flex-1 py-2 rounded-lg border ${
                  communityType === 'disease' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                🏥 专病社区
              </button>
              <button
                type="button"
                onClick={() => setCommunityType('other')}
                className={`flex-1 py-2 rounded-lg border ${
                  communityType === 'other' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                🌐 其他社区
              </button>
            </div>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? '创建中...' : '创建社区'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ========== 删除确认弹窗 ==========
const DeleteConfirmModal: React.FC<{
  community: CommunityInfo;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ community, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">确认删除</h3>
            <p className="text-sm text-gray-500">此操作不可恢复</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">
          确定要删除 <span className="font-semibold">{community.name}</span> 社区吗？
        </p>
        
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
          ⚠️ 删除后，该社区的所有公告、帖子、讲座和发展建议都将永久删除。
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== 社区管理页面 ==========
const MobileCommunityAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [communities, setCommunities] = useState<CommunityInfo[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CommunityInfo | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showSystem, setShowSystem] = useState(false);

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = () => {
    const all = communityAdminService.getAllCommunities();
    setCommunities(all);
  };

  const handleCreate = (newCommunity: CommunityInfo) => {
    loadCommunities();
  };

  const handleDelete = (community: CommunityInfo) => {
    try {
      communityAdminService.deleteCommunity(community.id, user?.id || '');
      loadCommunities();
      setDeleteTarget(null);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const filteredCommunities = communities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         c.id.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesSystem = showSystem ? true : !communityAdminService['DEFAULT_COMMUNITIES'].some(d => d.id === c.id);
    return matchesSearch && matchesSystem;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center p-4">
          <button onClick={() => navigate('/mobile/community')} className="text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">社区管理</h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="text-blue-600"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索社区..."
            className="w-full pl-10 pr-4 py-3 border rounded-xl"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={showSystem}
              onChange={(e) => setShowSystem(e.target.checked)}
              className="w-4 h-4"
            />
            显示系统默认社区
          </label>
          <span className="text-sm text-gray-400">
            共 {filteredCommunities.length} 个社区
          </span>
        </div>
      </div>

      {/* 社区列表 */}
      <div className="p-4 space-y-2">
        {filteredCommunities.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">暂无社区</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              创建第一个社区
            </button>
          </div>
        ) : (
          filteredCommunities.map(community => {
            const isSystem = communityAdminService['DEFAULT_COMMUNITIES'].some(d => d.id === community.id);
            
            return (
              <div
                key={community.id}
                className={`bg-white rounded-xl p-4 shadow-sm ${
                  !community.isActive ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl`}>
                      {community.icon || '🏥'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{community.name}</h3>
                        {isSystem && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">
                            系统
                          </span>
                        )}
                        {!community.isActive && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            已删除
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ID: {community.id} · 创建于 {new Date(community.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {!isSystem && community.isActive && (
                    <button
                      onClick={() => setDeleteTarget(community)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 创建社区弹窗 */}
      {showCreateModal && (
        <CreateCommunityModal
          user={user}
          onCreate={handleCreate}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* 删除确认弹窗 */}
      {deleteTarget && (
        <DeleteConfirmModal
          community={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default MobileCommunityAdminPage;
