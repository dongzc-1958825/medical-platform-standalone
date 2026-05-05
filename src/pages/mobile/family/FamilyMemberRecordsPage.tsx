// src/pages/mobile/family/FamilyMemberRecordsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Upload, FileText, X } from 'lucide-react';
import { familyService } from '../../../shared/services/familyService';
import { FamilyMember, FamilyHealthRecord } from '../../../shared/types/family';
import HealthRecordList from '../../../components/family/HealthRecordList';
import RecordUploader from '../../../components/records/RecordUploader';

// 纯文字记录表单（复用诊疗记录的逻辑）
const TextOnlyRecordForm: React.FC<{
  memberId: string;
  memberName: string;
  editRecord?: FamilyHealthRecord | null;
  onSuccess: () => void;
  onClose: () => void;
}> = ({ memberId, memberName, editRecord, onSuccess, onClose }) => {
  const [recordDate, setRecordDate] = useState(editRecord?.recordDate || new Date().toISOString().split('T')[0]);
  const [hospital, setHospital] = useState(editRecord?.hospital || '');
  const [department, setDepartment] = useState(editRecord?.department || '');
  const [doctor, setDoctor] = useState(editRecord?.doctor || '');
  const [diagnosis, setDiagnosis] = useState(editRecord?.diagnosis || '');
  const [recordType, setRecordType] = useState(editRecord?.recordType || '门诊');
  const [symptoms, setSymptoms] = useState<string[]>(editRecord?.symptoms || []);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [treatment, setTreatment] = useState(editRecord?.treatment || '');
  const [outcome, setOutcome] = useState(editRecord?.outcome || '');
  const [notes, setNotes] = useState(editRecord?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleSubmit = async () => {
    if (!hospital.trim()) {
      alert('请输入就诊医院');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editRecord) {
        // 更新现有记录
        const updated = familyService.updateHealthRecord(editRecord.id, {
          recordDate,
          hospital,
          department,
          doctor,
          diagnosis,
          recordType: recordType as any,
          symptoms,
          treatment,
          outcome,
          notes
        });
        if (updated) {
          onSuccess();
          onClose();
        }
      } else {
        // 新增记录
        const newRecord = familyService.addHealthRecord(memberId, memberName, {
          recordDate,
          hospital,
          department,
          doctor,
          diagnosis,
          recordType: recordType as any,
          symptoms,
          treatment,
          outcome,
          notes
        });
        if (newRecord) {
          onSuccess();
          onClose();
        }
      }
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {editRecord ? '编辑健康记录' : '新增健康记录'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* 就诊日期和类型 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">就诊日期</label>
              <input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">记录类型</label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="门诊">门诊</option>
                <option value="住院">住院</option>
                <option value="检查">检查</option>
                <option value="手术">手术</option>
                <option value="急诊">急诊</option>
              </select>
            </div>
          </div>

          {/* 医院 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              就诊医院 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              placeholder="例如：市人民医院"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 科室和医生 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">就诊科室</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="例如：心血管内科"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">医生姓名</label>
              <input
                type="text"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                placeholder="例如：张医生"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* 诊断结果 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">诊断结果</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="例如：高血压"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 症状 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">症状</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentSymptom}
                onChange={(e) => setCurrentSymptom(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSymptom())}
                placeholder="输入症状，按Enter添加"
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={handleAddSymptom}
                disabled={!currentSymptom.trim()}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50"
              >
                添加
              </button>
            </div>
            {symptoms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                  >
                    {symptom}
                    <button type="button" onClick={() => handleRemoveSymptom(symptom)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 治疗方案 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">治疗方案</label>
            <textarea
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder="描述治疗方案..."
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* 治疗效果 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">治疗效果</label>
            <textarea
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="描述治疗效果..."
              rows={3}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* 备注 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">备注</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="其他需要记录的信息..."
              rows={2}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-white border-t p-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !hospital.trim()}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? '保存中...' : (editRecord ? '更新记录' : '保存记录')}
          </button>
        </div>
      </div>
    </div>
  );
};

const FamilyMemberRecordsPage: React.FC = () => {
  const navigate = useNavigate();
  const { memberId } = useParams<{ memberId: string }>();
  const [searchParams] = useSearchParams();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [records, setRecords] = useState<FamilyHealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [showTextForm, setShowTextForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FamilyHealthRecord | null>(null);

  // 检查是否有 action=add 参数，自动打开新增表单
  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      setEditingRecord(null);
      setShowTextForm(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!memberId) {
      navigate('/mobile/family');
      return;
    }
    loadData();
  }, [memberId]);

  const loadData = () => {
    const memberData = familyService.getMember(memberId!);
    if (!memberData) {
      navigate('/mobile/family');
      return;
    }
    setMember(memberData);
    
    const memberRecords = familyService.getMemberHealthRecords(memberId!);
    setRecords(memberRecords);
    setLoading(false);
  };

  const handleUploadSuccess = (recordId: string) => {
    loadData();
    setShowUploader(false);
  };

  const handleAddTextRecord = () => {
    setEditingRecord(null);
    setShowTextForm(true);
  };

  const handleEditRecord = (record: FamilyHealthRecord) => {
    setEditingRecord(record);
    setShowTextForm(true);
  };

  const handleDeleteRecord = (recordId: string) => {
    if (window.confirm('确定要删除这条健康记录吗？')) {
      const success = familyService.deleteHealthRecord(recordId);
      if (success) {
        loadData();
      }
    }
  };

  const handlePreview = (record: FamilyHealthRecord) => {
    // TODO: 实现文件预览
    alert('文件预览功能开发中');
  };

  const handleDownload = (record: FamilyHealthRecord) => {
    // TODO: 实现文件下载
    alert('文件下载功能开发中');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="text-center">成员不存在</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(`/mobile/family`)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>返回</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{member.name}的健康记录</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowUploader(true)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="上传文件"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              onClick={handleAddTextRecord}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="新增记录"
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* 统计卡片 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-4 text-white mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">总记录数</p>
              <p className="text-2xl font-bold">{records.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">最近记录</p>
              <p className="text-sm font-medium">
                {records.length > 0 ? records[0].recordDate : '无'}
              </p>
            </div>
          </div>
        </div>

        {/* 记录列表 */}
        <HealthRecordList
          records={records}
          memberName={member.name}
          onAdd={handleAddTextRecord}
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
          onPreview={handlePreview}
          onDownload={handleDownload}
        />
      </div>

      {/* 上传弹窗 */}
      {showUploader && (
        <RecordUploader
          onUploadSuccess={handleUploadSuccess}
          onClose={() => setShowUploader(false)}
        />
      )}

      {/* 纯文字记录表单 */}
      {showTextForm && (
        <TextOnlyRecordForm
          memberId={member.id}
          memberName={member.name}
          editRecord={editingRecord}
          onSuccess={loadData}
          onClose={() => {
            setShowTextForm(false);
            setEditingRecord(null);
          }}
        />
      )}
    </div>
  );
};

export default FamilyMemberRecordsPage;