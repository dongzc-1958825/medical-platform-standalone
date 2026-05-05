// src/pages/mobile/FamilyHealthPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Plus, 
  User, 
  Edit2, 
  Trash2, 
  Calendar,
  Heart,
  Activity,
  Droplet,
  Scale,
  Ruler,
  AlertCircle,
  Users,
  Bell,
  FileText,
  X
} from 'lucide-react';
import { familyService } from '../../shared/services/familyService';
import { FamilyMember } from '../../shared/types/family';
import MemberForm from '../../components/family/MemberForm';

const FamilyHealthPage: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [showSharedSettings, setShowSharedSettings] = useState({
    shareData: true,
    viewFamily: true,
    emergencyNotify: true
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    try {
      const data = familyService.getMembers();
      if (data.length === 0) {
        // 如果没有数据，使用示例数据
        const sampleMembers: FamilyMember[] = [
          {
            id: '1',
            name: '张伟',
            relationship: '父亲',
            birthDate: '1959-03-15',
            gender: '男',
            height: 172,
            weight: 75,
            bloodType: 'A',
            allergies: ['青霉素过敏'],
            chronicDiseases: ['高血压'],
            surgicalHistory: [],
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: '李芳',
            relationship: '母亲',
            birthDate: '1962-07-22',
            gender: '女',
            height: 160,
            weight: 58,
            bloodType: 'B',
            allergies: [],
            chronicDiseases: [],
            surgicalHistory: [],
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            name: '张小华',
            relationship: '儿子',
            birthDate: '2012-05-10',
            gender: '男',
            height: 148,
            weight: 40,
            bloodType: 'O',
            allergies: ['花粉过敏'],
            chronicDiseases: [],
            surgicalHistory: [],
            createdAt: new Date().toISOString()
          },
          {
            id: '4',
            name: '张小红',
            relationship: '女儿',
            birthDate: '2016-11-28',
            gender: '女',
            height: 125,
            weight: 23,
            bloodType: 'A',
            allergies: [],
            chronicDiseases: ['哮喘'],
            surgicalHistory: [],
            createdAt: new Date().toISOString()
          }
        ];
        setMembers(sampleMembers);
        // 保存示例数据到服务
        sampleMembers.forEach(m => {
          const { id, createdAt, ...rest } = m;
          familyService.addMember(rest);
        });
      } else {
        setMembers(data);
      }
    } catch (error) {
      console.error('加载家庭成员失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (member: FamilyMember) => {
    if (member.chronicDiseases && member.chronicDiseases.length > 2) return 'bg-red-100 text-red-600';
    if (member.chronicDiseases && member.chronicDiseases.length > 0) return 'bg-orange-100 text-orange-600';
    return 'bg-green-100 text-green-600';
  };

  const getHealthStatus = (member: FamilyMember): '良好' | '一般' | '关注' | '需就医' => {
    if (member.chronicDiseases && member.chronicDiseases.length > 2) return '需就医';
    if (member.chronicDiseases && member.chronicDiseases.length > 0) return '关注';
    if (member.allergies && member.allergies.length > 0) return '一般';
    return '良好';
  };

  const getHealthSummary = () => {
    const total = members.length;
    const good = members.filter(m => getHealthStatus(m) === '良好').length;
    const needAttention = members.filter(m => getHealthStatus(m) === '关注' || getHealthStatus(m) === '需就医').length;
    
    return { total, good, needAttention };
  };

  const handleAddMember = (memberData: Omit<FamilyMember, 'id' | 'createdAt'>) => {
    const newMember = familyService.addMember(memberData);
    setMembers(prev => [newMember, ...prev]);
    setShowForm(false);
  };

  const handleUpdateMember = (memberData: Omit<FamilyMember, 'id' | 'createdAt'>) => {
    if (editingMember) {
      const updated = familyService.updateMember(editingMember.id, memberData);
      if (updated) {
        setMembers(prev => prev.map(m => m.id === editingMember.id ? updated : m));
      }
      setEditingMember(null);
      setShowForm(false);
    }
  };

  const handleDeleteMember = (id: string) => {
    if (window.confirm('确定要删除这位家庭成员吗？此操作不可恢复。')) {
      const success = familyService.deleteMember(id);
      if (success) {
        setMembers(prev => prev.filter(m => m.id !== id));
      }
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const summary = getHealthSummary();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-8">
      {/* 头部 */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">👨‍👩‍👧‍👦 家庭成员健康</h1>
        <p className="text-gray-600">管理家庭成员的健康信息</p>
      </header>

      {/* 家庭健康概览 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">家庭成员</p>
          <p className="text-2xl font-bold text-blue-600">{summary.total}人</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">健康良好</p>
          <p className="text-2xl font-bold text-green-600">{summary.good}人</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-sm text-gray-500 mb-1">需关注</p>
          <p className="text-2xl font-bold text-red-600">{summary.needAttention}人</p>
        </div>
      </div>

      {/* 添加家庭成员按钮 */}
      <div className="mb-6">
        <button 
          onClick={() => {
            setEditingMember(null);
            setShowForm(true);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition"
        >
          <span className="mr-2">+</span>
          添加家庭成员
        </button>
      </div>

      {/* 家庭成员列表 */}
      <div className="space-y-4 mb-8">
        {members.map((member) => {
          const healthStatus = getHealthStatus(member);
          const statusColor = getStatusColor(member);
          const bmi = familyService.calculateBMI(member.height, member.weight);
          const age = calculateAge(member.birthDate);

          return (
            <div key={member.id} className="bg-white rounded-xl shadow p-4 relative group">
              {/* 操作按钮 */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingMember(member);
                    setShowForm(true);
                  }}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                  title="编辑"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  title="删除"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                    <span className="text-lg font-semibold">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{member.name}</h3>
                    <p className="text-sm text-gray-500">
                      {member.relationship} • {age}岁
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                  {healthStatus}
                </div>
              </div>

              {/* 身体指标 */}
              {(member.height || member.weight || member.bloodType) && (
                <div className="flex flex-wrap gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                  {member.height && (
                    <div className="flex items-center gap-1 text-sm">
                      <Ruler className="w-4 h-4 text-blue-500" />
                      <span>{member.height} cm</span>
                    </div>
                  )}
                  {member.weight && (
                    <div className="flex items-center gap-1 text-sm">
                      <Scale className="w-4 h-4 text-green-500" />
                      <span>{member.weight} kg</span>
                    </div>
                  )}
                  {bmi && (
                    <div className="flex items-center gap-1 text-sm">
                      <Activity className="w-4 h-4 text-purple-500" />
                      <span>BMI {bmi}</span>
                    </div>
                  )}
                  {member.bloodType && (
                    <div className="flex items-center gap-1 text-sm">
                      <Droplet className="w-4 h-4 text-red-500" />
                      <span>{member.bloodType}型</span>
                    </div>
                  )}
                </div>
              )}

              {/* 健康档案 */}
              <div className="space-y-1 mb-3">
                {member.allergies && member.allergies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {member.allergies.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs">
                        🚫 {item}
                      </span>
                    ))}
                  </div>
                )}
                {member.chronicDiseases && member.chronicDiseases.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {member.chronicDiseases.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">
                        🏥 {item}
                      </span>
                    ))}
                  </div>
                )}
                {member.surgicalHistory && member.surgicalHistory.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {member.surgicalHistory.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">
                        🔪 {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => navigate(`/mobile/family/${member.id}/records`)}
                  className="flex-1 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-1"
                >
                  <FileText className="w-4 h-4" />
                  查看
                </button>
                <button
                  onClick={() => navigate(`/mobile/family/${member.id}/records?action=add`)}
                  className="flex-1 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  记录
                </button>
                <button
                  onClick={() => navigate(`/mobile/family/${member.id}/reminders`)}
                  className="flex-1 py-2 text-sm bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 flex items-center justify-center gap-1"
                >
                  <Bell className="w-4 h-4" />
                  提醒
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 家庭健康日程 - 动态提醒列表 */}
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">家庭健康日程</h3>
          <button
            onClick={() => navigate('/mobile/family')}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            查看全部
          </button>
        </div>
        
        {(() => {
          // 获取所有成员的未完成提醒
          const allReminders = members.flatMap(member => 
            familyService.getMemberReminders(member.id)
              .filter(r => !r.completed)
              .map(r => ({ ...r, memberName: member.name }))
          ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 5); // 只显示最近5条

          if (allReminders.length === 0) {
            return (
              <div className="text-center py-6 text-gray-400">
                <Bell className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">暂无待办提醒</p>
              </div>
            );
          }

          return (
            <div className="space-y-3">
              {allReminders.map((reminder) => {
                const date = new Date(reminder.dueDate);
                const today = new Date();
                const isToday = date.toDateString() === today.toDateString();
                const isTomorrow = date.toDateString() === new Date(today.setDate(today.getDate() + 1)).toDateString();

                let timeText = '';
                if (isToday) timeText = '今天';
                else if (isTomorrow) timeText = '明天';
                else timeText = `${date.getMonth() + 1}月${date.getDate()}日`;

                const timeStr = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

                // 根据提醒类型设置颜色
                const getTypeColor = (type: string) => {
                  switch(type) {
                    case 'medication': return 'bg-blue-50 border-blue-200';
                    case 'checkup': return 'bg-yellow-50 border-yellow-200';
                    case 'vaccine': return 'bg-purple-50 border-purple-200';
                    default: return 'bg-gray-50 border-gray-200';
                  }
                };

                const getTypeIcon = (type: string) => {
                  switch(type) {
                    case 'medication': return '💊';
                    case 'checkup': return '🩺';
                    case 'vaccine': return '💉';
                    default: return '🔔';
                  }
                };

                return (
                  <div
                    key={reminder.id}
                    className={`flex items-center p-3 rounded-lg border ${getTypeColor(reminder.type)} cursor-pointer hover:shadow-sm transition`}
                    onClick={() => navigate(`/mobile/family/${reminder.memberId}/reminders`)}
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <span className="text-sm">{getTypeIcon(reminder.type)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{reminder.title}</p>
                        <span className="text-xs text-gray-500">{reminder.memberName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span>{timeText} {timeStr}</span>
                        {reminder.repeat !== 'none' && (
                          <span className="px-1.5 py-0.5 bg-white/50 rounded text-xs">
                            🔄 {reminder.repeat === 'daily' ? '每天' : reminder.repeat === 'weekly' ? '每周' : '每月'}
                          </span>
                        )}
                      </div>
                    </div>
                    {!reminder.completed && (
                      <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* 共享设置 */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold text-gray-800 mb-3">健康数据共享</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">共享我的健康数据</span>
            <button 
              onClick={() => setShowSharedSettings(prev => ({ ...prev, shareData: !prev.shareData }))}
              className={`w-10 h-6 ${showSharedSettings.shareData ? 'bg-blue-500' : 'bg-gray-300'} rounded-full`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transform ${showSharedSettings.shareData ? 'translate-x-5' : 'translate-x-1'}`}></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">查看家人健康数据</span>
            <button 
              onClick={() => setShowSharedSettings(prev => ({ ...prev, viewFamily: !prev.viewFamily }))}
              className={`w-10 h-6 ${showSharedSettings.viewFamily ? 'bg-blue-500' : 'bg-gray-300'} rounded-full`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transform ${showSharedSettings.viewFamily ? 'translate-x-5' : 'translate-x-1'}`}></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">紧急情况自动通知</span>
            <button 
              onClick={() => setShowSharedSettings(prev => ({ ...prev, emergencyNotify: !prev.emergencyNotify }))}
              className={`w-10 h-6 ${showSharedSettings.emergencyNotify ? 'bg-blue-500' : 'bg-gray-300'} rounded-full`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transform ${showSharedSettings.emergencyNotify ? 'translate-x-5' : 'translate-x-1'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* 添加/编辑表单 */}
      {showForm && (
        <MemberForm
          initialData={editingMember || undefined}
          onSave={editingMember ? handleUpdateMember : handleAddMember}
          onClose={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
        />
      )}
    </div>
  );
};

export default FamilyHealthPage;