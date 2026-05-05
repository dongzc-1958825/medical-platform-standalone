import React, { useState, useEffect } from 'react';
import { HealthRecord } from '../../types/user';
import { userService } from '../../services/userService';

const HealthManagement: React.FC = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<HealthRecord>>({
    type: 'blood_pressure',
    value: 0,
    unit: '',
    measuredAt: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const data = userService.getHealthRecords();
    setRecords(data);
  };

  const handleAddRecord = () => {
    if (newRecord.type && newRecord.value && newRecord.unit && newRecord.measuredAt) {
      userService.addHealthRecord({
        type: newRecord.type as any,
        value: newRecord.value,
        unit: newRecord.unit,
        measuredAt: newRecord.measuredAt,
        note: newRecord.note
      });
      setShowForm(false);
      setNewRecord({
        type: 'blood_pressure',
        value: 0,
        unit: '',
        measuredAt: new Date().toISOString().slice(0, 16)
      });
      loadRecords();
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      blood_pressure: '🩸',
      blood_sugar: '🍬',
      heart_rate: '💓',
      weight: '⚖️',
      temperature: '🌡️'
    };
    return icons[type as keyof typeof icons] || '📊';
  };

  const getTypeName = (type: string) => {
    const names = {
      blood_pressure: '血压',
      blood_sugar: '血糖',
      heart_rate: '心率',
      weight: '体重',
      temperature: '体温'
    };
    return names[type as keyof typeof names] || '健康指标';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 头部操作栏 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">健康记录</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          + 添加记录
        </button>
      </div>

      {/* 添加记录表单 */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="font-semibold mb-4">添加健康记录</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">指标类型</label>
              <select
                value={newRecord.type}
                onChange={(e) => setNewRecord({...newRecord, type: e.target.value as any})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="blood_pressure">血压</option>
                <option value="blood_sugar">血糖</option>
                <option value="heart_rate">心率</option>
                <option value="weight">体重</option>
                <option value="temperature">体温</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">测量数值</label>
              <input
                type="number"
                value={newRecord.value || ''}
                onChange={(e) => setNewRecord({...newRecord, value: parseFloat(e.target.value)})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">单位</label>
              <input
                type="text"
                value={newRecord.unit}
                onChange={(e) => setNewRecord({...newRecord, unit: e.target.value})}
                placeholder="如：mmHg, mmol/L"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">测量时间</label>
              <input
                type="datetime-local"
                value={newRecord.measuredAt}
                onChange={(e) => setNewRecord({...newRecord, measuredAt: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <input
                type="text"
                value={newRecord.note || ''}
                onChange={(e) => setNewRecord({...newRecord, note: e.target.value})}
                placeholder="可选"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleAddRecord}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </div>
      )}

      {/* 记录列表 */}
      <div className="space-y-3">
        {records.map(record => (
          <div key={record.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeIcon(record.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{getTypeName(record.type)}</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {record.value} <span className="text-sm font-normal text-gray-600">{record.unit}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(record.measuredAt).toLocaleString('zh-CN')}
                </p>
                {record.note && (
                  <p className="text-sm text-gray-600 mt-1">{record.note}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {records.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-300 text-6xl mb-4">❤️</div>
            <p className="text-gray-500">暂无健康记录</p>
            <p className="text-sm text-gray-400 mt-1">点击上方按钮添加您的第一条健康记录</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthManagement;