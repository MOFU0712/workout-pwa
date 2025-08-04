/**
 * LocalStorageを使用したデータ管理
 * 運動記録の保存・取得・統計計算を行う
 */

class WorkoutStorage {
    constructor() {
        this.storageKey = 'workoutData';
        this.videosKey = 'workoutVideos';
        this.initializeVideos();
    }

    /**
     * 事前定義された動画データを初期化
     */
    initializeVideos() {
        const defaultVideos = [
            {
                id: 'video1',
                title: '腹筋トレーニング 7分',
                youtubeId: 'Lx0hqiuNvpw', 
                estimatedDuration: 420, // 7分
                category: '筋トレ'
            },
            {
                id: 'video2',
                title: '脂肪燃焼エクササイズ 10分',
                youtubeId: 's6poDXmdQhQ', 
                estimatedDuration: 600, // 10分
                category: '有酸素'
            },
            {
                id: 'video3',
                title: 'ウォールピラティス 10分',
                youtubeId: '1VINYPCLqrs', 
                estimatedDuration: 600, // 10分
                category: 'ストレッチ'
            },
            {
                id: 'video4',
                title: '腰痛改善ヨガ 10分',
                youtubeId: 'JL_FLZLyz2o', 
                estimatedDuration: 600, // 10分
                category: 'ヨガ'
            }
        ];

        // 初回のみデフォルト動画を保存
        if (!localStorage.getItem(this.videosKey)) {
            localStorage.setItem(this.videosKey, JSON.stringify(defaultVideos));
        }
    }

    /**
     * 動画リストを取得
     */
    getVideos() {
        const videos = localStorage.getItem(this.videosKey);
        return videos ? JSON.parse(videos) : [];
    }

    /**
     * 動画情報を取得
     */
    getVideo(videoId) {
        const videos = this.getVideos();
        return videos.find(video => video.id === videoId);
    }

    /**
     * 運動記録を保存
     */
    saveWorkoutSession(videoTitle, duration, videoId) {
        const today = new Date().toLocaleDateString('ja-JP');
        const startTime = new Date(Date.now() - duration * 1000).toLocaleTimeString('ja-JP');
        const endTime = new Date().toLocaleTimeString('ja-JP');
        
        const workoutData = this.getWorkoutData();
        
        // 今日のデータを取得または作成
        let todayData = workoutData.find(day => day.date === today);
        if (!todayData) {
            todayData = {
                date: today,
                sessions: [],
                totalDuration: 0
            };
            workoutData.push(todayData);
        }

        // セッションを追加
        const session = {
            videoTitle,
            videoId,
            duration,
            startTime,
            endTime
        };
        
        todayData.sessions.push(session);
        todayData.totalDuration += duration;

        // データを保存
        localStorage.setItem(this.storageKey, JSON.stringify(workoutData));
        
        return session;
    }

    /**
     * 全運動データを取得
     */
    getWorkoutData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    /**
     * 今日の運動時間を取得（分）
     */
    getTodayTotal() {
        const today = new Date().toLocaleDateString('ja-JP');
        const workoutData = this.getWorkoutData();
        const todayData = workoutData.find(day => day.date === today);
        
        return todayData ? Math.floor(todayData.totalDuration / 60) : 0;
    }

    /**
     * 今週の運動時間を取得（分）
     */
    getWeekTotal() {
        const workoutData = this.getWorkoutData();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        let total = 0;
        workoutData.forEach(day => {
            const dayDate = new Date(day.date);
            if (dayDate >= oneWeekAgo) {
                total += day.totalDuration;
            }
        });
        
        return Math.floor(total / 60);
    }

    /**
     * 今月の運動時間を取得（分）
     */
    getMonthTotal() {
        const workoutData = this.getWorkoutData();
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        let total = 0;
        workoutData.forEach(day => {
            const dayDate = new Date(day.date);
            if (dayDate.getMonth() === currentMonth && dayDate.getFullYear() === currentYear) {
                total += day.totalDuration;
            }
        });
        
        return Math.floor(total / 60);
    }

    /**
     * 連続運動日数を取得
     */
    getStreakDays() {
        const workoutData = this.getWorkoutData();
        if (workoutData.length === 0) return 0;

        // 日付順にソート
        workoutData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < workoutData.length; i++) {
            const workoutDate = new Date(workoutData[i].date);
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - streak);
            
            // 日付を比較（時間は無視）
            if (workoutDate.toDateString() === expectedDate.toDateString()) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    /**
     * 統計データをまとめて取得
     */
    getStats() {
        return {
            today: this.getTodayTotal(),
            week: this.getWeekTotal(),
            month: this.getMonthTotal(),
            streak: this.getStreakDays()
        };
    }

    /**
     * データをリセット（開発・テスト用）
     */
    clearData() {
        localStorage.removeItem(this.storageKey);
    }

    /**
     * 時間を読みやすい形式に変換
     */
    static formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * 秒を分に変換
     */
    static secondsToMinutes(seconds) {
        return Math.floor(seconds / 60);
    }
}

// グローバルインスタンス
const workoutStorage = new WorkoutStorage();