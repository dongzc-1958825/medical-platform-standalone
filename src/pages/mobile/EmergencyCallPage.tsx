import React, { useState } from 'react';

const EmergencyCallPage: React.FC = () => {
    const [emergencyContacts] = useState([
        { id: '1', name: '张医生', relationship: '家庭医生', phone: '13800138000' },
        { id: '2', name: '李护士', relationship: '社区护士', phone: '13900139000' },
        { id: '3', name: '王小明', relationship: '紧急联系人', phone: '13600136000' },
        { id: '4', name: '120急救中心', relationship: '急救电话', phone: '120' }
    ]);

    const [emergencyInfo] = useState({
        bloodType: 'O型',
        allergies: '青霉素过敏',
        chronicConditions: '高血压',
        medications: '硝苯地平控释片 30mg'
    });

    const handleCall = (phoneNumber: string) => {
        if (window.confirm(`是否拨打电话 ${phoneNumber}？`)) {
            window.location.href = `tel:${phoneNumber}`;
        }
    };

    const handleSendSOS = () => {
        const message = `紧急求助！我的位置是：用户当前位置。我的健康信息：血型${emergencyInfo.bloodType}，过敏：${emergencyInfo.allergies}，慢性病：${emergencyInfo.chronicConditions}。`;
        
        emergencyContacts.forEach(contact => {
            console.log(`发送短信给 ${contact.name} (${contact.phone}): ${message}`);
        });
        
        alert('紧急求助信息已发送给所有紧急联系人！');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white p-4">
            {/* 紧急求助按钮 */}
            <div className="mb-8 text-center">
                <button
                    onClick={handleSendSOS}
                    className="w-32 h-32 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg flex flex-col items-center justify-center mx-auto mb-4 transition-transform hover:scale-105"
                >
                    <span className="text-4xl mb-2">🚨</span>
                    <span className="font-bold">紧急求助</span>
                </button>
                <p className="text-gray-600">点击发送求助信息给紧急联系人</p>
            </div>

            {/* 紧急联系人 */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">紧急联系人</h2>
                <div className="space-y-3">
                    {emergencyContacts.map((contact) => (
                        <div key={contact.id} className="bg-white rounded-xl shadow p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                                    <p className="text-sm text-gray-500">{contact.relationship}</p>
                                </div>
                                <button
                                    onClick={() => handleCall(contact.phone)}
                                    className="bg-red-100 hover:bg-red-200 text-red-600 font-medium py-2 px-4 rounded-lg transition"
                                >
                                    📞 {contact.phone}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 紧急健康信息 */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">紧急健康信息</h2>
                <div className="bg-white rounded-xl shadow p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">血型</p>
                            <p className="font-semibold text-red-600">{emergencyInfo.bloodType}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">过敏史</p>
                            <p className="font-semibold text-red-600">{emergencyInfo.allergies}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">慢性病</p>
                            <p className="font-semibold text-red-600">{emergencyInfo.chronicConditions}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">当前用药</p>
                            <p className="font-semibold text-red-600">{emergencyInfo.medications}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 紧急操作指南 */}
            <div className="bg-white rounded-xl shadow p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">紧急操作指南</h2>
                <div className="space-y-3">
                    <div className="flex items-start">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-red-600">1</span>
                        </div>
                        <div>
                            <h3 className="font-medium">保持冷静</h3>
                            <p className="text-sm text-gray-500">深呼吸，评估自己的状况</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-red-600">2</span>
                        </div>
                        <div>
                            <h3 className="font-medium">点击紧急求助</h3>
                            <p className="text-sm text-gray-500">发送位置和健康信息给联系人</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-red-600">3</span>
                        </div>
                        <div>
                            <h3 className="font-medium">拨打急救电话</h3>
                            <p className="text-sm text-gray-500">立即联系120或最近医院</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyCallPage;
