import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Users, FileText, AlertTriangle, BarChart, Bell, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 获取用户信息
  React.useEffect(() => {
    const userStr = localStorage.getItem('current-user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  // 检查管理员权限 - 使用手动检查
  React.useEffect(() => {
  const userStr = localStorage.getItem('current-user');
  const user = userStr ? JSON.parse(userStr) : null;
  // 直接根据用户角色判断是否为管理员
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  
  console.log('[AdminLayout] 检查管理员状态:', { isAdmin, userRole: user?.role, username: user?.username });
  
  if (!isAdmin) {
    console.log('[AdminLayout] 不是管理员，跳转到个人中心');
    navigate('/mobile/profile');
  }
}, [navigate]);

  const logout = () => {
    localStorage.removeItem('current-user');
    window.location.href = '/medical-platform/#/login';
  };

  const menuItems = [
    { path: '/admin/users', icon: Users, label: '用户管理' },
    { path: '/admin/pending', icon: FileText, label: '内容审核' },
    { path: '/admin/reports', icon: AlertTriangle, label: '举报处理' },
    { path: '/admin/statistics', icon: BarChart, label: '数据统计' },
    { path: '/admin/announcements', icon: Bell, label: '系统公告' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 移动端顶部导航 */}
      {isMobile && (
        <div className="sticky top-0 bg-white border-b z-20 flex items-center justify-between p-4">
          <button onClick={toggleSidebar} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-semibold">管理后台</h1>
          <button onClick={() => logout()} className="p-2">
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      <div className="flex">
        {/* 侧边栏 */}
        <aside className={`
          fixed md:relative z-30 bg-white shadow-lg transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-0 md:w-20'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          h-screen overflow-hidden
        `}>
          <div className="flex flex-col h-full">
            {/* Logo区域 */}
            <div className="p-4 border-b">
              {sidebarOpen ? (
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-blue-600">众创医案</h2>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">管理后台</span>
                </div>
              ) : (
                <div className="flex justify-center">
                  <span className="text-xl font-bold text-blue-600">众</span>
                </div>
              )}
            </div>

            {/* 用户信息 */}
            {sidebarOpen && user && (
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-500">超级管理员</p>
                  </div>
                </div>
              </div>
            )}

            {/* 导航菜单 */}
            <nav className="flex-1 p-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                      ${active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}
                      ${!sidebarOpen ? 'justify-center' : ''}
                    `}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                    {sidebarOpen && <span className="text-sm">{item.label}</span>}
                  </button>
                );
              })}
            </nav>

            {/* 退出按钮 */}
            {sidebarOpen && (
              <div className="p-4 border-t">
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">退出登录</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* 遮罩层 - 移动端侧边栏打开时 */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 主内容区 */}
        <main className="flex-1 min-h-screen">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
