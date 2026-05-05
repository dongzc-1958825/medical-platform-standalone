// 众创医案平台 Service Worker
const CACHE_NAME = 'zhongchuang-medical-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo-192x192.png'
];

// 安装事件
self.addEventListener('install', function(event) {
  console.log('Service Worker 安装中...');
  
  // 跳过等待，直接激活
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('缓存打开');
        return cache.addAll(urlsToCache);
      })
  );
});

// 激活事件
self.addEventListener('activate', function(event) {
  console.log('Service Worker 激活');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // 立即接管所有页面
  self.clients.claim();
});

// 请求拦截
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 返回缓存的资源或网络请求
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(function(response) {
          // 检查是否有效的响应
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 克隆响应
          var responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
    );
});