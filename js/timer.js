/**
 * タイマー機能
 * 運動時間の計測と進捗管理
 */

class WorkoutTimer {
    constructor() {
        this.startTime = null;
        this.pausedTime = 0;
        this.intervalId = null;
        this.isRunning = false;
        this.isPaused = false;
        this.currentVideo = null;
        this.estimatedDuration = 0;
        
        this.initializePage();
    }

    /**
     * ページ初期化
     */
    initializePage() {
        // URLパラメータから動画IDを取得
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get('video');
        
        if (videoId) {
            this.currentVideo = workoutStorage.getVideo(videoId);
            if (this.currentVideo) {
                this.setupVideoPage();
            } else {
                alert('動画が見つかりませんでした');
                this.goBack();
            }
        } else {
            alert('動画が指定されていません');
            this.goBack();
        }
    }

    /**
     * 動画ページのセットアップ
     */
    setupVideoPage() {
        // タイトル設定
        document.getElementById('workoutTitle').textContent = this.currentVideo.title;
        
        // 動画埋め込み
        const videoContainer = document.getElementById('videoContainer');
        videoContainer.innerHTML = `
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/${this.currentVideo.youtubeId}?rel=0&modestbranding=1&autoplay=0"
                title="${this.currentVideo.title}"
                frameborder="0"
                allowfullscreen>
            </iframe>
        `;
        
        // 推定時間設定
        this.estimatedDuration = this.currentVideo.estimatedDuration;
        const estimatedMinutes = Math.floor(this.estimatedDuration / 60);
        const estimatedSeconds = this.estimatedDuration % 60;
        document.getElementById('estimatedTime').textContent = 
            `${estimatedMinutes}:${estimatedSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * タイマー開始
     */
    start() {
        if (this.isRunning) return;
        
        this.startTime = Date.now() - this.pausedTime;
        this.isRunning = true;
        this.isPaused = false;
        
        this.intervalId = setInterval(() => {
            this.updateDisplay();
        }, 100); // 100ms間隔で更新
        
        this.updateButtons();
    }

    /**
     * タイマー一時停止
     */
    pause() {
        if (!this.isRunning || this.isPaused) return;
        
        this.isPaused = true;
        this.pausedTime = Date.now() - this.startTime;
        clearInterval(this.intervalId);
        
        this.updateButtons();
    }

    /**
     * タイマー再開
     */
    resume() {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        this.startTime = Date.now() - this.pausedTime;
        
        this.intervalId = setInterval(() => {
            this.updateDisplay();
        }, 100);
        
        this.updateButtons();
    }

    /**
     * 運動完了
     */
    complete() {
        if (!this.isRunning) return;
        
        clearInterval(this.intervalId);
        
        const totalSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        
        // 記録を保存
        const session = workoutStorage.saveWorkoutSession(
            this.currentVideo.title,
            totalSeconds,
            this.currentVideo.id
        );
        
        // 完了メッセージ
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        alert(`🎉 運動完了！
        
${this.currentVideo.title}
時間: ${minutes}分${seconds}秒

お疲れさまでした！`);
        
        // メイン画面に戻る
        this.goBack();
    }

    /**
     * 表示更新
     */
    updateDisplay() {
        const currentTime = Date.now() - this.startTime;
        const totalSeconds = Math.floor(currentTime / 1000);
        
        // 時間表示更新
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        document.getElementById('timeDisplay').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('currentTime').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // 進捗バー更新
        const progress = Math.min((totalSeconds / this.estimatedDuration) * 100, 100);
        document.getElementById('progressBar').style.width = `${progress}%`;
        
        // 推定時間を超えた場合の色変更
        if (totalSeconds > this.estimatedDuration) {
            document.getElementById('timeDisplay').style.color = '#ef4444';
        }
    }

    /**
     * ボタン状態更新
     */
    updateButtons() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resumeBtn = document.getElementById('resumeBtn');
        const completeBtn = document.getElementById('completeBtn');
        
        if (!this.isRunning) {
            // 未開始状態
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            resumeBtn.style.display = 'none';
            completeBtn.style.display = 'none';
        } else if (this.isPaused) {
            // 一時停止状態
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'none';
            resumeBtn.style.display = 'inline-block';
            completeBtn.style.display = 'inline-block';
        } else {
            // 実行中状態
            startBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
            resumeBtn.style.display = 'none';
            completeBtn.style.display = 'inline-block';
        }
    }

    /**
     * メイン画面に戻る
     */
    goBack() {
        if (this.isRunning && !confirm('運動を中断してメイン画面に戻りますか？')) {
            return;
        }
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        window.location.href = 'index.html';
    }
}

// タイマーインスタンス
let workoutTimer;

// ページ読み込み時にタイマー初期化
document.addEventListener('DOMContentLoaded', function() {
    workoutTimer = new WorkoutTimer();
});

// グローバル関数（HTMLから呼び出し用）
function startTimer() {
    workoutTimer.start();
}

function pauseTimer() {
    workoutTimer.pause();
}

function resumeTimer() {
    workoutTimer.resume();
}

function completeWorkout() {
    if (confirm('運動を完了しますか？')) {
        workoutTimer.complete();
    }
}

function goBack() {
    workoutTimer.goBack();
}

// ブラウザの戻るボタン対応
window.addEventListener('beforeunload', function(e) {
    if (workoutTimer && workoutTimer.isRunning && !workoutTimer.isPaused) {
        e.preventDefault();
        e.returnValue = '運動中です。ページを離れますか？';
    }
});

// ページフォーカス時の処理
window.addEventListener('focus', function() {
    // アプリに戻った時の処理（必要に応じて）
});

window.addEventListener('blur', function() {
    // アプリから離れた時の処理（必要に応じて）
});