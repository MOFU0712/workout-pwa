/**
 * 統計画面の機能
 * カレンダー表示、詳細統計、データ可視化
 */

class StatsManager {
    constructor() {
        this.currentDate = new Date();
        this.workoutData = workoutStorage.getWorkoutData();
        this.init();
    }

    init() {
        this.updateStatsSummary();
        this.renderCalendar();
        this.renderDetailedStats();
    }

    /**
     * 統計サマリーを更新
     */
    updateStatsSummary() {
        const stats = workoutStorage.getStats();
        
        document.getElementById('todayStats').textContent = `${stats.today}分`;
        document.getElementById('weekStats').textContent = `${stats.week}分`;
        document.getElementById('monthStats').textContent = `${stats.month}分`;
        document.getElementById('streakStats').textContent = `${stats.streak}日`;
    }

    /**
     * カレンダーを表示
     */
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // カレンダータイトル更新
        document.getElementById('calendarTitle').textContent = 
            `${year}年${month + 1}月`;
        
        // カレンダーグリッド作成
        const calendarGrid = document.getElementById('calendarGrid');
        calendarGrid.innerHTML = '';
        
        // 曜日ヘッダー
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        weekdays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-weekday';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // 月の最初の日と最後の日
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // 前月の余白
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // 各日付のセル作成
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = this.createCalendarDay(year, month, day);
            calendarGrid.appendChild(dayElement);
        }
    }

    /**
     * カレンダーの日付セルを作成
     */
    createCalendarDay(year, month, day) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dateStr = new Date(year, month, day).toLocaleDateString('ja-JP');
        const dayData = this.workoutData.find(d => d.date === dateStr);
        const workoutMinutes = dayData ? Math.floor(dayData.totalDuration / 60) : 0;
        
        // 運動時間に応じてクラス設定
        let intensityClass = 'no-workout';
        if (workoutMinutes > 30) {
            intensityClass = 'heavy-workout';
        } else if (workoutMinutes > 15) {
            intensityClass = 'medium-workout';
        } else if (workoutMinutes > 0) {
            intensityClass = 'light-workout';
        }
        
        dayElement.classList.add(intensityClass);
        
        // 今日の日付をハイライト
        const today = new Date().toLocaleDateString('ja-JP');
        if (dateStr === today) {
            dayElement.classList.add('today');
        }
        
        dayElement.innerHTML = `
            <span class="day-number">${day}</span>
            ${workoutMinutes > 0 ? `<span class="workout-time">${workoutMinutes}分</span>` : ''}
        `;
        
        // クリックイベント（詳細表示）
        dayElement.addEventListener('click', () => {
            this.showDayDetails(dateStr, dayData);
        });
        
        return dayElement;
    }

    /**
     * 日付詳細を表示
     */
    showDayDetails(dateStr, dayData) {
        if (!dayData || dayData.sessions.length === 0) {
            alert(`${dateStr}\n運動記録はありません`);
            return;
        }
        
        const totalMinutes = Math.floor(dayData.totalDuration / 60);
        let details = `📅 ${dateStr}\n合計: ${totalMinutes}分\n\n`;
        
        dayData.sessions.forEach((session, index) => {
            const sessionMinutes = Math.floor(session.duration / 60);
            const sessionSeconds = session.duration % 60;
            details += `${index + 1}. ${session.videoTitle}\n`;
            details += `   時間: ${sessionMinutes}分${sessionSeconds}秒\n`;
            details += `   ${session.startTime} - ${session.endTime}\n\n`;
        });
        
        alert(details);
    }

    /**
     * 月を変更
     */
    changeMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    /**
     * 詳細統計を表示
     */
    renderDetailedStats() {
        this.renderMonthlyChart();
        this.renderCategoryStats();
        this.renderRecentWorkouts();
    }

    /**
     * 月間チャートを表示
     */
    renderMonthlyChart() {
        const monthlyChart = document.getElementById('monthlyChart');
        const monthlyData = this.getMonthlyData();
        
        monthlyChart.innerHTML = '';
        
        monthlyData.forEach(monthData => {
            const chartItem = document.createElement('div');
            chartItem.className = 'chart-item';
            
            const maxHeight = 100;
            const maxMinutes = Math.max(...monthlyData.map(d => d.minutes), 1);
            const height = (monthData.minutes / maxMinutes) * maxHeight;
            
            chartItem.innerHTML = `
                <div class="chart-bar" style="height: ${height}px;"></div>
                <div class="chart-label">${monthData.month}</div>
                <div class="chart-value">${monthData.minutes}分</div>
            `;
            
            monthlyChart.appendChild(chartItem);
        });
    }

    /**
     * 月間データを取得
     */
    getMonthlyData() {
        const months = [];
        const currentDate = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            
            let totalMinutes = 0;
            this.workoutData.forEach(dayData => {
                const dayDate = new Date(dayData.date);
                if (dayDate.getFullYear() === date.getFullYear() && 
                    dayDate.getMonth() === date.getMonth()) {
                    totalMinutes += Math.floor(dayData.totalDuration / 60);
                }
            });
            
            months.push({
                month: `${date.getMonth() + 1}月`,
                minutes: totalMinutes
            });
        }
        
        return months;
    }

    /**
     * カテゴリ別統計を表示
     */
    renderCategoryStats() {
        const categoryStats = document.getElementById('categoryStats');
        const categoryData = this.getCategoryData();
        
        categoryStats.innerHTML = '';
        
        Object.entries(categoryData).forEach(([category, data]) => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            
            const percentage = data.totalMinutes > 0 ? 
                Math.round((data.totalMinutes / data.totalMinutes) * 100) : 0;
            
            categoryItem.innerHTML = `
                <div class="category-header">
                    <span class="category-name">${category}</span>
                    <span class="category-time">${data.totalMinutes}分 (${data.sessions}回)</span>
                </div>
                <div class="category-bar">
                    <div class="category-progress" style="width: ${percentage}%;"></div>
                </div>
            `;
            
            categoryStats.appendChild(categoryItem);
        });
    }

    /**
     * カテゴリ別データを取得
     */
    getCategoryData() {
        const categoryData = {};
        const videos = workoutStorage.getVideos();
        
        // カテゴリ初期化
        videos.forEach(video => {
            if (!categoryData[video.category]) {
                categoryData[video.category] = {
                    totalMinutes: 0,
                    sessions: 0
                };
            }
        });
        
        // セッションデータを集計
        this.workoutData.forEach(dayData => {
            dayData.sessions.forEach(session => {
                const video = videos.find(v => v.id === session.videoId);
                if (video) {
                    const category = video.category;
                    categoryData[category].totalMinutes += Math.floor(session.duration / 60);
                    categoryData[category].sessions += 1;
                }
            });
        });
        
        return categoryData;
    }

    /**
     * 最近の運動履歴を表示
     */
    renderRecentWorkouts() {
        const recentWorkouts = document.getElementById('recentWorkouts');
        const recentSessions = this.getRecentSessions();
        
        recentWorkouts.innerHTML = '';
        
        if (recentSessions.length === 0) {
            recentWorkouts.innerHTML = '<p class="no-data">まだ運動記録がありません</p>';
            return;
        }
        
        recentSessions.forEach(session => {
            const workoutItem = document.createElement('div');
            workoutItem.className = 'workout-item';
            
            const minutes = Math.floor(session.duration / 60);
            const seconds = session.duration % 60;
            
            workoutItem.innerHTML = `
                <div class="workout-info">
                    <div class="workout-title">${session.videoTitle}</div>
                    <div class="workout-meta">
                        ${session.date} ${session.startTime} - ${session.endTime}
                    </div>
                </div>
                <div class="workout-duration">
                    ${minutes}分${seconds}秒
                </div>
            `;
            
            recentWorkouts.appendChild(workoutItem);
        });
    }

    /**
     * 最近のセッションを取得
     */
    getRecentSessions() {
        const allSessions = [];
        
        this.workoutData.forEach(dayData => {
            dayData.sessions.forEach(session => {
                allSessions.push({
                    ...session,
                    date: dayData.date
                });
            });
        });
        
        // 日付順にソートして最新10件を返す
        return allSessions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);
    }
}

// グローバル関数
let statsManager;

document.addEventListener('DOMContentLoaded', function() {
    statsManager = new StatsManager();
});

function changeMonth(direction) {
    statsManager.changeMonth(direction);
}

function goHome() {
    window.location.href = 'index.html';
}

// データが更新された際の再読み込み
window.addEventListener('focus', function() {
    if (statsManager) {
        statsManager.workoutData = workoutStorage.getWorkoutData();
        statsManager.updateStatsSummary();
        statsManager.renderCalendar();
        statsManager.renderDetailedStats();
    }
});