// src/pages/HomePage.tsx - 恢复原始代码并修复路由
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MedicalRecordCard from '../components/cards/MedicalRecordCard';
import CommunityPostCard from '../components/cards/CommunityPostCard';
import SearchBar from '../components/common/SearchBar';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Heart,
  ArrowRight,
  Calendar,
  Clock,
  Star
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalCases: 12458,
    activeDoctors: 342,
    communityPosts: 8923,
    todayVisits: 456
  });

  useEffect(() => {
    // 模拟数据获取
    const mockRecentCases = [
      {
        id: '1',
        title: '慢性胃炎的中医辩证治疗',
        author: '张医生',
        specialty: '中医内科',
        date: '2024-01-15',
        likes: 42,
        tags: ['胃炎', '中医', '消化科']
      },
      {
        id: '2',
        title: '糖尿病患者的饮食管理方案',
        author: '李医生',
        specialty: '内分泌科',
        date: '2024-01-14',
        likes: 38,
        tags: ['糖尿病', '饮食', '内分泌']
      },
      {
        id: '3',
        title: '儿童哮喘的预防与治疗',
        author: '王医生',
        specialty: '儿科',
        date: '2024-01-13',
        likes: 31,
        tags: ['哮喘', '儿科', '呼吸科']
      }
    ];

    const mockPopularPosts = [
      {
        id: '1',
        title: '大家如何看待中西医结合治疗肿瘤？',
        author: '医疗爱好者',
        replies: 156,
        views: 2345,
        lastActivity: '2小时前'
      },
      {
        id: '2',
        title: '分享一个降血压的食疗方法',
        author: '健康达人',
        replies: 89,
        views: 1876,
        lastActivity: '5小时前'
      },
      {
        id: '3',
        title: '探讨：人工智能在医疗诊断中的应用',
        author: '科技医疗',
        replies: 203,
        views: 3210,
        lastActivity: '1天前'
      }
    ];

    setRecentCases(mockRecentCases);
    setPopularPosts(mockPopularPosts);
  }, []);

  const handleSearch = (query: string) => {
    console.log('搜索查询:', query);
    // 实际应用中这里会调用搜索API
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'browse':
        navigate('/desktop/cases'); // 修复：使用正确的路由路径
        break;
      case 'create':
        if (user) {
          navigate('/desktop/create-case');
        } else {
          navigate('/desktop/login'); // 修复：使用正确的路由路径
        }
        break;
      case 'community':
        navigate('/desktop/community'); // 修复：使用正确的路由路径
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 英雄区域 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              众创医案平台
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              打破医疗信息垄断，实现医生与公众共同参与的医疗健康信息共享平台
            </p>
            
            <SearchBar onSearch={handleSearch} className="max-w-2xl mx-auto mb-8" />
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleQuickAction('browse')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="mr-2 h-5 w-5" />
                浏览医案
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              <button
                onClick={() => handleQuickAction('create')}
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                分享案例
              </button>
              
              <button
                onClick={() => handleQuickAction('community')}
                className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-medium rounded-lg border border-green-600 hover:bg-green-50 transition-colors"
              >
                <Users className="mr-2 h-5 w-5" />
                加入社区
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">医案总数</p>
                <p className="text-2xl font-bold">{stats.totalCases.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">活跃医生</p>
                <p className="text-2xl font-bold">{stats.activeDoctors.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">社区讨论</p>
                <p className="text-2xl font-bold">{stats.communityPosts.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">今日访问</p>
                <p className="text-2xl font-bold">{stats.todayVisits.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 最新医案 */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">最新医案</h2>
              <Link 
                to="/desktop/cases" // 修复：使用正确的路由路径
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                查看全部
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentCases.map((medicalCase) => (
                <MedicalRecordCard
                  key={medicalCase.id}
                  title={medicalCase.title}
                  author={medicalCase.author}
                  specialty={medicalCase.specialty}
                  date={medicalCase.date}
                  likes={medicalCase.likes}
                  tags={medicalCase.tags}
                  onClick={() => navigate(`/desktop/case/${medicalCase.id}`)} // 修复：使用正确的路由路径
                />
              ))}
            </div>
          </div>

          {/* 热门社区讨论 */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">热门讨论</h2>
              <Link 
                to="/desktop/community" // 修复：使用正确的路由路径
                className="text-green-600 hover:text-green-800 font-medium flex items-center"
              >
                更多讨论
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                {popularPosts.map((post) => (
                  <CommunityPostCard
                    key={post.id}
                    title={post.title}
                    author={post.author}
                    replies={post.replies}
                    views={post.views}
                    lastActivity={post.lastActivity}
                    onClick={() => navigate(`/desktop/community/post/${post.id}`)} // 修复：使用正确的路由路径
                  />
                ))}
              </div>
              
              {user ? (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    to="/desktop/community/create" // 修复：使用正确的路由路径
                    className="block w-full text-center px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium"
                  >
                    发起新讨论
                  </Link>
                </div>
              ) : (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center mb-3">
                    登录后参与社区讨论
                  </p>
                  <Link
                    to="/desktop/login" // 修复：使用正确的路由路径
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    立即登录
                  </Link>
                </div>
              )}
            </div>

            {/* 平台特色 */}
            <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">平台特色</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">专业医案分享</p>
                    <p className="text-sm text-gray-500">医生分享真实病例，供学习参考</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">开放讨论社区</p>
                    <p className="text-sm text-gray-500">医患交流，共同探讨治疗方案</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                  <div>
                    <p className="font-medium">持续更新</p>
                    <p className="text-sm text-gray-500">每日新增医案和讨论内容</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;