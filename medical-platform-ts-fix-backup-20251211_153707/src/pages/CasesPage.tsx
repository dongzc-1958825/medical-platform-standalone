// src/pages/CasesPage.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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
}

const CasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'tagged' | 'favorites'>('all');
  const [activeView, setActiveView] = useState<'list' | 'mobile'>('list');

  // 加载医案数据
  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = () => {
    try {
      setIsLoading(true);
      const savedCases = localStorage.getItem('medical-cases');
      
      if (savedCases) {
        const parsedCases = JSON.parse(savedCases);
        setCases(parsedCases);
      } else {
        // 初始化示例数据
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
            outcome: '3天后复诊，体温正常，咳嗽明显减轻'
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
            isFavorite: false
          }
        ];
        setCases(sampleCases);
        localStorage.setItem('medical-cases', JSON.stringify(sampleCases));
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

    // 首先应用筛选条件
    if (selectedFilter === 'recent') {
      result = result.filter(caseItem => 
        new Date(caseItem.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
    } else if (selectedFilter === 'tagged') {
      result = result.filter(caseItem => caseItem.tags.length > 0);
    } else if (selectedFilter === 'favorites') {
      result = result.filter(caseItem => caseItem.isFavorite);
    }

    // 然后应用搜索条件
    if (searchTerm) {
      result = result.filter(caseItem => 
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.treatment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.outcome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.symptoms.some(symptom => 
          symptom.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        caseItem.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return result;
  }, [cases, searchTerm, selectedFilter]);

  // 搜索处理函数
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter: 'all' | 'recent' | 'tagged' | 'favorites') => {
    setSelectedFilter(filter);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedFilter('all');
  };

  // 处理新医案发布 - 这个函数现在在独立页面中使用
  const handlePublishCase = useCallback((caseData: any) => {
    console.log('收到发布数据:', caseData);
    
    const newCase: MedicalCase = {
      id: Date.now().toString(),
      title: caseData.title,
      patientName: caseData.patientName || '匿名患者', // 修复：使用表单中的患者姓名
      diagnosis: caseData.diagnosis,
      symptoms: caseData.symptoms || [],
      tags: caseData.tags || [],
      description: caseData.description,
      treatment: caseData.treatment,
      outcome: caseData.outcome,
      imageUrls: caseData.imageUrls || [],
      createdAt: new Date().toISOString().split('T')[0],
      isFavorite: false
    };

    const updatedCases = [newCase, ...cases];
    setCases(updatedCases);
    localStorage.setItem('medical-cases', JSON.stringify(updatedCases));
    
    alert('医案发布成功！');
  }, [cases]);

  // 发布按钮 - 导航到独立页面
  const handleOpenPublishModal = useCallback(() => {
    console.log('导航到独立创建页面');
    navigate('/cases/create');
  }, [navigate]);

  // 删除医案
  const handleDeleteCase = (id: string) => {
    if (confirm('确定要删除这个医案吗？此操作不可恢复。')) {
      const updatedCases = cases.filter(caseItem => caseItem.id !== id);
      setCases(updatedCases);
      localStorage.setItem('medical-cases', JSON.stringify(updatedCases));
    }
  };

  // 收藏/取消收藏医案
  const handleToggleFavorite = (id: string) => {
    const updatedCases = cases.map(caseItem => 
      caseItem.id === id ? { ...caseItem, isFavorite: !caseItem.isFavorite } : caseItem
    );
    setCases(updatedCases);
    localStorage.setItem('medical-cases', JSON.stringify(updatedCases));
  };

  // 分享医案功能
  const handleShareCase = (caseItem: MedicalCase) => {
    const shareText = `医案标题: ${caseItem.title}\n患者: ${caseItem.patientName}\n诊断: ${caseItem.diagnosis}\n症状: ${caseItem.symptoms.join(', ')}`;
    
    if (navigator.share) {
      navigator.share({
        title: caseItem.title,
        text: shareText,
        url: window.location.href,
      })
      .catch(error => console.log('分享失败:', error));
    } else {
      // 降级方案 - 复制到剪贴板
      navigator.clipboard.writeText(shareText)
        .then(() => alert('医案信息已复制到剪贴板'))
        .catch(() => alert('复制失败，请手动复制'));
    }
  };

  // 电脑手机文件传输功能
  const handleFileTransfer = () => {
    alert('电脑手机文件传输功能已激活！\n\n此功能允许您在电脑和手机之间传输医案数据。');
    // 这里可以调用 realFileService 中的功能
  };

  // 生成手机极简版HTML
  const generateMobileHTML = (caseItem: MedicalCase) => {
    const mobileHTML = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${caseItem.title}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0; padding: 16px;
            background: #f5f5f5;
            line-height: 1.6;
          }
          .case-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .case-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 12px;
            color: #333;
          }
          .case-info {
            margin-bottom: 10px;
          }
          .case-label {
            font-weight: 600;
            color: #666;
          }
          .symptoms, .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
          }
          .symptom-tag, .category-tag {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
          }
          .symptom-tag {
            background: #fed7aa;
            color: #9a3412;
          }
          .category-tag {
            background: #bfdbfe;
            color: #1e40af;
          }
        </style>
      </head>
      <body>
        <div class="case-card">
          <div class="case-title">${caseItem.title}</div>
          <div class="case-info"><span class="case-label">患者:</span> ${caseItem.patientName}</div>
          <div class="case-info"><span class="case-label">诊断:</span> ${caseItem.diagnosis}</div>
          ${caseItem.description ? `<div class="case-info"><span class="case-label">描述:</span> ${caseItem.description}</div>` : ''}
          <div class="case-info">
            <span class="case-label">症状:</span>
            <div class="symptoms">
              ${caseItem.symptoms.map(symptom => `<span class="symptom-tag">${symptom}</span>`).join('')}
            </div>
          </div>
          ${caseItem.tags.length > 0 ? `
          <div class="case-info">
            <span class="case-label">标签:</span>
            <div class="tags">
              ${caseItem.tags.map(tag => `<span class="category-tag">#${tag}</span>`).join('')}
            </div>
          </div>` : ''}
          ${caseItem.treatment ? `<div class="case-info"><span class="case-label">治疗方案:</span> ${caseItem.treatment}</div>` : ''}
          ${caseItem.outcome ? `<div class="case-info"><span class="case-label">治疗效果:</span> ${caseItem.outcome}</div>` : ''}
        </div>
      </body>
      </html>
    `;
    
    // 在新窗口中打开手机版
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(mobileHTML);
      newWindow.document.close();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 页面标题和功能区域 */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">众创医案平台</h1>
            <p className="text-gray-600">
              共 {filteredCases.length} 个医案
              {searchTerm && ` (搜索: "${searchTerm}")`}
              {selectedFilter !== 'all' && ` (筛选: ${selectedFilter === 'recent' ? '最近一周' : selectedFilter === 'favorites' ? '收藏' : '已标记'})`}
            </p>
          </div>
          
          {/* 功能按钮区域 */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleFileTransfer}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium shadow-sm flex items-center gap-2"
            >
              <span>📱</span> 电脑手机传输
            </button>
            <button
              onClick={() => setActiveView(activeView === 'list' ? 'mobile' : 'list')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors font-medium shadow-sm flex items-center gap-2"
            >
              <span>{activeView === 'list' ? '📱' : '📄'}</span> 
              {activeView === 'list' ? '手机视图' : '列表视图'}
            </button>
            <button
              onClick={handleOpenPublishModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-sm flex items-center gap-2"
            >
              <span>➕</span> 发布新医案
            </button>
          </div>
        </div>

        {/* 搜索和筛选组件 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索输入框 */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索医案标题、患者、诊断、症状、标签或描述..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* 筛选按钮组 */}
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => handleFilterChange('recent')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedFilter === 'recent'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                最近一周
              </button>
              <button
                onClick={() => handleFilterChange('tagged')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedFilter === 'tagged'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                已标记
              </button>
              <button
                onClick={() => handleFilterChange('favorites')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedFilter === 'favorites'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                收藏
              </button>
            </div>
          </div>

          {/* 搜索状态显示 */}
          {(searchTerm || selectedFilter !== 'all') && (
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <span>当前筛选:</span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  "{searchTerm}"
                </span>
              )}
              {selectedFilter !== 'all' && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  {selectedFilter === 'recent' ? '最近一周' : 
                   selectedFilter === 'favorites' ? '收藏' : '已标记'}
                </span>
              )}
              <button
                onClick={handleClearSearch}
                className="text-gray-500 hover:text-gray-700 underline text-xs"
              >
                清除筛选
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 调试信息 */}
      <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-sm">
        <strong>调试信息:</strong> 
        <br />- 总医案数: {cases.length}
        <br />- 过滤后: {filteredCases.length}
        <br />- 路由测试: <button 
          onClick={() => {
            console.log('测试路由导航');
            navigate('/cases/create');
          }} 
          className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          测试创建页面
        </button>
      </div>

      {/* 医案列表显示 */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到医案</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedFilter !== 'all' 
              ? '尝试调整搜索条件或清除筛选'
              : '还没有任何医案，点击"发布新医案"开始创建'
            }
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {(searchTerm || selectedFilter !== 'all') && (
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                查看所有医案
              </button>
            )}
            <button
              onClick={handleOpenPublishModal}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              发布新医案
            </button>
          </div>
        </div>
      ) : activeView === 'mobile' ? (
        // 手机视图
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <h3 className="text-lg font-bold text-center mb-4">手机预览模式</h3>
              <p className="text-sm text-gray-600 text-center">以下是医案在手机上的显示效果</p>
            </div>
            {filteredCases.map(caseItem => (
              <div key={caseItem.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{caseItem.title}</h3>
                  <span className="text-xs text-gray-500">{caseItem.createdAt}</span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">患者:</span>
                    <span className="ml-2 text-gray-900">{caseItem.patientName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">诊断:</span>
                    <span className="ml-2 text-gray-900 font-medium">{caseItem.diagnosis}</span>
                  </div>
                </div>

                {caseItem.description && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">描述:</span>
                    <p className="mt-1 text-gray-600 text-sm">{caseItem.description}</p>
                  </div>
                )}

                {caseItem.symptoms.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700">症状:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {caseItem.symptoms.map((symptom, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => handleToggleFavorite(caseItem.id)}
                    className={`text-sm ${caseItem.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                  >
                    {caseItem.isFavorite ? '★ 已收藏' : '☆ 收藏'}
                  </button>
                  <button
                    onClick={() => handleShareCase(caseItem)}
                    className="text-sm text-blue-600"
                  >
                    分享
                  </button>
                  <button
                    onClick={() => generateMobileHTML(caseItem)}
                    className="text-sm text-green-600"
                  >
                    手机版
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // 列表视图
        <div className="grid gap-6">
          {filteredCases.map(caseItem => (
            <div key={caseItem.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{caseItem.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{caseItem.createdAt}</span>
                  <button
                    onClick={() => handleToggleFavorite(caseItem.id)}
                    className={`text-lg ${caseItem.isFavorite ? 'text-yellow-500' : 'text-gray-400'}`}
                    title={caseItem.isFavorite ? '取消收藏' : '收藏'}
                  >
                    {caseItem.isFavorite ? '★' : '☆'}
                  </button>
                  <button
                    onClick={() => handleDeleteCase(caseItem.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    title="删除医案"
                  >
                    删除
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">患者:</span>
                  <span className="ml-2 text-gray-900">{caseItem.patientName}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">诊断:</span>
                  <span className="ml-2 text-gray-900 font-medium">{caseItem.diagnosis}</span>
                </div>
              </div>

              {caseItem.description && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">病例描述:</span>
                  <p className="mt-1 text-gray-600">{caseItem.description}</p>
                </div>
              )}

              {caseItem.symptoms.length > 0 && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">症状:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {caseItem.symptoms.map((symptom, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {caseItem.treatment && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">治疗方案:</span>
                  <p className="mt-1 text-gray-600">{caseItem.treatment}</p>
                </div>
              )}

              {caseItem.outcome && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">治疗效果:</span>
                  <p className="mt-1 text-gray-600">{caseItem.outcome}</p>
                </div>
              )}

              {caseItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {caseItem.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {caseItem.imageUrls && caseItem.imageUrls.length > 0 && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-700">相关图片:</span>
                  <div className="flex gap-2 mt-2">
                    {caseItem.imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`病例图片 ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleShareCase(caseItem)}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <span>📤</span> 分享
                  </button>
                  <button
                    onClick={() => generateMobileHTML(caseItem)}
                    className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                  >
                    <span>📱</span> 手机版
                  </button>
                </div>
                <button
                  onClick={() => handleToggleFavorite(caseItem.id)}
                  className={`text-sm flex items-center gap-1 ${caseItem.isFavorite ? 'text-yellow-600' : 'text-gray-600'}`}
                >
                  {caseItem.isFavorite ? '★ 已收藏' : '☆ 收藏'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CasesPage;