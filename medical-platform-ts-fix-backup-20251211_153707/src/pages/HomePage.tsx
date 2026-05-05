// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主内容区域 */}
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题和欢迎信息 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            众创医案平台
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            连接医生与患者，共建医疗知识共享生态
          </p>
        </div>

        {/* 功能卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* 医案分享卡片 */}
          <Link 
            to="/cases" 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
          >
            <div className="text-blue-600 text-3xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">医案分享</h3>
            <p className="text-gray-600">浏览和学习其他医生的临床案例</p>
          </Link>

          {/* 创建医案卡片 */}
          <Link 
            to="/cases/create" 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
          >
            <div className="text-green-600 text-3xl mb-4">✏️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">创建医案</h3>
            <p className="text-gray-600">分享您的临床经验和治疗案例</p>
          </Link>

          {/* 专家社区卡片 */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="text-purple-600 text-3xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">专家社区</h3>
            <p className="text-gray-600">与医疗同行交流讨论（开发中）</p>
          </div>
        </div>

        {/* 移动端CSS测试区域 - 临时添加，测试后可删除 */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-blue-300 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            移动端CSS测试区域
            <span className="block text-sm font-normal text-blue-600 mt-1">
              （临时测试功能，验证后可删除）
            </span>
          </h2>
          
          <div className="space-y-6">
            {/* 测试1: 安全区域 */}
            <div className="safe-area-padding bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">✅ 安全区域测试</h3>
              <p className="text-blue-700 text-sm">
                在iPhone等设备上，这个区域应该有安全区域的内边距，避免内容被刘海或Home条遮挡。
              </p>
            </div>

            {/* 测试2: 移动端卡片 */}
            <div 
              className="mobile-card bg-white p-4 rounded-lg border border-gray-300 touch-feedback"
              onClick={() => console.log('卡片被点击')}
            >
              <h3 className="font-semibold text-gray-800 mb-2">✅ 移动端卡片测试</h3>
              <p className="text-gray-600 text-sm mb-3">
                点击这个卡片应该有触摸反馈效果（变暗或缩放）。
              </p>
              <div className="flex space-x-2">
                <span className="no-context-menu bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  不可选择文本
                </span>
                <span className="allow-select bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  可选择文本
                </span>
              </div>
            </div>

            {/* 测试3: 移动端按钮 */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">✅ 移动端按钮测试</h3>
              <button className="mobile-btn hardware-accelerate bg-green-600 text-white py-3 px-6 rounded-lg w-full">
                主要按钮 - 点击测试触摸反馈
              </button>
              <button className="mobile-btn hardware-accelerate bg-blue-600 text-white py-3 px-6 rounded-lg w-full">
                次要按钮 - 点击测试触摸反馈
              </button>
            </div>

            {/* 测试4: 输入框优化 */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">✅ 输入框优化测试</h3>
              <input 
                type="text"
                placeholder="在iOS设备上测试，输入时不应该自动缩放"
                className="no-zoom ios-input-fix w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-gray-500 text-xs mt-1">
                在手机浏览器中打开，点击输入框测试字体大小(应该保持16px防止缩放)
              </p>
            </div>

            {/* 测试5: 移动端布局 */}
            <div className="mobile-container bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">✅ 移动端布局测试</h3>
              <div className="md-mobile-grid grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded text-center text-sm">网格项1</div>
                <div className="bg-white p-2 rounded text-center text-sm">网格项2</div>
                <div className="bg-white p-2 rounded text-center text-sm">网格项3</div>
                <div className="bg-white p-2 rounded text-center text-sm">网格项4</div>
              </div>
            </div>

            {/* 测试说明 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">测试说明</h4>
              <ul className="text-yellow-700 text-sm list-disc list-inside space-y-1">
                <li>请在手机浏览器中打开此页面测试，或使用浏览器开发者工具的移动端模拟器</li>
                <li>测试完成后，可以删除这个测试区域</li>
                <li>所有移动端CSS类都已配置，可以在其他组件中直接使用</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;