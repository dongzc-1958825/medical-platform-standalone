import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth';
import { useResponsive } from '../shared/hooks/useResponsive';
import { Search, Plus, Eye, Heart, Share2, Building, User, Calendar, MapPin } from 'lucide-react';

// 模拟数据 - 医案列表
const mockCases = [
  {
    id: '1',
    title: '高血压合并糖尿病治疗案例',
    author: '张医生',
    department: '心血管内科',
    hospital: '北京协和医院',
    createdAt: '2024-01-05',
    viewCount: 1250,
    favoriteCount: 89,
    isCollected: false,
    symptoms: ['头晕', '多饮多尿', '视力模糊'],
    tags: ['高血压', '糖尿病', '心血管']
  },
  {
    id: '2',
    title: '儿童哮喘长期管理案例',
    author: '李医生',
    department: '儿科',
    hospital: '上海儿童医学中心',
    createdAt: '2024-01-04',
    viewCount: 980,
    favoriteCount: 65,
    isCollected: true,
    symptoms: ['喘息', '咳嗽', '胸闷'],
    tags: ['哮喘', '儿科', '呼吸科']
  }
];

// 模拟症状标签
const symptomTags = [
  '发热', '咳嗽', '头痛', '头晕', '心悸', '胸闷', '腹痛', '腹泻',
  '便秘', '失眠', '焦虑', '抑郁', '关节痛', '腰痛', '皮肤瘙痒'
];

// 模拟疾病分类
const diseaseCategories = [
  '心血管', '呼吸科', '消化科', '神经科', '儿科', '妇科', '骨科', '皮肤科'
];

const CasesPage: React.FC = () => {
  const { isMobile } = useResponsive();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [cases, setCases] = useState(mockCases);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [loading, setLoading] = useState(false);

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setCases(mockCases);
      return;
    }
    
    const filtered = mockCases.filter(caseItem =>
      caseItem.title.toLowerCase().includes(query.toLowerCase()) ||
      caseItem.department.toLowerCase().includes(query.toLowerCase()) ||
      caseItem.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setCases(filtered);
  };

  // 处理医案点击
  const handleCaseClick = (caseId: string) => {
    navigate(`/cases/${caseId}`);
  };

  // 处理收藏
  const handleFavorite = (caseId: string) => {
    setCases(cases.map(c => 
      c.id === caseId ? { ...c, isCollected: !c.isCollected } : c
    ));
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'p-4' : 'p-8'}`}>
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            医案分享
          </h1>
          <p className="text-gray-600">
            浏览和分享真实医疗案例，共同学习进步
          </p>
        </div>

        {/* 搜索和筛选栏 */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索医案、症状、科室..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* 医案列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map(caseItem => (
            <div
              key={caseItem.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleCaseClick(caseItem.id)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {caseItem.department}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite(caseItem.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Heart
                      size={18}
                      className={caseItem.isCollected ? 'fill-red-400 text-red-400' : 'text-gray-400'}
                    />
                  </button>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">
                  {caseItem.title}
                </h3>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Building size={14} className="mr-1" />
                  <span>{caseItem.hospital}</span>
                  <User size={14} className="ml-3 mr-1" />
                  <span>{caseItem.author}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {caseItem.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye size={14} className="mr-1" />
                    <span>{caseItem.viewCount}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart size={14} className="mr-1" />
                    <span>{caseItem.favoriteCount}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>{caseItem.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 没有医案时的提示 */}
        {cases.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">暂无医案</h3>
            <p className="text-gray-600">尝试调整搜索关键词或筛选条件</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CasesPage;