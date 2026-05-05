import React from 'react';

const HealthReminderPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">⏰ 健康提醒</h1>
                <p className="text-gray-600">基于您的健康档案的个性化提醒</p>
            </header>

            <div className="space-y-4">
                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-red-600">💊</span>
                        </div>
                        <div>
                            <h3 className="font-semibold">服药提醒</h3>
                            <p className="text-sm text-gray-500">每天 08:00, 20:00</p>
                        </div>
                    </div>
                    <p className="text-gray-700">降压药：硝苯地平控释片 30mg</p>
                </div>

                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600">🏥</span>
                        </div>
                        <div>
                            <h3 className="font-semibold">复诊提醒</h3>
                            <p className="text-sm text-gray-500">2024年12月15日</p>
                        </div>
                    </div>
                    <p className="text-gray-700">心内科门诊复诊</p>
                </div>

                <div className="bg-white rounded-xl shadow p-4">
                    <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-green-600">📝</span>
                        </div>
                        <div>
                            <h3 className="font-semibold">问卷提醒</h3>
                            <p className="text-sm text-gray-500">每月1日</p>
                        </div>
                    </div>
                    <p className="text-gray-700">健康生活习惯问卷</p>
                </div>
            </div>
        </div>
    );
};

export default HealthReminderPage;