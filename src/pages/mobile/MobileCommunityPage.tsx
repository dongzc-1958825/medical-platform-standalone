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
  Pill
} from 'lucide-react';
import { communityAdminService } from '../../shared/services/communityAdminService';

interface Disease {
  id: string;
  name: string;
  pinyin: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  count: number;
}

const MobileCommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [filteredDiseases, setFilteredDiseases] = useState<Disease[]>([]);

  // 根据疾病名称返回对应的图标组件
  const getIconForDisease = (name: string): React.ElementType => {
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
      '儿童多动症': Brain,
    };
    
    return iconMap[name] || Activity;
  };

  // 加载社区数据
  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = () => {
    // 从社区管理服务获取所有激活的社区
    const communities = communityAdminService.getActiveCommunities();
    
    // 转换为 Disease 格式
    const diseaseList: Disease[] = communities.map(comm => ({
      id: comm.id,
      name: comm.name,
      pinyin: comm.pinyin,
      description: `${comm.name}病友互助社区`,
      icon: getIconForDisease(comm.name),
      color: comm.color || 'text-blue-600',
      bgColor: `bg-${comm.color?.split('-')[1] || 'blue'}-50`,
      count: 0
    }));
    
    setDiseases(diseaseList);
    setFilteredDiseases(diseaseList);
  };

  // 按拼音首字母分组
  const groupedDiseases = filteredDiseases.reduce((acc, disease) => {
    const letter = disease.pinyin;
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(disease);
    return acc;
  }, {} as Record<string, Disease[]>);

  // 获取所有首字母并排序
  const letters = Object.keys(groupedDiseases).sort();

  // 过滤后的病种（按搜索关键词）
  useEffect(() => {
    if (searchKeyword) {
      const filtered = diseases.filter(d => 
        d.name.includes(searchKeyword) || 
        d.description.includes(searchKeyword)
      );
      setFilteredDiseases(filtered);
    } else {
      setFilteredDiseases(diseases);
    }
  }, [searchKeyword, diseases]);

  // 按首字母分组过滤后的结果
  const filteredGrouped = filteredDiseases.reduce((acc, disease) => {
    const letter = disease.pinyin;
    if (!acc[letter]) {
      acc[letter] = [];
    }
    acc[letter].push(disease);
    return acc;
  }, {} as Record<string, Disease[]>);

  const filteredLetters = Object.keys(filteredGrouped).sort();

  const handleDiseaseClick = (disease: Disease) => {
    navigate(`/mobile/community/${disease.id}`, { 
      state: { diseaseName: disease.name } 
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
      {/* 顶部标题 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-white mb-2">专病社区</h1>
        <p className="text-blue-100 text-sm">
          选择您的专病，加入病友互助社区
        </p>
      </div>

      {/* 搜索栏 */}
      <div className="px-4 -mt-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索病种名称..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 右侧病种列表 */}
        <div className="flex-1">
          {searchKeyword ? (
            // 搜索结果显示为平铺列表
            <div className="space-y-2">
              {filteredDiseases.map((disease) => {
                const Icon = disease.icon;
                return (
                  <div
                    key={disease.id}
                    onClick={() => handleDiseaseClick(disease)}
                    className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all cursor-pointer active:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-xl ${disease.bgColor} flex items-center justify-center mr-3`}>
                        <Icon className={`w-6 h-6 ${disease.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{disease.name}</h3>
                          <span className="text-xs text-gray-400">{disease.count}位病友</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{disease.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                );
              })}
              {filteredDiseases.length === 0 && (
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
                    {filteredGrouped[letter].map((disease) => {
                      const Icon = disease.icon;
                      return (
                        <div
                          key={disease.id}
                          onClick={() => handleDiseaseClick(disease)}
                          className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all cursor-pointer active:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-xl ${disease.bgColor} flex items-center justify-center mr-3`}>
                              <Icon className={`w-6 h-6 ${disease.color}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">{disease.name}</h3>
                                <span className="text-xs text-gray-400">{disease.count}位病友</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{disease.description}</p>
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

export default MobileCommunityPage;