import React, { useState, useEffect } from 'react';
import { Collection } from '../../types/user';
import { userService } from '../../services/userService';

const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = () => {
    const data = userService.getCollections();
    setCollections(data);
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      article: '📚',
      medicine: '💊',
      case: '📋',
      doctor: '👨‍⚕️'
    };
    return icons[type as keyof typeof icons] || '⭐';
  };

  const getTypeName = (type: string) => {
    const names = {
      article: '文章',
      medicine: '药品',
      case: '医案',
      doctor: '医生'
    };
    return names[type as keyof typeof names] || '收藏';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">我的收藏</h2>
      </div>

      <div className="space-y-3">
        {collections.map(collection => (
          <div key={collection.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{getTypeIcon(collection.type)}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{collection.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{collection.content}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">{getTypeName(collection.type)}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(collection.collectedAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {collections.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-300 text-6xl mb-4">⭐</div>
            <p className="text-gray-500">暂无收藏</p>
            <p className="text-sm text-gray-400 mt-1">您还没有收藏任何内容</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;