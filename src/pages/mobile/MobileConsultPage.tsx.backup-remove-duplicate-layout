import React, { useState } from 'react';
import MobileLayout from '../../components/layout/MobileLayout';

const MobileConsultPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'form'>('list');
  const [showExamples, setShowExamples] = useState(true);

  // 简化版的移动端寻医问药，可以后续完善
  return (
    <MobileLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">寻医问药</h1>

        {/* 标签切换 */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 rounded-md text-center ${
              activeTab === 'list' ? 'bg-white shadow' : ''
            }`}
          >
            咨询列表
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-2 rounded-md text-center ${
              activeTab === 'form' ? 'bg-white shadow' : ''
            }`}
          >
            发起咨询
          </button>
        </div>

        {activeTab === 'list' ? (
          <div className="space-y-4">
            {/* 简化版咨询列表 */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold mb-2">持续头痛3天</h3>
              <p className="text-sm text-gray-600 mb-2">紧急 · 3回复</p>
              <p className="text-xs text-gray-500">2小时前</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-4">发起咨询</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">主要症状</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="描述主要症状"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">主要诉求</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="希望获得什么帮助"
                />
              </div>
              <button className="w-full py-2 bg-blue-600 text-white rounded">
                提交咨询
              </button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default MobileConsultPage;