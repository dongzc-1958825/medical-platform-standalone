// src/components/family/HealthRecordList.tsx
import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Building2, 
  Download,
  Trash2,
  Search,
  Filter,
  X,
  User,
  Stethoscope,
  Image as ImageIcon,
  Activity,
  Edit2
} from 'lucide-react';
import { FamilyHealthRecord } from '../../shared/types/family';

interface HealthRecordListProps {
  records: FamilyHealthRecord[];
  memberName: string;
  onAdd: () => void;
  onEdit: (record: FamilyHealthRecord) => void;
  onDelete: (id: string) => void;
  onPreview: (record: FamilyHealthRecord) => void;
  onDownload: (record: FamilyHealthRecord) => void;
}

const HealthRecordList: React.FC<HealthRecordListProps> = ({
  records,
  memberName,
  onAdd,
  onEdit,
  onDelete,
  onPreview,
  onDownload
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [recordType, setRecordType] = useState('');

  // 过滤记录
  const filteredRecords = records.filter(record => {
    let matchesSearch = true;
    let matchesDate = true;
    let matchesType = true;

    if (searchKeyword) {
      const term = searchKeyword.toLowerCase();
      matchesSearch = 
        record.hospital.toLowerCase().includes(term) ||
        record.department?.toLowerCase().includes(term) ||
        record.doctor?.toLowerCase().includes(term) ||
        record.diagnosis.toLowerCase().includes(term) ||
        record.symptoms?.some(s => s.toLowerCase().includes(term));
    }

    if (startDate) {
      matchesDate = record.recordDate >= startDate;
    }
    if (endDate && matchesDate) {
      matchesDate = record.recordDate <= endDate;
    }

    if (recordType) {
      matchesType = record.recordType === recordType;
    }

    return matchesSearch && matchesDate && matchesType;
  });

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

  const clearFilters = () => {
    setSearchKeyword('');
    setStartDate('');
    setEndDate('');
    setRecordType('');
    setShowFilters(false);
  };

  return (
    <div className="space-y-4">
      {/* 搜索栏 - 删除"+新建"按钮 */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜索医院、医生、诊断..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-colors ${
            showFilters || startDate || endDate || recordType
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* 筛选条件 */}
      {showFilters && (
        <div className="bg-white rounded-lg p-3 border border-gray-200 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">开始日期</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">结束日期</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">记录类型</label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="w-full p-2 border rounded-lg text-sm bg-white"
            >
              <option value="">全部</option>
              <option value="门诊">门诊</option>
              <option value="住院">住院</option>
              <option value="检查">检查</option>
              <option value="手术">手术</option>
              <option value="急诊">急诊</option>
            </select>
          </div>

          {(startDate || endDate || recordType) && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center w-full py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <X className="w-3 h-3 mr-1" />
              清除筛选
            </button>
          )}
        </div>
      )}

      {/* 记录列表 */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">暂无健康记录</p>
          <p className="text-sm text-gray-400">
            点击右上角"新增记录"按钮为{memberName}添加第一条健康记录
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all relative group"
            >
              {/* 编辑按钮 - 添加这个 */}
              <button
                onClick={() => onEdit(record)}
                className="absolute top-3 right-3 p-1.5 bg-gray-100 text-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
                title="编辑"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-start gap-3">
                {/* 文件图标 */}
                <div className="flex-shrink-0">
                  {record.attachments && record.attachments.length > 0 ? (
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-purple-600" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* 记录信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">
                      {record.recordType}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRecordTypeColor(record.recordType)}`}>
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
              {record.attachments && record.attachments.length > 0 && (
                <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => onPreview(record)}
                    className="px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1 inline" />
                    预览
                  </button>
                  <button
                    onClick={() => onDownload(record)}
                    className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Download className="w-3.5 h-3.5 mr-1 inline" />
                    下载
                  </button>
                  <button
                    onClick={() => onDelete(record.id)}
                    className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1 inline" />
                    删除
                  </button>
                </div>
              )}
              {!record.attachments && (
                <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => onDelete(record.id)}
                    className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1 inline" />
                    删除
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthRecordList;