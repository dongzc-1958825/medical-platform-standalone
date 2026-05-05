import React from 'react';
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

// Layouts
import DesktopLayout from './components/layout/DesktopLayout';
import MobileLayout from './components/layout/MobileLayout';

// 主页面文件
import HomePage from './pages/HomePage';
import CasesPage from './pages/CasesPage';
import ConsultationPage from './pages/ConsultationPage';
import CommunityPage from './pages/CommunityPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';

// 移动端页面
import MobileHomePage from './pages/mobile/MobileHomePage';
import MobileCasesPage from './pages/mobile/MobileCasesPage';
import MobileConsultPage from './pages/mobile/MobileConsultPage';
import MobileConsultDetailPage from './pages/mobile/MobileConsultDetailPage';
import MobileMessagesPage from './pages/mobile/MobileMessagesPage';
import MobileProfilePage from './pages/mobile/MobileProfilePage';

// 医案相关页面导入
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

// ========== 新增：测试页面导入 ==========
import ConsultFlowTest from './pages/test/ConsultFlowTest';

// 共享组件
import AuthGuard from './components/auth/AuthGuard';

// 设备重定向组件
const DeviceRedirect = () => {
  const isMobile = isMobileDevice();
  console.log('[DeviceRedirect] 设备检测:', isMobile ? '移动端' : '桌面端');
  const targetPath = isMobile ? '/mobile/home' : '/desktop/home';
  console.log('[DeviceRedirect] 重定向到:', targetPath);
  return <Navigate to={targetPath} replace />;
};

// 404页面组件
const NotFoundPage = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-50 to-white">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">404 - 页面未找到</h1>
      <p className="text-gray-600 mb-6">您访问的页面不存在</p>
      <a 
        href="#/"
        className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
      >
        返回首页
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* 根路径重定向 */}
          <Route path="/" element={<DeviceRedirect />} />

          {/* 登录页面 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 桌面端路由 */}
          <Route path="/desktop" element={<DesktopLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<HomePage />} />
            <Route path="cases" element={<AuthGuard><CasesPage /></AuthGuard>} />
            <Route path="consult" element={<AuthGuard><ConsultationPage /></AuthGuard>} />
            <Route path="community" element={<AuthGuard><CommunityPage /></AuthGuard>} />
            <Route path="messages" element={<AuthGuard><MessagesPage /></AuthGuard>} />
            <Route path="profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
          </Route>

          {/* 移动端路由 */}
          <Route path="/mobile" element={<MobileLayout />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<MobileHomePage />} />
            
            {/* 家庭成员路由 */}
            <Route path="family" element={<AuthGuard><FamilyHealthPage /></AuthGuard>} />
            <Route path="family/:memberId/records" element={<AuthGuard><FamilyMemberRecordsPage /></AuthGuard>} />
            <Route path="family/:memberId/reminders" element={<AuthGuard><FamilyMemberRemindersPage /></AuthGuard>} />
            
            {/* 管理员路由 */}
            <Route path="admin/pending" element={<AuthGuard><PendingContentPage /></AuthGuard>} />
            <Route path="admin/reports" element={<AuthGuard><ReportsPage /></AuthGuard>} />
            <Route path="admin/users" element={<AuthGuard><UserManagementPage /></AuthGuard>} />
            <Route path="admin/statistics" element={<AuthGuard><div>数据统计（开发中）</div></AuthGuard>} />
            <Route path="admin/announcements" element={<AuthGuard><div>系统公告（开发中）</div></AuthGuard>} />
            
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
            
            {/* 历史记录页面路由 */}
            <Route path="health/questionnaire/history" element={<QuestionnaireHistoryPage />} />
            
            <Route path="health/emergency" element={<EmergencyCallPage />} />
            <Route path="health/wearable" element={<WearableDevicesPage />} />
            
            {/* 我的页面相关路由 */}
            <Route path="profile" element={<AuthGuard><MobileProfilePage /></AuthGuard>} />
            <Route path="profile/critical-info" element={<CriticalInfoPage />} />
            
            {/* 体检报告页面 */}
            <Route path="profile/reports" element={<HealthReportPage />} />
            <Route path="reports" element={<Navigate to="/mobile/profile/reports" replace />} />
            
            {/* 诊疗记录页面 */}
            <Route path="records" element={<MedicalRecordsPage />} />
            
            {/* 社区管理路由 */}
            <Route path="community/admin" element={<AuthGuard><MobileCommunityAdminPage /></AuthGuard>} />
            
            {/* 社区生活相关路由 */}
            <Route path="community-life" element={<MobileCommunityLifePage />} />
            <Route path="community/disease" element={<MobileCommunityDiseasePage />} />
            <Route path="community/other" element={<MobileCommunityOtherPage />} />
            <Route path="community/disease/:id" element={<MobileCommunityDetailPage />} />
            <Route path="community/other/:id" element={<MobileCommunityDetailPage />} />
          </Route>

          {/* ========== 测试路由（放在404之前）========== */}
          <Route path="/test/consult-flow" element={<ConsultFlowTest />} />

          {/* 404页面 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;