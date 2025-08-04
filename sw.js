/**
 * Service Worker for Workout PWA
 * オフライン機能とキャッシュ管理
 */

const CACHE_NAME = 'workout-pwa-v1.0.0';
const STATIC_CACHE_NAME = 'workout-static-v1.0.0';

// キャッシュするファイル
const STATIC_FILES = [
    './',
    './index.html',
    './stats.html',
    './settings.html',
    './login.html',
    './timer.html',
    './css/style.css',
    './js/main.js',
    './js/storage.js',
    './js/auth.js',
    './js/stats.js',
    './js/settings.js',
    './js/timer.js',
    './manifest.json'
];

// 外部リソース（YouTube等）
const EXTERNAL_RESOURCES = [
    'https://www.youtube.com/embed/',
    'https://fonts.googleapis.com/',
    'https://fonts.gstatic.com/'
];

// インストール時の処理
self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('✅ Service Worker: Static files cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker: Install failed', error);
            })
    );
});

// アクティベート時の処理
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        // 古いキャッシュを削除
                        if (cacheName !== STATIC_CACHE_NAME && cacheName !== CACHE_NAME) {
                            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// フェッチイベントの処理
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    
    // YouTubeの埋め込み動画は常にネットワークから取得
    if (requestUrl.hostname.includes('youtube.com') || 
        requestUrl.hostname.includes('ytimg.com') ||
        requestUrl.hostname.includes('googlevideo.com')) {
        return;
    }
    
    event.respondWith(
        handleFetch(event.request)
    );
});

// フェッチ処理の実装
async function handleFetch(request) {
    const url = new URL(request.url);
    
    try {
        // 静的ファイルの処理
        if (isStaticFile(url.pathname)) {
            return await handleStaticFile(request);
        }
        
        // APIリクエストやその他の処理
        return await handleDynamicRequest(request);
        
    } catch (error) {
        console.error('❌ Service Worker: Fetch failed', error);
        return await handleOfflineFallback(request);
    }
}

// 静的ファイルの判定
function isStaticFile(pathname) {
    const staticExtensions = ['.html', '.css', '.js', '.json', '.png', '.jpg', '.svg', '.ico'];
    return staticExtensions.some(ext => pathname.endsWith(ext)) || pathname === '/';
}

// 静的ファイルの処理
async function handleStaticFile(request) {
    // キャッシュファーストの戦略
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        console.log('📦 Service Worker: Serving from cache:', request.url);
        return cachedResponse;
    }
    
    // キャッシュにない場合はネットワークから取得してキャッシュ
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
        const cache = await caches.open(STATIC_CACHE_NAME);
        cache.put(request, networkResponse.clone());
        console.log('🌐 Service Worker: Cached from network:', request.url);
    }
    
    return networkResponse;
}

// 動的リクエストの処理
async function handleDynamicRequest(request) {
    // ネットワークファーストの戦略
    try {
        const networkResponse = await fetch(request);
        
        // 成功した場合はキャッシュに保存
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // ネットワークエラーの場合はキャッシュから取得
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📦 Service Worker: Serving from cache (offline):', request.url);
            return cachedResponse;
        }
        throw error;
    }
}

// オフライン時のフォールバック
async function handleOfflineFallback(request) {
    // HTMLページの場合はindex.htmlを返す
    if (request.destination === 'document') {
        const cachedIndex = await caches.match('/index.html');
        if (cachedIndex) {
            return cachedIndex;
        }
    }
    
    // その他のリソースの場合はオフラインページまたはエラーレスポンス
    return new Response('オフラインです', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
            'Content-Type': 'text/plain; charset=utf-8'
        })
    });
}

// プッシュ通知の処理（将来の機能）
self.addEventListener('push', event => {
    console.log('📬 Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : '運動の時間です！',
        icon: '/manifest-icon-192.png',
        badge: '/manifest-icon-192.png',
        tag: 'workout-reminder',
        requireInteraction: true,
        actions: [
            {
                action: 'start',
                title: '運動開始',
                icon: '/icon-start.png'
            },
            {
                action: 'later',
                title: '後で',
                icon: '/icon-later.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('運動リマインダー', options)
    );
});

// 通知クリック時の処理
self.addEventListener('notificationclick', event => {
    console.log('🔔 Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'start') {
        // 運動開始アクションの場合
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'later') {
        // 後でアクションの場合は何もしない
        console.log('User chose to exercise later');
    } else {
        // 通知本体がクリックされた場合
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// バックグラウンド同期（将来の機能）
self.addEventListener('sync', event => {
    console.log('🔄 Service Worker: Background sync triggered');
    
    if (event.tag === 'workout-sync') {
        event.waitUntil(syncWorkoutData());
    }
});

// ワークアウトデータの同期
async function syncWorkoutData() {
    try {
        console.log('📊 Service Worker: Syncing workout data...');
        // 将来的にサーバーとの同期処理を実装
        return Promise.resolve();
    } catch (error) {
        console.error('❌ Service Worker: Sync failed', error);
        throw error;
    }
}

// エラーハンドリング
self.addEventListener('error', event => {
    console.error('❌ Service Worker: Error occurred', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('❌ Service Worker: Unhandled promise rejection', event.reason);
});

console.log('🎯 Service Worker: Loaded successfully');