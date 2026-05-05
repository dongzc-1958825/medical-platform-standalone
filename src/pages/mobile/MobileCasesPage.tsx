// src/pages/mobile/MobileCasesPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Search,
  X,
  User,
  Clock,
  Image,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../shared/hooks/useAuth';
import CollectButton from '../../components/collection/CollectButton';

interface MedicalCase {
  id: string;
  title: string;
  patientName: string;
  diagnosis: string;
  symptoms: string[];
  createdAt: string;
  tags: string[];
  description?: string;
  treatment?: string;
  outcome?: string;
  imageUrls?: string[];
  isFavorite?: boolean;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
  author?: string;
  authorId?: string;
}

const MobileCasesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'favorites'>('all');
  const [showSearch, setShowSearch] = useState(false);
  
  // 删除确认弹窗状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingCaseId, setDeletingCaseId] = useState<string | null>(null);
  const [deletingCaseTitle, setDeletingCaseTitle] = useState('');

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = () => {
    try {
      setIsLoading(true);
      const savedCases = localStorage.getItem('medical_cases');
      
      if (savedCases) {
        const parsedCases = JSON.parse(savedCases);
        const enhancedCases = parsedCases.map((c: MedicalCase) => ({
          ...c,
          likeCount: c.likeCount || 0,
          commentCount: c.commentCount || 0,
          isLiked: c.isLiked || false
        }));
        setCases(enhancedCases);
      } else {
        // 示例数据
        const sampleCases: MedicalCase[] = [
          {
            id: '1',
            title: '感冒病例分析',
            patientName: '张先生',
            diagnosis: '上呼吸道感染',
            symptoms: ['头痛', '发热', '咳嗽'],
            createdAt: new Date().toISOString(),
            tags: ['感冒', '呼吸道'],
            description: '患者因发热、头痛、咳嗽前来就诊',
            treatment: '布洛芬退热，复方甘草口服液止咳',
            outcome: '3天后复诊，体温正常',
            likeCount: 12,
            commentCount: 5,
            isLiked: false,
            isFavorite: false
          }
        ];
        setCases(sampleCases);
        localStorage.setItem('medical_cases', JSON.stringify(sampleCases));
      }
    } catch (error) {
      console.error('加载医案数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCases = useMemo(() => {
    let result = cases;
    if (selectedFilter === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      result = result.filter(c => new Date(c.createdAt) >= oneWeekAgo);
    } else if (selectedFilter === 'favorites') {
      result = result.filter(c => c.isFavorite);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(term) ||
        c.diagnosis.toLowerCase().includes(term) ||
        c.symptoms.some(s => s.toLowerCase().includes(term))
      );
    }
    return result;
  }, [cases, searchTerm, selectedFilter]);

  const handleLike = (id: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === id) {
        const newLiked = !c.isLiked;
        return {
          ...c,
          isLiked: newLiked,
          likeCount: (c.likeCount || 0) + (newLiked ? 1 : -1)
        };
      }
      return c;
    }));
  };

    const handleDeleteClick = (id: string, title: string) => {
    // 获取当前用户和医案信息
    const userStr = localStorage.getItem('current-user');
    const user = userStr ? JSON.parse(userStr) : null;
    const caseItem = cases.find(c => c.id === id);
    
    // 只有作者或超级管理员可以删除
    const isAuthor = user?.id === caseItem?.authorId;
    const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
    
    if (!isAuthor && !isAdmin) {
      alert('您没有权限删除此医案');
      return;
    }
    
    setDeletingCaseId(id);
    setDeletingCaseTitle(title);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deletingCaseId) {
      const updatedCases = cases.filter(c => c.id !== deletingCaseId);
      setCases(updatedCases);
      localStorage.setItem('medical_cases', JSON.stringify(updatedCases));
    }
    setShowDeleteConfirm(false);
    setDeletingCaseId(null);
    setDeletingCaseTitle('');
  };

  const handleFavoriteToggle = (id: string, collected: boolean) => {
    setCases(prev => prev.map(c => 
      c.id === id ? { ...c, isFavorite: collected } : c
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays <= 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">医案分享</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigate('/mobile/cases/create')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              发布
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="px-4 pb-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索医案..."
                className="w-full pl-10 pr-10 py-2 bg-gray-100 border-0 rounded-lg text-sm"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 筛选标签 */}
        <div className="px-4 pb-3 flex space-x-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              selectedFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setSelectedFilter('recent')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              selectedFilter === 'recent' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            最近一周
          </button>
          <button
            onClick={() => setSelectedFilter('favorites')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              selectedFilter === 'favorites' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            我的收藏
          </button>
        </div>

        <div className="px-4 pb-3">
          <span className="text-sm text-gray-500">共 {filteredCases.length} 个医案</span>
        </div>
      </div>

      {/* 医案列表 */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">暂无医案</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCases.map((caseItem) => (
              <div key={caseItem.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 
                      onClick={() => navigate(`/mobile/cases/${caseItem.id}`)}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                    >
                      {caseItem.title}
                    </h3>
                    <button
                      onClick={() => handleDeleteClick(caseItem.id, caseItem.title)}
                      className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <User className="w-3 h-3" />
                    <span>{caseItem.patientName}</span>
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(caseItem.createdAt)}</span>
                  </div>

                  <div className="mb-2">
                    <span className="text-xs text-gray-500">诊断：</span>
                    <span className="text-sm font-medium text-gray-900">{caseItem.diagnosis}</span>
                  </div>

                  {caseItem.symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {caseItem.symptoms.map((symptom, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(caseItem.id)}
                      className="flex items-center gap-1"
                    >
                      <Heart
                        className={`w-4 h-4 ${caseItem.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                      <span className="text-xs text-gray-600">{caseItem.likeCount || 0}</span>
                    </button>
                    <CollectButton
                      itemId={caseItem.id}
                      itemType="case"
                      itemData={{
                        title: caseItem.title,
                        description: caseItem.description || caseItem.diagnosis,
                        date: caseItem.createdAt
                      }}
                      initialCollected={caseItem.isFavorite || false}
                      onToggle={(collected) => handleFavoriteToggle(caseItem.id, collected)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold mb-2">确认删除</h3>
            <p className="text-gray-600 mb-6">
              确定要删除医案「{deletingCaseTitle}」吗？删除后无法恢复。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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

export default MobileCasesPage;
