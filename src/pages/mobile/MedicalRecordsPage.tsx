// src/pages/mobile/MedicalRecordsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  FileText, 
  Upload, 
  Calendar, 
  Building2, 
  Download,
  Trash2,
  Plus,
  Search,
  AlertCircle,
  Filter,
  X,
  User,
  Stethoscope,
  Clock,
  Image as ImageIcon,
  Activity,
  Edit2
} from 'lucide-react';
import { clinicalRecordService } from '../../shared/services/clinicalRecordService';
import { MedicalRecord } from '../../shared/types/medicalRecord';
import RecordUploader from '../../components/records/RecordUploader';

// 纯文字记录表单组件
const TextOnlyForm: React.FC<{
  onSuccess: () => void;
  onClose: () => void;
  editRecord?: MedicalRecord | null;
}> = ({ onSuccess, onClose, editRecord }) => {
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
        // 编辑现有记录
        const updated = clinicalRecordService.updateRecord(editRecord.id, {
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
        // 新建记录
        const newRecord = clinicalRecordService.createTextRecord({
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
            {editRecord ? '编辑诊疗记录' : '新增诊疗记录'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* 第一行：就诊日期和类型 */}
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
                    <button
                      type="button"
                      onClick={() => handleRemoveSymptom(symptom)}
                      className="hover:text-orange-900"
                    >
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

const MedicalRecordsPage: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [showTextOnlyForm, setShowTextOnlyForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // 搜索和筛选条件
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [recordType, setRecordType] = useState('');
  const [hospital, setHospital] = useState('');

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [records, keyword, startDate, endDate, recordType, hospital]);

  const loadRecords = async () => {
    try {
      const data = clinicalRecordService.getRecords();
      setRecords(data);
    } catch (error) {
      console.error('加载诊疗记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...records];

    // 关键词检索
    if (keyword) {
      const searchTerm = keyword.toLowerCase();
      filtered = filtered.filter(record => 
        record.fileName.toLowerCase().includes(searchTerm) ||
        record.hospital.toLowerCase().includes(searchTerm) ||
        record.department?.toLowerCase().includes(searchTerm) ||
        record.doctor?.toLowerCase().includes(searchTerm) ||
        record.diagnosis.toLowerCase().includes(searchTerm) ||
        record.symptoms?.some(s => s.toLowerCase().includes(searchTerm))
      );
    }

    // 日期范围筛选
    if (startDate) {
      filtered = filtered.filter(record => record.recordDate >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(record => record.recordDate <= endDate);
    }

    // 记录类型筛选
    if (recordType) {
      filtered = filtered.filter(record => record.recordType === recordType);
    }

    // 医院筛选
    if (hospital) {
      filtered = filtered.filter(record => 
        record.hospital.toLowerCase().includes(hospital.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  };

  const clearFilters = () => {
    setKeyword('');
    setStartDate('');
    setEndDate('');
    setRecordType('');
    setHospital('');
    setShowFilters(false);
  };

  const handleUploadSuccess = (recordId: string) => {
    loadRecords();
    setShowUploader(false);
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('确定要删除这份诊疗记录吗？')) {
      const success = clinicalRecordService.deleteRecord(id);
      if (success) {
        loadRecords();
      }
    }
  };

  const handleDownload = (record: MedicalRecord) => {
    const link = document.createElement('a');
    link.href = record.fileData;
    link.download = record.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = (record: MedicalRecord) => {
    if (record.fileType.startsWith('image/')) {
      try {
        const base64Data = record.fileData.split(',')[1] || record.fileData;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: record.fileType });
        const blobUrl = URL.createObjectURL(blob);
        
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
          previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${record.fileName}</title>
                <style>
                  body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f5f5f5; }
                  img { max-width: 100%; max-height: 90vh; object-fit: contain; }
                  .close-btn { position: fixed; top: 16px; right: 16px; padding: 8px 16px; background: white; border: none; border-radius: 20px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
                </style>
              </head>
              <body>
                <button class="close-btn" onclick="window.close()">关闭</button>
                <img src="${blobUrl}" alt="${record.fileName}" />
              </body>
            </html>
          `);
          previewWindow.document.close();
          
          previewWindow.onunload = () => {
            URL.revokeObjectURL(blobUrl);
          };
        }
      } catch (error) {
        console.error('图片预览失败:', error);
        alert('图片预览失败，请尝试下载后查看');
      }
    } else {
      try {
        const base64Data = record.fileData.split(',')[1] || record.fileData;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        
        const previewWindow = window.open('', '_blank');
        if (previewWindow) {
          previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${record.fileName}</title>
                <style>
                  body { margin: 0; display: flex; flex-direction: column; height: 100vh; }
                  .toolbar { padding: 12px; background: white; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; }
                  .close-btn { padding: 8px 16px; background: #f3f4f6; border: none; border-radius: 6px; cursor: pointer; }
                  iframe { flex: 1; width: 100%; border: none; }
                </style>
              </head>
              <body>
                <div class="toolbar">
                  <span>${record.fileName}</span>
                  <button class="close-btn" onclick="window.close()">关闭</button>
                </div>
                <iframe src="${blobUrl}" type="application/pdf"></iframe>
              </body>
            </html>
          `);
          previewWindow.document.close();
          
          previewWindow.onunload = () => {
            URL.revokeObjectURL(blobUrl);
          };
        }
      } catch (error) {
        console.error('PDF预览失败:', error);
        alert('PDF预览失败，请尝试下载后查看');
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    } catch {
      return dateString;
    }
  };

  const getRecordTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      '门诊': 'bg-blue-100 text-blue-700',
      '住院': 'bg-purple-100 text-purple-700',
      '检查': 'bg-green-100 text-green-700',
      '手术': 'bg-orange-100 text-orange-700',
      '急诊': 'bg-red-100 text-red-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const totalSize = records.reduce((sum, r) => sum + r.fileSize, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载诊疗记录...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* 顶部导航 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate('/mobile/profile')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>返回</span>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">诊疗记录</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTextOnlyForm(true)}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="新增文字记录"
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowUploader(true)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="上传文件"
            >
              <Upload className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="px-4 pb-4 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索医院、医生、诊断..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-lg transition-colors ${
              showFilters || startDate || endDate || recordType || hospital
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* 筛选条件 */}
        {showFilters && (
          <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">开始日期</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">结束日期</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">记录类型</label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white"
                >
                  <option value="">全部</option>
                  <option value="门诊">门诊</option>
                  <option value="住院">住院</option>
                  <option value="检查">检查</option>
                  <option value="手术">手术</option>
                  <option value="急诊">急诊</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">医院</label>
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  placeholder="输入医院名称"
                  className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            {(startDate || endDate || recordType || hospital) && (
              <button
                onClick={clearFilters}
                className="flex items-center justify-center w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                清除筛选条件
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        {/* 统计卡片 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm p-5 text-white mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              <div>
                <p className="text-sm text-blue-100">总记录数</p>
                <p className="text-2xl font-bold">{filteredRecords.length}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">占用空间</p>
              <p className="text-lg font-semibold">
                {clinicalRecordService.formatFileSize(totalSize)}
              </p>
            </div>
          </div>
        </div>

        {/* 记录列表 */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无诊疗记录</h3>
            <p className="text-sm text-gray-500 mb-6">
              {keyword || startDate || endDate || recordType || hospital
                ? '没有找到匹配的记录'
                : '点击右上角按钮新增记录或上传文件'}
            </p>
            {!keyword && !startDate && !endDate && !recordType && !hospital && (
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowTextOnlyForm(true)}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  新增记录
                </button>
                <button
                  onClick={() => setShowUploader(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  上传文件
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all relative group"
              >
                {/* 编辑按钮 */}
                <button
                  onClick={() => {
                    setEditingRecord(record);
                    setShowTextOnlyForm(true);
                  }}
                  className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
                  title="编辑"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <div className="flex items-start space-x-3">
                  {/* 文件图标/缩略图 */}
                  <div className="flex-shrink-0">
                    {record.thumbnail ? (
                      <img 
                        src={record.thumbnail} 
                        alt="缩略图" 
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    ) : record.fileType.startsWith('image/') ? (
                      <div className="w-16 h-16 bg-purple-50 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-purple-600" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-blue-600" />
                      </div>
                    )}
                  </div>
                  
                  {/* 记录信息 */}
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate pr-2">
                        {record.fileName}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${getRecordTypeColor(record.recordType)}`}>
                        {record.recordType}
                      </span>
                    </div>
                    
                    {/* 基本信息 */}
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>{formatDate(record.recordDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Building2 className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{record.hospital}</span>
                      </div>
                      {(record.department || record.doctor) && (
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {[record.department, record.doctor].filter(Boolean).join(' · ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 症状 */}
                    {record.symptoms && record.symptoms.length > 0 && (
                      <div className="mt-2">
                        <div className="flex items-start">
                          <span className="text-xs text-gray-500 mr-2 w-12">症状：</span>
                          <div className="flex flex-wrap gap-1 flex-1">
                            {record.symptoms.map((symptom, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full text-xs">
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 诊断 */}
                    <div className="mt-2">
                      <div className="flex items-start">
                        <span className="text-xs text-gray-500 mr-2 w-12">诊断：</span>
                        <span className="text-xs text-gray-700 flex-1">{record.diagnosis}</span>
                      </div>
                    </div>

                    {/* 治疗 */}
                    {record.treatment && (
                      <div className="mt-1">
                        <div className="flex items-start">
                          <span className="text-xs text-gray-500 mr-2 w-12">治疗：</span>
                          <span className="text-xs text-gray-600 flex-1">{record.treatment}</span>
                        </div>
                      </div>
                    )}

                    {/* 效果 */}
                    {record.outcome && (
                      <div className="mt-1">
                        <div className="flex items-start">
                          <span className="text-xs text-gray-500 mr-2 w-12">效果：</span>
                          <span className="text-xs text-gray-600 flex-1">{record.outcome}</span>
                        </div>
                      </div>
                    )}

                    {/* 备注 */}
                    {record.notes && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs text-blue-700">
                        📝 {record.notes}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex items-center justify-end space-x-2 mt-3 pt-2 border-t border-gray-100">
                  {record.fileData && record.fileData.length > 0 && (
                    <>
                      <button
                        onClick={() => handlePreview(record)}
                        className="flex items-center px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" />
                        预览
                      </button>
                      <button
                        onClick={() => handleDownload(record)}
                        className="flex items-center px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        下载
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteRecord(record.id)}
                    className="flex items-center px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 上传弹窗 */}
      {showUploader && (
        <RecordUploader
          onUploadSuccess={handleUploadSuccess}
          onClose={() => setShowUploader(false)}
        />
      )}

      {/* 纯文字记录表单 */}
      {showTextOnlyForm && (
        <TextOnlyForm
          editRecord={editingRecord}
          onSuccess={() => {
            loadRecords();
            setEditingRecord(null);
          }}
          onClose={() => {
            setShowTextOnlyForm(false);
            setEditingRecord(null);
          }}
        />
      )}
    </div>
  );
};

export default MedicalRecordsPage;