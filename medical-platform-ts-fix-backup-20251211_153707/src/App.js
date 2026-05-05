import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// 组件导入
import InstallPrompt from './components/InstallPrompt';
import Profile from './pages/Profile';
import MedicalCaseDetail from './pages/MedicalCaseDetail';

// 模拟数据 - 实际开发中应从API获取
const mockMedicalCases = [
  {
    id: '1',
    patientName: '张先生',
    gender: '男',
    age: 45,
    visitTime: '2024-01-15',
    chiefComplaint: '反复头痛3个月，加重1周',
    diagnosis: '肝阳上亢型头痛',
    treatment: '天麻钩藤饮加减',
    status: 'completed'
  },
  {
    id: '2', 
    patientName: '李女士',
    gender: '女',
    age: 36,
    visitTime: '2024-01-10',
    chiefComplaint: '失眠多梦，心悸不安2月',
    diagnosis: '心脾两虚证',
    treatment: '归脾汤加减',
    status: 'in-progress'
  }
];

function App() {
  const [medicalCases, setMedicalCases] = useState(mockMedicalCases);
  const [loading, setLoading] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    setLoading(true);
    // 模拟API调用延迟
    const timer = setTimeout(() => {
      setMedicalCases(mockMedicalCases);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      <Router>
        <div className="app-container">
          {/* 应用头部 - 可根据需要添加 */}
          {/* <header className="app-header">
            <h1>众创医案平台</h1>
          </header> */}

          {/* 主内容区域 */}
          <main className="app-main">
            <Routes>
              {/* 默认路由重定向到个人资料页 */}
              <Route path="/" element={<Navigate to="/profile" replace />} />
              
              {/* 个人资料页面 */}
              <Route 
                path="/profile" 
                element={
                  <Profile 
                    medicalCases={medicalCases}
                    loading={loading}
                  />
                } 
              />
              
              {/* 医案详情页面 */}
              <Route 
                path="/medical-case/:caseId" 
                element={
                  <MedicalCaseDetail 
                    medicalCases={medicalCases}
                    loading={loading}
                  />
                } 
              />
              
              {/* 404页面 - 可后续添加 */}
              <Route path="*" element={<div className="not-found">页面未找到</div>} />
            </Routes>
          </main>

          {/* 移动端底部导航 - 可根据需要添加 */}
          {/* <nav className="app-bottom-nav">
            <button className="nav-item">首页</button>
            <button className="nav-item">医案</button>
            <button className="nav-item">我的</button>
          </nav> */}
        </div>
      </Router>

      {/* PWA安装提示 */}
      <InstallPrompt />

      {/* 全局加载状态 */}
      {loading && (
        <div className="global-loading">
          <div className="loading-spinner"></div>
          <span>加载中...</span>
        </div>
      )}
    </div>
  );
}

export default App;