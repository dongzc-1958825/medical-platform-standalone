// src/router/AppRouter.tsx (更新版本)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CasesPage from '../pages/CasesPage';
import CreateCasePage from '../pages/CreateCasePage';
import MobileRouter from './MobileRouter';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* 桌面端路由 */}
      <Route path="/" element={<Navigate to="/cases" replace />} />
      <Route path="/cases" element={<CasesPage />} />
      <Route path="/cases/create" element={<CreateCasePage />} />
      
      {/* 移动端路由 */}
      <Route path="/mobile/*" element={<MobileRouter />} />
      
      {/* 移动端入口重定向 */}
      <Route path="/m" element={<Navigate to="/mobile" replace />} />
    </Routes>
  );
};

export default AppRouter;