import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { consultService, 
  PatientBasicInfo, 
  SymptomDetail, 
  MedicalHistory,
  DiagnosisInfo,
  TreatmentInfo,
  CourseInfo,
  EfficacyInfo,
  UploadedFile 
} from '../../shared/services/consultService';
import { medicalRecordService } from '../../shared/services/medicalRecordService';
import { AlertCircle, CheckCircle, Upload, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';

// ========== 组件 Props 接口 ==========
interface CompleteConsultFormProps {
  user?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: any;  // 初始数据（编辑模式用）
  isEditing?: boolean; // 是否是编辑模式
}

interface FormData {
  // 1. 患者基本信息
  patient?: PatientBasicInfo;
  
  // 2. 症状详细描述
  symptoms: SymptomDetail[];
  
  // 3. 病史信息
  medicalHistory?: MedicalHistory;
  
  // 4. 诊断信息
  diagnosis?: DiagnosisInfo;
  
  // 5. 治疗信息
  treatment?: TreatmentInfo;
  
  // 6. 病程信息
  course?: CourseInfo;
  
  // 7. 疗效信息
  efficacy?: EfficacyInfo;
  
  // 8. 主要诉求
  mainRequest: string;
  
  // 9. 紧急程度
  urgency: 'normal' | 'urgent' | 'critical';
  
  // 10. 上传的文件
  uploadedFiles: UploadedFile[];
  
  // 11. 补充说明
  additionalInfo?: string;
}

// ==================== 文件上传组件 ====================
const FileUploadSection: React.FC<{
  files: UploadedFile[];
  onUpload: (files: File[]) => void;
  onRemove: (id: string) => void;
  uploading: boolean;
  uploadError: string | null;
}> = ({ files, onUpload, onRemove, uploading, uploadError }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    onUpload(selectedFiles);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="mb-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="text-center">
            <span className="text-2xl block mb-2">📤</span>
            <span className="text-sm text-gray-600">
              点击或拖拽文件上传
            </span>
            <span className="text-xs text-gray-400 block mt-1">
              可上传检查报告、处方单、出院小结等
            </span>
          </div>
        </label>
      </div>

      {/* 错误提示 */}
      {uploadError && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-xs text-red-600">{uploadError}</span>
        </div>
      )}

      {/* 文件列表 */}
      {files.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {files.map(file => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-white p-2 rounded border"
            >
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-xl">{getFileIcon(file.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{file.uploadTime || new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 文件分类 */}
              <select
                value={file.category}
                onChange={(e) => {
                  file.category = e.target.value as any;
                }}
                className="text-xs border rounded px-2 py-1 mx-2"
              >
                <option value="labReport">化验单</option>
                <option value="prescription">处方单</option>
                <option value="dischargeSummary">出院小结</option>
                <option value="image">影像资料</option>
                <option value="other">其他</option>
              </select>

              {/* 预览按钮 */}
              <button
                onClick={() => window.open(file.url, '_blank')}
                className="text-blue-500 hover:text-blue-700 px-2"
                title="预览"
              >
                👁️
              </button>

              {/* 删除按钮 */}
              <button
                onClick={() => onRemove(file.id)}
                className="text-red-500 hover:text-red-700 px-2"
                title="删除"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="text-center py-2">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-xs text-gray-500 ml-2">上传中...</span>
        </div>
      )}
    </div>
  );
};

// ==================== 主组件 ====================
const CompleteConsultForm: React.FC<CompleteConsultFormProps> = ({ 
  user: propUser, 
  onSuccess, 
  onCancel,
  initialData,
  isEditing = false 
}) => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const currentUser = propUser || authUser;
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    // 如果是编辑模式且有初始数据，用初始数据填充
    if (isEditing && initialData) {
      console.log('📝 编辑模式，加载初始数据:', initialData);
      return {
        patient: initialData.patientInfo || {},
        symptoms: initialData.symptomDetails || [],
        medicalHistory: initialData.medicalHistory || {},
        diagnosis: initialData.diagnosis || {},
        treatment: initialData.treatment || {},
        course: initialData.course || {},
        efficacy: initialData.efficacy || {},
        mainRequest: initialData.mainRequest || '',
        urgency: initialData.urgency || 'normal',
        uploadedFiles: initialData.uploadedFiles || [],
        additionalInfo: initialData.additionalInfo || ''
      };
    }
    
    // 新建模式：空数据
    return {
      symptoms: [],
      mainRequest: '',
      urgency: 'normal',
      uploadedFiles: []
    };
  });
  
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ==================== 辅助函数 ====================
  const updatePatient = (field: keyof PatientBasicInfo, value: any) => {
    setFormData(prev => ({
      ...prev,
      patient: { ...prev.patient, [field]: value } as PatientBasicInfo
    }));
  };

  const addSymptom = () => {
    setFormData(prev => ({
      ...prev,
      symptoms: [
        ...prev.symptoms,
        {
          name: '',
          characteristic: [],
          aggravating: [],
          relieving: [],
          severity: 3
        }
      ]
    }));
  };

  const updateSymptom = (index: number, field: keyof SymptomDetail, value: any) => {
    setFormData(prev => {
      const symptoms = [...prev.symptoms];
      symptoms[index] = { ...symptoms[index], [field]: value };
      return { ...prev, symptoms };
    });
  };

  const removeSymptom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }));
  };

  const toggleBaseline = (disease: string, checked: boolean) => {
    setFormData(prev => {
      const current = prev.medicalHistory?.baselineDiseases || [];
      const updated = checked
        ? [...current, disease]
        : current.filter(d => d !== disease);
      return {
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          baselineDiseases: updated
        }
      };
    });
  };

  const updateAllergies = (type: 'drug' | 'food' | 'other', value: string) => {
    const items = value.split(/[，,、]/).filter(s => s.trim());
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        allergies: {
          ...prev.medicalHistory?.allergies,
          [type]: items
        }
      }
    }));
  };

  const addSurgery = () => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        surgeries: [
          ...(prev.medicalHistory?.surgeries || []),
          { name: '', year: '' }
        ]
      }
    }));
  };

  const updateSurgery = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const surgeries = [...(prev.medicalHistory?.surgeries || [])];
      surgeries[index] = { ...surgeries[index], [field]: value };
      return {
        ...prev,
        medicalHistory: { ...prev.medicalHistory, surgeries }
      };
    });
  };

  const removeSurgery = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        surgeries: prev.medicalHistory?.surgeries?.filter((_, i) => i !== index)
      }
    }));
  };

  const toggleFamilyHistory = (disease: string, checked: boolean) => {
    setFormData(prev => {
      const current = prev.medicalHistory?.familyHistory || [];
      const updated = checked
        ? [...current, disease]
        : current.filter(d => d !== disease);
      return {
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          familyHistory: updated
        }
      };
    });
  };

  const addHospital = () => {
    setFormData(prev => ({
      ...prev,
      diagnosis: {
        ...prev.diagnosis,
        hospitals: [
          ...(prev.diagnosis?.hospitals || []),
          { name: '', department: '', diagnosis: '', date: '' }
        ]
      }
    }));
  };

  const updateHospital = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const hospitals = [...(prev.diagnosis?.hospitals || [])];
      hospitals[index] = { ...hospitals[index], [field]: value };
      return {
        ...prev,
        diagnosis: { ...prev.diagnosis, hospitals }
      };
    });
  };

  const removeHospital = (index: number) => {
    setFormData(prev => ({
      ...prev,
      diagnosis: {
        ...prev.diagnosis,
        hospitals: prev.diagnosis?.hospitals?.filter((_, i) => i !== index)
      }
    }));
  };

  const addTreatment = () => {
    setFormData(prev => ({
      ...prev,
      treatment: {
        ...prev.treatment,
        records: [
          ...(prev.treatment?.records || []),
          { hospital: '', medications: [], startDate: '' }
        ]
      }
    }));
  };

  const updateTreatment = (index: number, field: string, value: any) => {
    setFormData(prev => {
      const records = [...(prev.treatment?.records || [])];
      records[index] = { ...records[index], [field]: value };
      return {
        ...prev,
        treatment: { ...prev.treatment, records }
      };
    });
  };

  const removeTreatment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      treatment: {
        ...prev.treatment,
        records: prev.treatment?.records?.filter((_, i) => i !== index)
      }
    }));
  };

  const addMedication = (treatmentIndex: number) => {
    setFormData(prev => {
      const records = [...(prev.treatment?.records || [])];
      records[treatmentIndex].medications.push({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        efficacy: '有效'
      });
      return {
        ...prev,
        treatment: { ...prev.treatment, records }
      };
    });
  };

  const updateMedication = (treatmentIndex: number, medIndex: number, field: string, value: string) => {
    setFormData(prev => {
      const records = [...(prev.treatment?.records || [])];
      records[treatmentIndex].medications[medIndex] = {
        ...records[treatmentIndex].medications[medIndex],
        [field]: value
      };
      return {
        ...prev,
        treatment: { ...prev.treatment, records }
      };
    });
  };

  const updateCourse = (field: keyof CourseInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      course: { ...prev.course, [field]: value }
    }));
  };

  const updateEfficacy = (field: keyof EfficacyInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      efficacy: { ...prev.efficacy, [field]: value }
    }));
  };

  // 文件上传处理
  const handleFileUpload = async (files: File[]) => {
    const uploadedFiles: UploadedFile[] = [];

    setUploading(true);
    setUploadError(null);

    for (const file of files) {
      // 检查文件类型
      const isValidType = medicalRecordService.isSupportedFile(file);
      if (!isValidType) {
        setUploadError(`不支持的文件类型: ${file.name}`);
        continue;
      }

      // 检查文件大小 (50MB)
      if (file.size > 50 * 1024 * 1024) {
        setUploadError(`文件大小不能超过50MB: ${file.name}`);
        continue;
      }

      try {
        // 转换为Base64
        const url = await readFileAsDataURL(file);
        
        uploadedFiles.push({
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url,
          uploadTime: new Date().toLocaleString(),
          category: getFileCategory(file.name)
        });
      } catch (error) {
        console.error('文件上传失败:', error);
        setUploadError(`文件上传失败: ${file.name}`);
      }
    }

    setFormData(prev => ({
      ...prev,
      uploadedFiles: [...(prev.uploadedFiles || []), ...uploadedFiles]
    }));
    setUploading(false);
  };

  const handleFileRemove = (fileId: string) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles?.filter(f => f.id !== fileId) || []
    }));
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const getFileCategory = (fileName: string): UploadedFile['category'] => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('化验') || lowerName.includes('血常规') || lowerName.includes('尿常规')) {
      return 'labReport';
    }
    if (lowerName.includes('处方') || lowerName.includes('用药')) {
      return 'prescription';
    }
    if (lowerName.includes('出院') || lowerName.includes('小结')) {
      return 'dischargeSummary';
    }
    if (lowerName.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
      return 'image';
    }
    return 'other';
  };

  // 计算信息完整度
  const calculateCompleteness = (): number => {
    let total = 0;
    let filled = 0;

    // 1. 患者基本信息 (30分)
    if (formData.patient) {
      if (formData.patient.name) filled += 5;
      if (formData.patient.age) filled += 5;
      if (formData.patient.gender) filled += 5;
      if (formData.patient.height && formData.patient.weight) filled += 5;
      if (formData.patient.location) filled += 5;
      if (formData.patient.occupation) filled += 5;
    }
    total += 30;

    // 2. 症状描述 (30分)
    if (formData.symptoms?.length) {
      formData.symptoms.forEach(s => {
        if (s.name) filled += 5;
        if (s.characteristic?.length) filled += 3;
        if (s.duration) filled += 2;
        if (s.description) filled += 5;
      });
    }
    total += 30;

    // 3. 病史 (15分)
    if (formData.medicalHistory) {
      if (formData.medicalHistory.baselineDiseases?.length) filled += 5;
      if (formData.medicalHistory.allergies?.drug?.length) filled += 3;
      if (formData.medicalHistory.allergies?.food?.length) filled += 2;
      if (formData.medicalHistory.familyHistory?.length) filled += 5;
    }
    total += 15;

    // 4. 诊断和治疗 (15分)
    if (formData.diagnosis?.hospitals?.length) filled += 8;
    if (formData.treatment?.records?.length) filled += 7;
    total += 15;

    // 5. 主要诉求 (10分)
    if (formData.mainRequest) filled += 10;
    total += 10;

    return Math.min(Math.round((filled / total) * 100), 100);
  };

  // 获取参考意义级别
  const getReferenceLevel = (completeness: number): string => {
    if (completeness >= 90) return 'Ⅰ级';
    if (completeness >= 70) return 'Ⅱ级';
    if (completeness >= 50) return 'Ⅲ级';
    if (completeness >= 30) return 'Ⅳ级';
    return 'Ⅴ级';
  };

  // 提交表单
  const handleSubmit = async () => {
    const completeness = calculateCompleteness();
    const referenceLevel = getReferenceLevel(completeness);

    try {
      if (isEditing && initialData?.id) {
        // 编辑模式：只提交修改的部分
        const updatedData = {
          patientInfo: formData.patient,
          symptomDetails: formData.symptoms,
          medicalHistory: formData.medicalHistory,
          diagnosis: formData.diagnosis,
          treatment: formData.treatment,
          course: formData.course,
          efficacy: formData.efficacy,
          uploadedFiles: formData.uploadedFiles,
          additionalInfo: formData.additionalInfo,
          mainRequest: formData.mainRequest,
          urgency: formData.urgency
        };

        // 调用更新服务
        const success = consultService.updateConsultation(
          initialData.id,
          currentUser?.id || 'anonymous',
          updatedData,
          '患者补充了病情信息'
        );

        if (success) {
          onSuccess?.();
          if (onCancel) onCancel();
        }
      } else {
        // 新建模式：原有逻辑
        const completeData = {
          patientInfo: formData.patient,
          symptomDetails: formData.symptoms,
          medicalHistory: formData.medicalHistory,
          diagnosis: formData.diagnosis,
          treatment: formData.treatment,
          course: formData.course,
          efficacy: formData.efficacy,
          uploadedFiles: formData.uploadedFiles,
          additionalInfo: formData.additionalInfo
        };

        const newConsultation = consultService.createConsultation(
          {
            symptoms: formData.symptoms[0]?.name || '',
            description: formData.symptoms.map(s => s.description).join('\n') || '',
            request: formData.mainRequest,
            urgency: formData.urgency || 'normal'
          },
          currentUser?.id || 'anonymous',
          currentUser?.username || '用户',
          completeData
        );

        // 如果有上传的文件，可以关联诊疗记录
        if (formData.uploadedFiles?.length > 0) {
          const recordIds: string[] = [];
          
          for (const uploadedFile of formData.uploadedFiles) {
            try {
              // 将上传的文件转为诊疗记录
              const record = await medicalRecordService.uploadRecord(
                new File([uploadedFile.url], uploadedFile.name, { type: uploadedFile.type }),
                {
                  recordDate: new Date().toISOString().split('T')[0],
                  hospital: '寻医问药',
                  department: '在线咨询',
                  doctor: currentUser?.username || '用户',
                  diagnosis: formData.symptoms[0]?.name || '',
                  summary: formData.mainRequest,
                  recordType: '检查'
                }
              );
              
              if (record) {
                recordIds.push(record.id);
              }
            } catch (error) {
              console.error('创建诊疗记录失败:', error);
            }
          }
          
          // 关联诊疗记录到咨询
          if (recordIds.length > 0) {
            consultService.addMedicalRecords(newConsultation.id, recordIds);
          }
        }

        // 跳转到详情页
        navigate(`/mobile/consult/${newConsultation.id}`, {
          state: { 
            message: '咨询提交成功，正在为您匹配相关案例...',
            completeness,
            referenceLevel
          }
        });

        // 调用成功回调
        onSuccess?.();
      }
      
    } catch (error) {
      console.error('提交咨询失败:', error);
      alert('提交失败，请重试');
    }
  };

  // 验证当前步骤
  const validateStep = (stepNum: number): boolean => {
    if (stepNum === 1) {
      // 验证基本信息
      if (!formData.patient?.age) {
        alert('请输入年龄');
        return false;
      }
      if (!formData.patient?.gender) {
        alert('请选择性别');
        return false;
      }
    }
    
    if (stepNum === 2) {
      // 验证症状
      if (formData.symptoms.length === 0) {
        alert('请至少添加一个症状');
        return false;
      }
      if (!formData.symptoms[0]?.name) {
        alert('请填写症状名称');
        return false;
      }
    }
    
    if (stepNum === 6) {
      // 验证主要诉求
      if (!formData.mainRequest) {
        alert('请输入主要诉求');
        return false;
      }
    }
    
    return true;
  };

  // ==================== 渲染函数 ====================
  
  // 步骤1：患者基本信息
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-lg border-b pb-2">📋 患者基本信息</h3>
      <p className="text-sm text-gray-500">所有信息仅用于匹配更准确的案例，平台承诺严格保密</p>

      <div className="grid grid-cols-2 gap-4">
        {/* 姓名 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.patient?.name || ''}
            onChange={(e) => updatePatient('name', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="例如：王某某"
          />
          <p className="text-xs text-gray-400 mt-1">平台会自动脱敏处理</p>
        </div>

        {/* 年龄 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            年龄 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            max="120"
            value={formData.patient?.age || ''}
            onChange={(e) => updatePatient('age', parseInt(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="请输入年龄"
          />
        </div>

        {/* 性别 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            性别 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.patient?.gender || ''}
            onChange={(e) => updatePatient('gender', e.target.value as 'male' | 'female')}
            className="w-full p-2 border rounded"
          >
            <option value="">请选择</option>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>

        {/* 身高体重 */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">身高(cm)</label>
            <input
              type="number"
              min="0"
              max="250"
              value={formData.patient?.height || ''}
              onChange={(e) => updatePatient('height', parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              placeholder="身高"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">体重(kg)</label>
            <input
              type="number"
              min="0"
              max="200"
              value={formData.patient?.weight || ''}
              onChange={(e) => updatePatient('weight', parseInt(e.target.value))}
              className="w-full p-2 border rounded"
              placeholder="体重"
            />
          </div>
        </div>

        {/* 居住地 */}
        <div>
          <label className="block text-sm font-medium mb-1">居住地</label>
          <input
            type="text"
            value={formData.patient?.location || ''}
            onChange={(e) => updatePatient('location', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="例如：北京市朝阳区"
          />
        </div>

        {/* 职业和工作环境 */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">职业和工作环境</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.patient?.occupation || ''}
              onChange={(e) => updatePatient('occupation', e.target.value)}
              className="p-2 border rounded"
              placeholder="职业：例如程序员、教师、工人"
            />
            <select
              value={formData.patient?.workEnvironment || ''}
              onChange={(e) => updatePatient('workEnvironment', e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">工作环境</option>
              <option value="办公室">办公室</option>
              <option value="户外">户外</option>
              <option value="化工厂">化工厂</option>
              <option value="粉尘环境">粉尘环境</option>
              <option value="高温环境">高温环境</option>
              <option value="低温环境">低温环境</option>
              <option value="噪音环境">噪音环境</option>
              <option value="其他">其他</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // 步骤2：症状详细描述
  const renderSymptoms = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-lg border-b pb-2">🤒 症状详细描述</h3>
      <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded">
        ⚠️ 症状描述越详细，匹配的案例越准确。特别是疼痛，请详细说明性质、部位、时间等特点。
      </p>

      {formData.symptoms.map((symptom, index) => (
        <div key={index} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between mb-2">
            <span className="font-medium">症状 {index + 1}</span>
            {index > 0 && (
              <button 
                onClick={() => removeSymptom(index)}
                className="text-red-500 text-sm"
              >
                删除
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 症状名称 */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                症状名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={symptom.name}
                onChange={(e) => updateSymptom(index, 'name', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="例如：胸痛、头痛、腹痛"
              />
            </div>

            {/* 部位 */}
            <div>
              <label className="block text-sm font-medium mb-1">具体部位</label>
              <input
                type="text"
                value={symptom.location || ''}
                onChange={(e) => updateSymptom(index, 'location', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="例如：左侧胸部、右下腹部"
              />
            </div>

            {/* 性质 */}
            <div>
              <label className="block text-sm font-medium mb-1">疼痛性质</label>
              <select
                multiple
                value={symptom.characteristic || []}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, opt => opt.value);
                  updateSymptom(index, 'characteristic', values);
                }}
                className="w-full p-2 border rounded h-24"
              >
                <option value="钝痛">钝痛</option>
                <option value="刺痛">刺痛</option>
                <option value="胀痛">胀痛</option>
                <option value="灼烧感">灼烧感</option>
                <option value="麻木感">麻木感</option>
                <option value="放射性痛">放射性痛</option>
                <option value="固定位置痛">固定位置痛</option>
                <option value="非固定位置痛">非固定位置痛</option>
                <option value="与体位相关痛">与体位相关痛</option>
                <option value="与体位无关痛">与体位无关痛</option>
              </select>
            </div>

            {/* 发作时间 */}
            <div>
              <label className="block text-sm font-medium mb-1">发作时间</label>
              <select
                value={symptom.timing || ''}
                onChange={(e) => updateSymptom(index, 'timing', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">请选择</option>
                <option value="白天">白天</option>
                <option value="晚上">晚上</option>
                <option value="凌晨">凌晨</option>
                <option value="饭后">饭后</option>
                <option value="空腹">空腹</option>
                <option value="活动后">活动后</option>
                <option value="休息时">休息时</option>
              </select>
            </div>

            {/* 频率 */}
            <div>
              <label className="block text-sm font-medium mb-1">发作频率</label>
              <select
                value={symptom.frequency || ''}
                onChange={(e) => updateSymptom(index, 'frequency', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">请选择</option>
                <option value="持续性">持续性</option>
                <option value="间歇性">间歇性</option>
                <option value="阵发性">阵发性</option>
                <option value="周期性">周期性</option>
              </select>
            </div>

            {/* 持续时间 */}
            <div>
              <label className="block text-sm font-medium mb-1">每次持续多久</label>
              <input
                type="text"
                value={symptom.duration || ''}
                onChange={(e) => updateSymptom(index, 'duration', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="例如：几分钟、几小时"
              />
            </div>

            {/* 加重因素 */}
            <div>
              <label className="block text-sm font-medium mb-1">什么情况下加重</label>
              <select
                multiple
                value={symptom.aggravating || []}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, opt => opt.value);
                  updateSymptom(index, 'aggravating', values);
                }}
                className="w-full p-2 border rounded h-20"
              >
                <option value="活动后">活动后</option>
                <option value="休息时">休息时</option>
                <option value="夜间">夜间</option>
                <option value="情绪波动">情绪波动</option>
                <option value="进食后">进食后</option>
                <option value="空腹">空腹</option>
                <option value="天气变化">天气变化</option>
              </select>
            </div>

            {/* 缓解因素 */}
            <div>
              <label className="block text-sm font-medium mb-1">什么情况下缓解</label>
              <select
                multiple
                value={symptom.relieving || []}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, opt => opt.value);
                  updateSymptom(index, 'relieving', values);
                }}
                className="w-full p-2 border rounded h-20"
              >
                <option value="休息后">休息后</option>
                <option value="服药后">服药后</option>
                <option value="改变体位">改变体位</option>
                <option value="进食后">进食后</option>
                <option value="热敷">热敷</option>
                <option value="冷敷">冷敷</option>
              </select>
            </div>

            {/* 严重程度 */}
            <div>
              <label className="block text-sm font-medium mb-1">严重程度</label>
              <select
                value={symptom.severity || ''}
                onChange={(e) => updateSymptom(index, 'severity', parseInt(e.target.value) as 1|2|3|4|5)}
                className="w-full p-2 border rounded"
              >
                <option value="">请选择</option>
                <option value="1">1级（轻微）</option>
                <option value="2">2级（轻度）</option>
                <option value="3">3级（中度）</option>
                <option value="4">4级（重度）</option>
                <option value="5">5级（剧烈）</option>
              </select>
            </div>

            {/* 详细描述 */}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">详细描述</label>
              <textarea
                value={symptom.description || ''}
                onChange={(e) => updateSymptom(index, 'description', e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="请详细描述症状的发生、发展过程..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addSymptom}
        className="w-full py-2 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50"
      >
        + 添加另一个症状
      </button>

      {/* 疼痛鉴别提示 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">⚠️ 疼痛症状特别提示</h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
          <li>胸痛可能是心绞痛，也可能是胃痛，请详细描述性质</li>
          <li>头痛可能是感冒，也可能是偏头痛，请说明位置和性质</li>
          <li>腹痛原因复杂，请说明具体位置和与饮食的关系</li>
          <li>关节痛请说明是否与活动相关，有无红肿</li>
        </ul>
      </div>
    </div>
  );

  // 步骤3：病史信息
  const renderMedicalHistory = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-lg border-b pb-2">📚 病史信息</h3>

      {/* 基础病 */}
      <div>
        <label className="block text-sm font-medium mb-2">基础病（多选）</label>
        <div className="grid grid-cols-3 gap-2">
          {['高血压', '糖尿病', '冠心病', '肝炎', '肾炎', '哮喘', 
            '胃病', '关节炎', '甲亢', '甲减', '贫血', '痛风'].map(disease => (
            <label key={disease} className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={formData.medicalHistory?.baselineDiseases?.includes(disease) || false}
                onChange={(e) => toggleBaseline(disease, e.target.checked)}
                className="mr-2"
              />
              {disease}
            </label>
          ))}
        </div>
      </div>

      {/* 过敏史 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">过敏史</label>
        
        <div>
          <span className="text-xs text-gray-500 block mb-1">药物过敏</span>
          <input
            type="text"
            value={formData.medicalHistory?.allergies?.drug?.join('、') || ''}
            onChange={(e) => updateAllergies('drug', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="例如：青霉素、头孢、磺胺（多个用逗号分隔）"
          />
        </div>

        <div>
          <span className="text-xs text-gray-500 block mb-1">食物过敏</span>
          <input
            type="text"
            value={formData.medicalHistory?.allergies?.food?.join('、') || ''}
            onChange={(e) => updateAllergies('food', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="例如：海鲜、花生、牛奶（多个用逗号分隔）"
          />
        </div>
      </div>

      {/* 手术史 */}
      <div>
        <label className="block text-sm font-medium mb-2">手术史</label>
        {formData.medicalHistory?.surgeries?.map((surgery, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 mb-2">
            <input
              type="text"
              value={surgery.name}
              onChange={(e) => updateSurgery(index, 'name', e.target.value)}
              className="p-2 border rounded"
              placeholder="手术名称"
            />
            <input
              type="text"
              value={surgery.year}
              onChange={(e) => updateSurgery(index, 'year', e.target.value)}
              className="p-2 border rounded"
              placeholder="年份"
            />
            <button
              onClick={() => removeSurgery(index)}
              className="text-red-500 text-sm"
            >
              删除
            </button>
          </div>
        ))}
        <button
          onClick={addSurgery}
          className="text-blue-500 text-sm"
        >
          + 添加手术史
        </button>
      </div>

      {/* 家族病史 */}
      <div>
        <label className="block text-sm font-medium mb-2">家族病史</label>
        <div className="grid grid-cols-3 gap-2">
          {['高血压', '糖尿病', '心脏病', '癌症', '精神病', '遗传病'].map(disease => (
            <label key={disease} className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={formData.medicalHistory?.familyHistory?.includes(disease) || false}
                onChange={(e) => toggleFamilyHistory(disease, e.target.checked)}
                className="mr-2"
              />
              {disease}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // 步骤4：诊断和治疗
  const renderDiagnosisAndTreatment = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-lg border-b pb-2">🏥 诊断和治疗</h3>
      <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded">
        ⚠️ 如果有多个医院的诊断，请全部填写，这有助于避免误诊
      </p>

      {/* 诊断记录 */}
      <div>
        <label className="block text-sm font-medium mb-2">医院诊断</label>
        {formData.diagnosis?.hospitals?.map((hospital, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="font-medium">医院 {index + 1}</span>
              {index > 0 && (
                <button onClick={() => removeHospital(index)} className="text-red-500 text-sm">
                  删除
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={hospital.name}
                onChange={(e) => updateHospital(index, 'name', e.target.value)}
                className="p-2 border rounded"
                placeholder="医院名称"
              />
              <input
                type="text"
                value={hospital.department}
                onChange={(e) => updateHospital(index, 'department', e.target.value)}
                className="p-2 border rounded"
                placeholder="科室"
              />
              <input
                type="text"
                value={hospital.doctor || ''}
                onChange={(e) => updateHospital(index, 'doctor', e.target.value)}
                className="p-2 border rounded"
                placeholder="医生（选填）"
              />
              <input
                type="text"
                value={hospital.date}
                onChange={(e) => updateHospital(index, 'date', e.target.value)}
                className="p-2 border rounded"
                placeholder="诊断日期"
              />
              <div className="col-span-2">
                <textarea
                  value={hospital.diagnosis}
                  onChange={(e) => updateHospital(index, 'diagnosis', e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={2}
                  placeholder="诊断结果"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addHospital}
          className="w-full py-2 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50"
        >
          + 添加另一家医院的诊断
        </button>
      </div>

      {/* 治疗记录 */}
      <div>
        <label className="block text-sm font-medium mb-2">治疗记录</label>
        {formData.treatment?.records?.map((record, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="font-medium">治疗方案 {index + 1}</span>
              {index > 0 && (
                <button onClick={() => removeTreatment(index)} className="text-red-500 text-sm">
                  删除
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={record.hospital}
                  onChange={(e) => updateTreatment(index, 'hospital', e.target.value)}
                  className="p-2 border rounded"
                  placeholder="医院"
                />
                <input
                  type="text"
                  value={record.doctor || ''}
                  onChange={(e) => updateTreatment(index, 'doctor', e.target.value)}
                  className="p-2 border rounded"
                  placeholder="医生（选填）"
                />
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium">用药记录</span>
                {record.medications.map((med, medIndex) => (
                  <div key={medIndex} className="grid grid-cols-5 gap-2">
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) => updateMedication(index, medIndex, 'name', e.target.value)}
                      className="p-1 border rounded text-sm"
                      placeholder="药品名"
                    />
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => updateMedication(index, medIndex, 'dosage', e.target.value)}
                      className="p-1 border rounded text-sm"
                      placeholder="剂量"
                    />
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => updateMedication(index, medIndex, 'frequency', e.target.value)}
                      className="p-1 border rounded text-sm"
                      placeholder="频率"
                    />
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => updateMedication(index, medIndex, 'duration', e.target.value)}
                      className="p-1 border rounded text-sm"
                      placeholder="疗程"
                    />
                    <select
                      value={med.efficacy}
                      onChange={(e) => updateMedication(index, medIndex, 'efficacy', e.target.value as any)}
                      className="p-1 border rounded text-sm"
                    >
                      <option value="有效">有效</option>
                      <option value="部分有效">部分有效</option>
                      <option value="无效">无效</option>
                      <option value="不良反应">不良反应</option>
                    </select>
                  </div>
                ))}
                <button
                  onClick={() => addMedication(index)}
                  className="text-blue-500 text-sm"
                >
                  + 添加药品
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addTreatment}
          className="w-full py-2 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50"
        >
          + 添加另一家医院的治疗方案
        </button>
      </div>
    </div>
  );

  // 步骤5：病程和疗效
  const renderCourseAndEfficacy = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-lg border-b pb-2">📊 病程和疗效</h3>

      {/* 病程时间 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">发病日期</label>
          <input
            type="date"
            value={formData.course?.startDate || ''}
            onChange={(e) => updateCourse('startDate', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">结束日期（如已痊愈）</label>
          <input
            type="date"
            value={formData.course?.endDate || ''}
            onChange={(e) => updateCourse('endDate', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* 当前状态 */}
      <div>
        <label className="block text-sm font-medium mb-1">当前状态</label>
        <select
          value={formData.course?.currentStatus || ''}
          onChange={(e) => updateCourse('currentStatus', e.target.value as any)}
          className="w-full p-2 border rounded"
        >
          <option value="">请选择</option>
          <option value="急性期">急性期</option>
          <option value="缓解期">缓解期</option>
          <option value="康复期">康复期</option>
          <option value="慢性期">慢性期</option>
        </select>
      </div>

      {/* 疗效评估 */}
      <div>
        <label className="block text-sm font-medium mb-1">总体疗效</label>
        <select
          value={formData.efficacy?.overall || ''}
          onChange={(e) => updateEfficacy('overall', e.target.value as any)}
          className="w-full p-2 border rounded"
        >
          <option value="">请选择</option>
          <option value="治愈">治愈</option>
          <option value="好转">好转</option>
          <option value="无效">无效</option>
          <option value="加重">加重</option>
          <option value="反复">反复</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">疗效详细描述</label>
        <textarea
          value={formData.efficacy?.description || ''}
          onChange={(e) => updateEfficacy('description', e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="请详细描述治疗效果..."
        />
      </div>
    </div>
  );

  // 步骤6：主要诉求
  const renderMainRequest = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-lg border-b pb-2">🎯 主要诉求</h3>

      <div>
        <label className="block text-sm font-medium mb-1">
          您希望通过本次咨询获得什么？ <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.mainRequest || ''}
          onChange={(e) => setFormData({ ...formData, mainRequest: e.target.value })}
          className="w-full p-2 border rounded"
          rows={4}
          placeholder="例如：想了解可能的诊断、用药建议、是否需要就医、有哪些注意事项..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">紧急程度</label>
        <select
          value={formData.urgency}
          onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
          className="w-full p-2 border rounded"
        >
          <option value="normal">普通</option>
          <option value="urgent">紧急</option>
          <option value="critical">危急</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">补充说明</label>
        <textarea
          value={formData.additionalInfo || ''}
          onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
          className="w-full p-2 border rounded"
          rows={3}
          placeholder="其他需要补充的信息..."
        />
      </div>
    </div>
  );

  // 步骤7：文件上传
  const renderFileUpload = () => (
    <div className="space-y-6">
      <h3 className="font-bold text-lg border-b pb-2">📎 上传病历资料</h3>
      <p className="text-sm text-gray-500">
        上传相关检查报告、处方单、出院小结等，可以帮助更精准地匹配案例
      </p>

      <FileUploadSection
        files={formData.uploadedFiles || []}
        onUpload={handleFileUpload}
        onRemove={handleFileRemove}
        uploading={uploading}
        uploadError={uploadError}
      />

      {/* 上传建议 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">💡 上传建议</h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
          <li>化验单：血常规、尿常规、生化检查等</li>
          <li>影像资料：X光、CT、MRI、B超等</li>
          <li>处方单：用药记录、剂量等</li>
          <li>出院小结：诊断证明、治疗过程等</li>
          <li>门诊病历：就诊记录、医生意见等</li>
        </ul>
      </div>

      {/* 隐私说明 */}
      <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-700">
        <p className="font-medium mb-1">🔒 隐私保护</p>
        <p>所有上传文件仅用于案例匹配，平台会进行脱敏处理，不会泄露个人信息</p>
      </div>
    </div>
  );

  const steps = [
    { step: 1, label: '基本信息' },
    { step: 2, label: '症状' },
    { step: 3, label: '病史' },
    { step: 4, label: '诊断治疗' },
    { step: 5, label: '病程疗效' },
    { step: 6, label: '主要诉求' },
    { step: 7, label: '上传资料' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* 头部 */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">
          {isEditing ? '补充咨询信息' : '发起咨询'}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 编辑模式提示 */}
      {isEditing && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          📝 请在原有信息基础上补充，无需重复填写已有内容
        </div>
      )}

            {/* 步骤指示器 */}
      <div className="mb-6">
        {/* 桌面端：正常显示 */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s.step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step >= s.step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s.step}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-2 ${
                  step > s.step ? 'bg-blue-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="hidden md:flex justify-between mt-1 text-xs text-gray-500">
          {steps.map(s => (
            <span key={s.step}>{s.label}</span>
          ))}
        </div>
        
        {/* 手机端：横向滚动 */}
        <div className="md:hidden">
          <div className="flex overflow-x-auto pb-2 gap-2" style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}>
            {steps.map((s, index) => (
              <div key={s.step} className="flex items-center flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step >= s.step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s.step}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-6 h-1 mx-1 ${
                    step > s.step ? 'bg-blue-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex overflow-x-auto pb-1 mt-1 gap-4 text-xs text-gray-500">
            {steps.map(s => (
              <span key={s.step} className="flex-shrink-0">{s.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 表单内容 */}
      <div className="mb-4">
        {step === 1 && renderBasicInfo()}
        {step === 2 && renderSymptoms()}
        {step === 3 && renderMedicalHistory()}
        {step === 4 && renderDiagnosisAndTreatment()}
        {step === 5 && renderCourseAndEfficacy()}
        {step === 6 && renderMainRequest()}
        {step === 7 && renderFileUpload()}
      </div>

      {/* 信息完整度提示（最后一步显示） */}
      {step === 7 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">📊 信息完整度评估</h4>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${calculateCompleteness()}%` }}
              />
            </div>
            <span className="text-sm font-medium text-blue-700">
              {calculateCompleteness()}%
            </span>
          </div>
          <p className="text-sm text-blue-700">
            参考意义级别：{getReferenceLevel(calculateCompleteness())}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {calculateCompleteness() < 50 ? '信息完整度较低，结果仅供参考' : '信息较完整，可提供较准确的参考案例'}
          </p>
        </div>
      )}

      {/* 按钮 */}
      <div className="flex justify-between">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            上一步
          </button>
        ) : (
          <div></div>
        )}
        
        {step < 7 ? (
          <button
            onClick={() => {
              if (validateStep(step)) {
                setStep(step + 1);
              }
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            下一步
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {isEditing ? '提交补充' : '提交咨询'}
          </button>
        )}
      </div>

      {/* 最终提示 */}
      {step === 7 && (
        <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <p className="text-sm text-yellow-800">
            ⚕️ 本咨询结果仅供参考，不能替代医生诊断。如有紧急情况，请立即就医。
            平台提供的案例旨在帮助您了解类似情况，避免误诊和走弯路。
          </p>
        </div>
      )}
    </div>
  );
};

export default CompleteConsultForm;


