/**
 * メイン画面の機能
 * 動画リストの表示と運動開始処理
 */

document.addEventListener('DOMContentLoaded', function() {
    // 認証チェック（将来的に有効化）
    // if (!checkAuth()) return;
    
    loadVideoList();
    updateTodayStats();
    updateUserInfo();
    
    // デバッグ用：ナビゲーション関数が定義されているか確認
    console.log('📍 Navigation functions loaded:', {
        navigateToStats: typeof window.navigateToStats,
        navigateToSettings: typeof window.navigateToSettings,
        navigateToLogin: typeof window.navigateToLogin
    });
});

/**
 * ナビゲーション関数（HTMLのonclickから直接呼び出し）
 */
function navigateToStats() {
    console.log('🚀 [CLICK] Stats button clicked - navigating to stats page');
    try {
        window.location.href = 'stats.html';
        console.log('✅ [SUCCESS] Navigation to stats initiated');
    } catch (error) {
        console.error('❌ [ERROR] Failed to navigate to stats:', error);
    }
}

function navigateToSettings() {
    console.log('🚀 [CLICK] Settings button clicked - navigating to settings page');
    try {
        window.location.href = 'settings.html';
        console.log('✅ [SUCCESS] Navigation to settings initiated');
    } catch (error) {
        console.error('❌ [ERROR] Failed to navigate to settings:', error);
    }
}

function navigateToLogin() {
    console.log('🚀 [CLICK] Login button clicked - navigating to login page');
    try {
        window.location.href = 'login.html';
        console.log('✅ [SUCCESS] Navigation to login initiated');
    } catch (error) {
        console.error('❌ [ERROR] Failed to navigate to login:', error);
    }
}

// グローバルスコープに明示的に配置
window.navigateToStats = navigateToStats;
window.navigateToSettings = navigateToSettings;
window.navigateToLogin = navigateToLogin;

/**
 * 動画リストを読み込み表示
 */
function loadVideoList() {
    const videoListContainer = document.getElementById('videoList');
    const videos = workoutStorage.getVideos();
    
    videoListContainer.innerHTML = '';
    
    videos.forEach(video => {
        const videoElement = createVideoElement(video);
        videoListContainer.appendChild(videoElement);
    });
}

/**
 * 動画要素を作成
 */
function createVideoElement(video) {
    const videoDiv = document.createElement('div');
    videoDiv.className = 'video-item';
    
    const estimatedMinutes = Math.floor(video.estimatedDuration / 60);
    
    videoDiv.innerHTML = `
        <div class="video-header">
            <h3 class="video-title">${video.title}</h3>
            <div class="video-meta">
                <span class="video-duration">${estimatedMinutes}分</span>
                <span class="video-category">${video.category}</span>
            </div>
        </div>
        <iframe 
            class="video-frame"
            src="https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1"
            title="${video.title}"
            frameborder="0"
            allowfullscreen>
        </iframe>
        <button class="start-workout-btn" onclick="startWorkout('${video.id}')">
            🏃‍♂️ 運動を開始
        </button>
    `;
    
    return videoDiv;
}

/**
 * 運動を開始（タイマーページに移動）
 */
function startWorkout(videoId) {
    // URLパラメータとして動画IDを渡す
    window.location.href = `timer.html?video=${videoId}`;
}

/**
 * 今日の統計を更新
 */
function updateTodayStats() {
    const todayTotalElement = document.getElementById('todayTotal');
    const todayMinutes = workoutStorage.getTodayTotal();
    todayTotalElement.textContent = `今日: ${todayMinutes}分`;
}

// 古い関数は削除済み - 新しいnavigateTo*関数を使用

/**
 * ユーザー情報を更新
 */
function updateUserInfo() {
    const userInfo = document.getElementById('userInfo');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userStatus = document.getElementById('userStatus');
    const loginNavBtn = document.getElementById('loginNavBtn');
    
    if (typeof authManager !== 'undefined' && authManager.isLoggedIn()) {
        const user = authManager.getCurrentUser();
        userInfo.style.display = 'flex';
        userAvatar.textContent = user.username.charAt(0).toUpperCase();
        userName.textContent = user.username;
        userStatus.textContent = user.isGuest ? 'ゲストモード' : 'ユーザー';
        
        // ログインボタンの表示を変更
        if (loginNavBtn) {
            loginNavBtn.textContent = user.isGuest ? '🔐 ログイン' : '👤 アカウント';
        }
    } else {
        userInfo.style.display = 'none';
        if (loginNavBtn) {
            loginNavBtn.textContent = '🔐 ログイン';
        }
    }
}

/**
 * ページ更新時に統計を再読み込み
 */
window.addEventListener('focus', function() {
    updateTodayStats();
    updateUserInfo();
});

/**
 * PWA関連の処理
 */
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // インストールプロンプトを表示しない
    e.preventDefault();
    // 後で使用するためにイベントを保存
    deferredPrompt = e;
    
    // インストールボタンを表示（Phase 2で実装予定）
    console.log('PWA installable');
});

window.addEventListener('appinstalled', (evt) => {
    console.log('PWA was installed');
});

/**
 * サービスワーカーの登録
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async function() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker registered successfully:', registration.scope);
            
            // 更新チェック
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('🔄 New Service Worker found, installing...');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('🆕 New content available, please refresh');
                        // 将来的にはユーザーに更新通知を表示
                    }
                });
            });
            
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    });
}

// デバッグ用：ナビゲーション関数が正しく定義されているか確認
console.log('Main.js loaded. Navigation functions available:', {
    navigateToStats: typeof navigateToStats,
    navigateToSettings: typeof navigateToSettings,
    navigateToLogin: typeof navigateToLogin
});