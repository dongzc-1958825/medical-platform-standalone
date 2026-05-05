import React, { useState, useEffect } from 'react';
import { PhysicalExam } from '../../types/user';
import { userService } from '../../services/userService';

const PhysicalExams: React.FC = () => {
  const [exams, setExams] = useState<PhysicalExam[]>([]);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = () => {
    const data = userService.getPhysicalExams();
    setExams(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">体检报告</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          + 添加报告
        </button>
      </div>

      <div className="space-y-4">
        {exams.map(exam => (
          <div key={exam.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">{exam.hospital}</h3>
                <p className="text-sm text-gray-600">{exam.date} · {exam.doctor}</p>
              </div>
              <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">正常</span>
            </div>
            
            {exam.summary && (
              <p className="text-gray-700 mb-4">{exam.summary}</p>
            )}

            <div className="space-y-2">
              {exam.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({item.normalRange})</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold ${item.isNormal ? 'text-green-600' : 'text-red-600'}`}>
                      {item.result} {item.unit || ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {exams.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-300 text-6xl mb-4">🔍</div>
            <p className="text-gray-500">暂无体检报告</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhysicalExams;