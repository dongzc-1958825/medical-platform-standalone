import React, { useState } from 'react';

// 按汉语拼音排序的专病名录
const diseaseCommunities = [
  { id: 'asthma', name: '哮喘', pinyin: 'xiaochuan', members: 2845, online: 123 },
  { id: 'diabetes', name: '糖尿病', pinyin: 'tangniaobing', members: 3921, online: 256 },
  { id: 'hypertension', name: '高血压', pinyin: 'gaoxueya', members: 5678, online: 389 },
  { id: 'coronary', name: '冠心病', pinyin: 'guanxinbing', members: 2341, online: 167 },
  { id: 'arthritis', name: '关节炎', pinyin: 'guanjieyan', members: 1890, online: 98 },
  { id: 'headache', name: '偏头痛', pinyin: 'piantoutong', members: 1456, online: 87 },
  { id: 'depression', name: '抑郁症', pinyin: 'yiyuzheng', members: 3210, online: 234 },
  { id: 'insomnia', name: '失眠症', pinyin: 'shimianzheng', members: 2789, online: 189 },
  { id: 'allergy', name: '过敏性疾病', pinyin: 'guominxingjibing', members: 1987, online: 134 },
  { id: 'copd', name: '慢阻肺', pinyin: 'manzufei', members: 1234, online: 76 },
  { id: 'ibd', name: '炎症性肠病', pinyin: 'yanzhengxingchangbing', members: 876, online: 45 },
  { id: 'psoriasis', name: '银屑病', pinyin: 'yinxiebing', members: 1543, online: 92 },
  { id: 'thyroid', name: '甲状腺疾病', pinyin: 'jiazhuangxianjibing', members: 2678, online: 178 },
  { id: 'osteoporosis', name: '骨质疏松', pinyin: 'guzhishusong', members: 1892, online: 112 },
  { id: 'migraine', name: '偏头痛', pinyin: 'piantoutong', members: 1678, online: 101 },
  { id: 'anxiety', name: '焦虑症', pinyin: 'jiaolvzheng', members: 2987, online: 213 },
  { id: 'asthma_copd', name: '哮喘-慢阻肺重叠', pinyin: 'xiaochuanmanzufeichongdie', members: 765, online: 34 },
  { id: 'gerd', name: '胃食管反流', pinyin: 'weishiguanfanliu', members: 2345, online: 156 },
  { id: 'ibh', name: '心律失常', pinyin: 'xinlvshichang', members: 1876, online: 123 },
  { id: 'dementia', name: '认知障碍', pinyin: 'renzhizhangai', members: 1432, online: 89 }
].sort((a, b) => a.pinyin.localeCompare(b.pinyin));

// 模拟聊天消息
const mockMessages = {
  asthma: [
    { id: 1, user: '张医生', content: '大家好，我是呼吸科张医生，今天我们来聊聊哮喘的日常管理', time: '10:00', isDoctor: true },
    { id: 2, user: '李女士', content: '张医生好！我孩子最近哮喘发作比较频繁，有什么预防措施吗？', time: '10:02', isDoctor: false },
    { id: 3, user: '王先生', content: '我用的吸入剂感觉效果不如以前了，需要调整吗？', time: '10:03', isDoctor: false },
    { id: 4, user: '张医生', content: '李女士，建议记录发作的诱因，比如天气变化、过敏原等。王先生，建议复诊评估用药方案', time: '10:05', isDoctor: true }
  ],
  diabetes: [
    { id: 1, user: '刘医生', content: '欢迎糖友们！今天我们来讨论血糖监测的重要性', time: '09:30', isDoctor: true },
    { id: 2, user: '陈阿姨', content: '我空腹血糖总是偏高，怎么办？', time: '09:32', isDoctor: false },
    { id: 3, user: '赵先生', content: '大家用的什么牌子的血糖仪？求推荐', time: '09:35', isDoctor: false }
  ]
};

const CommunityPage: React.FC = () => {
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 过滤疾病列表
  const filteredDiseases = diseaseCommunities.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.pinyin.includes(searchTerm.toLowerCase())
  );

  // 获取当前选中的疾病信息
  const currentDisease = selectedDisease ? 
    diseaseCommunities.find(d => d.id === selectedDisease) : null;

  // 获取当前疾病的聊天消息
  const currentMessages = selectedDisease ? 
    (mockMessages as any)[selectedDisease] || [] : [];

  if (selectedDisease && currentDisease) {
    // 显示微信群风格的聊天界面
    return (
      <div className="min-h-screen bg-gray-50">
        {/* 群聊头部 */}
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSelectedDisease(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                ←
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-800">{currentDisease.name}病友群</h1>
                <p className="text-sm text-gray-500">
                  {currentDisease.members} 名成员，{currentDisease.online} 人在线
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-800">
                🔍
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800">
                ⋮
              </button>
            </div>
          </div>
        </div>

        {/* 聊天区域 */}
        <div className="max-w-4xl mx-auto p-4 space-y-4 pb-20">
          {currentMessages.map((message: any) => (
            <div
              key={message.id}
              className={`flex ${message.isDoctor ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                  message.isDoctor
                    ? 'bg-white border border-gray-200'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {message.isDoctor && (
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">
                      🩺
                    </div>
                    <span className="text-sm font-medium text-gray-700">{message.user}</span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.isDoctor ? 'text-gray-500' : 'text-blue-200'
                }`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 输入框 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800">
              😊
            </button>
            <input
              type="text"
              placeholder="输入消息..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
              ↑
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 主页面 - 专病名录
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">👥 专病社区</h1>
          <p className="text-gray-600 text-lg">选择疾病类型，加入病友交流群</p>
        </div>

        {/* 搜索框 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="搜索疾病名称或拼音..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 专病名录 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">专病名录</h2>
            <p className="text-gray-600">按汉语拼音排序，点击疾病名称进入病友群</p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredDiseases.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                未找到相关疾病
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredDiseases.map((disease, _index) => (
                  <button
                    key={disease.id}
                    onClick={() => setSelectedDisease(disease.id)}
                    className="w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          🩺
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {disease.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {disease.pinyin}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {disease.members.toLocaleString()} 名成员
                        </div>
                        <div className="text-xs text-green-600">
                          {disease.online} 人在线
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 使用说明 */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">如何使用专病社区？</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• 在搜索框中输入疾病名称或拼音首字母快速查找</li>
            <li>• 点击疾病名称进入对应的病友交流群</li>
            <li>• 在群内可以与病友交流经验，获取专业医生建议</li>
            <li>• 所有交流内容严格保密，保护个人隐私</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;