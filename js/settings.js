/**
 * 設定画面の機能
 * 動画管理、ユーザー設定、データ管理
 */

class SettingsManager {
    constructor() {
        this.currentEditingVideo = null;
        this.init();
    }

    init() {
        // 認証状態をチェック（必須ではないが、UI調整のため）
        this.loadUserProfile();
        this.loadVideoList();
        this.loadAppSettings();
    }

    /**
     * ユーザープロフィールを読み込み
     */
    loadUserProfile() {
        const userProfile = document.getElementById('userProfile');
        const user = authManager.getCurrentUser();
        
        if (user) {
            userProfile.innerHTML = `
                <div class="profile-card">
                    <div class="profile-avatar">
                        ${user.username.charAt(0).toUpperCase()}
                    </div>
                    <div class="profile-info">
                        <h3>${user.username}</h3>
                        <p>${user.isGuest ? 'ゲストユーザー' : user.email}</p>
                        <p class="profile-status">
                            ${user.isGuest ? 'ローカル保存のみ' : 'アカウント保存'}
                        </p>
                    </div>
                    ${user.isGuest ? `
                        <button class="btn-primary small" onclick="goToLogin()">
                            アカウント作成
                        </button>
                    ` : `
                        <button class="btn-outline small" onclick="goToLogin()">
                            アカウント管理
                        </button>
                    `}
                </div>
            `;
        } else {
            userProfile.innerHTML = `
                <div class="profile-card">
                    <p>ログインしていません</p>
                    <button class="btn-primary" onclick="goToLogin()">
                        ログイン
                    </button>
                </div>
            `;
        }

        // ゲストユーザーの場合はアカウントセクションを非表示
        const accountSection = document.getElementById('accountSection');
        if (user && user.isGuest) {
            accountSection.style.display = 'none';
        }
    }

    /**
     * 編集可能な動画リストを読み込み
     */
    loadVideoList() {
        const videoListEdit = document.getElementById('videoListEdit');
        const videos = workoutStorage.getVideos();
        
        if (videos.length === 0) {
            videoListEdit.innerHTML = `
                <div class="empty-state">
                    <p>まだ動画が登録されていません</p>
                    <button class="btn-primary" onclick="showAddVideoForm()">
                        最初の動画を追加
                    </button>
                </div>
            `;
            return;
        }

        videoListEdit.innerHTML = '';
        
        videos.forEach(video => {
            const videoItem = this.createEditableVideoItem(video);
            videoListEdit.appendChild(videoItem);
        });
    }

    /**
     * 編集可能な動画アイテムを作成
     */
    createEditableVideoItem(video) {
        const videoDiv = document.createElement('div');
        videoDiv.className = 'video-edit-item';
        videoDiv.dataset.videoId = video.id;
        
        const estimatedMinutes = Math.floor(video.estimatedDuration / 60);
        
        videoDiv.innerHTML = `
            <div class="video-edit-preview">
                <iframe 
                    class="video-thumbnail"
                    src="https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1"
                    title="${video.title}"
                    frameborder="0">
                </iframe>
                <div class="video-edit-info">
                    <h4>${video.title}</h4>
                    <div class="video-meta">
                        <span class="video-category">${video.category}</span>
                        <span class="video-duration">${estimatedMinutes}分</span>
                    </div>
                    <div class="video-url">
                        <small>https://www.youtube.com/watch?v=${video.youtubeId}</small>
                    </div>
                </div>
            </div>
            <div class="video-edit-actions">
                <button class="btn-edit" onclick="editVideo('${video.id}')">
                    ✏️ 編集
                </button>
                <button class="btn-delete" onclick="deleteVideo('${video.id}')">
                    🗑️ 削除
                </button>
            </div>
        `;
        
        return videoDiv;
    }

    /**
     * 新しい動画追加フォームを表示
     */
    showAddVideoForm() {
        this.currentEditingVideo = null;
        document.getElementById('modalTitle').textContent = '新しい動画を追加';
        document.getElementById('submitBtn').textContent = '追加';
        this.clearVideoForm();
        document.getElementById('videoModal').style.display = 'flex';
    }

    /**
     * 動画編集フォームを表示
     */
    showEditVideoForm(videoId) {
        const video = workoutStorage.getVideo(videoId);
        if (!video) return;

        this.currentEditingVideo = video;
        document.getElementById('modalTitle').textContent = '動画を編集';
        document.getElementById('submitBtn').textContent = '更新';
        
        // フォームに既存データを設定
        document.getElementById('videoTitle').value = video.title;
        document.getElementById('videoUrl').value = `https://www.youtube.com/watch?v=${video.youtubeId}`;
        document.getElementById('videoCategory').value = video.category;
        document.getElementById('videoDuration').value = Math.floor(video.estimatedDuration / 60);
        
        document.getElementById('videoModal').style.display = 'flex';
    }

    /**
     * 動画フォームをクリア
     */
    clearVideoForm() {
        document.getElementById('videoForm').reset();
    }

    /**
     * 動画フォーム送信処理
     */
    handleVideoSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const title = formData.get('title');
        const url = formData.get('url');
        const category = formData.get('category');
        const duration = parseInt(formData.get('duration'));
        
        // YouTube URLからIDを抽出
        const youtubeId = this.extractYouTubeId(url);
        if (!youtubeId) {
            alert('有効なYouTube URLを入力してください');
            return;
        }
        
        const videoData = {
            id: this.currentEditingVideo ? this.currentEditingVideo.id : this.generateVideoId(),
            title,
            youtubeId,
            estimatedDuration: duration * 60,
            category
        };
        
        if (this.currentEditingVideo) {
            // 既存動画の更新
            this.updateVideo(videoData);
        } else {
            // 新規動画の追加
            this.addVideo(videoData);
        }
        
        this.closeVideoModal();
        this.loadVideoList();
    }

    /**
     * YouTube URLからIDを抽出
     */
    extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    /**
     * 動画IDを生成
     */
    generateVideoId() {
        return 'video_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * 新しい動画を追加
     */
    addVideo(videoData) {
        const videos = workoutStorage.getVideos();
        videos.push(videoData);
        localStorage.setItem('workoutVideos', JSON.stringify(videos));
        
        alert('動画を追加しました！');
    }

    /**
     * 既存動画を更新
     */
    updateVideo(videoData) {
        const videos = workoutStorage.getVideos();
        const index = videos.findIndex(v => v.id === videoData.id);
        
        if (index !== -1) {
            videos[index] = videoData;
            localStorage.setItem('workoutVideos', JSON.stringify(videos));
            alert('動画を更新しました！');
        }
    }

    /**
     * 動画を削除
     */
    deleteVideo(videoId) {
        if (!confirm('この動画を削除しますか？')) return;
        
        const videos = workoutStorage.getVideos();
        const filteredVideos = videos.filter(v => v.id !== videoId);
        
        localStorage.setItem('workoutVideos', JSON.stringify(filteredVideos));
        this.loadVideoList();
        
        alert('動画を削除しました');
    }

    /**
     * モーダルを閉じる
     */
    closeVideoModal() {
        document.getElementById('videoModal').style.display = 'none';
        this.clearVideoForm();
        this.currentEditingVideo = null;
    }

    /**
     * アプリ設定を読み込み
     */
    loadAppSettings() {
        const settings = this.getAppSettings();
        document.getElementById('notificationToggle').checked = settings.notifications;
    }

    /**
     * アプリ設定を取得
     */
    getAppSettings() {
        const settings = localStorage.getItem('appSettings');
        return settings ? JSON.parse(settings) : {
            notifications: true,
            theme: 'light'
        };
    }

    /**
     * アプリ設定を保存
     */
    saveAppSettings(settings) {
        localStorage.setItem('appSettings', JSON.stringify(settings));
    }

    /**
     * 通知設定切り替え
     */
    toggleNotifications() {
        const settings = this.getAppSettings();
        settings.notifications = document.getElementById('notificationToggle').checked;
        this.saveAppSettings(settings);
        
        if (settings.notifications) {
            // 通知許可をリクエスト
            if ('Notification' in window) {
                Notification.requestPermission();
            }
        }
    }

    /**
     * データエクスポート
     */
    exportData() {
        try {
            const exportData = {
                videos: workoutStorage.getVideos(),
                workouts: workoutStorage.getWorkoutData(),
                settings: this.getAppSettings(),
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `workout-data-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            alert('データをエクスポートしました！');
        } catch (error) {
            alert('エクスポートに失敗しました');
        }
    }

    /**
     * データインポート
     */
    importData() {
        document.getElementById('importFile').click();
    }

    /**
     * ファイルインポート処理
     */
    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (confirm('既存のデータを上書きしますか？この操作は元に戻せません。')) {
                    if (importData.videos) {
                        localStorage.setItem('workoutVideos', JSON.stringify(importData.videos));
                    }
                    if (importData.workouts) {
                        localStorage.setItem('workoutData', JSON.stringify(importData.workouts));
                    }
                    if (importData.settings) {
                        this.saveAppSettings(importData.settings);
                    }
                    
                    alert('データをインポートしました！ページを再読み込みします。');
                    window.location.reload();
                }
            } catch (error) {
                alert('無効なファイル形式です');
            }
        };
        reader.readAsText(file);
    }

    /**
     * 全データリセット
     */
    resetAllData() {
        if (!confirm('全ての運動記録を削除しますか？この操作は元に戻せません。')) return;
        if (!confirm('本当によろしいですか？')) return;
        
        localStorage.removeItem('workoutData');
        alert('全ての運動記録を削除しました');
        
        // 統計画面などを更新するためにリロード
        window.location.reload();
    }

    /**
     * パスワード変更
     */
    changePassword() {
        alert('パスワード変更機能は今後実装予定です');
    }

    /**
     * アカウント削除
     */
    deleteAccount() {
        if (!confirm('アカウントを削除しますか？全てのデータが失われます。')) return;
        if (!confirm('本当によろしいですか？')) return;
        
        // 全データを削除してログアウト
        localStorage.clear();
        alert('アカウントを削除しました');
        window.location.href = 'login.html';
    }
}

// グローバルインスタンス
let settingsManager;

document.addEventListener('DOMContentLoaded', function() {
    settingsManager = new SettingsManager();
});

// グローバル関数（HTMLから呼び出し用）
function showAddVideoForm() {
    settingsManager.showAddVideoForm();
}

function editVideo(videoId) {
    settingsManager.showEditVideoForm(videoId);
}

function deleteVideo(videoId) {
    settingsManager.deleteVideo(videoId);
}

function closeVideoModal() {
    settingsManager.closeVideoModal();
}

function handleVideoSubmit(event) {
    settingsManager.handleVideoSubmit(event);
}

function toggleNotifications() {
    settingsManager.toggleNotifications();
}

function exportData() {
    settingsManager.exportData();
}

function importData() {
    settingsManager.importData();
}

function handleFileImport(event) {
    settingsManager.handleFileImport(event);
}

function resetAllData() {
    settingsManager.resetAllData();
}

function changePassword() {
    settingsManager.changePassword();
}

function deleteAccount() {
    settingsManager.deleteAccount();
}

function goHome() {
    window.location.href = 'index.html';
}

function goToLogin() {
    // 設定画面に戻るためのリダイレクトパラメータを追加
    window.location.href = 'login.html?redirect=settings.html';
}