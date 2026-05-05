import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  TrendingUp,
  ChevronLeft,
  Users,
  Activity,
  Heart,
  MessageCircle,
  Eye,
  Download,
  Trash2,
  Plus,
  Send,
  X,
  ThumbsUp,
  Calendar,
  BarChart3,
  Award,
  Clock,
  Filter
} from 'lucide-react';
import { useAuth } from '../../shared/hooks/useAuth';
import { communityStatsService, CommunityStats } from '../../shared/services/communityStatsService';
import { communitySuggestionService, CommunitySuggestion } from '../../shared/services/communitySuggestionService';
import { communityLevelService } from '../../shared/services/communityLevelService';
import CollectButton from '../../components/collection/CollectButton';

// ========== 统计数据卡片组件 ==========
const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  trend?: number;
  unit?: string;
}> = ({ title, value, icon: Icon, color, bgColor, trend, unit }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <div className={`w-10 h-10 rounded-lg ${bgColor} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <p className="text-xl font-bold text-gray-900">
      {value}
      {unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
    </p>
  </div>
);

// ========== 季度趋势图表组件 ==========
const QuarterlyChart: React.FC<{
  data: { q1: number; q2: number; q3: number; q4: number };
  title: string;
  color: string;
  unit?: string;
  maxValue?: number;
}> = ({ data, title, color, unit = '', maxValue }) => {
  const hasData = data.q1 > 0 || data.q2 > 0 || data.q3 > 0 || data.q4 > 0;
  
  if (!hasData) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
        <div className="text-center py-4 text-gray-400 text-sm">
          暂无季度数据
        </div>
      </div>
    );
  }
  
  const globalMax = maxValue || Math.max(data.q1, data.q2, data.q3, data.q4, 1);
  const avg = (data.q1 + data.q2 + data.q3 + data.q4) / 4;
  
  const getColorClass = () => {
    switch(color) {
      case 'bg-blue-500': return 'bg-blue-500';
      case 'bg-green-500': return 'bg-green-500';
      case 'bg-red-500': return 'bg-red-500';
      default: return color;
    }
  };
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <div className="text-xs text-gray-500">
          平均: {avg.toFixed(1)}{unit}
        </div>
      </div>
      
      <div className="flex items-end justify-around h-32 mb-2">
        {[
          { label: 'Q1', value: data.q1 },
          { label: 'Q2', value: data.q2 },
          { label: 'Q3', value: data.q3 },
          { label: 'Q4', value: data.q4 }
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center w-1/5">
            <div className="text-xs font-medium text-gray-700 mb-1">
              {item.value}{unit}
            </div>
            <div 
              className={`w-full ${getColorClass()} rounded-t-lg transition-all duration-300`}
              style={{ 
                height: `${(item.value / globalMax) * 80}px`,
                minHeight: item.value > 0 ? '4px' : '0'
              }}
            ></div>
            <div className="text-xs text-gray-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========== 横向对比卡片（带等级显示） ==========
const ComparisonCard: React.FC<{
  title: string;
  communities: any[];
  valueKey: keyof CommunityStats;
  valueLabel: string;
  icon: React.ElementType;
  color: string;
}> = ({ title, communities, valueKey, valueLabel, icon: Icon, color }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedCommunities = showAll ? communities : communities.slice(0, 5);

  if (communities.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        {title} ({communities.length})
      </h3>
      <div className="space-y-2">
        {displayedCommunities.map((community, index) => {
          const levelInfo = communityLevelService.getLevel(community.satisfactionScore || 0);
          
          return (
            <div key={community.diseaseId} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-400 w-5">#{index + 1}</span>
                <span className="text-gray-700">{community.diseaseName}</span>
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${levelInfo.bgColor}`}>
                  <span className="text-xs">{levelInfo.icon}</span>
                  <span className={`text-xs font-medium ${levelInfo.textColor}`}>
                    {levelInfo.level}
                  </span>
                </div>
              </div>
              <span className="font-medium text-gray-900">
                {community[valueKey]}
                {valueLabel}
              </span>
            </div>
          );
        })}
        
        {communities.length > 5 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="text-sm text-orange-600 hover:text-orange-700 mt-2 w-full text-center py-1 border-t border-gray-100"
          >
            查看更多 ({communities.length - 5} 个)
          </button>
        )}
        
        {showAll && communities.length > 5 && (
          <button
            onClick={() => setShowAll(false)}
            className="text-sm text-orange-600 hover:text-orange-700 mt-2 w-full text-center py-1 border-t border-gray-100"
          >
            收起
          </button>
        )}
      </div>
    </div>
  );
};

// ========== 发布建议弹窗 ==========
const SuggestionModal: React.FC<{
  diseaseId: string;
  diseaseName: string;
  onPublish: (suggestion: any) => void;
  onClose: () => void;
  user: any;
}> = ({ diseaseId, diseaseName, onPublish, onClose, user }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);

    const newSuggestion = communitySuggestionService.addSuggestion({
      diseaseId,
      diseaseName,
      title: title.trim(),
      content: content.trim(),
      author: user?.username || '用户',
      publisherId: user?.id || 'anonymous',
      date: new Date().toLocaleDateString('zh-CN', { 
        month: 'numeric', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    });

    onPublish(newSuggestion);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl">
        <div className="p-4 border-b flex justify-between">
          <h2 className="text-lg font-semibold">社区发展建议</h2>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="建议标题"
            className="w-full p-3 border rounded-lg"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="建议内容"
            rows={5}
            className="w-full p-3 border rounded-lg resize-none"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            {isSubmitting ? '发布中...' : '发布建议'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ========== 主页面 ==========
const MobileDiseaseDevelopmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { diseaseId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [allStats, setAllStats] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<CommunitySuggestion[]>([]);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('month');

  const diseaseName = location.state?.diseaseName || 
    (diseaseId === 'fxm' ? '风湿病' : '专病');

  useEffect(() => {
    loadData();
  }, [diseaseId, diseaseName]);

  const loadData = async () => {
    const currentStats = await communityStatsService.updateCommunityStats(diseaseId || '', diseaseName);
    setStats(currentStats);

    const all = communityStatsService.getAllStats();
    setAllStats(all);

    const suggestionList = communitySuggestionService.getAllSuggestions(diseaseId);
    setSuggestions(suggestionList);
  };

  const handlePublishSuggestion = (newSuggestion: CommunitySuggestion) => {
    setSuggestions(prev => [newSuggestion, ...prev]);
    loadData();
  };

  const handleLikeSuggestion = (suggestionId: string) => {
    if (!user) return alert('请先登录');
    
    communitySuggestionService.likeSuggestion(suggestionId, user.id);
    setSuggestions(prev => prev.map(s => {
      if (s.id === suggestionId) {
        const hasLiked = s.likedBy?.includes(user.id);
        return {
          ...s,
          likes: hasLiked ? s.likes - 1 : s.likes + 1,
          likedBy: hasLiked ? s.likedBy.filter(id => id !== user.id) : [...(s.likedBy || []), user.id]
        };
      }
      return s;
    }));
    loadData();
  };

  const handleDeleteSuggestion = (suggestionId: string) => {
    if (!user) return;
    if (!window.confirm('确定要删除这条建议吗？')) return;
    
    communitySuggestionService.deleteSuggestion(suggestionId, user.id);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    loadData();
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  const maxQuarterValue = Math.max(
    stats.newParticipants.q1,
    stats.newParticipants.q2,
    stats.newParticipants.q3,
    stats.newParticipants.q4,
    1
  );

  const levelInfo = communityLevelService.getLevel(stats.satisfactionScore);
  const nextLevel = communityLevelService.getNextLevel(levelInfo.level);
  const upgradeProgress = nextLevel ? communityLevelService.getUpgradeProgress(stats.satisfactionScore, levelInfo.level) : 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* 导航栏 */}
      <div className="sticky top-0 bg-white border-b z-10">
        <div className="flex items-center p-4">
          <button onClick={() => navigate(`/mobile/community/${diseaseId}`)}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center font-semibold">{diseaseName}社区发展</h1>
          <button 
            onClick={() => setShowSuggestionModal(true)}
            className="text-orange-600"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 社区基本信息 */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-5 py-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-white/80" />
          <span className="text-sm text-white/80">设立时间: {stats.establishmentDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-white/80" />
          <span className="text-sm text-white/80">最后更新: {new Date(stats.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>

      {/* 社区等级卡片 */}
      <div className="px-4 mt-2">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full ${levelInfo.bgColor} flex items-center justify-center text-2xl`}>
                {levelInfo.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${levelInfo.color}`}>
                    {levelInfo.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${levelInfo.bgColor} ${levelInfo.textColor}`}>
                    {levelInfo.level}级
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{levelInfo.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{stats.satisfactionScore}</div>
              <div className="text-xs text-gray-400">发展指数</div>
            </div>
          </div>
          
          {/* 升级进度条 */}
          {nextLevel && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>距离 {nextLevel.icon} {nextLevel.name}</span>
                <span>{upgradeProgress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-300"
                  style={{ width: `${upgradeProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>需要 {nextLevel.range[0]} 分</span>
                <span>当前 {stats.satisfactionScore} 分</span>
              </div>
            </div>
          )}
          {!nextLevel && (
            <div className="mt-3 pt-3 border-t border-gray-100 text-center text-yellow-600 text-sm font-medium">
              🏆 已达成最高等级！
            </div>
          )}
        </div>
      </div>

      {/* 等级图例 */}
      <div className="px-4 mt-2 mb-1">
        <div className="bg-white rounded-lg p-2 text-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span>社区发展等级：</span>
            <span className="text-gray-400">当前 {levelInfo.icon} {levelInfo.name}</span>
          </div>
          <div className="flex items-center justify-between">
            {['E', 'D', 'C', 'B', 'A'].map(level => {
              const info = communityLevelService.getLevel(
                level === 'E' ? 20 : 
                level === 'D' ? 47 :
                level === 'C' ? 62 :
                level === 'B' ? 77 : 92
              );
              return (
                <div key={level} className="flex items-center gap-1">
                  <span className={`w-3 h-3 rounded-full ${info.bgColor}`}></span>
                  <span className="text-gray-600">{info.icon}</span>
                  <span className="text-gray-400 text-xs">{info.level}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <StatCard
          title="参与人数"
          value={stats.totalParticipants}
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="满意度"
          value={stats.satisfactionScore}
          icon={Heart}
          color="text-red-600"
          bgColor="bg-red-50"
          unit="分"
        />
        <StatCard
          title={selectedPeriod === 'day' ? '日活跃' : selectedPeriod === 'week' ? '周活跃' : '月活跃'}
          value={selectedPeriod === 'day' ? stats.dailyActive : 
                  selectedPeriod === 'week' ? stats.weeklyActive : stats.monthlyActive}
          icon={Activity}
          color="text-green-600"
          bgColor="bg-green-50"
          unit="人"
        />
        <StatCard
          title="建议数量"
          value={stats.suggestionCount}
          icon={MessageCircle}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      </div>

      {/* 活跃度时段选择 */}
      <div className="px-4 flex gap-2 mb-2">
        <button
          onClick={() => setSelectedPeriod('day')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            selectedPeriod === 'day' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          日活
        </button>
        <button
          onClick={() => setSelectedPeriod('week')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            selectedPeriod === 'week' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          周活
        </button>
        <button
          onClick={() => setSelectedPeriod('month')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            selectedPeriod === 'month' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          月活
        </button>
      </div>

      {/* 季度趋势 */}
      <div className="px-4 space-y-3">
        <QuarterlyChart
          title="新增参与人数（季度）"
          data={stats.newParticipants}
          color="bg-blue-500"
          unit="人"
          maxValue={maxQuarterValue}
        />
        <QuarterlyChart
          title="活跃度趋势（季度）"
          data={stats.activeTrend}
          color="bg-green-500"
          unit="人"
          maxValue={maxQuarterValue}
        />
        <QuarterlyChart
          title="满意度趋势（季度）"
          data={stats.satisfactionTrend}
          color="bg-red-500"
          unit="分"
        />
      </div>

      {/* 横向对比 */}
      {allStats && (
        <div className="px-4 mt-4 space-y-3">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            社区横向对比
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <ComparisonCard
              title="参与人数排名"
              communities={allStats.rankings.byParticipants}
              valueKey="totalParticipants"
              valueLabel="人"
              icon={Users}
              color="text-blue-600"
            />
            <ComparisonCard
              title="活跃度排名"
              communities={allStats.rankings.byActive}
              valueKey="monthlyActive"
              valueLabel="人"
              icon={Activity}
              color="text-green-600"
            />
            <ComparisonCard
              title="满意度排名"
              communities={allStats.rankings.bySatisfaction}
              valueKey="satisfactionScore"
              valueLabel="分"
              icon={Heart}
              color="text-red-600"
            />
          </div>
        </div>
      )}

      {/* 发展建议列表 */}
      <div className="px-4 mt-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-orange-600" />
          社区发展建议 ({suggestions.length})
        </h2>
        
        <div className="space-y-3">
          {suggestions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">暂无发展建议</p>
              <button
                onClick={() => setShowSuggestionModal(true)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg"
              >
                提出第一条建议
              </button>
            </div>
          ) : (
            suggestions.map(suggestion => {
              const canDelete = user && suggestion.publisherId === user.id;
              const liked = user && suggestion.likedBy?.includes(user.id);

              return (
                <div key={suggestion.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                    {canDelete && (
                      <button onClick={() => handleDeleteSuggestion(suggestion.id)}>
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{suggestion.content}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span>{suggestion.author}</span>
                    <span>·</span>
                    <span>{suggestion.date}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm border-t pt-3">
                    <button
                      onClick={() => handleLikeSuggestion(suggestion.id)}
                      className={`flex items-center gap-1 ${liked ? 'text-orange-600' : 'text-gray-500'}`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-orange-600' : ''}`} />
                      {suggestion.likes || 0}
                    </button>
                    
                    <CollectButton
                      itemId={suggestion.id}
                      itemType="suggestion"
                      itemData={{
                        title: suggestion.title,
                        description: suggestion.content,
                        date: suggestion.date,
                        tags: [diseaseName],
                        disease: diseaseName,
                        diseaseId: diseaseId,
                        author: suggestion.author
                      }}
                      initialCollected={false}
                      size="sm"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 发布建议弹窗 */}
      {showSuggestionModal && (
        <SuggestionModal
          diseaseId={diseaseId || ''}
          diseaseName={diseaseName}
          onPublish={handlePublishSuggestion}
          onClose={() => setShowSuggestionModal(false)}
          user={user}
        />
      )}

      {/* 浮动发布按钮 */}
      <button
        onClick={() => setShowSuggestionModal(true)}
        className="fixed bottom-20 right-4 p-4 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 z-50"
        title="发布建议"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MobileDiseaseDevelopmentPage;