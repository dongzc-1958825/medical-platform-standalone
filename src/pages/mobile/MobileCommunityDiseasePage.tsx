// src/pages/mobile/MobileCommunityDiseasePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  Heart,
  Activity,
  Brain,
  Wind,
  Droplet,
  Bone,
  Eye,
  Zap,
  Thermometer,
  Pill,
  ChevronLeft
} from 'lucide-react';
import { communityLifeService } from '../../shared/services/communityLifeService';
import { CommunityCategory } from '../../shared/types/community';

const MobileCommunityDiseasePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<CommunityCategory[]>([]);

  // 根据名称返回对应的图标组件
  const getIconForCategory = (name: string): React.ElementType => {
    const iconMap: Record<string, React.ElementType> = {
      '高血压': Activity,
      '糖尿病': Droplet,
      '冠心病': Heart,
      '关节炎': Bone,
      '慢阻肺': Wind,
      '偏头痛': Brain,
      '青光眼': Eye,
      '神经性耳聋': Zap,
      '风湿病': Bone,
      '乙型肝炎': Pill,
      '抑郁症': Brain,
      '感冒': Thermometer,
    };
    
    return iconMap[name] || Activity;
  };

  // 加载专病社区数据
  useEffect(() => {
    const diseaseCategories = communityLifeService.getCategoriesByType('disease');
    setCategories(diseaseCategories);
    setFilteredCategories(diseaseCategories);
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
    navigate(`/mobile/community/disease/${category.id}`, { 
      state: { categoryName: category.name, type: 'disease' } 
    });
  };

  const scrollToLetter = (letter: string) => {
    setSelectedLetter(letter);
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center p-4">
          <button onClick={() => navigate('/mobile/community-life')} className="text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">专病社区</h1>
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
            placeholder="搜索病种名称..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      ? 'bg-red-600 text-white'
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
                return (
                  <div
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all cursor-pointer active:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mr-3">
                        <Icon className="w-6 h-6 text-red-600" />
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
                  <p className="text-gray-500">未找到相关病种</p>
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
                      return (
                        <div
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat)}
                          className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all cursor-pointer active:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mr-3">
                              <Icon className="w-6 h-6 text-red-600" />
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

export default MobileCommunityDiseasePage;
