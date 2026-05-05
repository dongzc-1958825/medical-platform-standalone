import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// 移动端布局与页面
import MobileLayout from "./components/layout/MobileLayout";
import MobileCasesPage from "./pages/mobile/MobileCasesPage";
import MobileCommunityPage from "./pages/mobile/MobileCommunityPage";
import MobileConsultPage from "./pages/mobile/MobileConsultPage";
import MobileMessagesPage from "./pages/mobile/MobileMessagesPage";
import MobileProfilePage from "./pages/mobile/MobileProfilePage";

function App() {
  return (
    <Router> {/* 移除basename */}
      <Routes>
        <Route path="/" element={<Navigate to="/mobile/cases" replace />} />
        <Route path="/cases" element={<Navigate to="/mobile/cases" replace />} />
        
        <Route path="/mobile" element={<MobileLayout />}>
          <Route index element={<Navigate to="/mobile/cases" />} />
          <Route path="cases" element={<MobileCasesPage />} />
          <Route path="community" element={<MobileCommunityPage />} />
          <Route path="consult" element={<MobileConsultPage />} />
          <Route path="messages" element={<MobileMessagesPage />} />
          <Route path="profile" element={<MobileProfilePage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/mobile/cases" replace />} />
      </Routes>
    </Router>
  );
}

export default App;