import React, { useState, useEffect } from 'react';
import './InstallPrompt.css';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // 阻止默认的安装提示
      e.preventDefault();
      // 保存事件以便后续触发
      setDeferredPrompt(e);
      // 显示我们的自定义安装提示
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    
    // 显示安装提示
    deferredPrompt.prompt();
    
    // 等待用户响应
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('用户接受了安装提示');
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else {
      console.log('用户拒绝了安装提示');
    }
  };

  const closePrompt = () => {
    setShowPrompt(false);
    // 可以在这里设置本地存储，避免频繁显示
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt">
        <div className="install-prompt-icon">📱</div>
        <h3>添加到手机桌面</h3>
        <p>将众创医案添加到手机桌面，快速访问专业中医医案</p>
        <div className="install-prompt-actions">
          <button 
            className="install-button"
            onClick={installApp}
          >
            立即添加
          </button>
          <button 
            className="cancel-button"
            onClick={closePrompt}
          >
            稍后再说
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;