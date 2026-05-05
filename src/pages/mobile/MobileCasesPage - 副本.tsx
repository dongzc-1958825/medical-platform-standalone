// src/pages/mobile/MobileCasesPage.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  MoreVertical,
  ChevronRight,
  Search,
  X,
  User,
  Clock,
  FileText,
  Image,
  Award,
  Stethoscope
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

  // 加载医案数据
  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = () => {
    try {
      setIsLoading(true);
      // ✅ 修改：使用 medical_cases（下划线）键名
      const savedCases = localStorage.getItem('medical_cases');
      
      if (savedCases) {
        const parsedCases = JSON.parse(savedCases);
        console.log('📊 加载医案数据:', parsedCases.length);
        
        // 确保每个医案都有必要的计数属性
        const enhancedCases = parsedCases.map((c: MedicalCase) => ({
          ...c,
          likeCount: c.likeCount || Math.floor(Math.random() * 20) + 1,
          commentCount: c.commentCount || Math.floor(Math.random() * 10),
          isLiked: c.isLiked || false
        }));
        
        setCases(enhancedCases);
      } else {
        // 如果没有数据，使用示例数据
        console.log('📊 没有数据，使用示例');
        const sampleCases: MedicalCase[] = [
          {
            id: '1',
            title: '感冒病例分析',
            patientName: '张先生',
            diagnosis: '上呼吸道感染',
            symptoms: ['头痛', '发热', '咳嗽'],
            createdAt: '2025-11-08',
            tags: ['感冒', '呼吸道'],
            description: '患者因发热、头痛、咳嗽前来就诊，体温38.5℃，咽部充血，双肺呼吸音清。',
            treatment: '对症治疗：布洛芬退热，复方甘草口服液止咳，建议多饮水休息',
            outcome: '3天后复诊，体温正常，咳嗽明显减轻',
            likeCount: 12,
            commentCount: 5,
            isLiked: false,
            isFavorite: false
          },
          {
            id: '2', 
            title: '高血压管理病例',
            patientName: '李女士',
            diagnosis: '原发性高血压',
            symptoms: ['头晕', '心悸', '耳鸣'],
            createdAt: '2025-11-07',
            tags: ['慢性病', '心血管'],
            description: '患者高血压病史5年，近期因工作压力大出现头晕、心悸，血压测量160/95mmHg。',
            treatment: '药物治疗：氨氯地平5mg每日一次，生活方式干预：低盐饮食、规律运动',
            outcome: '2周后血压降至135/85mmHg，症状明显改善',
            likeCount: 24,
            commentCount: 8,
            isLiked: true,
            isFavorite: true
          },
          {
            id: '3',
            title: '糖尿病足部护理',
            patientName: '王先生',
            diagnosis: 'II型糖尿病伴足部溃疡',
            symptoms: ['足部麻木', '伤口不愈', '疼痛'],
            createdAt: '2025-11-05',
            tags: ['糖尿病', '伤口护理', '慢性病'],
            description: '糖尿病患者，右足底部出现溃疡2周，经自行处理未见好转，伴有周围神经病变症状。',
            treatment: '血糖控制：胰岛素调整；伤口护理：清创、抗生素软膏、专用敷料；教育：足部日常检查',
            outcome: '4周后溃疡愈合，患者掌握自我护理方法',
            likeCount: 8,
            commentCount: 3,
            isLiked: false,
            isFavorite: false
          }
        ];
        setCases(sampleCases);
        // ✅ 保存示例数据也使用 medical_cases
        localStorage.setItem('medical_cases', JSON.stringify(sampleCases));
      }
    } catch (error) {
      console.error('加载医案数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 搜索和筛选逻辑
  const filteredCases = useMemo(() => {
    let result = cases;

    // 应用筛选
    if (selectedFilter === 'recent') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      result = result.filter(c => new Date(c.createdAt) >= oneWeekAgo);
    } else if (selectedFilter === 'favorites') {
      result = result.filter(c => c.isFavorite);
    }

    // 应用搜索
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(term) ||
        c.patientName.toLowerCase().includes(term) ||
        c.diagnosis.toLowerCase().includes(term) ||
        c.symptoms.some(s => s.toLowerCase().includes(term)) ||
        c.tags.some(t => t.toLowerCase().includes(term)) ||
        c.description?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [cases, searchTerm, selectedFilter]);

  // 处理点赞
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

    // 更新 localStorage
    setTimeout(() => {
      localStorage.setItem('medical_cases', JSON.stringify(cases));
    }, 0);
  };

  // 处理删除
  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个医案吗？')) {
      const updatedCases = cases.filter(c => c.id !== id);
      setCases(updatedCases);
      // ✅ 使用 medical_cases
      localStorage.setItem('medical_cases', JSON.stringify(updatedCases));
    }
  };

  // 处理收藏状态变化
  const handleFavoriteToggle = (id: string, collected: boolean) => {
    setCases(prev => prev.map(c => 
      c.id === id ? { ...c, isFavorite: collected } : c
    ));
    
    // 更新 localStorage
    const updatedCases = cases.map(c => 
      c.id === id ? { ...c, isFavorite: collected } : c
    );
    // ✅ 使用 medical_cases
    localStorage.setItem('medical_cases', JSON.stringify(updatedCases));
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              发布
            </button>
          </div>
        </div>

        {/* 搜索栏 - 条件显示 */}
        {showSearch && (
          <div className="px-4 pb-3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索医案标题、症状、诊断..."
                className="w-full pl-10 pr-10 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 筛选标签 */}
        <div className="px-4 pb-3 flex space-x-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setSelectedFilter('recent')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedFilter === 'recent'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            最近一周
          </button>
          <button
            onClick={() => setSelectedFilter('favorites')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedFilter === 'favorites'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            我的收藏
          </button>
        </div>

        {/* 统计信息 */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            共 <span className="font-medium text-gray-900">{filteredCases.length}</span> 个医案
          </span>
          {searchTerm && (
            <span className="text-sm text-gray-500">
              搜索: "{searchTerm}"
            </span>
          )}
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
            <p className="text-gray-500 mb-2">暂无医案</p>
            <p className="text-sm text-gray-400">
              {searchTerm ? '换个搜索关键词试试' : '点击"发布"按钮分享您的第一个医案'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* 卡片头部 */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 
                        onClick={() => navigate(`/mobile/cases/${caseItem.id}`)}
                        className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer mb-1"
                      >
                        {caseItem.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{caseItem.patientName}</span>
                        <Clock className="w-3 h-3 ml-1" />
                        <span>{formatDate(caseItem.createdAt)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(caseItem.id)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* 卡片内容 */}
                <div className="p-4">
                  {/* 诊断 */}
                  <div className="mb-3">
                    <span className="text-xs text-gray-500 block mb-1">诊断</span>
                    <span className="text-sm font-medium text-gray-900 bg-blue-50 px-2 py-1 rounded">
                      {caseItem.diagnosis}
                    </span>
                  </div>

                  {/* 症状标签 */}
                  {caseItem.symptoms.length > 0 && (
                    <div className="mb-3">
                      <span className="text-xs text-gray-500 block mb-1">症状</span>
                      <div className="flex flex-wrap gap-1">
                        {caseItem.symptoms.map((symptom, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs"
                          >
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 描述摘要 */}
                  {caseItem.description && (
                    <div className="mb-3">
                      <span className="text-xs text-gray-500 block mb-1">描述</span>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {caseItem.description}
                      </p>
                    </div>
                  )}

                  {/* 治疗方案和效果 */}
                  {(caseItem.treatment || caseItem.outcome) && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      {caseItem.treatment && (
                        <div className="mb-2 last:mb-0">
                          <span className="text-xs text-gray-500 block mb-1">治疗方案</span>
                          <p className="text-sm text-gray-700">{caseItem.treatment}</p>
                        </div>
                      )}
                      {caseItem.outcome && (
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">治疗效果</span>
                          <p className="text-sm text-gray-700">{caseItem.outcome}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 标签 */}
                  {caseItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {caseItem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 图片预览 */}
                  {caseItem.imageUrls && caseItem.imageUrls.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-1 mb-1">
                        <Image className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{caseItem.imageUrls.length}张图片</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {caseItem.imageUrls.slice(0, 3).map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt=""
                            className="w-full h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 互动按钮 */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(caseItem.id)}
                        className="flex items-center space-x-1"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            caseItem.isLiked
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400 hover:text-red-500'
                          } transition-colors`}
                        />
                        <span className="text-sm text-gray-600">{caseItem.likeCount || 0}</span>
                      </button>
                      <button
                        onClick={() => navigate(`/mobile/cases/${caseItem.id}#comments`)}
                        className="flex items-center space-x-1"
                      >
                        <MessageCircle className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
                        <span className="text-sm text-gray-600">{caseItem.commentCount || 0}</span>
                      </button>
                    </div>
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
    </div>
  );
};

export default MobileCasesPage;