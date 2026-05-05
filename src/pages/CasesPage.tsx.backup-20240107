import React, { useState, useEffect } from 'react';
// 删除这两行布局导入
// import DesktopLayout from '../components/layout/DesktopLayout';
// import MobileLayout from '../components/layout/MobileLayout';
// 保留 useResponsive 用于响应式判断
import { useResponsive } from '../shared/hooks/useResponsive';
import { Search, Plus, Eye, Heart, Share2, Building, User, Calendar, MapPin } from 'lucide-react';

// 模拟数据 - 医案列表（保持不变）
const mockCases = [
  // ... 所有模拟数据保持不变
];

// 模拟症状标签（保持不变）
const symptomTags = [
  '发热', '咳嗽', '头痛', '头晕', '心悸', '胸闷', '腹痛', '腹泻', 
  '便秘', '失眠', '焦虑', '抑郁', '关节痛', '腰痛', '皮肤瘙痒'
];

// 模拟疾病分类（保持不变）
const diseaseCategories = [
  '心血管疾病', '呼吸系统疾病', '消化系统疾病', '神经系统疾病',
  '内分泌疾病', '骨科疾病', '妇科疾病', '儿科疾病', '皮肤科疾病'
];

// 医案卡片组件（保持不变）
const CaseCard: React.FC<{
  caseData: any;
  onView: () => void;
  onLike: () => void;
  onShare: () => void;
}> = ({ caseData, onView, onLike, onShare }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(caseData.likeCount);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike();
  };

  return (
    // ... CaseCard 组件所有代码保持不变
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col h-full">
      {/* ... 所有 CaseCard 内容保持不变 */}
    </div>
  );
};

const CasesPage: React.FC = () => {
  const [cases, setCases] = useState(mockCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // 保留 useResponsive 用于响应式样式判断
  const { isDesktop } = useResponsive();
  // 删除这行：const Layout = isDesktop ? DesktopLayout : MobileLayout;

  // 处理搜索（保持不变）
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // 处理症状选择（保持不变）
  const handleSymptomClick = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // 处理类别选择（保持不变）
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  // 清空筛选（保持不变）
  const handleClearFilters = () => {
    setSelectedSymptoms([]);
    setSelectedCategory('');
    setSearchTerm('');
  };

  // 模拟发布新医案（保持不变）
  const handleCreateNewCase = () => {
    alert('跳转到创建新医案页面');
  };

  // 过滤医案（保持不变）
  useEffect(() => {
    let filtered = [...mockCases];

    if (searchTerm) {
      filtered = filtered.filter(caseItem => 
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.symptoms.some((symptom: string) => 
          symptom.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedSymptoms.length > 0) {
      filtered = filtered.filter(caseItem =>
        selectedSymptoms.every(symptom =>
          caseItem.symptoms.includes(symptom)
        )
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(caseItem =>
        caseItem.diagnosis.includes(selectedCategory) ||
        caseItem.symptoms.some((symptom: string) => 
          symptom.includes(selectedCategory)
        )
      );
    }

    setCases(filtered);
  }, [searchTerm, selectedSymptoms, selectedCategory]);

  return (
    // 删除 <Layout> 包裹，直接返回内容
    <div className={`min-h-screen bg-gray-50 ${isDesktop ? 'p-8' : 'p-4'}`}>
      <div className={`max-w-7xl mx-auto`}>
        {/* 页面标题和操作区 */}
        <div className={`flex ${isDesktop ? 'flex-row items-center' : 'flex-col'} justify-between mb-8 gap-4`}>
          <div>
            <h1 className={`${isDesktop ? 'text-3xl' : 'text-2xl'} font-bold text-gray-800 mb-2`}>
              医案分享
            </h1>
            <p className="text-gray-600">
              浏览和学习来自专业医生的真实医疗案例
            </p>
          </div>
          
          <button
            onClick={handleCreateNewCase}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors
              ${isDesktop ? 'px-6 py-3 text-base' : 'w-full py-3 text-sm'}
              flex items-center justify-center gap-2`}
          >
            <Plus className="w-5 h-5" />
            发布新医案
          </button>
        </div>

        {/* 搜索和筛选区 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* 搜索框 */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索医案、疾病、症状或医生..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* 症状标签筛选 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">常见症状</h3>
              {selectedSymptoms.length > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  已选 {selectedSymptoms.length} 个
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {symptomTags.map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomClick(symptom)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${selectedSymptoms.includes(symptom)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* 疾病分类筛选 */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-4">疾病分类</h3>
            <div className="flex flex-wrap gap-2">
              {diseaseCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 筛选操作按钮 */}
          {(selectedSymptoms.length > 0 || selectedCategory || searchTerm) && (
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {selectedSymptoms.length > 0 && `症状: ${selectedSymptoms.join(', ')} `}
                {selectedCategory && `分类: ${selectedCategory}`}
              </div>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                清空筛选
              </button>
            </div>
          )}
        </div>

        {/* 医案列表 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              医案列表
              {cases.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({cases.length}个)
                </span>
              )}
            </h2>
            <span className="text-sm text-gray-500">按时间倒序排列</span>
          </div>
          
          {cases.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                未找到匹配的医案
              </h3>
              <p className="text-gray-500 mb-6">
                尝试调整搜索条件或清空筛选
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                清空筛选条件
              </button>
            </div>
          ) : (
            <div className={`grid ${isDesktop ? 'grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {cases.map((caseItem) => (
                <CaseCard
                  key={caseItem.id}
                  caseData={caseItem}
                  onView={() => alert(`查看医案详情: ${caseItem.title}`)}
                  onLike={() => {}}
                  onShare={() => alert(`分享医案: ${caseItem.title}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 底部提示 */}
        {cases.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              共找到 {cases.length} 个医案 • 
              {selectedSymptoms.length > 0 && ` 已选症状: ${selectedSymptoms.join(', ')} •`}
              {selectedCategory && ` 已选分类: ${selectedCategory} •`}
              {' 医案数据仅供学习参考，具体诊疗请咨询专业医生'}
            </p>
          </div>
        )}
      </div>
    </div>
    // 删除对应的 </Layout> 标签
  );
};

export default CasesPage;