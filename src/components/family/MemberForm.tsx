// src/components/family/MemberForm.tsx
import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { FamilyMember } from '../../shared/types/family';

interface MemberFormProps {
  initialData?: FamilyMember;
  onSave: (member: Omit<FamilyMember, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ initialData, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    birthDate: initialData?.birthDate || '',
    gender: initialData?.gender || '男' as const,
    relationship: initialData?.relationship || '其他' as const,
    height: initialData?.height || undefined,
    weight: initialData?.weight || undefined,
    bloodType: initialData?.bloodType || undefined,
    allergies: initialData?.allergies || [],
    chronicDiseases: initialData?.chronicDiseases || [],
    surgicalHistory: initialData?.surgicalHistory || [],
    otherConditions: initialData?.otherConditions || [],
    notes: initialData?.notes || '',
    avatar: initialData?.avatar
  });

  const [currentAllergy, setCurrentAllergy] = useState('');
  const [currentChronic, setCurrentChronic] = useState('');
  const [currentSurgery, setCurrentSurgery] = useState('');
  const [currentOther, setCurrentOther] = useState('');

  // 添加各项记录
  const handleAddAllergy = () => {
    if (currentAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...(prev.allergies || []), currentAllergy.trim()]
      }));
      setCurrentAllergy('');
    }
  };

  const handleAddChronic = () => {
    if (currentChronic.trim()) {
      setFormData(prev => ({
        ...prev,
        chronicDiseases: [...(prev.chronicDiseases || []), currentChronic.trim()]
      }));
      setCurrentChronic('');
    }
  };

  const handleAddSurgery = () => {
    if (currentSurgery.trim()) {
      setFormData(prev => ({
        ...prev,
        surgicalHistory: [...(prev.surgicalHistory || []), currentSurgery.trim()]
      }));
      setCurrentSurgery('');
    }
  };

  const handleAddOther = () => {
    if (currentOther.trim()) {
      setFormData(prev => ({
        ...prev,
        otherConditions: [...(prev.otherConditions || []), currentOther.trim()]
      }));
      setCurrentOther('');
    }
  };

  // 删除各项记录
  const handleRemoveAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies?.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveChronic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chronicDiseases: prev.chronicDiseases?.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveSurgery = (index: number) => {
    setFormData(prev => ({
      ...prev,
      surgicalHistory: prev.surgicalHistory?.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveOther = (index: number) => {
    setFormData(prev => ({
      ...prev,
      otherConditions: prev.otherConditions?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.name.trim()) {
      alert('请输入姓名');
      return;
    }
    if (!formData.birthDate) {
      alert('请选择出生日期');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {initialData ? '编辑家庭成员' : '添加家庭成员'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">基本信息</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入姓名"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  出生日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  性别
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="其他">其他</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  亲属关系
                </label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value as any })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="本人">本人</option>
                  <option value="配偶">配偶</option>
                  <option value="子女">子女</option>
                  <option value="父母">父母</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>
          </div>

          {/* 身体指标 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">身体指标</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  身高 (cm)
                </label>
                <input
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="170"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  体重 (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value ? Number(e.target.value) : undefined })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="65"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  血型
                </label>
                <select
                  value={formData.bloodType || ''}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value as any })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">未选择</option>
                  <option value="A">A型</option>
                  <option value="B">B型</option>
                  <option value="AB">AB型</option>
                  <option value="O">O型</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>
          </div>

          {/* 过敏史 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">过敏史</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentAllergy}
                onChange={(e) => setCurrentAllergy(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAllergy())}
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="例如：青霉素过敏"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {formData.allergies && formData.allergies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.allergies.map((item, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                    {item}
                    <button type="button" onClick={() => handleRemoveAllergy(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 慢性病史 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">慢性病史</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentChronic}
                onChange={(e) => setCurrentChronic(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChronic())}
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="例如：高血压"
              />
              <button
                type="button"
                onClick={handleAddChronic}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {formData.chronicDiseases && formData.chronicDiseases.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.chronicDiseases.map((item, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
                    {item}
                    <button type="button" onClick={() => handleRemoveChronic(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 手术史 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">手术史</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentSurgery}
                onChange={(e) => setCurrentSurgery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSurgery())}
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="例如：阑尾炎手术"
              />
              <button
                type="button"
                onClick={handleAddSurgery}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {formData.surgicalHistory && formData.surgicalHistory.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.surgicalHistory.map((item, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                    {item}
                    <button type="button" onClick={() => handleRemoveSurgery(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 其他情况 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">其他情况</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentOther}
                onChange={(e) => setCurrentOther(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOther())}
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="例如：特殊用药"
              />
              <button
                type="button"
                onClick={handleAddOther}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {formData.otherConditions && formData.otherConditions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.otherConditions.map((item, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {item}
                    <button type="button" onClick={() => handleRemoveOther(index)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="其他需要记录的信息..."
            />
          </div>

          {/* 提交按钮 */}
          <div className="sticky bottom-0 bg-white pt-4 border-t">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {initialData ? '保存修改' : '添加成员'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;