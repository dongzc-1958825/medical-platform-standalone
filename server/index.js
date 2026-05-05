// server/index.js

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// ========== 中间件配置 ==========
// 跨域
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true
}));

// 压缩
app.use(compression());

// 安全头
app.use(helmet({
  contentSecurityPolicy: false, // 开发环境禁用，生产环境需要配置
}));

// JSON解析
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 静态文件（如果需要）
app.use('/static', express.static(path.join(__dirname, 'public')));

// ========== 请求日志 ==========
app.use((req, res, next) => {
  console.log(`📝 ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// ========== 统一搜索路由 ==========
const searchRouter = require('./search');
app.use('/api', searchRouter);

// ========== 中华医学期刊代理路由（如有）==========
// 如果存在 yiigleProxy.js，则加载
try {
  const yiigleRouter = require('./yiigleProxy');
  app.use('/api', yiigleRouter);
  console.log('✅ 中华医学期刊代理已加载');
} catch (err) {
  console.log('⚠️ 中华医学期刊代理未找到，跳过');
}

// ========== 健康检查 ==========
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ========== 404处理 ==========
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found', 
    path: req.url 
  });
});

// ========== 错误处理 ==========
app.use((err, req, res, next) => {
  console.error('❌ 服务器错误:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误'
  });
});

// ========== 启动服务 ==========
app.listen(PORT, () => {
  console.log(`\n🚀 众创医案平台后端服务启动成功！`);
  console.log(`📍 地址: http://localhost:${PORT}`);
  console.log(`📋 可用接口:`);
  console.log(`   POST /api/search     - 统一搜索（疾病/药品）`);
  console.log(`   GET  /api/health     - 健康检查`);
  console.log(`\n⏰ 启动时间: ${new Date().toLocaleString()}\n`);
});