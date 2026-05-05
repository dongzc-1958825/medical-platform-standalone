// src/pages/mobile/family/FamilyMemberRemindersPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Plus, 
  Bell, 
  Pill, 
  Stethoscope, 
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import { familyService } from '../../../shared/services/familyService';
import { FamilyMember, HealthReminder } from '../../../shared/types/family';

// 添加/编辑提醒表单
const ReminderForm: React.FC<{
  memberId: string;
  memberName: string;
  editReminder?: HealthReminder | null;
  onSuccess: () => void;
  onClose: () => void;
}> = ({ memberId, memberName, editReminder, onSuccess, onClose }) => {
  const [title, setTitle] = useState(editReminder?.title || '');
  const [description, setDescription] = useState(editReminder?.description || '');
  const [type, setType] = useState<'medication' | 'checkup' | 'vaccine' | 'other'>(editReminder?.type || 'medication');
  const [dueDate, setDueDate] = useState(() => {
    if (editReminder?.dueDate) {
      const date = new Date(editReminder.dueDate);
      return date.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  });
  const [dueTime, setDueTime] = useState(() => {
    if (editReminder?.dueDate) {
      const date = new Date(editReminder.dueDate);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    return '09:00';
  });
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'>(editReminder?.repeat || 'none');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('请输入提醒标题');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullDueDate = `${dueDate}T${dueTime}:00`;
      
      if (editReminder) {
        // 更新现有提醒
        const updated = familyService.updateReminder(editReminder.id, {
          title: title.trim(),
          description: description.trim(),
          type,
          dueDate: fullDueDate,
          repeat
        });
        if (updated) {
          onSuccess();
          onClose();
        }
      } else {
        // 新增提醒
        await familyService.addReminder(memberId, memberName, {
          title: title.trim(),
          description: description.trim(),
          type,
          dueDate: fullDueDate,
          repeat
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('保存提醒失败:', error);
      alert('保存失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (t: string) => {
    switch(t) {
      case 'medication': return <Pill className="w-5 h-5" />;
      case 'checkup': return <Stethoscope className="w-5 h-5" />;
      case 'vaccine': return <Calendar className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {editReminder ? '编辑提醒' : '新增提醒'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* 提醒类型 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">提醒类型</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'medication', label: '用药', icon: Pill },
                { value: 'checkup', label: '复诊', icon: Stethoscope },
                { value: 'vaccine', label: '疫苗', icon: Calendar },
                { value: 'other', label: '其他', icon: Bell }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setType(item.value as any)}
                    className={`p-3 rounded-lg border flex flex-col items-center gap-1 ${
                      type === item.value
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 提醒标题 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              提醒标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：降压药"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 提醒描述 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">详细描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例如：每天一次，每次一片"
              rows={2}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* 日期和时间 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">提醒日期</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">提醒时间</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 重复周期 */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">重复周期</label>
            <div className="flex gap-2">
              {[
                { value: 'none', label: '不重复' },
                { value: 'daily', label: '每天' },
                { value: 'weekly', label: '每周' },
                { value: 'monthly', label: '每月' }
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRepeat(item.value as any)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm ${
                    repeat === item.value
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? '保存中...' : (editReminder ? '更新提醒' : '添加提醒')}
          </button>
        </div>
      </div>
    </div>
  );
};

const FamilyMemberRemindersPage: React.FC = () => {
  const navigate = useNavigate();
  const { memberId } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [reminders, setReminders] = useState<HealthReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<HealthReminder | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  useEffect(() => {
    console.log('🔄 useEffect 执行, memberId:', memberId);
    if (!memberId) {
      navigate('/mobile/family');
      return;
    }
    loadData();
  }, [memberId]);

  const loadData = () => {
    console.log('🔍 loadData 开始执行, memberId:', memberId);
    
    const memberData = familyService.getMember(memberId!);
    console.log('📋 获取到的成员数据:', memberData);
    
    if (!memberData) {
      console.log('❌ 成员不存在，跳转');
      navigate('/mobile/family');
      return;
    }
    setMember(memberData);
    
    const memberReminders = familyService.getMemberReminders(memberId!);
    console.log('🔍 获取到的提醒:', memberReminders);
    setReminders(memberReminders);
    setLoading(false);
  };

  const handleAddReminder = () => {
    console.log('➕ 点击添加提醒按钮');
    setEditingReminder(null);
    setShowForm(true);
  };

  const handleEditReminder = (reminder: HealthReminder) => {
    console.log('✏️ 编辑提醒:', reminder);
    setEditingReminder(reminder);
    setShowForm(true);
  };

  const handleToggleReminder = (id: string) => {
    console.log('🔄 切换提醒状态:', id);
    const updated = familyService.toggleReminder(id);
    if (updated) {
      setReminders(prev => prev.map(r => r.id === id ? updated : r));
    }
  };

  const handleDeleteReminder = (id: string) => {
    console.log('🗑️ 删除提醒:', id);
    if (window.confirm('确定要删除这条提醒吗？')) {
      const success = familyService.deleteReminder(id);
      if (success) {
        setReminders(prev => prev.filter(r => r.id !== id));
      }
    }
  };

  const filteredReminders = reminders.filter(r => {
    if (filter === 'pending') return !r.completed;
    if (filter === 'completed') return r.completed;
    return true;
  });

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return {
      date: date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
      time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'medication': return <Pill className="w-4 h-4 text-blue-500" />;
      case 'checkup': return <Stethoscope className="w-4 h-4 text-green-500" />;
      case 'vaccine': return <Calendar className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRepeatText = (repeat: string) => {
    switch(repeat) {
      case 'daily': return '每天';
      case 'weekly': return '每周';
      case 'monthly': return '每月';
      case 'yearly': return '每年';
      default: return '';
    }
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
          <h1 className="text-lg font-semibold text-gray-900">{member.name}的提醒</h1>
          <button
            onClick={handleAddReminder}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* 统计卡片 */}
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl shadow-sm p-4 text-white mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-100">总提醒数</p>
              <p className="text-2xl font-bold">{reminders.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-yellow-100">待完成</p>
              <p className="text-lg font-bold">{reminders.filter(r => !r.completed).length}</p>
            </div>
          </div>
        </div>

        {/* 筛选标签 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            待处理 ({reminders.filter(r => !r.completed).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            已完成 ({reminders.filter(r => r.completed).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部 ({reminders.length})
          </button>
        </div>

        {/* 提醒列表 */}
        {filteredReminders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">暂无提醒</p>
            <p className="text-sm text-gray-400">点击右上角"+"按钮添加提醒</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReminders.map((reminder) => {
              const { date, time } = formatDateTime(reminder.dueDate);
              
              return (
                <div
                  key={reminder.id}
                  className={`bg-white rounded-xl p-4 shadow-sm border-l-4 relative group ${
                    reminder.completed
                      ? 'border-green-500'
                      : reminder.type === 'medication'
                      ? 'border-blue-500'
                      : reminder.type === 'checkup'
                      ? 'border-yellow-500'
                      : 'border-purple-500'
                  }`}
                >
                  {/* 编辑按钮 */}
                  <button
                    onClick={() => handleEditReminder(reminder)}
                    className="absolute top-3 right-9 p-1.5 bg-gray-100 text-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
                    title="编辑"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleReminder(reminder.id)}
                      className="mt-1"
                    >
                      {reminder.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(reminder.type)}
                        <span className={`font-medium ${
                          reminder.completed ? 'line-through text-gray-400' : 'text-gray-900'
                        }`}>
                          {reminder.title}
                        </span>
                      </div>
                      
                      {reminder.description && (
                        <p className={`text-sm mb-2 ${
                          reminder.completed ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {reminder.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {date}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          {time}
                        </span>
                        {reminder.repeat !== 'none' && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {getRepeatText(reminder.repeat)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 添加/编辑提醒表单 */}
      {showForm && (
        <ReminderForm
          memberId={member.id}
          memberName={member.name}
          editReminder={editingReminder}
          onSuccess={loadData}
          onClose={() => {
            setShowForm(false);
            setEditingReminder(null);
          }}
        />
      )}
    </div>
  );
};

export default FamilyMemberRemindersPage;