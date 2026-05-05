import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Heart,
  MessageCircle,
  Send,
  Trash2,
  Clock,
  User,
  Stethoscope,
  Award,
  Phone,
  Mail,
  Sparkles,
  X,
  AlertCircle,
  FileText,
  Image,
  Download,
  Eye,
  ExternalLink,
  Calendar,
  MapPin,
  Briefcase,
  Activity,
  AlertTriangle,
  Pill,
  Edit
} from 'lucide-react';
import { useAuth } from '../../shared/hooks/useAuth';
import { consultService, Consultation, Reply } from '../../shared/services/consultService';
import { medicalRecordService, MedicalRecord } from '../../shared/services/medicalRecordService';
import CollectButton from '../../components/collection/CollectButton';
import { enhancedConsultService, EnhancedAnswer } from '../../shared/services/enhancedConsultService';
import { drugSearchService } from '../../shared/services/drugSearchService';
import { resultFormatter, FormattedDrugCard } from '../../shared/services/resultFormatter';
import { aiSearchService } from '../../shared/services/aiSearchService';
import { aiMedicalService, AIMedicalAnswer } from '../../shared/services/aiMedicalService';
import CompleteConsultForm from '../../components/consult/CompleteConsultForm';
import { useAdmin } from '../../shared/hooks/useAdmin';

// ========== 患者信息展示组件 ==========
const PatientInfoCard: React.FC<{ consultation: Consultation }> = ({ consultation }) => {
  const patientInfo = consultation.patientInfo || {};
  const medicalHistory = consultation.medicalHistory || {};
  const symptoms = consultation.symptomDetails || [];
  const diagnosis = consultation.diagnosis || {};
  const treatment = consultation.treatment || {};
  const efficacy = consultation.efficacy || {};
  const course = consultation.course || {};

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
      <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-600" />
        患者信息
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4 bg-blue-50 p-3 rounded-lg">
        <div>
          <span className="text-xs text-gray-500">姓名</span>
          <p className="text-sm font-medium">{patientInfo.name || '未填写'}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500">年龄/性别</span>
          <p className="text-sm font-medium">
            {patientInfo.age || '?'}岁 · {patientInfo.gender === 'male' ? '男' : patientInfo.gender === 'female' ? '女' : '未知'}
          </p>
        </div>
        {patientInfo.height && patientInfo.weight && (
          <div>
            <span className="text-xs text-gray-500">身高/体重</span>
            <p className="text-sm font-medium">{patientInfo.height}cm / {patientInfo.weight}kg</p>
          </div>
        )}
        {patientInfo.location && (
          <div>
            <span className="text-xs text-gray-500">居住地</span>
            <p className="text-sm font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {patientInfo.location}
            </p>
          </div>
        )}
        {patientInfo.occupation && (
          <div className="col-span-2">
            <span className="text-xs text-gray-500">职业/工作环境</span>
            <p className="text-sm font-medium flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {patientInfo.occupation} · {patientInfo.workEnvironment || '未填写'}
            </p>
          </div>
        )}
      </div>

      {symptoms.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Activity className="w-4 h-4 text-orange-600" />
            症状描述
          </h4>
          {symptoms.map((symptom: any, index: number) => (
            <div key={index} className="bg-orange-50 p-3 rounded-lg mb-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">{symptom.name}</span>
                {symptom.severity && (
                  <span className="text-xs px-2 py-0.5 bg-orange-200 text-orange-800 rounded">
                    严重程度 {symptom.severity}/5
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {symptom.location && (
                  <div>
                    <span className="text-gray-500">部位：</span>
                    <span>{symptom.location}</span>
                  </div>
                )}
                {symptom.duration && (
                  <div>
                    <span className="text-gray-500">持续时间：</span>
                    <span>{symptom.duration}</span>
                  </div>
                )}
                {symptom.characteristic?.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-gray-500">性质：</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {symptom.characteristic.map((c: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-white rounded text-xs">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {symptom.timing && (
                  <div>
                    <span className="text-gray-500">发作时间：</span>
                    <span>{symptom.timing}</span>
                  </div>
                )}
                {symptom.frequency && (
                  <div>
                    <span className="text-gray-500">频率：</span>
                    <span>{symptom.frequency}</span>
                  </div>
                )}
              </div>
              {symptom.description && (
                <p className="text-xs text-gray-600 mt-2 bg-white p-2 rounded">
                  {symptom.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {(medicalHistory.baselineDiseases?.length > 0 || 
        medicalHistory.allergies?.drug?.length > 0 ||
        medicalHistory.surgeries?.length > 0) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            病史信息
          </h4>
          <div className="bg-yellow-50 p-3 rounded-lg space-y-2">
            {medicalHistory.baselineDiseases?.length > 0 && (
              <div>
                <span className="text-xs text-gray-500">基础病：</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {medicalHistory.baselineDiseases.map((d: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-white rounded text-xs">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {medicalHistory.allergies?.drug?.length > 0 && (
              <div>
                <span className="text-xs text-gray-500">药物过敏：</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {medicalHistory.allergies.drug.map((a: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {medicalHistory.surgeries?.length > 0 && (
              <div>
                <span className="text-xs text-gray-500">手术史：</span>
                <div className="space-y-1 mt-1">
                  {medicalHistory.surgeries.map((s: any, i: number) => (
                    <div key={i} className="text-xs">
                      {s.name} ({s.year})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {diagnosis.hospitals?.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Stethoscope className="w-4 h-4 text-purple-600" />
            医院诊断
          </h4>
          {diagnosis.hospitals.map((h: any, index: number) => (
            <div key={index} className="bg-purple-50 p-3 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">{h.name}</span>
                <span className="text-xs text-gray-500">{h.department} · {h.date}</span>
              </div>
              <p className="text-sm font-medium text-purple-700 mb-1">{h.diagnosis}</p>
              {h.basis && (
                <p className="text-xs text-gray-600">诊断依据：{h.basis}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {treatment.records?.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Pill className="w-4 h-4 text-green-600" />
            治疗记录
          </h4>
          {treatment.records.map((r: any, index: number) => (
            <div key={index} className="bg-green-50 p-3 rounded-lg mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm">{r.hospital}</span>
                <span className="text-xs text-gray-500">开始：{r.startDate}</span>
              </div>
              {r.medications.map((m: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs mb-1 bg-white p-2 rounded">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-gray-500">{m.dosage}</span>
                  <span className="text-gray-500">{m.frequency}</span>
                  <span className="text-gray-500">{m.duration}</span>
                  <span className={`px-2 py-0.5 rounded ${
                    m.efficacy === '有效' ? 'bg-green-100 text-green-700' :
                    m.efficacy === '部分有效' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {m.efficacy}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {course.startDate && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            病程
          </h4>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-4 text-sm">
              <span>发病：{course.startDate}</span>
              {course.endDate && <span>结束：{course.endDate}</span>}
              <span className={`px-2 py-0.5 rounded ${
                course.currentStatus === '急性期' ? 'bg-red-100 text-red-700' :
                course.currentStatus === '缓解期' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {course.currentStatus}
              </span>
            </div>
          </div>
        </div>
      )}

      {consultation.mainRequest && (
        <div className="bg-yellow-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
            <MessageCircle className="w-4 h-4 text-yellow-600" />
            主要诉求
          </h4>
          <p className="text-sm">{consultation.mainRequest}</p>
        </div>
      )}
    </div>
  );
};

// ========== 诊疗记录项组件 ==========
const MedicalRecordItem: React.FC<{
  record: MedicalRecord;
  onPreview: (record: MedicalRecord) => void;
  onDownload: (record: MedicalRecord) => void;
}> = ({ record, onPreview, onDownload }) => {
  const isImage = record.fileType?.startsWith('image/');

  return (
    <div className="bg-gray-50 rounded-lg p-3 mb-2">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {record.thumbnail ? (
            <img 
              src={record.thumbnail} 
              alt="缩略图" 
              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
            />
          ) : isImage ? (
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">{record.fileName}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span>{record.recordDate}</span>
            <span>·</span>
            <span>{record.hospital}</span>
            {record.department && (
              <>
                <span>·</span>
                <span>{record.department}</span>
              </>
            )}
          </div>
          {record.diagnosis && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-1">{record.diagnosis}</p>
          )}
          {record.summary && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 bg-white p-2 rounded">
              {record.summary}
            </p>
          )}
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onPreview(record)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="预览"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDownload(record)}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="下载"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== 身份选择器组件 ==========
const IdentitySelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const identities = [
    { value: 'patient', label: '病友', icon: User, color: 'text-green-600' },
    { value: 'specialist', label: '专科医生', icon: Stethoscope, color: 'text-blue-600' },
    { value: 'general', label: '非专科医生', icon: Award, color: 'text-purple-600' },
    { value: 'other', label: '其他', icon: User, color: 'text-gray-600' }
  ];

  return (
    <div className="flex gap-2 mb-3">
      {identities.map(({ value: val, label, icon: Icon, color }) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-1 text-sm ${
            value === val
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Icon className={`w-4 h-4 ${value === val ? 'text-blue-600' : color}`} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

// ========== 回复项组件 ==========
const ReplyItem: React.FC<{
  reply: Reply;
  currentUserId: string;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onAskForMore: (replyId: string, question: string) => void;
}> = ({ reply, currentUserId, onLike, onDelete, onAskForMore }) => {
  const canDelete = currentUserId === reply.authorId;
  const liked = reply.likedBy?.includes(currentUserId);
  const [showAsk, setShowAsk] = useState(false);
  const [question, setQuestion] = useState('');

  const getIdentityText = (identity?: string) => {
    switch(identity) {
      case 'specialist': return '专科医生';
      case 'patient': return '病友';
      case 'general': return '非专科医生';
      default: return '其他';
    }
  };

  const getIdentityIcon = (identity?: string) => {
    switch(identity) {
      case 'specialist': return <Stethoscope className="w-4 h-4 text-blue-600" />;
      case 'patient': return <User className="w-4 h-4 text-green-600" />;
      case 'general': return <Award className="w-4 h-4 text-purple-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getIdentityColor = (identity?: string) => {
    switch(identity) {
      case 'specialist': return 'bg-blue-50 text-blue-600';
      case 'patient': return 'bg-green-50 text-green-600';
      case 'general': return 'bg-purple-50 text-purple-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            {getIdentityIcon(reply.identity)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{reply.author}</span>
              {reply.identity && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${getIdentityColor(reply.identity)}`}>
                  {getIdentityText(reply.identity)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(reply.createdAt)}</span>
            </div>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(reply.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">{reply.content}</p>

      {reply.contact && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 bg-gray-50 p-2 rounded-lg">
          {reply.contact.includes('@') ? (
            <Mail className="w-3 h-3" />
          ) : (
            <Phone className="w-3 h-3" />
          )}
          <span>联系方式: {reply.contact}</span>
        </div>
      )}

      {reply.identity === 'specialist' && !reply.isFollowUp && (
        <div className="mt-2 pt-2 border-t">
          {!showAsk ? (
            <button
              onClick={() => setShowAsk(true)}
              className="text-xs text-blue-600 flex items-center gap-1 hover:text-blue-800"
            >
              <MessageCircle className="w-3 h-3" />
              向医生补充信息
            </button>
          ) : (
            <div className="mt-2">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="请补充医生询问的信息..."
                className="w-full p-2 border rounded text-sm"
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    onAskForMore(reply.id, question);
                    setShowAsk(false);
                    setQuestion('');
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  提交补充
                </button>
                <button
                  onClick={() => setShowAsk(false)}
                  className="px-3 py-1 bg-gray-100 text-xs rounded hover:bg-gray-200"
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 pt-2 border-t">
        <button
          onClick={() => onLike(reply.id)}
          className={`flex items-center gap-1 text-sm ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
          <span>{reply.likes || 0}</span>
        </button>
      </div>
    </div>
  );
};

// ========== 药品结果卡片组件 ==========
const DrugResultCard: React.FC<{ result: FormattedDrugCard }> = ({ result }) => {
  const [expanded, setExpanded] = useState(false);

  const getOriginStyle = () => {
    if (result.origin === '国产' || result.source === 'local') {
      return 'border-l-4 border-green-500';
    }
    return 'border-l-4 border-blue-500';
  };

  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm mb-3 ${getOriginStyle()}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-lg text-gray-900">{result.name || '未知药品'}</h4>
            {result.origin === '国产' && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                🇨🇳 国产药
              </span>
            )}
            {result.details?.insuranceType && (
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                医保{result.details.insuranceType}类
              </span>
            )}
            {result.source === 'fda' && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                FDA批准
              </span>
            )}
          </div>
        </div>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
          匹配度 {result.matchScore || 0}%
        </span>
      </div>

      {result.keyPoints && result.keyPoints.length > 0 && (
        <div className="mb-3 space-y-1">
          {result.keyPoints.map((point: string, i: number) => (
            <div key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      )}

      {(result.details?.approvalNumber || result.details?.manufacturer) && (
        <div className="mb-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
          {result.details?.approvalNumber && (
            <div className="mb-1">
              <span className="text-xs text-gray-500">批准文号：</span>
              <span className="font-mono">{result.details.approvalNumber}</span>
            </div>
          )}
          {result.details?.manufacturer && (
            <div>
              <span className="text-xs text-gray-500">生产厂家：</span>
              <span>{result.details.manufacturer}</span>
            </div>
          )}
        </div>
      )}

      {result.details && (
        <div className="mt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {expanded ? '收起详细' : '展开详细'}
          </button>
          
          {expanded && (
            <div className="mt-3 space-y-3">
              {result.details.indications?.length > 0 && (
                <div>
                  <span className="text-xs text-gray-500 block mb-1">适应症</span>
                  <div className="text-sm text-gray-700">
                    {result.details.indications.join('；')}
                  </div>
                </div>
              )}
              
              {result.details.contraindications?.length > 0 && (
                <div>
                  <span className="text-xs text-gray-500 block mb-1">禁忌症</span>
                  <div className="text-sm text-gray-700">
                    {result.details.contraindications.join('；')}
                  </div>
                </div>
              )}
              
              {result.details.usage && (
                <div>
                  <span className="text-xs text-gray-500 block mb-1">用法用量</span>
                  <div className="text-sm text-gray-700">{result.details.usage}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center pt-2 border-t text-xs text-gray-400 mt-2">
        <span>来源：{result.sourceLabel || '平台数据库'}</span>
      </div>
    </div>
  );
};

// ========== 咨询详情页 ==========
const MobileConsultDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
const { isAdmin } = useAdmin();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [identity, setIdentity] = useState('patient');
  const [contact, setContact] = useState('');
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  
  const [aiAnswers, setAiAnswers] = useState<EnhancedAnswer[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  
  const [drugKeyword, setDrugKeyword] = useState('');
  const [drugResults, setDrugResults] = useState<FormattedDrugCard[]>([]);
  const [loadingDrugs, setLoadingDrugs] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Consultation>>({});

  // AI治疗指导相关状态
  const [treatmentGuidance, setTreatmentGuidance] = useState('');
  const [loadingTreatmentGuidance, setLoadingTreatmentGuidance] = useState(false);

  // AI用药指导相关状态
  const [aiAdvice, setAIAdvice] = useState<AIMedicalAnswer | null>(null);
  const [loadingAIAdvice, setLoadingAIAdvice] = useState(false);
  
  // AI药品问答相关状态
  const [drugQuestion, setDrugQuestion] = useState('');
  const [drugAnswer, setDrugAnswer] = useState('');
  const [loadingDrugQuestion, setLoadingDrugQuestion] = useState(false);

  useEffect(() => {
    if (!id) {
      console.error('❌ 缺少咨询ID');
      navigate('/mobile/consult');
      return;
    }
    loadData();
    loadAIRecommendations();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = consultService.getConsultation(id!);
      if (data) {
        setConsultation(data);
        setReplies(data.replies || []);
        
        if (data.medicalRecords && data.medicalRecords.length > 0) {
          setLoadingRecords(true);
          const records = await Promise.all(
            data.medicalRecords.map(recordId => medicalRecordService.getRecord(recordId))
          );
          setMedicalRecords(records.filter(r => r !== null) as MedicalRecord[]);
          setLoadingRecords(false);
        }
      }
    } catch (error) {
      console.error('加载咨询失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAIRecommendations = async () => {
    setLoadingAI(true);
    try {
      const enhanced = await enhancedConsultService.getConsultWithAI(id!);
      if (enhanced) {
        setAiAnswers(enhanced.aiSuggestedAnswers);
      }
    } catch (error) {
      console.error('加载AI推荐失败:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const matchDrugsForConsultation = async () => {
    if (!consultation) return;
    
    setLoadingMatch(true);
    
    const symptoms = consultation.symptomDetails?.map(s => s.name) || [];
    const mainSymptom = consultation.symptoms || symptoms[0] || '';
    
    const patientInfo = {
      age: consultation.patientInfo?.age,
      isElderly: (consultation.patientInfo?.age || 0) > 65,
      isChild: (consultation.patientInfo?.age || 0) < 12,
      isPregnant: false,
      isLactating: false,
      conditions: consultation.medicalHistory?.baselineDiseases || [],
      allergies: consultation.medicalHistory?.allergies?.drug || [],
      medications: []
    };
    
    try {
      const result = await aiSearchService.search(mainSymptom, patientInfo);
      setHealthAdvice(result.drugs);
    } catch (error) {
      console.error('对症寻药失败:', error);
    } finally {
      setLoadingMatch(false);
    }
  };

  // 药品搜索
  const handleDrugSearch = async () => {
    if (!drugKeyword.trim()) return;
    
    setLoadingDrugs(true);
    try {
      const rawResults = await drugSearchService.searchBySymptom(drugKeyword);
      const formatted = resultFormatter.formatDrugs(rawResults);
      setDrugResults(formatted);
    } catch (error) {
      console.error('药品搜索失败:', error);
    } finally {
      setLoadingDrugs(false);
    }
  };

  // AI治疗指导
  const handleGetTreatmentGuidance = async () => {
    if (!consultation) {
      alert('请先加载咨询数据');
      return;
    }
    
    const symptoms = consultation.symptomDetails?.map(s => s.name) || 
                     (consultation.symptoms ? [consultation.symptoms] : []);
    const mainSymptom = symptoms[0] || consultation.mainRequest || '';
    
    const patientInfo = {
      age: consultation.patientInfo?.age,
      conditions: consultation.medicalHistory?.baselineDiseases,
      allergies: consultation.medicalHistory?.allergies?.drug
    };
    
    setLoadingTreatmentGuidance(true);
    setTreatmentGuidance('');
    
    try {
      const guidance = await aiMedicalService.getTreatmentGuidance(mainSymptom, patientInfo);
      setTreatmentGuidance(guidance);
    } catch (error) {
      console.error('获取治疗指导失败:', error);
      setTreatmentGuidance('服务暂时不可用，请稍后再试。');
    } finally {
      setLoadingTreatmentGuidance(false);
    }
  };

  // AI用药指导
  const handleGetAIAdvice = async () => {
    if (!consultation) return;
    
    const symptoms = consultation.symptomDetails?.map(s => s.name) || [];
    const mainSymptom = consultation.symptoms || symptoms[0] || '';
    
    const patientInfo = {
      age: consultation.patientInfo?.age,
      isChild: (consultation.patientInfo?.age || 0) < 12,
      isElderly: (consultation.patientInfo?.age || 0) > 65,
      conditions: consultation.medicalHistory?.baselineDiseases,
      allergies: consultation.medicalHistory?.allergies?.drug
    };
    
    setLoadingAIAdvice(true);
    try {
      const advice = await aiMedicalService.getDrugAdvice(mainSymptom, patientInfo);
      setAIAdvice(advice);
    } catch (error) {
      console.error('获取AI建议失败:', error);
    } finally {
      setLoadingAIAdvice(false);
    }
  };
  
  // AI药品问答
  const handleDrugQuestion = async () => {
    if (!drugQuestion.trim()) return;
    
    setLoadingDrugQuestion(true);
    setDrugAnswer('');
    
    try {
      const result = await drugSearchService.askDrugQuestion(drugQuestion);
      setDrugAnswer(result.answer);
    } catch (error) {
      console.error('AI问答失败:', error);
      setDrugAnswer('抱歉，暂时无法回答这个问题，请稍后再试。');
    } finally {
      setLoadingDrugQuestion(false);
    }
  };

  const handleEditConsultation = () => {
    if (!consultation) return;
    setEditFormData(consultation);
    setIsEditing(true);
  };

  const handleUpdateConsultation = async (updatedData: any) => {
    if (!user || !consultation) return;
    
    const success = consultService.updateConsultation(
      consultation.id,
      user.id,
      updatedData,
      '患者补充了病情信息'
    );
    
    if (success) {
      setIsEditing(false);
      loadData();
    }
  };

  const handleAskForMore = (replyId: string, question: string) => {
    if (!user || !consultation) return;
    
    consultService.addFollowUp(
      consultation.id,
      replyId,
      question,
      user.id,
      user.username || '用户'
    );
    
    loadData();
  };

  const handleLikeConsultation = () => {
    if (!id || !user) return;
    consultService.likeConsultation(id, user.id);
    loadData();
  };

  const handleLikeReply = (replyId: string) => {
    if (!user) return;
    consultService.likeReply(replyId, user.id);
    loadData();
  };

  const handleAddReply = () => {
    if (!user) {
      alert('请先登录');
      return;
    }
    if (!replyContent.trim()) {
      alert('请输入回复内容');
      return;
    }
    if (!id) return;

    consultService.addReply(
      id,
      replyContent.trim(),
      user.id,
      user.username || '用户',
      identity,
      showContact ? contact : undefined
    );

    setReplyContent('');
    setContact('');
    setShowContact(false);
    loadData();
  };

  const handleDeleteConsultation = () => {
    if (!id || !user) return;
    if (!window.confirm('确定要删除这条咨询吗？')) return;
    
    const success = consultService.deleteConsultation(id, user.id);
    if (success) {
      navigate('/mobile/consult');
    }
  };

  const handleDeleteReply = (replyId: string) => {
    if (!user) return;
    if (!window.confirm('确定要删除这条回复吗？')) return;
    
    consultService.deleteReply(replyId, user.id);
    loadData();
  };

  const handlePreviewRecord = (record: MedicalRecord) => {
    if (record.fileType?.startsWith('image/')) {
      try {
        const base64Data = record.fileData.split(',')[1];
        if (!base64Data) return;
        
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
                <meta charset="UTF-8">
                <style>
                  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5; }
                  .container { max-width: 100%; max-height: 100vh; text-align: center; }
                  img { max-width: 100%; max-height: 90vh; object-fit: contain; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; }
                  .toolbar { position: fixed; top: 0; right: 0; padding: 16px; background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent); width: 100%; text-align: right; }
                  .close-btn { padding: 8px 16px; background: white; border: none; border-radius: 20px; cursor: pointer; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
                </style>
              </head>
              <body>
                <div class="toolbar"><button class="close-btn" onclick="window.close()">关闭</button></div>
                <div class="container"><img src="${blobUrl}" alt="${record.fileName}" /></div>
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
        const base64Data = record.fileData.split(',')[1];
        if (!base64Data) return;
        
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
                <meta charset="UTF-8">
                <style>
                  body { margin: 0; height: 100vh; display: flex; flex-direction: column; background: #f5f5f5; }
                  .toolbar { padding: 12px 20px; background: white; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                  .title { font-weight: 500; color: #333; }
                  .close-btn { padding: 6px 16px; background: #f0f0f0; border: none; border-radius: 20px; cursor: pointer; font-size: 14px; }
                  .pdf-container { flex: 1; background: #525659; }
                  iframe { width: 100%; height: 100%; border: none; }
                </style>
              </head>
              <body>
                <div class="toolbar"><span class="title">${record.fileName}</span><button class="close-btn" onclick="window.close()">关闭</button></div>
                <div class="pdf-container"><iframe src="${blobUrl}" type="application/pdf"></iframe></div>
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

  const handleDownloadRecord = (record: MedicalRecord) => {
    const link = document.createElement('a');
    link.href = record.fileData;
    link.download = record.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAIFeedback = (answerId: string, helpful: boolean) => {
    enhancedConsultService.submitFeedback(answerId, helpful);
    alert(helpful ? '感谢您的反馈，这将帮助其他患者找到更好的医案！' : '感谢您的反馈，我们会继续优化医案推荐');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">咨询不存在</h3>
          <button
            onClick={() => navigate('/mobile/consult')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回列表
          </button>
        </div>
      </div>
    );
  }

  const liked = consultation.likedBy?.includes(user?.id || '');
  const canDelete = user?.id === consultation.authorId;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="flex items-center p-4">
            <button onClick={() => navigate('/mobile/consult')} className="text-gray-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="flex-1 text-center font-semibold">咨询详情</h1>
            <div className="flex items-center">
              {canDelete && (
                <>
                  <button
                    onClick={handleEditConsultation}
                    className="text-gray-400 hover:text-blue-500 mr-2"
                    title="编辑咨询"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDeleteConsultation}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 pb-64">
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">{consultation.symptoms}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <User className="w-3 h-3" />
                  <span>{consultation.author}</span>
                  <Clock className="w-3 h-3 ml-2" />
                  <span>{new Date(consultation.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                consultation.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                consultation.urgency === 'urgent' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {consultation.urgency === 'critical' ? '危急' :
                 consultation.urgency === 'urgent' ? '紧急' : '普通'}
              </span>
            </div>

            {consultation.currentVersion > 1 && (
              <div className="mb-2 text-xs text-gray-400">
                已编辑 {consultation.currentVersion - 1} 次
                {consultation.lastEditedAt && ` · 最后编辑 ${new Date(consultation.lastEditedAt).toLocaleDateString()}`}
              </div>
            )}

            <div className="flex items-center gap-4 pt-3 border-t">
              <button
                onClick={handleLikeConsultation}
                className={`flex items-center gap-1 ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-red-500' : ''}`} />
                <span>{consultation.likes || 0}</span>
              </button>
              
              <CollectButton
                itemId={consultation.id}
                itemType="consult"
                itemData={{
                  title: consultation.symptoms,
                  description: consultation.description,
                  date: consultation.createdAt
                }}
                initialCollected={false}
              />
              
              <span className="flex items-center gap-1 text-gray-500">
                <MessageCircle className="w-5 h-5" />
                <span>{consultation.replyCount}</span>
              </span>
            </div>
          </div>

          <PatientInfoCard consultation={consultation} />

          {medicalRecords.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                关联诊疗记录 ({medicalRecords.length})
              </h3>
              <div className="space-y-2">
                {medicalRecords.map(record => (
                  <MedicalRecordItem
                    key={record.id}
                    record={record}
                    onPreview={handlePreviewRecord}
                    onDownload={handleDownloadRecord}
                  />
                ))}
              </div>
            </div>
          )}

          {loadingRecords && (
            <div className="text-center py-2 text-sm text-gray-400">
              加载诊疗记录中...
            </div>
          )}

          {loadingAI && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-xs text-gray-400 mt-2">正在搜索相关真实医案...</p>
            </div>
          )}

          {aiAnswers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                相关真实医案推荐 ({aiAnswers.length})
              </h3>
              <div className="space-y-3">
                {aiAnswers.map(answer => (
                  <div key={answer.id} className="bg-green-50 rounded-xl p-4 border border-green-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        🏥 {answer.source === 'yiigle' ? '期刊参考' : '平台真实医案'}
                      </span>
                      {answer.credibilityLevel === 'A' && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                          ⭐ 高可信
                        </span>
                      )}
                      {answer.institution && answer.institution !== '未知医院' && (
                        <span className="text-xs text-gray-500">
                          {answer.institution}
                        </span>
                      )}
                    </div>

                    <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
                      {(answer.patientInfo?.age || answer.patientInfo?.gender || (answer.publishDate && answer.publishDate !== 'Invalid Date')) && (
                        <div className="flex items-center gap-2 text-gray-600">
                          {answer.patientInfo?.age && (
                            <>
                              <User className="w-4 h-4" />
                              <span>{answer.patientInfo.age}岁</span>
                            </>
                          )}
                          {answer.patientInfo?.gender && (
                            <span>· {answer.patientInfo.gender}</span>
                          )}
                          {answer.publishDate && answer.publishDate !== 'Invalid Date' && (
                            <>
                              <span>·</span>
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(answer.publishDate).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      )}
                      
                      {answer.symptoms && answer.symptoms.length > 0 && (
                        <div>
                          <span className="text-gray-500 text-xs">症状：</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {answer.symptoms.map((s: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-gray-500 text-xs">诊断：</span>
                        <span className="text-gray-700 font-medium ml-1">{answer.diagnosis}</span>
                      </div>
                      
                      {answer.treatment && (
                        <div>
                          <span className="text-gray-500 text-xs">治疗：</span>
                          <span className="text-gray-600 ml-1">{answer.treatment}</span>
                        </div>
                      )}
                      
                      {answer.outcome && (
                        <div className={`p-2 rounded-lg ${
                          answer.outcome.includes('痊愈') ? 'bg-green-50 text-green-700' :
                          answer.outcome.includes('改善') ? 'bg-blue-50 text-blue-700' :
                          'bg-yellow-50 text-yellow-700'
                        }`}>
                          <span className="text-xs font-medium">疗效：</span>
                          <span className="text-xs">{answer.outcome}</span>
                        </div>
                      )}
                    </div>
                    
                    {answer.url && (
                      <a
                        href={answer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        查看原文
                      </a>
                    )}
                    
                    <div className="flex justify-end mt-2 border-t border-green-200 pt-2">
                      <button
                        onClick={() => handleAIFeedback(answer.id, true)}
                        className="text-xs text-green-600 hover:text-green-700 mr-4 font-medium"
                      >
                        👍 有帮助
                      </button>
                      <button
                        onClick={() => handleAIFeedback(answer.id, false)}
                        className="text-xs text-gray-500 hover:text-gray-600"
                      >
                        👎 不相关
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========== AI治疗指导区域 ========== */}
          <div className="mb-4">
            <button
              onClick={handleGetTreatmentGuidance}
              disabled={loadingTreatmentGuidance}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🩺</span>
                <div className="text-left">
                  <h3 className="font-bold">AI治疗指导</h3>
                  <p className="text-xs opacity-90">基于您的病情，提供治疗思路和参考案例</p>
                </div>
              </div>
              {loadingTreatmentGuidance ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <span className="text-2xl">→</span>
              )}
            </button>
          </div>

          {/* AI治疗指导结果展示 */}
          {treatmentGuidance && !loadingTreatmentGuidance && (
            <div className="bg-white rounded-xl shadow-lg mb-4 overflow-hidden border-l-4 border-green-500">
              <div className="bg-green-50 p-4 border-b border-green-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🩺</span>
                  <h4 className="font-semibold text-green-800">AI治疗指导</h4>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">参考案例</span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-gray-700 text-sm leading-relaxed">
                  {treatmentGuidance.split('\n').map((para, idx) => {
                    if (para.startsWith('##')) {
                      return <h4 key={idx} className="font-semibold text-gray-800 mt-3 first:mt-0">{para.replace(/^##\s*/, '')}</h4>;
                    }
                    if (para.startsWith('###')) {
                      return <h5 key={idx} className="font-medium text-gray-800 mt-2">{para.replace(/^###\s*/, '')}</h5>;
                    }
                    if (para.trim()) {
                      return <p key={idx} className="mb-2">{para}</p>;
                    }
                    return null;
                  })}
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-400">
                  ⚠️ 以上信息仅供参考，具体治疗方案请咨询医生
                </div>
              </div>
            </div>
          )}

          {/* ========== AI用药指导按钮和展示区 ========== */}
          <div className="mb-4">
            <button
              onClick={handleGetAIAdvice}
              disabled={loadingAIAdvice}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">💊</span>
                <div className="text-left">
                  <h3 className="font-bold">AI用药指导</h3>
                  <p className="text-xs opacity-90">基于您的症状，推荐个性化用药方案</p>
                </div>
              </div>
              {loadingAIAdvice ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <span className="text-2xl">→</span>
              )}
            </button>
          </div>

          {aiAdvice && (
            <div className="bg-white rounded-xl shadow-lg mb-4 overflow-hidden border-l-4 border-blue-500">
              <div className="bg-blue-50 p-4 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💊</span>
                  <h4 className="font-semibold text-blue-800">AI用药指导</h4>
                </div>
                <p className="text-sm text-gray-700 mt-2">{aiAdvice.summary}</p>
              </div>
              
              {aiAdvice.drugs.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <h4 className="font-medium mb-3">💊 推荐药物</h4>
                  <div className="space-y-3">
                    {aiAdvice.drugs.map((drug, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{drug.name}</span>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                            {drug.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">适应症：{drug.indications}</p>
                        <p className="text-xs text-red-600 mt-1">禁忌：{drug.contraindications}</p>
                        <p className="text-xs text-gray-500 mt-1">用法：{drug.usage}</p>
                        <p className="text-xs text-yellow-600 mt-1">副作用：{drug.sideEffects}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {aiAdvice.lifestyle.length > 0 && (
                <div className="p-4 border-b border-gray-100 bg-green-50">
                  <h4 className="font-medium text-green-800 mb-2">🌿 生活方式建议</h4>
                  <ul className="space-y-1">
                    {aiAdvice.lifestyle.map((item, idx) => (
                      <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="p-4 bg-yellow-50">
                <h4 className="font-medium text-yellow-800 mb-2">🏥 就医建议</h4>
                <p className="text-sm text-yellow-800">{aiAdvice.whenToSeeDoctor}</p>
              </div>
            </div>
          )}

          {/* ========== AI药品问答区域 ========== */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💊</span>
              <h4 className="font-medium text-gray-800">AI药品问答</h4>
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded">智能解答</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              可以问：高血压降压药怎么选？布洛芬和扑热息痛有什么区别？...
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={drugQuestion}
                onChange={(e) => setDrugQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleDrugQuestion()}
                placeholder="输入药品相关问题..."
                className="flex-1 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleDrugQuestion}
                disabled={loadingDrugQuestion}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium disabled:opacity-50"
              >
                {loadingDrugQuestion ? '思考中...' : '提问'}
              </button>
            </div>
            
            {loadingDrugQuestion && (
              <div className="mt-3 p-4 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span className="text-sm text-gray-500">AI正在思考...</span>
                </div>
              </div>
            )}
            
            {drugAnswer && !loadingDrugQuestion && (
              <div className="mt-3 bg-white rounded-lg border-l-4 border-purple-500 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-purple-700">🤖 AI回答</span>
                    <span className="text-xs text-gray-400">基于权威医学知识</span>
                  </div>
                  <div className="text-gray-700 text-sm leading-relaxed space-y-3">
                    {drugAnswer.split('\n').map((paragraph, idx) => {
                      if (paragraph.startsWith('#') || paragraph.startsWith('##')) {
                        return (
                          <h4 key={idx} className="font-semibold text-gray-800 mt-2 first:mt-0">
                            {paragraph.replace(/^#+\s*/, '').replace(/\*\*/g, '')}
                          </h4>
                        );
                      }
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <p key={idx} className="font-medium text-gray-700">
                            {paragraph.replace(/\*\*/g, '')}
                          </p>
                        );
                      }
                      if (paragraph.trim()) {
                        return <p key={idx} className="mb-2">{paragraph}</p>;
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 搜索结果列表 */}
          {loadingDrugs ? (
            <div className="text-center py-8 bg-white rounded-xl mt-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">正在搜索药品...</p>
            </div>
          ) : drugResults.length > 0 ? (
            <div className="space-y-3 mt-3">
              {drugResults.map((result, index) => (
                <DrugResultCard key={index} result={result} />
              ))}
            </div>
          ) : drugKeyword && !loadingDrugs ? (
            <div className="text-center py-8 bg-white rounded-lg mt-3">
              <p className="text-gray-500">未找到相关药品</p>
              <p className="text-xs text-gray-400 mt-1">试试用 AI药品问答获取更多帮助</p>
            </div>
          ) : null}
        </div>

        <div className="h-16"></div>

        {replies.length > 0 && (
          <div className="mb-4">
            {replies.map(reply => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                currentUserId={user?.id || ''}
                onLike={handleLikeReply}
                onDelete={handleDeleteReply}
                onAskForMore={handleAskForMore}
              />
            ))}
          </div>
        )}
      </div>

      {/* 回复输入框 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-h-[50vh] overflow-y-auto">
          <div className="p-4">
            <h3 className="font-medium mb-2">写回复</h3>
            
            <IdentitySelector value={identity} onChange={setIdentity} />
            
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="写下你的回复..."
              rows={3}
              className="w-full p-3 border rounded-lg resize-none mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <div className="mb-3">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={showContact}
                  onChange={(e) => setShowContact(e.target.checked)}
                  className="w-4 h-4"
                />
                留下联系方式（选填）
              </label>
              {showContact && (
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="微信号/手机号/邮箱"
                  className="w-full p-2 border rounded-lg mt-2"
                />
              )}
            </div>
            
            <button
              onClick={handleAddReply}
              disabled={!replyContent.trim()}
              className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium text-base"
              style={{ minHeight: '52px' }}
            >
              <Send className="w-5 h-5" />
              发布回复
            </button>
          </div>
        </div>
      </div>

      {/* 编辑模态框 */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b sticky top-0 bg-white flex justify-between items-center">
              <h3 className="font-bold text-lg">补充咨询信息</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <CompleteConsultForm 
                initialData={consultation}
                isEditing={true}
                onSubmit={handleUpdateConsultation}
                onCancel={() => setIsEditing(false)}
                user={user}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileConsultDetailPage;