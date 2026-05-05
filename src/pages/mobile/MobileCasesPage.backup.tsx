// src/pages/mobile/MobileCasesPage.tsx - 完整UI版本
import React, { useState } from 'react';
import MobileLayout from '../../components/MobileLayout';

// 模拟数据
const initialCases = [
  {
    id: 1,
    title: '糖尿病患者长期管理成功案例',
    department: '内分泌科',
    doctor: '张华主任医师',
    date: '2025-12-05',
    views: 245,
    comments: 18,
    isBookmarked: true,
    excerpt: '通过个性化饮食和运动方案，患者血糖控制稳定，HbA1c从9.2%降至6.8%...'
  },
  {
    id: 2,
    title: '高血压合并冠心病综合治疗方案',
    department: '心血管科',
    doctor: '李明副主任医师',
    date: '2025-12-04',
    views: 189,
    comments: 12,
    isBookmarked: false,
    excerpt: '结合药物治疗与生活方式干预，血压达标率提升至92%，心绞痛发作减少80%...'
  },
  {
    id: 3,
    title: '儿童哮喘急性发作的院前处理',
    department: '儿科',
    doctor: '王芳主治医师',
    date: '2025-12-03',
    views: 156,
    comments: 8,
    isBookmarked: true,
    excerpt: '快速识别哮喘发作征兆，及时使用雾化吸入治疗，有效避免急诊入院...'
  },
  {
    id: 4,
    title: '腰椎间盘突出症的康复训练方案',
    department: '康复科',
    doctor: '赵伟治疗师',
    date: '2025-12-02',
    views: 312,
    comments: 24,
    isBookmarked: false,
    excerpt: '核心肌群训练结合物理治疗，有效缓解疼痛，改善日常生活功能...'
  }
];

const MobileCasesPage: React.FC = () => {
  const [cases, setCases] = useState(initialCases);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('全部');

  // 处理收藏切换
  const handleBookmarkToggle = (id: number) => {
    setCases(cases.map(caseItem => 
      caseItem.id === id 
        ? { ...caseItem, isBookmarked: !caseItem.isBookmarked }
        : caseItem
    ));
  };

  // 过滤病例
  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = searchQuery === '' || 
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === '全部' || 
      caseItem.department === activeFilter ||
      (activeFilter === '热门' && caseItem.views > 200) ||
      (activeFilter === '最新' && caseItem.id >= 3);
    
    return matchesSearch && matchesFilter;
  });

  const filters = ['全部', '内分泌科', '心血管科', '儿科', '康复科', '热门', '最新'];

  return (
    <MobileLayout title="医案分享" showBack={false}>
      <div className="pb-24">
        {/* 搜索栏 */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索医案、疾病或科室..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 筛选标签 - 横向滚动 */}
        <div className="sticky top-[60px] z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex space-x-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* 医案卡片列表 */}
        <div className="p-4">
          {filteredCases.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📝</div>
              <p className="text-gray-500">未找到匹配的医案</p>
              <p className="text-gray-400 text-sm mt-2">尝试其他搜索词或筛选条件</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCases.map((caseItem) => (
                <div 
                  key={caseItem.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden active:scale-[0.99] transition-transform"
                >
                  {/* 卡片头部 */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-2">
                        <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2">
                          {caseItem.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                            {caseItem.department}
                          </span>
                          <span className="text-gray-500 text-xs">
                            👨‍⚕️ {caseItem.doctor}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleBookmarkToggle(caseItem.id)}
                        className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg"
                        aria-label={caseItem.isBookmarked ? "取消收藏" : "收藏"}
                      >
                        <span className={`text-xl ${caseItem.isBookmarked ? 'text-red-500' : 'text-gray-300'}`}>
                          {caseItem.isBookmarked ? '❤️' : '🤍'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 卡片内容 */}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {caseItem.excerpt}
                    </p>
                    
                    {/* 数据统计和操作 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-gray-500 text-xs">
                        <span className="flex items-center">
                          <span className="mr-1">👁️</span>
                          {caseItem.views}
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">💬</span>
                          {caseItem.comments}
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">📅</span>
                          {caseItem.date}
                        </span>
                      </div>
                      <button 
                        className="text-blue-600 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50 active:bg-blue-100"
                        onClick={() => console.log('查看详情:', caseItem.id)}
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 统计信息 */}
        {filteredCases.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-gray-600 text-sm text-center">
              共找到 {filteredCases.length} 个医案
              {searchQuery && ` · 搜索: "${searchQuery}"`}
              {activeFilter !== '全部' && ` · 筛选: ${activeFilter}`}
            </p>
          </div>
        )}

        {/* 浮动操作按钮 - 快速创建医案 */}
        <button 
          className="fixed bottom-20 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all"
          onClick={() => console.log('创建新医案')}
          aria-label="创建新医案"
        >
          <span className="text-xl">➕</span>
        </button>
      </div>
    </MobileLayout>
  );
};

export default MobileCasesPage;