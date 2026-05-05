// File: src/components/MessageCenter.tsx
import React, { useState } from 'react';

// 这是一个Map，定义了我们的六个功能及其显示名称
const MESSAGE_TABS = {
  all: '全部消息',
  unread: '未读消息',
  drug: '新药信息',
  report: '研究报告',
  system: '系统通知',
  interaction: '互动提醒',
};

const MessageCenter: React.FC = () => {
  // 状态：记录当前激活的选项卡的key
  const [activeTab, setActiveTab] = useState<keyof typeof MESSAGE_TABS>('all');

  return (
    <div className="message-center">
      {/* 导航区域 */}
      <nav className="messages-nav">
        {Object.entries(MESSAGE_TABS).map(([key, title]) => (
          <button
            key={key}
            // 根据状态决定按钮的CSS类名，用于高亮显示
            className={`nav-button ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key as keyof typeof MESSAGE_TABS)}
          >
            {title}
          </button>
        ))}
      </nav>

      {/* 内容显示区域 */}
      <div className="messages-content">
        {/* 
          第二步中，我们将根据 activeTab 的值，
          在这里渲染对应的子组件。
          例如：{activeTab === 'all' && <AllMessages />}
          现在这里只是一个占位符。
        */}
        <p>当前显示的是: 【{MESSAGE_TABS[activeTab]}】 的功能界面。</p>
        <p>（下一步将在此处接入独立的子组件）</p>
      </div>
    </div>
  );
};

export default MessageCenter;