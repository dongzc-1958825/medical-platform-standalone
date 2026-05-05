import React, { useState, useEffect } from 'react';
import { KeyInformation as KeyInfoType } from '../../types/user';
import { userService } from '../../services/userService';

const KeyInformation: React.FC = () => {
  const [informations, setInformations] = useState<KeyInfoType[]>([]);

  useEffect(() => {
    loadInformations();
  }, []);

  const loadInformations = () => {
    const data = userService.getKeyInformation();
    setInformations(data);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      mild: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      severe: 'bg-red-100 text-red-800'
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeName = (type: string) => {
    const names = {
      allergy: '过敏史',
      chronic_disease: '慢性病',
      surgery_history: '手术史',
      family_history: '家族史',
      medication: '长期用药'
    };
    return names[type as keyof typeof names] || '其他信息';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">关键信息</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          + 添加信息
        </button>
      </div>

      <div className="space-y-3">
        {informations.map(info => (
          <div key={info.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">{info.title}</h3>
              {info.severity && (
                <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(info.severity)}`}>
                  {info.severity === 'mild' ? '轻度' : info.severity === 'moderate' ? '中度' : '严重'}
                </span>
              )}
            </div>
            <p className="text-gray-600 mb-2">{info.content}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{getTypeName(info.type)}</span>
              {info.startDate && <span>开始时间：{info.startDate}</span>}
            </div>
            {info.note && (
              <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">{info.note}</p>
              </div>
            )}
          </div>
        ))}

        {informations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-300 text-6xl mb-4">⚠️</div>
            <p className="text-gray-500">暂无关键信息</p>
            <p className="text-sm text-gray-400 mt-1">请添加您的过敏史、慢性病等重要信息</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyInformation;