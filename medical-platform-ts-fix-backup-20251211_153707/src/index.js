import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW注册成功，作用域为: ', registration.scope);
      })
      .catch((registrationError) => {
        console.log('SW注册失败: ', registrationError);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);