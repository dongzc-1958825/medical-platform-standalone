// src/TestApp.tsx
export default function TestApp() {
  console.log('🔧 [TEST] TestApp组件渲染开始');
  
  // 简单的组件，没有任何复杂逻辑
  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f0f0f0' }}>
      <h1 style={{ color: 'green' }}>✅ 测试成功 - App组件渲染正常</h1>
      <p>如果看到这个页面，说明基础渲染正常</p>
      <p>环境: {import.meta.env.MODE}</p>
      <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: '8px' }}>
        <h3>测试信息：</h3>
        <p>时间: {new Date().toLocaleString()}</p>
        <p>路径: {window.location.href}</p>
      </div>
    </div>
  );
}