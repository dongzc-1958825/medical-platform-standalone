// src/router/MobileRouter.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MobileHomePage from '../pages/mobile/MobileHomePage';
import MobileCasesPage from '../pages/mobile/MobileCasesPage';
import MobileCaseDetailPage from '../pages/mobile/MobileCaseDetailPage';
import MobileFavoritesPage from '../pages/mobile/MobileFavoritesPage';
import MobileProfilePage from '../pages/mobile/MobileProfilePage';

const MobileRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/mobile" element={<MobileHomePage />} />
      <Route path="/mobile/cases" element={<MobileCasesPage />} />
      <Route path="/mobile/cases/:id" element={<MobileCaseDetailPage />} />
      <Route path="/mobile/favorites" element={<MobileFavoritesPage />} />
      <Route path="/mobile/profile" element={<MobileProfilePage />} />
    </Routes>
  );
};

export default MobileRouter;