import React, { useState, useEffect } from 'react';
import DesktopLayout from '../components/layout/DesktopLayout';
import MobileLayout from '../components/layout/MobileLayout';
import { useResponsive } from '../shared/hooks/useResponsive';
import { Search, Plus, Eye, Heart, Share2, Building, User, Calendar, MapPin } from 'lucide-react';

// 模拟数据 - 医案列表
const mockCases = [
  {
    id: 1,
    title: '高血压管理案例',
    patientName: '李女士',
    diagnosis: '原发性高血压',
    symptoms: ['头晕', '心悸', '耳鸣'],
    createdAt: '2025-11-04',
    viewCount: 342,
    likeCount: 28,
    shareCount: 12,
    doctorName: '张医生',
    hospital: '北京协和医院',
    isFeatured: true,
    age: 58,
    gender: '女'
  },
  {
    id: 2,
    title: '糖尿病调理案例',
    patientName: '张先生',
    diagnosis: '2型糖尿病',
    symptoms: ['多饮', '多尿', '体重下降'],
    createdAt: '2025-11-03',
    viewCount: 218,
    likeCount: 15,
    shareCount: 8,
    doctorName: '王医生',
    hospital: '上海瑞金医院',
    isFeatured: true,
    age: 45,
    gender: '男'
  },
  {
    id: 3,
    title: '颈椎病康复案例',
    patientName: '王女士',
    diagnosis: '颈椎病',
    symptoms: ['颈部疼痛', '上肢麻木', '头晕'],
    createdAt: '2025-11-02',
    viewCount: 156,
    likeCount: 9,
    shareCount: 5,
    doctorName: '李医生',
    hospital: '广州中山医院',
    isFeatured: false,
    age: 32,
    gender: '女'
  },
  {
    id: 4,
    title: '中医调理失眠案例',
    patientName: '陈先生',
    diagnosis: '失眠症',
    symptoms: ['入睡困难', '多梦易醒', '白天疲倦'],
    createdAt: '2025-11-01',
    viewCount: 189,
    likeCount: 12,
    shareCount: 6,
    doctorName: '孙医生',
    hospital: '成都中医药大学附属医院',
    isFeatured: true,
    age: 41,
    gender: '男'
  },
  {
    id: 5,
    title: '小儿发热处理案例',
    patientName: '小明',
    age: 4,
    diagnosis: '急性上呼吸道感染',
    symptoms: ['发热', '咳嗽', '流涕'],
    createdAt: '2025-10-30',
    viewCount: 275,
    likeCount: 21,
    shareCount: 11,
    doctorName: '赵医生',
    hospital: '南京儿童医院',
    isFeatured: false,
    gender: '男'
  },
  {
    id: 6,
    title: '产后抑郁调理案例',
    patientName: '刘女士',
    diagnosis: '产后抑郁症',
    symptoms: ['情绪低落', '失眠', '食欲不振'],
    createdAt: '2025-10-28',
    viewCount: 132,
    likeCount: 8,
    shareCount: 4,
    doctorName: '周医生',
    hospital: '武汉同济医院',
    isFeatured: false,
    age: 29,
    gender: '女'
  }
];

// 模拟症状标签
const symptomTags = [
  '发热', '咳嗽', '头痛', '头晕', '心悸', '胸闷', '腹痛', '腹泻', 
  '便秘', '失眠', '焦虑', '抑郁', '关节痛', '腰痛', '皮肤瘙痒'
];

// 模拟疾病分类
const diseaseCategories = [
  '心血管疾病', '呼吸系统疾病', '消化系统疾病', '神经系统疾病',
  '内分泌疾病', '骨科疾病', '妇科疾病', '儿科疾病', '皮肤科疾病'
];

// 医案卡片组件
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
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col h-full">
      {/* 精选标签 */}
      {caseData.isFeatured && (
        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-bold z-10">
          精选
        </div>
      )}
      
      {/* 卡片头部 */}
      <div className="p-6 pb-4 flex-1">
        <div className="flex items-start mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
              {caseData.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm">
              <User className="w-4 h-4 mr-1" />
              <span>{caseData.patientName} {caseData.age && `· ${caseData.age}岁`} {caseData.gender && `· ${caseData.gender}`}</span>
            </div>
          </div>
        </div>

        {/* 诊断信息 */}
        <div className="mb-4">
          <h4 className="text-blue-600 font-bold text-sm mb-2">
            {caseData.diagnosis}
          </h4>
          
          {/* 症状标签 */}
          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-2">主要症状：</p>
            <div className="flex flex-wrap gap-1">
              {caseData.symptoms.map((symptom: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          {/* 医院和时间 */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate max-w-[120px]">{caseData.hospital}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{caseData.createdAt}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 卡片底部 - 交互按钮 */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between">
          <button
            onClick={onView}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Eye className="w-5 h-5 mr-1" />
            <span className="text-sm">{caseData.viewCount}</span>
          </button>

          <button
            onClick={handleLike}
            className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
          >
            {liked ? (
              <Heart className="w-5 h-5 mr-1 fill-red-500 text-red-500" />
            ) : (
              <Heart className="w-5 h-5 mr-1" />
            )}
            <span className="text-sm">{likeCount}</span>
          </button>

          <button
            onClick={onShare}
            className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
          >
            <Share2 className="w-5 h-5 mr-1" />
            <span className="text-sm">{caseData.shareCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const CasesPage: React.FC = () => {
  const [cases, setCases] = useState(mockCases);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const { isDesktop } = useResponsive();
  const Layout = isDesktop ? DesktopLayout : MobileLayout;

  // 处理搜索
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // 处理症状选择
  const handleSymptomClick = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // 处理类别选择
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  // 清空筛选
  const handleClearFilters = () => {
    setSelectedSymptoms([]);
    setSelectedCategory('');
    setSearchTerm('');
  };

  // 模拟发布新医案
  const handleCreateNewCase = () => {
    alert('跳转到创建新医案页面');
    // 这里应该导航到创建医案页面
  };

  // 过滤医案
  useEffect(() => {
    let filtered = [...mockCases];

    // 按搜索词过滤
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

    // 按症状过滤
    if (selectedSymptoms.length > 0) {
      filtered = filtered.filter(caseItem =>
        selectedSymptoms.every(symptom =>
          caseItem.symptoms.includes(symptom)
        )
      );
    }

    // 按类别过滤（简化逻辑）
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
    <Layout>
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
    </Layout>
  );
};

export default CasesPage;