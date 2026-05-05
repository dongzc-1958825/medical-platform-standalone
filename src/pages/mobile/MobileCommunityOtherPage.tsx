// src/pages/mobile/MobileCommunityOtherPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  Heart,
  Brain,
  Beaker,
  BookOpen,
  Users,
  Sparkles,
  Coffee,
  Leaf,
  ChevronLeft
} from 'lucide-react';
import { communityLifeService } from '../../shared/services/communityLifeService';
import { CommunityCategory } from '../../shared/types/community';

const MobileCommunityOtherPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CommunityCategory[]>([]);

  // 根据名称返回对应的图标组件
  const getIconForCategory = (name: string): React.ElementType => {
    const iconMap: Record<string, React.ElementType> = {
      '心理健康': Brain,
      '中药研学': Beaker,
      '针灸学习': BookOpen,
      '太极养生': Users,
      '营养饮食': Coffee,
      '运动健康': Leaf,
    };
    
    return iconMap[name] || Heart;
  };

  // 加载其他社区数据
  useEffect(() => {
    const otherCategories = communityLifeService.getCategoriesByType('other');
    setCategories(otherCategories);
    setFilteredCategories(otherCategories);
  }, []);

  // 按拼音首字母分组
  const groupedCategories = filteredCategories.reduce((acc, cat) => {
    const letter = cat.pinyin;
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(cat);
    return acc;
  }, {} as Record<string, CommunityCategory[]>);

  // 获取所有首字母并排序
  const letters = Object.keys(groupedCategories).sort();

  // 过滤后的分类（按搜索关键词）
  useEffect(() => {
    if (searchKeyword) {
      const filtered = categories.filter(c => 
        c.name.includes(searchKeyword) || 
        c.description.includes(searchKeyword)
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchKeyword, categories]);

  // 按首字母分组过滤后的结果
  const filteredGrouped = filteredCategories.reduce((acc, cat) => {
    const letter = cat.pinyin;
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(cat);
    return acc;
  }, {} as Record<string, CommunityCategory[]>);

  const filteredLetters = Object.keys(filteredGrouped).sort();

  const handleCategoryClick = (category: CommunityCategory) => {
    navigate(`/mobile/community/other/${category.id}`, { 
      state: { categoryName: category.name, type: 'other' } 
    });
  };

  const scrollToLetter = (letter: string) => {
    setSelectedLetter(letter);
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 获取图标背景色
  const getBgColor = (name: string): string => {
    const colorMap: Record<string, string> = {
      '心理健康': 'bg-purple-50',
      '中药研学': 'bg-amber-50',
      '针灸学习': 'bg-blue-50',
      '太极养生': 'bg-green-50',
      '营养饮食': 'bg-orange-50',
      '运动健康': 'bg-cyan-50',
    };
    return colorMap[name] || 'bg-teal-50';
  };

  // 获取图标颜色
  const getIconColor = (name: string): string => {
    const colorMap: Record<string, string> = {
      '心理健康': 'text-purple-600',
      '中药研学': 'text-amber-600',
      '针灸学习': 'text-blue-600',
      '太极养生': 'text-green-600',
      '营养饮食': 'text-orange-600',
      '运动健康': 'text-cyan-600',
    };
    return colorMap[name] || 'text-teal-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center p-4">
          <button onClick={() => navigate('/mobile/community-life')} className="text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">其他社区</h1>
          <div className="w-5"></div>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索社区名称..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="px-4 pb-8 flex">
        {/* 左侧字母导航 */}
        {!searchKeyword && letters.length > 0 && (
          <div className="w-8 mr-2 sticky top-20 self-start">
            <div className="flex flex-col items-center space-y-1">
              {letters.map((letter) => (
                <button
                  key={letter}
                  onClick={() => scrollToLetter(letter)}
                  className={`w-6 h-6 text-xs font-medium rounded-full flex items-center justify-center transition-colors ${
                    selectedLetter === letter
                      ? 'bg-teal-600 text-white'
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 右侧分类列表 */}
        <div className="flex-1">
          {searchKeyword ? (
            // 搜索结果显示为平铺列表
            <div className="space-y-2">
              {filteredCategories.map((cat) => {
                const Icon = getIconForCategory(cat.name);
                const bgColor = getBgColor(cat.name);
                const iconColor = getIconColor(cat.name);
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all cursor-pointer active:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mr-3`}>
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                          <span className="text-xs text-gray-400">{cat.memberCount}位成员</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                );
              })}
              {filteredCategories.length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center">
                  <p className="text-gray-500">未找到相关社区</p>
                </div>
              )}
            </div>
          ) : (
            // 正常显示按字母分组
            <div className="space-y-4">
              {filteredLetters.map((letter) => (
                <div key={letter} id={`letter-${letter}`}>
                  <div className="sticky top-0 bg-gray-50 py-2 z-10">
                    <h2 className="text-lg font-bold text-gray-700">{letter}</h2>
                  </div>
                  <div className="space-y-2">
                    {filteredGrouped[letter].map((cat) => {
                      const Icon = getIconForCategory(cat.name);
                      const bgColor = getBgColor(cat.name);
                      const iconColor = getIconColor(cat.name);
                      return (
                        <div
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat)}
                          className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all cursor-pointer active:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mr-3`}>
                              <Icon className={`w-6 h-6 ${iconColor}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                                <span className="text-xs text-gray-400">{cat.memberCount}位成员</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileCommunityOtherPage;
