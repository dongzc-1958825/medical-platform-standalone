import React, { useState } from 'react';
import SearchResultCard from '../../components/search/SearchResultCard';

// 模拟搜索结果数据
const mockResults = [
  {
    id: '1',
    title: '冠心病不稳定型心绞痛诊疗案例',
    content: '患者，男性，56岁，因"反复胸痛3天"入院。诊断：冠心病 不稳定型心绞痛。治疗：给予阿司匹林100mg qd，氯吡格雷75mg qd。疗效：症状明显缓解。',
    source: 'yiigle' as const,
    url: 'https://www.yiigle.com/...',
    date: '2024-01-15'
  },
  {
    id: '2',
    title: '上呼吸道感染案例',
    content: '患者头痛发热3天，诊断为上呼吸道感染，给予布洛芬治疗，症状缓解。',
    source: 'platform' as const,
    url: '#',
    date: '2024-01-14'
  }
];

const SearchResultsPage: React.FC = () => {
  const [results] = useState(mockResults);

  const handleSave = (info: any) => {
    console.log('保存到家庭健康:', info);
    // TODO: 实现保存逻辑
  };

  const handleReminder = (info: any) => {
    console.log('设置提醒:', info);
    // TODO: 实现提醒逻辑
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">搜索结果</h2>
      <div className="space-y-4">
        {results.map(result => (
          <SearchResultCard
            key={result.id}
            result={result}
            onSave={handleSave}
            onReminder={handleReminder}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;