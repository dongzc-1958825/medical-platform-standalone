import React, { useState } from 'react';
import { enhancedExtractor, EnrichedCaseInfo, DrugInfo } from '../../shared/utils/enhancedExtractor';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  source: 'platform' | 'yiigle';
  url: string;
  date?: string;
}

interface SearchResultCardProps {
  result: SearchResult;
  onSave?: (info: EnrichedCaseInfo | DrugInfo) => void;
  onReminder?: (info: EnrichedCaseInfo | DrugInfo) => void;
  onFeedback?: (id: string, type: 'helpful' | 'not-helpful') => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ 
  result, 
  onSave,
  onReminder,
  onFeedback 
}) => {
  const [expanded, setExpanded] = useState(false);
  
  // 判断内容类型
  const isDrugContent = result.content.includes('【药品名称】') || 
                       result.content.includes('适应症') ||
                       result.content.includes('用法用量') ||
                       result.content.includes('禁忌');
  
  // 根据类型使用不同的提取器
  const caseInfo = !isDrugContent ? enhancedExtractor.extractCase(result.content) : null;
  const drugInfo = isDrugContent ? enhancedExtractor.extractDrug(result.content) : null;
  
  // 生成摘要
  const summary = isDrugContent && drugInfo
    ? enhancedExtractor.generateDrugSummary(drugInfo)
    : caseInfo 
      ? enhancedExtractor.generateCaseSummary(caseInfo)
      : result.content.substring(0, 100) + '...';

  // 计算可信度
  const confidence = caseInfo?.confidence || 70;

  // 渲染医案信息
  const renderCaseInfo = () => {
    if (!caseInfo) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        {/* 患者基本信息 */}
        {(caseInfo.patient.name || caseInfo.patient.age || caseInfo.patient.gender !== '未知') && (
          <div className="mb-2 pb-2 border-b border-gray-200">
            <span className="text-xs text-gray-500 block mb-1">👤 患者信息</span>
            <div className="flex flex-wrap items-center gap-2">
              {caseInfo.patient.name && (
                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {caseInfo.patient.name}
                </span>
              )}
              {caseInfo.patient.age && (
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {caseInfo.patient.age}岁
                </span>
              )}
              {caseInfo.patient.gender !== '未知' && (
                <span className="text-sm bg-pink-100 text-pink-800 px-2 py-1 rounded">
                  {caseInfo.patient.gender}性
                </span>
              )}
            </div>
          </div>
        )}

        {/* 基础病 */}
        {caseInfo.patient.baseline?.diseases && caseInfo.patient.baseline.diseases.length > 0 && (
          <div className="mb-2 pb-2 border-b border-gray-200">
            <span className="text-xs text-gray-500 block mb-1">🏥 基础病史</span>
            <div className="flex flex-wrap gap-1">
              {caseInfo.patient.baseline.diseases.map((disease, idx) => (
                <span key={idx} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded">
                  {disease}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 症状 */}
        {caseInfo.symptoms.primary.length > 0 && (
          <div className="mb-2 pb-2 border-b border-gray-200">
            <span className="text-xs text-gray-500 block mb-1">🤒 症状</span>
            <div className="flex flex-wrap gap-1">
              {caseInfo.symptoms.primary.map((symptom, idx) => (
                <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full">
                  {symptom}
                </span>
              ))}
              {caseInfo.symptoms.duration && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  {caseInfo.symptoms.duration}
                </span>
              )}
            </div>
            {caseInfo.symptoms.description && !expanded && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {caseInfo.symptoms.description}
              </p>
            )}
          </div>
        )}

        {/* 诊断 */}
        {caseInfo.diagnosis.primary !== '未知' && (
          <div className="mb-2 pb-2 border-b border-gray-200">
            <span className="text-xs text-gray-500 block mb-1">🏷️ 诊断</span>
            <div className="font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded inline-block text-sm">
              {caseInfo.diagnosis.primary}
            </div>
            {caseInfo.diagnosis.differential && caseInfo.diagnosis.differential.length > 0 && expanded && (
              <div className="mt-1">
                <span className="text-xs text-gray-500">鉴别诊断：</span>
                <span className="text-xs">{caseInfo.diagnosis.differential.join('、')}</span>
              </div>
            )}
          </div>
        )}

        {/* 治疗用药 */}
        {caseInfo.treatment.medications.length > 0 && (
          <div className="mb-2 pb-2 border-b border-gray-200">
            <span className="text-xs text-gray-500 block mb-1">💊 用药</span>
            <div className="space-y-1">
              {caseInfo.treatment.medications.map((med, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-700">{med.name}</span>
                  {med.dosage && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                      {med.dosage}
                    </span>
                  )}
                  {med.frequency && (
                    <span className="text-xs text-gray-500">{med.frequency}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 手术/操作 */}
        {caseInfo.treatment.procedures && caseInfo.treatment.procedures.length > 0 && expanded && (
          <div className="mb-2 pb-2 border-b border-gray-200">
            <span className="text-xs text-gray-500 block mb-1">🔪 手术/操作</span>
            <div className="flex flex-wrap gap-1">
              {caseInfo.treatment.procedures.map((proc, idx) => (
                <span key={idx} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded">
                  {proc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 疗效 */}
        {caseInfo.efficacy.outcome !== '未知' && (
          <div className="mb-2 pb-2 border-b border-gray-200">
            <span className="text-xs text-gray-500 block mb-1">📊 疗效</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm px-2 py-1 rounded ${
                caseInfo.efficacy.outcome === '治愈' ? 'bg-green-100 text-green-800' :
                caseInfo.efficacy.outcome === '好转' ? 'bg-blue-100 text-blue-800' :
                caseInfo.efficacy.outcome === '无效' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {caseInfo.efficacy.outcome}
              </span>
              {caseInfo.efficacy.description && expanded && (
                <span className="text-xs text-gray-600">{caseInfo.efficacy.description}</span>
              )}
            </div>
            {caseInfo.efficacy.followUp && expanded && (
              <p className="text-xs text-gray-500 mt-1">{caseInfo.efficacy.followUp}</p>
            )}
          </div>
        )}

        {/* 医院信息 */}
        {(caseInfo.hospital.name || caseInfo.hospital.doctor) && (
          <div className="mb-2">
            <span className="text-xs text-gray-500 block mb-1">🏥 就诊信息</span>
            <div className="text-sm">
              {caseInfo.hospital.name && (
                <span className="text-gray-700">{caseInfo.hospital.name}</span>
              )}
              {caseInfo.hospital.department && (
                <span className="text-gray-500 text-xs ml-1">{caseInfo.hospital.department}</span>
              )}
              {caseInfo.hospital.doctor && (
                <span className="text-gray-600 text-sm block mt-0.5">
                  接诊医生：{caseInfo.hospital.doctor}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染药品信息
  const renderDrugInfo = () => {
    if (!drugInfo) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        {/* 药品名称 */}
        <div className="mb-2 pb-2 border-b border-gray-200">
          <span className="text-xs text-gray-500 block mb-1">💊 药品信息</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-purple-800">{drugInfo.name}</span>
            {drugInfo.genericName && (
              <span className="text-xs text-gray-500">({drugInfo.genericName})</span>
            )}
          </div>
          {drugInfo.category && (
            <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded mt-1 inline-block">
              {drugInfo.category}
            </span>
          )}
        </div>

        {/* 适应症 */}
        {drugInfo.indications.length > 0 && (
          <div className="mb-2 pb-2 border-b border-gray-200">
            <span className="text-xs text-gray-500 block mb-1">✅ 适应症</span>
            <div className="flex flex-wrap gap-1">
              {drugInfo.indications.map((ind, idx) => (
                <span key={idx} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                  {ind}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 禁忌症 */}
        {drugInfo.contraindications.length > 0 && (
          <div className="mb-2 pb-2 border-b border-gray-200">
            <span className="text-xs text-gray-500 block mb-1">⚠️ 禁忌症</span>
            <div className="flex flex-wrap gap-1">
              {drugInfo.contraindications.map((contra, idx) => (
                <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">
                  {contra}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 用法用量 */}
        {drugInfo.usage.dosage && (
          <div className="mb-2 pb-2 border-b border-gray-200">
            <span className="text-xs text-gray-500 block mb-1">💧 用法用量</span>
            <div className="text-sm text-gray-800">{drugInfo.usage.dosage}</div>
            {drugInfo.usage.timing && (
              <div className="text-xs text-gray-500 mt-1">服用时间：{drugInfo.usage.timing}</div>
            )}
          </div>
        )}

        {/* 价格和医保 */}
        <div className="mb-2 pb-2 border-b border-gray-200">
          <span className="text-xs text-gray-500 block mb-1">💰 价格信息</span>
          <div className="grid grid-cols-2 gap-2">
            {drugInfo.pricing.price && (
              <div>
                <span className="text-xs text-gray-500">参考价</span>
                <div className="text-sm font-medium text-gray-800">
                  ¥{drugInfo.pricing.price}{drugInfo.pricing.unit ? `/${drugInfo.pricing.unit}` : ''}
                </div>
              </div>
            )}
            {drugInfo.pricing.insuranceType && drugInfo.pricing.insuranceType !== '未知' && (
              <div>
                <span className="text-xs text-gray-500">医保类型</span>
                <div className={`text-sm font-medium ${
                  drugInfo.pricing.insuranceType === '甲类' ? 'text-green-600' :
                  drugInfo.pricing.insuranceType === '乙类' ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {drugInfo.pricing.insuranceType}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 生产厂家 */}
        {drugInfo.pricing.manufacturer && (
          <div className="mb-2">
            <span className="text-xs text-gray-500 block mb-1">🏭 生产厂家</span>
            <div className="text-sm text-gray-700">{drugInfo.pricing.manufacturer}</div>
          </div>
        )}

        {/* 不良反应（展开时显示） */}
        {drugInfo.sideEffects && drugInfo.sideEffects.length > 0 && expanded && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-500 block mb-1">📋 不良反应</span>
            <div className="flex flex-wrap gap-1">
              {drugInfo.sideEffects.map((effect, idx) => (
                <span key={idx} className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded">
                  {effect}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 注意事项（展开时显示） */}
        {drugInfo.precautions.length > 0 && expanded && (
          <div className="mt-2">
            <span className="text-xs text-gray-500 block mb-1">📌 注意事项</span>
            <div className="flex flex-wrap gap-1">
              {drugInfo.precautions.map((pre, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                  {pre}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">
      {/* 头部：来源和可信度 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            result.source === 'yiigle' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {result.source === 'yiigle' ? '📚 中华医学期刊' : '🏥 平台医案'}
          </span>
          {confidence > 70 && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
              ⭐ 高可信度 {confidence}%
            </span>
          )}
          {isDrugContent && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
              💊 药品信息
            </span>
          )}
        </div>
        {result.date && (
          <span className="text-xs text-gray-400">{result.date}</span>
        )}
      </div>

      {/* 标题 */}
      <h3 className="font-bold text-lg mb-2 text-gray-800">{result.title}</h3>

      {/* 关键信息卡片 */}
      {isDrugContent ? renderDrugInfo() : renderCaseInfo()}

      {/* 展开/收起按钮 */}
      {((caseInfo?.symptoms.description) || 
        (caseInfo?.diagnosis.differential?.length) ||
        (caseInfo?.treatment.procedures?.length) ||
        (drugInfo?.sideEffects?.length) ||
        (drugInfo?.precautions?.length)) && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 mb-2 hover:text-blue-800"
        >
          {expanded ? '▲ 收起详细' : '▼ 展开详细'}
        </button>
      )}

      {/* 摘要 */}
      <div className="text-sm text-gray-700 mb-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
        <span className="text-xs text-yellow-600 font-medium block mb-1">
          📌 {isDrugContent ? '药品简介' : '案例摘要'}
        </span>
        {summary}
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-2 border-t pt-3">
        <button 
          onClick={() => onSave?.(isDrugContent ? drugInfo! : caseInfo!)}
          className="flex-1 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors flex items-center justify-center"
        >
          <span className="mr-1">👨‍👩‍👧</span> 存入家庭健康
        </button>
        <button 
          onClick={() => onReminder?.(isDrugContent ? drugInfo! : caseInfo!)}
          className="flex-1 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors flex items-center justify-center"
        >
          <span className="mr-1">🔔</span> 设提醒
        </button>
        <a 
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          <span className="mr-1">📖</span> 原文
        </a>
      </div>

      {/* 反馈按钮 */}
      <div className="flex justify-end space-x-3 mt-2 text-xs text-gray-400">
        <button 
          onClick={() => onFeedback?.(result.id, 'helpful')}
          className="hover:text-green-600 transition-colors flex items-center"
        >
          <span className="mr-1">👍</span> 有帮助
        </button>
        <button 
          onClick={() => onFeedback?.(result.id, 'not-helpful')}
          className="hover:text-red-600 transition-colors flex items-center"
        >
          <span className="mr-1">👎</span> 没帮助
        </button>
      </div>
    </div>
  );
};

export default SearchResultCard;