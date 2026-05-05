import React from 'react';
import DesktopLayout from '../components/layout/DesktopLayout';
import MobileLayout from '../components/layout/MobileLayout';
import { useResponsive } from '../shared/hooks/useResponsive';

const ConsultPage: React.FC = () => {
  const { isDesktop } = useResponsive();
  const Layout = isDesktop ? DesktopLayout : MobileLayout;
  
  return (
    <Layout>
      <div className="p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">寻医问药</h1>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-600 mb-4">向医生咨询健康问题...</p>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-bold mb-2">常见问题分类</h3>
              <ul className="list-disc pl-5 text-gray-600">
                <li>症状咨询</li>
                <li>用药指导</li>
                <li>治疗方案建议</li>
                <li>健康生活方式</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConsultPage;