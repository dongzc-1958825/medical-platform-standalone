import React, { useState, useEffect } from 'react';
import { MedicalRecord } from '../../types/user';
import { userService } from '../../services/userService';

const MedicalRecords: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    const data = userService.getMedicalRecords();
    setRecords(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">诊疗记录</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          + 添加记录
        </button>
      </div>

      <div className="space-y-4">
        {records.map(record => (
          <div key={record.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">{record.diagnosis}</h3>
              <span className="text-sm text-gray-500">{record.date}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p><span className="font-medium">医院：</span>{record.hospital}</p>
                <p><span className="font-medium">科室：</span>{record.department}</p>
                <p><span className="font-medium">医生：</span>{record.doctor}</p>
              </div>
              <div>
                <p><span className="font-medium">症状：</span>{record.symptoms}</p>
                <p><span className="font-medium">治疗：</span>{record.treatment}</p>
              </div>
            </div>
            {record.prescription && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-sm text-blue-800">处方：</p>
                <p className="text-sm text-blue-700">{record.prescription}</p>
              </div>
            )}
          </div>
        ))}

        {records.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-300 text-6xl mb-4">📋</div>
            <p className="text-gray-500">暂无诊疗记录</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;