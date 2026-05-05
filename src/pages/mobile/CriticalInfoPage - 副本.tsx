import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CriticalInfoPage: React.FC = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        bloodType: '',
        allergies: '',
        chronicDiseases: '',
        currentMedications: '',
        surgeryHistory: '',
        familyHistory: '',
        height: '',
        weight: '',
        emergencyContact: {
            name: '',
            phone: '',
            relationship: ''
        }
    });

    const bloodTypes = ['A型', 'B型', 'O型', 'AB型', '未知'];
    const relationshipOptions = ['配偶', '父母', '子女', '兄弟姐妹', '其他亲属', '朋友'];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEmergencyContactChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            emergencyContact: {
                ...prev.emergencyContact,
                [field]: value
            }
        }));
    };

    const handleSubmit = () => {
        localStorage.setItem('healthCriticalInfo', JSON.stringify(formData));
        alert('关键信息已保存！');
        navigate('/health-overview');
    };

    const calculateBMI = () => {
        if (formData.height && formData.weight) {
            const heightInMeters = parseFloat(formData.height) / 100;
            const weight = parseFloat(formData.weight);
            if (heightInMeters > 0) {
                return (weight / (heightInMeters * heightInMeters)).toFixed(1);
            }
        }
        return null;
    };

    const bmi = calculateBMI();
    const bmiCategory = bmi ? 
        parseFloat(bmi) < 18.5 ? '偏瘦' :
        parseFloat(bmi) < 24 ? '正常' :
        parseFloat(bmi) < 28 ? '超重' : '肥胖' : '';

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">📋 关键信息录入</h1>
                <p className="text-gray-600">请完善以下信息，这是健康管理的基础</p>
            </header>

            <div className="bg-white rounded-xl shadow p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">基本信息</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">身高 (cm)</label>
                        <input
                            type="number"
                            value={formData.height}
                            onChange={(e) => handleInputChange('height', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="例如：170"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">体重 (kg)</label>
                        <input
                            type="number"
                            value={formData.weight}
                            onChange={(e) => handleInputChange('weight', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="例如：65"
                        />
                    </div>
                </div>

                {bmi && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">BMI 指数</p>
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-blue-600">{bmi}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                bmiCategory === '正常' ? 'bg-green-100 text-green-600' :
                                bmiCategory === '偏瘦' ? 'bg-yellow-100 text-yellow-600' :
                                bmiCategory === '超重' ? 'bg-orange-100 text-orange-600' :
                                'bg-red-100 text-red-600'
                            }`}>
                                {bmiCategory}
                            </span>
                        </div>
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">血型</label>
                    <select
                        value={formData.bloodType}
                        onChange={(e) => handleInputChange('bloodType', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                        <option value="">请选择血型</option>
                        {bloodTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">医疗信息</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">过敏史</label>
                        <textarea
                            value={formData.allergies}
                            onChange={(e) => handleInputChange('allergies', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            rows={2}
                            placeholder="例如：青霉素过敏、海鲜过敏等"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">慢性病史</label>
                        <textarea
                            value={formData.chronicDiseases}
                            onChange={(e) => handleInputChange('chronicDiseases', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            rows={2}
                            placeholder="例如：高血压、糖尿病、哮喘等"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">当前用药</label>
                        <textarea
                            value={formData.currentMedications}
                            onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            rows={2}
                            placeholder="例如：硝苯地平控释片 30mg 每日一次"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">手术史</label>
                        <textarea
                            value={formData.surgeryHistory}
                            onChange={(e) => handleInputChange('surgeryHistory', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            rows={2}
                            placeholder="例如：2018年阑尾切除术"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">家族病史</label>
                        <textarea
                            value={formData.familyHistory}
                            onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            rows={2}
                            placeholder="例如：父亲高血压、母亲糖尿病"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4 mb-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">紧急联系人</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">联系人姓名</label>
                        <input
                            type="text"
                            value={formData.emergencyContact.name}
                            onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="请输入联系人姓名"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                        <input
                            type="tel"
                            value={formData.emergencyContact.phone}
                            onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="请输入联系电话"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">关系</label>
                        <select
                            value={formData.emergencyContact.relationship}
                            onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="">请选择关系</option>
                            {relationshipOptions.map(rel => (
                                <option key={rel} value={rel}>{rel}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-3 sticky bottom-0 bg-gray-50 pt-4 pb-6">
                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition"
                >
                    保存关键信息
                </button>
                
                <button
                    onClick={() => navigate('/health-overview')}
                    className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition"
                >
                    跳过，稍后填写
                </button>
            </div>
        </div>
    );
};

export default CriticalInfoPage;