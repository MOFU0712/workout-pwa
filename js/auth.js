/**
 * 認証機能
 * シンプルなローカル認証システム
 */

class AuthManager {
    constructor() {
        this.usersKey = 'workoutUsers';
        this.currentUserKey = 'currentUser';
        this.sessionKey = 'userSession';
        this.init();
    }

    init() {
        // ログイン画面でのみ自動リダイレクトを実行
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (this.isLoggedIn() && currentPage === 'login.html') {
            this.redirectToApp();
        }
        
        // デバッグ用ログ
        console.log('AuthManager init - Current page:', currentPage, 'Logged in:', this.isLoggedIn());
    }

    /**
     * ユーザー登録
     */
    register(username, email, password) {
        try {
            // 入力値検証
            if (!this.validateInput(username, email, password)) {
                return { success: false, message: '入力値が無効です' };
            }

            // 既存ユーザーチェック
            const users = this.getUsers();
            const existingUser = users.find(user => 
                user.username === username || user.email === email
            );

            if (existingUser) {
                return { 
                    success: false, 
                    message: 'そのユーザー名またはメールアドレスは既に使用されています' 
                };
            }

            // 新規ユーザー作成
            const newUser = {
                id: this.generateId(),
                username,
                email,
                password: this.hashPassword(password), // 実際の実装ではより強固なハッシュ化が必要
                createdAt: new Date().toISOString(),
                settings: {
                    notifications: true,
                    theme: 'light'
                }
            };

            users.push(newUser);
            localStorage.setItem(this.usersKey, JSON.stringify(users));

            // 自動ログイン
            const loginResult = this.login(username, password);
            
            if (loginResult.success) {
                return { success: true, message: '登録が完了しました', autoLogin: true };
            } else {
                return loginResult;
            }

        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: '登録中にエラーが発生しました' };
        }
    }

    /**
     * ログイン
     */
    login(username, password) {
        try {
            const users = this.getUsers();
            const user = users.find(u => u.username === username);

            if (!user) {
                return { success: false, message: 'ユーザーが見つかりません' };
            }

            if (user.password !== this.hashPassword(password)) {
                return { success: false, message: 'パスワードが間違っています' };
            }

            // セッション作成
            const session = {
                userId: user.id,
                username: user.username,
                email: user.email,
                loginTime: new Date().toISOString(),
                isGuest: false
            };

            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            localStorage.setItem(this.currentUserKey, JSON.stringify(user));

            return { success: true, message: 'ログインしました' };

        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'ログイン中にエラーが発生しました' };
        }
    }

    /**
     * ゲストモード
     */
    enterGuestMode() {
        const guestSession = {
            userId: 'guest_' + this.generateId(),
            username: 'ゲストユーザー',
            email: null,
            loginTime: new Date().toISOString(),
            isGuest: true
        };

        localStorage.setItem(this.sessionKey, JSON.stringify(guestSession));
        
        return { success: true, message: 'ゲストモードで開始します' };
    }

    /**
     * ログアウト
     */
    logout() {
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.currentUserKey);
        window.location.href = 'login.html';
    }

    /**
     * ログイン状態チェック
     */
    isLoggedIn() {
        const session = localStorage.getItem(this.sessionKey);
        return session !== null;
    }

    /**
     * 現在のユーザー情報取得
     */
    getCurrentUser() {
        const session = localStorage.getItem(this.sessionKey);
        return session ? JSON.parse(session) : null;
    }

    /**
     * 全ユーザー取得
     */
    getUsers() {
        const users = localStorage.getItem(this.usersKey);
        return users ? JSON.parse(users) : [];
    }

    /**
     * 入力値検証
     */
    validateInput(username, email, password) {
        if (!username || username.length < 3) {
            return false;
        }
        if (!email || !email.includes('@')) {
            return false;
        }
        if (!password || password.length < 6) {
            return false;
        }
        return true;
    }

    /**
     * パスワードハッシュ化（簡易版）
     * 実際の実装ではより強固なハッシュ化が必要
     */
    hashPassword(password) {
        // 簡易的なハッシュ化（本来はbcryptなどを使用）
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit整数に変換
        }
        return hash.toString();
    }

    /**
     * ID生成
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * アプリに遷移
     */
    redirectToApp() {
        // リダイレクト先をチェック
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect') || 'index.html';
        
        // セキュリティチェック：許可されたページのみリダイレクト
        const allowedPages = ['index.html', 'settings.html', 'stats.html', 'timer.html'];
        const targetPage = allowedPages.includes(redirectTo) ? redirectTo : 'index.html';
        
        window.location.href = targetPage;
    }

    /**
     * データエクスポート（将来の機能）
     */
    exportUserData() {
        const user = this.getCurrentUser();
        const workoutData = workoutStorage.getWorkoutData();
        
        const exportData = {
            user: user,
            workouts: workoutData,
            exportDate: new Date().toISOString()
        };

        return exportData;
    }

    /**
     * データインポート（将来の機能）
     */
    importUserData(data) {
        try {
            if (data.workouts) {
                localStorage.setItem('workoutData', JSON.stringify(data.workouts));
            }
            return { success: true, message: 'データをインポートしました' };
        } catch (error) {
            return { success: false, message: 'インポート中にエラーが発生しました' };
        }
    }
}

// グローバルインスタンス
const authManager = new AuthManager();

// グローバル関数（HTMLから呼び出し用）
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');
    
    const result = authManager.login(username, password);
    
    if (result.success) {
        authManager.redirectToApp();
    } else {
        alert(result.message);
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
        alert('パスワードが一致しません');
        return;
    }
    
    const result = authManager.register(username, email, password);
    
    if (result.success) {
        // 自動ログインが成功した場合はリダイレクト
        if (result.autoLogin) {
            authManager.redirectToApp();
        }
    } else {
        alert(result.message);
    }
}

function enterGuestMode() {
    const result = authManager.enterGuestMode();
    if (result.success) {
        authManager.redirectToApp();
    }
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// ページの認証チェック（他のページで使用）
function checkAuth() {
    if (!authManager.isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ユーザー情報の表示更新
function updateUserDisplay() {
    const user = authManager.getCurrentUser();
    if (user) {
        const userDisplays = document.querySelectorAll('.user-display');
        userDisplays.forEach(display => {
            display.textContent = user.isGuest ? 'ゲストユーザー' : user.username;
        });
    }
}