import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isMobileDevice } from './shared/utils/device';
import { AuthProvider } from './contexts/AuthContext';
import HealthReportPage from './pages/mobile/HealthReportPage';
import MedicalRecordsPage from './pages/mobile/MedicalRecordsPage';
import UserManagementPage from './pages/mobile/admin/UserManagementPage';
import MobileCommunityLifePage from './pages/mobile/MobileCommunityLifePage';
import MobileCommunityDiseasePage from './pages/mobile/MobileCommunityDiseasePage';
import MobileCommunityOtherPage from './pages/mobile/MobileCommunityOtherPage';
import MobileCommunityDetailPage from './pages/mobile/MobileCommunityDetailPage';
import MobileCommunityAnnouncementPage from './pages/mobile/MobileCommunityAnnouncementPage';
import MobileCommunityForumPage from './pages/mobile/MobileCommunityForumPage';
import MobileCommunityLecturePage from './pages/mobile/MobileCommunityLecturePage';
import MobileCommunityDevelopmentPage from './pages/mobile/MobileCommunityDevelopmentPage';
import FamilyHealthPage from './pages/mobile/FamilyHealthPage';
import FamilyMemberRecordsPage from './pages/mobile/family/FamilyMemberRecordsPage';
import FamilyMemberRemindersPage from './pages/mobile/family/FamilyMemberRemindersPage';

// 管理员页面
import PendingContentPage from './pages/mobile/admin/PendingContentPage';
import ReportsPage from './pages/mobile/admin/ReportsPage';

// 布局组件
import DesktopLayout from './components/layout/DesktopLayout';
import MobileLayout from './components/layout/MobileLayout';
import AdminLayout from './components/layout/AdminLayout';
import AuthGuard from './components/auth/AuthGuard';

// 移动端页面
import MobileHomePage from './pages/mobile/MobileHomePage';
import MobileCasesPage from './pages/mobile/MobileCasesPage';
import MobileConsultPage from './pages/mobile/MobileConsultPage';
import MobileConsultDetailPage from './pages/mobile/MobileConsultDetailPage';
import MobileMessagesPage from './pages/mobile/MobileMessagesPage';
import MobileProfilePage from './pages/mobile/MobileProfilePage';

// 医案相关页面
import CreateCasePage from './pages/CreateCasePage';
import MobileCaseDetailPage from './pages/mobile/MobileCaseDetailPage';

// 健康管理页面
import HealthOnboardingPage from './pages/mobile/HealthOnboardingPage';
import HealthOverviewPage from './pages/mobile/HealthOverviewPage';
import HealthReminderPage from './pages/mobile/HealthReminderPage';
import HealthQuestionnairePage from './pages/mobile/HealthQuestionnairePage';
import EmergencyCallPage from './pages/mobile/EmergencyCallPage';
import WearableDevicesPage from './pages/mobile/WearableDevicesPage';
import CriticalInfoPage from './pages/mobile/CriticalInfoPage';

// 成人综合健康问卷及结果页面
import AdultHealthQuestionnairePage from './pages/mobile/AdultHealthQuestionnairePage';
import QuestionnaireResultPage from './pages/mobile/QuestionnaireResultPage';

// 历史记录页面
import QuestionnaireHistoryPage from './pages/mobile/QuestionnaireHistoryPage';

// 专病社区相关页面（用于子页面）
import MobileDiseaseAnnouncementPage from './pages/mobile/MobileDiseaseAnnouncementPage';
import MobileDiseaseForumPage from './pages/mobile/MobileDiseaseForumPage';
import MobileDiseaseLecturePage from './pages/mobile/MobileDiseaseLecturePage';
import MobileDiseaseDevelopmentPage from './pages/mobile/MobileDiseaseDevelopmentPage';
import MobileCommunityAdminPage from './pages/mobile/MobileCommunityAdminPage';

// 测试页面
import ConsultFlowTest from './pages/test/ConsultFlowTest';

// 404页面
import NotFoundPage from './pages/NotFoundPage';

// 登录页面
import LoginPage from './pages/LoginPage';

const DeviceRedirect = () => {
  const isMobile = isMobileDevice();
  console.log('[DeviceRedirect] 设备检测:', isMobile ? '移动端' : '桌面端');
  const targetPath = isMobile ? '/mobile/home' : '/desktop/home';
  console.log('[DeviceRedirect] 重定向到:', targetPath);
  return <Navigate to={targetPath} replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* 根路径重定向 */}
          <Route path="/" element={<DeviceRedirect />} />
          
          {/* 登录页面 */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* 独立的管理员路由 - 使用 AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="pending" element={<PendingContentPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="statistics" element={<div className="bg-white rounded-xl p-6">数据统计（开发中）</div>} />
            <Route path="announcements" element={<div className="bg-white rounded-xl p-6">系统公告（开发中）</div>} />
          </Route>
          
          {/* 移动端路由 */}
          <Route path="/mobile" element={<MobileLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<MobileHomePage />} />
            
            {/* 家庭成员路由 */}
            <Route path="family" element={<AuthGuard><FamilyHealthPage /></AuthGuard>} />
            <Route path="family/:memberId/records" element={<AuthGuard><FamilyMemberRecordsPage /></AuthGuard>} />
            <Route path="family/:memberId/reminders" element={<AuthGuard><FamilyMemberRemindersPage /></AuthGuard>} />
            
            {/* 管理员路由（移动端入口，重定向到独立管理员页面） */}
            <Route path="admin/*" element={<Navigate to="/admin" replace />} />
            
            {/* 其他社区子页面路由 */}
            <Route path="community/other/:id/announcement" element={<AuthGuard><MobileCommunityAnnouncementPage /></AuthGuard>} />
            <Route path="community/other/:id/forum" element={<AuthGuard><MobileCommunityForumPage /></AuthGuard>} />
            <Route path="community/other/:id/lecture" element={<AuthGuard><MobileCommunityLecturePage /></AuthGuard>} />
            <Route path="community/other/:id/development" element={<AuthGuard><MobileCommunityDevelopmentPage /></AuthGuard>} />
            
            {/* 专病社区子页面路由 */}
            <Route path="community/disease/:id/announcement" element={<AuthGuard><MobileDiseaseAnnouncementPage /></AuthGuard>} />
            <Route path="community/disease/:id/forum" element={<AuthGuard><MobileDiseaseForumPage /></AuthGuard>} />
            <Route path="community/disease/:id/lecture" element={<AuthGuard><MobileDiseaseLecturePage /></AuthGuard>} />
            <Route path="community/disease/:id/development" element={<AuthGuard><MobileDiseaseDevelopmentPage /></AuthGuard>} />
            
            {/* 医案分享相关路由 */}
            <Route path="cases" element={<AuthGuard><MobileCasesPage /></AuthGuard>} />
            <Route path="cases/create" element={<AuthGuard><CreateCasePage /></AuthGuard>} />
            <Route path="cases/:id" element={<AuthGuard><MobileCaseDetailPage /></AuthGuard>} />
            
            {/* 寻医问药相关路由 */}
            <Route path="consult" element={<AuthGuard><MobileConsultPage /></AuthGuard>} />
            <Route path="consult/:id" element={<AuthGuard><MobileConsultDetailPage /></AuthGuard>} />
            
            <Route path="messages" element={<AuthGuard><MobileMessagesPage /></AuthGuard>} />
            
            {/* 健康管理路由 */}
            <Route path="health" element={<HealthOnboardingPage />} />
            <Route path="health/overview" element={<HealthOverviewPage />} />
            <Route path="health/reminder" element={<HealthReminderPage />} />
            
            {/* 原有健康问卷入口 */}
            <Route path="health/questionnaire" element={<HealthQuestionnairePage />} />
            
            {/* 成人综合健康问卷及结果页面 */}
            <Route path="health/questionnaire/adult" element={<AdultHealthQuestionnairePage />} />
            <Route path="health/questionnaire/adult/result" element={<QuestionnaireResultPage />} />
            
            {/* 历史记录页面 */}
            <Route path="health/history" element={<QuestionnaireHistoryPage />} />
            
            {/* 急救与设备页面 */}
            <Route path="emergency" element={<EmergencyCallPage />} />
            <Route path="wearables" element={<WearableDevicesPage />} />
            
            {/* 我的页面相关路由 */}
            <Route path="profile" element={<AuthGuard><MobileProfilePage /></AuthGuard>} />
            <Route path="profile/critical-info" element={<CriticalInfoPage />} />
            <Route path="profile/reports" element={<HealthReportPage />} />
            <Route path="profile/records" element={<MedicalRecordsPage />} />
            <Route path="reports" element={<Navigate to="/mobile/profile/reports" replace />} />
            
            {/* 社区管理路由 */}
            <Route path="community/admin" element={<AuthGuard><MobileCommunityAdminPage /></AuthGuard>} />
            
            {/* 社区生活相关路由 */}
            <Route path="community-life" element={<MobileCommunityLifePage />} />
            <Route path="community/disease" element={<MobileCommunityDiseasePage />} />
            <Route path="community/other" element={<MobileCommunityOtherPage />} />
            <Route path="community/disease/:id" element={<MobileCommunityDetailPage />} />
            <Route path="community/other/:id" element={<MobileCommunityDetailPage />} />
          </Route>
          
          {/* 桌面端路由 */}
          <Route path="/desktop" element={<DesktopLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<div>桌面端首页</div>} />
          </Route>
          
          {/* 测试页面 */}
          <Route path="/test/consult-flow" element={<ConsultFlowTest />} />
          
          {/* 404页面 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;