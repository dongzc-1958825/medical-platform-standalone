import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultService } from '../../shared/services/consultService';

const ConsultFlowTest: React.FC = () => {
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<{ [key: string]: { status: 'pending' | 'success' | 'fail', message?: string } }>({});

  // 测试1：创建新咨询
  const testCreateConsult = async () => {
    setTestResults(prev => ({ ...prev, create: { status: 'pending' } }));
    
    try {
      // 模拟完整的17项数据
      const completeData = {
        patientInfo: {
          name: '王某某',
          age: 56,
          gender: 'male' as const,
          height: 175,
          weight: 80,
          location: '北京市朝阳区',
          occupation: '程序员',
          workEnvironment: '办公室'
        },
        symptomDetails: [{
          name: '胸痛',
          location: '左侧胸部',
          characteristic: ['钝痛', '固定位置痛'],
          timing: '活动后',
          frequency: '间歇性',
          duration: '5-10分钟',
          aggravating: ['活动后', '情绪波动'],
          relieving: ['休息后'],
          severity: 4,
          description: '胸骨后压榨性疼痛，休息后可缓解'
        }],
        medicalHistory: {
          baselineDiseases: ['高血压', '糖尿病'],
          allergies: {
            drug: ['青霉素'],
            food: ['海鲜']
          },
          surgeries: [{ name: '阑尾切除术', year: '2018' }],
          familyHistory: ['高血压', '糖尿病']
        },
        diagnosis: {
          hospitals: [{
            name: '北京协和医院',
            department: '心内科',
            doctor: '张医生',
            diagnosis: '冠心病 不稳定型心绞痛',
            date: '2024-03-01',
            basis: '心电图、心肌酶'
          }]
        },
        treatment: {
          records: [{
            hospital: '北京协和医院',
            doctor: '张医生',
            medications: [{
              name: '阿司匹林',
              dosage: '100mg',
              frequency: 'qd',
              duration: '长期',
              efficacy: '有效'
            }],
            startDate: '2024-03-01'
          }]
        },
        course: {
          startDate: '2024-02-28',
          currentStatus: '急性期'
        },
        efficacy: {
          overall: '好转',
          description: '症状明显缓解'
        }
      };

      const newConsult = consultService.createConsultation(
        {
          symptoms: '胸痛',
          description: '反复胸痛3天',
          request: '想了解诊断和治疗建议',
          urgency: 'urgent'
        },
        'test-user-id',
        '测试用户',
        completeData
      );

      setTestResults(prev => ({ 
        ...prev, 
        create: { 
          status: 'success', 
          message: `✅ 创建成功！ID: ${newConsult.id}` 
        }
      }));

      return newConsult;
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        create: { 
          status: 'fail', 
          message: `❌ 创建失败: ${error}` 
        }
      }));
    }
  };

  // 测试2：读取刚创建的咨询
  const testReadConsult = (id: string) => {
    setTestResults(prev => ({ ...prev, read: { status: 'pending' } }));

    try {
      const consult = consultService.getConsultation(id);
      
      if (consult) {
        const hasCompleteData = consult.patientInfo && 
                                consult.symptomDetails && 
                                consult.medicalHistory &&
                                consult.diagnosis;

        setTestResults(prev => ({ 
          ...prev, 
          read: { 
            status: 'success', 
            message: `✅ 读取成功！${hasCompleteData ? '包含完整信息' : '信息不完整'}` 
          }
        }));
      } else {
        throw new Error('咨询不存在');
      }
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        read: { 
          status: 'fail', 
          message: `❌ 读取失败: ${error}` 
        }
      }));
    }
  };

  // 测试3：验证完整度计算
  const testCompleteness = () => {
    setTestResults(prev => ({ ...prev, completeness: { status: 'pending' } }));

    try {
      const consultations = consultService.getAllConsultations();
      const latest = consultations[0];
      
      if (latest && latest.completeness) {
        setTestResults(prev => ({ 
          ...prev, 
          completeness: { 
            status: 'success', 
            message: `✅ 完整度: ${latest.completeness}%，参考级别: ${latest.referenceLevel}` 
          }
        }));
      } else {
        throw new Error('未找到咨询或完整度未计算');
      }
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        completeness: { 
          status: 'fail', 
          message: `❌ 完整度验证失败: ${error}` 
        }
      }));
    }
  };

  // 测试4：验证详情页跳转
  const testNavigateToDetail = (id: string) => {
    navigate(`/consult/${id}`);
    setTestResults(prev => ({ 
      ...prev, 
      navigate: { 
        status: 'success', 
        message: '✅ 正在跳转到详情页，请检查页面显示...' 
      }
    }));
  };

  // 运行所有测试
  const runAllTests = async () => {
    setTestResults({});
    
    // 1. 创建
    const newConsult = await testCreateConsult();
    if (!newConsult) return;

    // 2. 读取
    testReadConsult(newConsult.id);

    // 3. 完整度
    setTimeout(() => testCompleteness(), 500);

    // 4. 提示跳转
    setTestResults(prev => ({ 
      ...prev, 
      final: { 
        status: 'success', 
        message: '🎯 请点击下方按钮查看详情页' 
      }
    }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 寻医问药功能测试</h1>

      {/* 测试控制 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">测试步骤</h2>
        
        <div className="space-y-3">
          <button
            onClick={runAllTests}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🚀 运行全部测试
          </button>

          <button
            onClick={async () => {
              const consult = await testCreateConsult();
              if (consult) {
                setTestResults(prev => ({ 
                  ...prev, 
                  nextStep: { 
                    status: 'success', 
                    message: `✅ 创建成功，请继续测试读取功能` 
                  }
                }));
              }
            }}
            className="w-full py-2 border rounded-lg hover:bg-gray-50"
          >
            仅测试创建
          </button>

          <button
            onClick={() => {
              const consultations = consultService.getAllConsultations();
              if (consultations.length > 0) {
                testReadConsult(consultations[0].id);
              } else {
                alert('请先创建咨询');
              }
            }}
            className="w-full py-2 border rounded-lg hover:bg-gray-50"
          >
            仅测试读取
          </button>
        </div>
      </div>

      {/* 测试结果 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">📊 测试结果</h2>
        
        <div className="space-y-3">
          {testResults.create && (
            <div className={`p-3 rounded-lg ${
              testResults.create.status === 'success' ? 'bg-green-50' :
              testResults.create.status === 'fail' ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              <span className="font-medium">创建咨询：</span>
              <span className="text-sm">{testResults.create.message}</span>
            </div>
          )}

          {testResults.read && (
            <div className={`p-3 rounded-lg ${
              testResults.read.status === 'success' ? 'bg-green-50' :
              testResults.read.status === 'fail' ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              <span className="font-medium">读取咨询：</span>
              <span className="text-sm">{testResults.read.message}</span>
            </div>
          )}

          {testResults.completeness && (
            <div className={`p-3 rounded-lg ${
              testResults.completeness.status === 'success' ? 'bg-green-50' :
              testResults.completeness.status === 'fail' ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              <span className="font-medium">完整度计算：</span>
              <span className="text-sm">{testResults.completeness.message}</span>
            </div>
          )}

          {testResults.navigate && (
            <div className="p-3 rounded-lg bg-yellow-50">
              <span className="font-medium">页面跳转：</span>
              <span className="text-sm">{testResults.navigate.message}</span>
            </div>
          )}

          {testResults.final && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 mb-2">{testResults.final.message}</p>
              <button
                onClick={() => {
                  const consultations = consultService.getAllConsultations();
                  if (consultations.length > 0) {
                    testNavigateToDetail(consultations[0].id);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                查看最新咨询详情
              </button>
            </div>
          )}
        </div>

        {/* 检查清单 */}
        <div className="mt-6 pt-4 border-t">
          <h3 className="font-medium mb-2">✅ 手动检查清单</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> 患者信息显示
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> 症状详细描述
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> 病史信息
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> 多家医院诊断
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> 治疗记录
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> 病程和疗效
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> 主要诉求
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> 完整度提示
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> 回复功能
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" /> 点赞/收藏
            </div>
          </div>
        </div>
      </div>

      {/* 数据查看 */}
      <div className="mt-4">
        <button
          onClick={() => {
            const consultations = consultService.getAllConsultations();
            console.log('📋 当前所有咨询:', consultations);
            alert(`已输出到控制台，共 ${consultations.length} 条咨询`);
          }}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          🔍 查看控制台数据
        </button>
      </div>
    </div>
  );
};

export default ConsultFlowTest;