import React from 'react';

const ConsultationPage: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">寻医问药</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          发起求助
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">寻医问药功能开发中...</p>
      </div>
    </div>
  );
};

export default ConsultationPage;