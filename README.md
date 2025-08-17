# 💪 Workout Routine PWA | 運動ルーティン PWA

[🇯🇵 日本語](#japanese) | [🇺🇸 English](#english)

---

## 🇺🇸 English {#english}

### 🎯 Overview

A **Progressive Web App (PWA)** for building daily workout habits, built with **pure HTML, CSS, and JavaScript**. This app provides a native-like experience without any frameworks, featuring offline functionality, workout tracking, and comprehensive statistics.

🌐 **Live Demo**: [https://MOFU0712.github.io/workout-pwa/](https://MOFU0712.github.io/workout-pwa/)

### ✨ Features

#### 🏃‍♂️ Core Functionality
- **YouTube Video Integration**: Curated workout videos with timer
- **Smart Timer**: Play/pause/complete with progress tracking
- **Workout Statistics**: Daily, weekly, monthly tracking with calendar visualization
- **User Authentication**: Local account system with guest mode
- **Video Management**: Add/edit/delete custom workout videos

#### 📱 PWA Features
- **Offline Support**: Full functionality without internet connection
- **Installable**: Add to home screen like a native app
- **Responsive Design**: Optimized for mobile and desktop
- **Service Worker**: Advanced caching and background sync
- **Push Notifications**: Workout reminders (future feature)

#### 🎨 User Experience
- **Intuitive Interface**: Clean, modern design
- **Calendar View**: Visual workout history with intensity indicators
- **Statistics Dashboard**: Comprehensive analytics and progress tracking
- **Settings Panel**: Customize videos, export/import data
- **Multi-language**: Japanese interface with English documentation

### 🛠️ Technology Stack

#### Frontend
- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Modern styling with Grid/Flexbox, responsive design
- **Vanilla JavaScript**: ES6+ features, modular architecture
- **Web APIs**: LocalStorage, Service Worker, Web App Manifest

#### PWA Technologies
- **Service Worker**: Offline caching and background operations
- **Web App Manifest**: Native app-like installation and appearance
- **Cache API**: Strategic resource caching for performance
- **Responsive Images**: Optimized icons and graphics

#### Development Tools
- **Git**: Version control with conventional commits
- **GitHub Pages**: Continuous deployment and hosting
- **Chrome DevTools**: Performance monitoring and debugging
- **Lighthouse**: PWA auditing and optimization

### 📊 Architecture

```
workout_pwa/
├── index.html              # Main application entry point
├── css/style.css          # Comprehensive styling
├── js/                    # Modular JavaScript architecture
│   ├── main.js           # UI control and navigation
│   ├── storage.js        # Data management layer
│   ├── auth.js           # Authentication system
│   ├── stats.js          # Statistics and visualization
│   ├── settings.js       # Configuration management
│   └── timer.js          # Workout timer functionality
├── sw.js                  # Service Worker for PWA features
├── manifest.json         # Web App Manifest
└── icons/                # App icons for various devices
```

### 🚀 Getting Started

#### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[username]/workout-pwa.git
   cd workout-pwa
   ```

2. **Local Development**
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access the application**
   ```
   http://localhost:8000
   ```

#### PWA Installation

1. **On Mobile (iOS Safari)**
   - Open the app in Safari
   - Tap the Share button
   - Select "Add to Home Screen"

2. **On Mobile (Android Chrome)**
   - Open the app in Chrome
   - Tap "Install" banner or menu option
   - Confirm installation

3. **On Desktop (Chrome/Edge)**
   - Click the install icon in the address bar
   - Or use Chrome menu > "Install [App Name]"

### 🎮 Usage

#### Basic Workflow
1. **Select a workout video** from the home screen
2. **Start the timer** and follow along with the video
3. **Complete or pause** the workout as needed
4. **View statistics** on the dedicated stats page
5. **Manage videos** in the settings panel

#### Features Guide

**Timer Controls**
- ▶️ **Start**: Begin workout timer
- ⏸️ **Pause**: Pause timer (resume available)
- ✅ **Complete**: Finish workout and save progress

**Statistics View**
- 📅 **Calendar**: Visual workout history
- 📊 **Charts**: Weekly/monthly progress graphs
- 🏆 **Streaks**: Consecutive workout days
- 📈 **Categories**: Workout type breakdown

**Video Management**
- ➕ **Add**: Insert custom YouTube workout videos
- ✏️ **Edit**: Modify video details and duration
- 🗑️ **Delete**: Remove videos from your collection

### 🚀 Deployment

#### GitHub Pages (Recommended)

1. **Create GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Workout PWA"
   git remote add origin https://github.com/[username]/workout-pwa.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Navigate to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save configuration

3. **Access your PWA**
   ```
   https://[username].github.io/workout-pwa/
   ```

#### Alternative Deployment Options
- **Netlify**: Drag & drop deployment
- **Vercel**: Git-connected deployments
- **Surge.sh**: Command-line deployment
- **Firebase Hosting**: Google Cloud integration

### 🧪 Development

#### Local Development Setup
```bash
# Install development dependencies (optional)
npm install -g live-server

# Start development server with auto-reload
live-server --port=8000
```

#### Testing PWA Features
1. **Lighthouse Audit**: Check PWA compliance
2. **DevTools Application Tab**: Inspect Service Worker and storage
3. **Network Throttling**: Test offline functionality
4. **Device Simulation**: Responsive design testing

#### Code Quality
- **ESLint**: JavaScript linting (configuration available)
- **Prettier**: Code formatting
- **HTML Validator**: Markup validation
- **Accessibility**: ARIA labels and semantic HTML

### 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add: Amazing new feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

#### Contribution Areas
- 🐛 **Bug fixes**: Report and fix issues
- ✨ **Features**: Add new functionality
- 📖 **Documentation**: Improve guides and tutorials
- 🌐 **Localization**: Add new language support
- 🎨 **Design**: UI/UX improvements

### 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- **YouTube**: Video platform integration
- **PWA Community**: Best practices and inspiration
- **MDN Web Docs**: Comprehensive web standards documentation
- **GitHub Pages**: Free hosting and deployment

### 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/MOFU0712/workout-pwa/issues)
- **Discussions**: [GitHub Discussions](https://github.com/[username]/workout-pwa/discussions)
- **Documentation**: See [LEARNING.md](LEARNING.md) for educational content

---

## 🇯🇵 日本語 {#japanese}

### 🎯 概要

**Progressive Web App (PWA)** として実装された運動習慣化アプリです。**純粋なHTML、CSS、JavaScript**のみで構築され、フレームワークを使わずにネイティブアプリ同等の体験を提供します。オフライン機能、運動記録、統計機能を備えています。

### ✨ 機能

#### 🏃‍♂️ 核心機能
- **YouTube動画統合**: 厳選されたワークアウト動画とタイマー
- **スマートタイマー**: 再生/一時停止/完了機能と進捗追跡
- **運動統計**: 日次・週次・月次の記録とカレンダー可視化
- **ユーザー認証**: ローカル認証システムとゲストモード
- **動画管理**: カスタムワークアウト動画の追加・編集・削除

#### 📱 PWA機能
- **オフライン対応**: インターネット接続なしでも完全機能
- **インストール可能**: ネイティブアプリのようにホーム画面に追加
- **レスポンシブデザイン**: モバイル・デスクトップ最適化
- **Service Worker**: 高度なキャッシングとバックグラウンド同期
- **プッシュ通知**: 運動リマインダー（将来機能）

#### 🎨 ユーザー体験
- **直感的インターface**: クリーンでモダンなデザイン
- **カレンダービュー**: 運動履歴の視覚的表示と強度インジケーター
- **統計ダッシュボード**: 包括的な分析と進捗追跡
- **設定パネル**: 動画カスタマイズ、データ書き出し・読み込み
- **多言語対応**: 日本語インターフェースと英語ドキュメント

### 🛠️ 技術スタック

#### フロントエンド
- **HTML5**: アクセシビリティを考慮したセマンティックマークアップ
- **CSS3**: Grid/Flexboxを使用したモダンスタイリング、レスポンシブデザイン
- **Vanilla JavaScript**: ES6+機能、モジュラーアーキテクチャ
- **Web API**: LocalStorage、Service Worker、Web App Manifest

#### PWA技術
- **Service Worker**: オフラインキャッシングとバックグラウンド操作
- **Web App Manifest**: ネイティブアプリライクなインストールと外観
- **Cache API**: パフォーマンスのための戦略的リソースキャッシング
- **レスポンシブ画像**: 最適化されたアイコンとグラフィック

#### 開発ツール
- **Git**: 規約的コミットによるバージョン管理
- **GitHub Pages**: 継続的デプロイメントとホスティング
- **Chrome DevTools**: パフォーマンス監視とデバッグ
- **Lighthouse**: PWA監査と最適化

### 📊 アーキテクチャ

```
workout_pwa/
├── index.html              # メインアプリケーションエントリーポイント
├── css/style.css          # 包括的スタイリング
├── js/                    # モジュラーJavaScriptアーキテクチャ
│   ├── main.js           # UI制御とナビゲーション
│   ├── storage.js        # データ管理層
│   ├── auth.js           # 認証システム
│   ├── stats.js          # 統計と可視化
│   ├── settings.js       # 設定管理
│   └── timer.js          # ワークアウトタイマー機能
├── sw.js                  # PWA機能用Service Worker
├── manifest.json         # Web App Manifest
└── icons/                # 各種デバイス用アプリアイコン
```

### 🚀 はじめ方

#### 前提条件
- モダンなWebブラウザ（Chrome、Firefox、Safari、Edge）
- ローカルWebサーバー（開発用）

#### インストール

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/[username]/workout-pwa.git
   cd workout-pwa
   ```

2. **ローカル開発**
   ```bash
   # Python 3を使用
   python3 -m http.server 8000
   
   # Node.jsを使用
   npx serve .
   
   # PHPを使用
   php -S localhost:8000
   ```

3. **アプリケーションへのアクセス**
   ```
   http://localhost:8000
   ```

#### PWAインストール

1. **モバイル（iOS Safari）**
   - Safariでアプリを開く
   - 共有ボタンをタップ
   - 「ホーム画面に追加」を選択

2. **モバイル（Android Chrome）**
   - Chromeでアプリを開く
   - 「インストール」バナーまたはメニューオプションをタップ
   - インストールを確認

3. **デスクトップ（Chrome/Edge）**
   - アドレスバーのインストールアイコンをクリック
   - またはChromeメニュー > 「[アプリ名]をインストール」

### 🎮 使用方法

#### 基本ワークフロー
1. **ワークアウト動画を選択** ホーム画面から
2. **タイマーを開始** して動画に合わせて運動
3. **完了または一時停止** 必要に応じて
4. **統計を確認** 専用統計ページで
5. **動画管理** 設定パネルで

#### 機能ガイド

**タイマーコントロール**
- ▶️ **開始**: ワークアウトタイマーを開始
- ⏸️ **一時停止**: タイマーを一時停止（再開可能）
- ✅ **完了**: ワークアウトを終了して進捗を保存

**統計ビュー**
- 📅 **カレンダー**: 視覚的ワークアウト履歴
- 📊 **チャート**: 週次・月次進捗グラフ
- 🏆 **連続記録**: 連続運動日数
- 📈 **カテゴリ**: ワークアウトタイプ別分析

**動画管理**
- ➕ **追加**: カスタムYouTubeワークアウト動画を挿入
- ✏️ **編集**: 動画詳細と時間を変更
- 🗑️ **削除**: コレクションから動画を削除

### 🚀 デプロイメント

#### GitHub Pages（推奨）

1. **GitHubリポジトリの作成**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Workout PWA"
   git remote add origin https://github.com/[username]/workout-pwa.git
   git push -u origin main
   ```

2. **GitHub Pagesの有効化**
   - リポジトリのSettingsに移動
   - "Pages"セクションをナビゲート
   - "Deploy from a branch"を選択
   - "main"ブランチと"/ (root)"フォルダを選択
   - 設定を保存

3. **PWAへのアクセス**
   ```
   https://[username].github.io/workout-pwa/
   ```

#### 代替デプロイオプション
- **Netlify**: ドラッグ&ドロップデプロイメント
- **Vercel**: Git連携デプロイメント
- **Surge.sh**: コマンドラインデプロイメント
- **Firebase Hosting**: Google Cloud統合

### 🧪 開発

#### ローカル開発環境セットアップ
```bash
# 開発依存関係のインストール（オプション）
npm install -g live-server

# 自動リロード付き開発サーバーの開始
live-server --port=8000
```

#### PWA機能のテスト
1. **Lighthouse監査**: PWA準拠性チェック
2. **DevToolsアプリケーションタブ**: Service Workerとストレージの検査
3. **ネットワークスロットリング**: オフライン機能テスト
4. **デバイスシミュレーション**: レスポンシブデザインテスト

#### コード品質
- **ESLint**: JavaScript linting（設定利用可能）
- **Prettier**: コードフォーマット
- **HTML Validator**: マークアップ検証
- **アクセシビリティ**: ARIAラベルとセマンティックHTML

### 🤝 貢献

貢献を歓迎します！以下のガイドラインに従ってください：

1. **リポジトリをフォーク**
2. **機能ブランチを作成**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **変更をコミット**
   ```bash
   git commit -m "Add: Amazing new feature"
   ```
4. **ブランチにプッシュ**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **プルリクエストを開く**

#### 貢献分野
- 🐛 **バグ修正**: 問題の報告と修正
- ✨ **機能**: 新機能の追加
- 📖 **ドキュメント**: ガイドとチュートリアルの改善
- 🌐 **ローカライゼーション**: 新言語サポートの追加
- 🎨 **デザイン**: UI/UX改善

### 📄 ライセンス

このプロジェクトは**MITライセンス**の下でライセンスされています - 詳細は[LICENSE](LICENSE)ファイルをご覧ください。

### 🙏 謝辞

- **YouTube**: 動画プラットフォーム統合
- **PWAコミュニティ**: ベストプラクティスとインスピレーション
- **MDN Web Docs**: 包括的なWeb標準ドキュメント
- **GitHub Pages**: 無料ホスティングとデプロイメント

### 📞 サポート・連絡先

- **問題**: [GitHub Issues](https://github.com/MOFU0712/workout-pwa/issues)
- **ディスカッション**: [GitHub Discussions](https://github.com/[username]/workout-pwa/discussions)
- **ドキュメント**: 教育コンテンツは[LEARNING.md](LEARNING.md)をご覧ください

---

## 📸 Screenshots | スクリーンショット

### Mobile Interface | モバイルインターフェース
![Mobile Home](screenshots/mobile-home.png)
![Mobile Timer](screenshots/mobile-timer.png)
![Mobile Stats](screenshots/mobile-stats.png)

### Desktop Interface | デスクトップインターフェース
![Desktop Home](screenshots/desktop-home.png)
![Desktop Stats](screenshots/desktop-stats.png)


---

**Built with ❤️ using Vanilla JavaScript and PWA technologies**