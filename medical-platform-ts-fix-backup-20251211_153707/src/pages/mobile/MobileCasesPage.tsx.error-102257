// src/pages/mobile/MobileCasesPage.tsx
import React from 'react';
import MobileLayout from '../../components/MobileLayout';
import { Bookmark, MessageSquare, Eye, Calendar, User } from 'lucide-react';

// 模拟数据 - 稍后可以替换为API调用
const mockCases = [
  {
    id: 1,
    title: '糖尿病患者长期管理成功案例',
    department: '内分泌科',
    doctor: '张华主任医师',
    date: '2025-12-05',
    views: 245,
    comments: 18,
    isBookmarked: true,
    excerpt: '通过个性化饮食和运动方案，患者血糖控制稳定...'
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
    excerpt: '结合药物治疗与生活方式干预，血压达标率提升至92%...'
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
    excerpt: '快速识别哮喘发作征兆，及时使用雾化吸入治疗...'
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
    excerpt: '核心肌群训练结合物理治疗，有效缓解疼痛改善功能...'
  }
];

const MobileCasesPage: React.FC = () => {
  return (
    <MobileLayout title="医案分享" showBack={false}>
      <div className="pb-20"> {/* 为底部导航留出空间 */}
        
        {/* 搜索栏 */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索医案、疾病或科室..."
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 筛选标签 */}
        <div className="px-4 py-3 bg-white border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {['全部', '内分泌科', '心血管科', '儿科', '康复科', '热门', '最新'].map((tag) => (
              <button
                key={tag}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  tag === '全部' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 医案卡片列表 */}
        <div className="space-y-4 p-4">
          {mockCases.map((caseItem) => (
            <div 
              key={caseItem.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* 卡片头部 */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-2">
                      {caseItem.title}
                    </h3>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                        {caseItem.department}
                      </span>
                      <span className="flex items-center text-gray-500 text-sm">
                        <User className="w-4 h-4 mr-1" />
                        {caseItem.doctor}
                      </span>
                    </div>
                  </div>
                  <button className="ml-2">
                    <Bookmark 
                      className={`w-6 h-6 ${caseItem.isBookmarked ? 'fill-blue-600 text-blue-600' : 'text-gray-400'}`}
                    />
                  </button>
                </div>
              </div>

              {/* 卡片内容 */}
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {caseItem.excerpt}
                </p>
                
                {/* 数据统计 */}
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {caseItem.views}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {caseItem.comments}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {caseItem.date}
                    </span>
                  </div>
                  <button className="text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-blue-50">
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 浮动操作按钮 (FAB) - 用于快速创建医案 */}
        <button className="fixed bottom-24 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </MobileLayout>
  );
};

export default MobileCasesPage;