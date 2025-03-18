# Rclone Config App

[English](README.md) | [日本語](README_ja.md)

Rclone Config Appは、rcloneの設定を簡単に管理できるGUIアプリケーションです。コマンドラインを使わずに、クラウドストレージの接続設定を視覚的に管理できます。

## 主な機能

✨ **簡単な設定**
- 直感的なGUIインターフェース
- ウィザード形式の設定手順
- 自動的なrclone検出

🔌 **対応クラウドストレージ**
- Google Drive
- OneDrive
- Dropbox
- Box

🛠 **管理機能**
- 接続テスト
- ストレージ容量確認
- ファイル一覧表示
- リモート設定の削除

## 動作環境

### macOS
- macOS 10.12以降
- Apple Silicon (arm64)プロセッサ
- rcloneがインストールされていること

### Windows
- Windows 10以降
- 64ビット(x64)プロセッサ
- rcloneがインストールされていること

## インストール方法

1. rcloneをインストール
   ```bash
   # macOSの場合
   brew install rclone

   # Windowsの場合
   # https://rclone.org/downloads/ からインストーラーをダウンロード
   ```

2. お使いのシステムに合わせたパッケージをダウンロード：
   - macOS: `Rclone Config App-1.0.0-mac-arm64-installer.dmg`
   - Windows: `Rclone Config App-1.0.0-win-x64-setup.exe`

3. インストーラーを実行

詳しいインストール手順は以下のガイドをご覧ください：
- [macOSインストールガイド](docs/installation_guide_ja.md)
- [Windowsインストールガイド](docs/installation_guide_windows_ja.md)

## 使い方

1. アプリケーションを起動
2. rcloneが自動的に検出されます
3. 追加したいクラウドストレージのボタンをクリック
4. 画面の指示に従って設定を完了

詳しい使い方は[ユーザーガイド](docs/users_guide_ja.md)をご覧ください。

## 開発者向け情報

### 必要な環境
- Node.js 18.x以降
- npm 9.x以降
- Git
- rclone

### 開発環境のセットアップ
```bash
# リポジトリのクローン
git clone <repository-url>
cd rclone-config-app

# 依存パッケージのインストール
npm install

# 開発モードで起動
npm start
```

詳しい開発手順は[開発ガイド](docs/development_guide_ja.md)をご覧ください。

### ビルド方法
```bash
# 現在のプラットフォーム用
npm run dist

# 特定のプラットフォーム用
npm run dist -- -m  # macOSのみ
npm run dist -- -w  # Windowsのみ
npm run dist -- -mw # 両方
```

## ディレクトリ構成

```
rclone-config-app/
├── src/                    # ソースコード
│   ├── main.js            # メインプロセス
│   ├── renderer.js        # レンダラープロセス
│   └── index.html         # メインウィンドウ
├── docs/                  # ドキュメント
├── scripts/               # ユーティリティスクリプト
├── build/                 # ビルド成果物
└── package.json          # プロジェクト設定
```

## アンインストール方法

### macOS
1. アプリケーションを終了
2. アプリケーションの削除：
   ```bash
   rm -rf "/Applications/Rclone Config App.app"
   ```
3. 設定とデータの削除（任意）：
   ```bash
   rm -rf ~/.config/rclone-config-app
   ```
4. rcloneが不要な場合は削除：
   ```bash
   brew uninstall rclone
   ```

### Windows
1. アプリケーションを終了
2. Windowsの設定からアンインストール：
   - 設定 > アプリ > アプリと機能を開く
   - "Rclone Config App"を見つける
   - アンインストールをクリック
3. 設定とデータの削除（任意）：
   ```cmd
   rd /s /q "%APPDATA%\rclone-config-app"
   ```
4. rcloneが不要な場合は削除：
   - Windowsの設定 > アプリと機能から削除
   - またはProgram Filesから削除

## ライセンス

本プロジェクトはMITライセンスで提供されています。詳細は[LICENSE](LICENSE)をご覧ください。

注：本プロジェクトは、MITライセンスで提供されているrcloneを依存関係として使用しています。rcloneと統合していますが、このアプリケーションは独自のライセンスを持つ別個のプロジェクトです。

## 謝辞

- [Rclone](https://rclone.org/) - 本アプリケーションの基盤となるツール
- [Electron](https://www.electronjs.org/) - クロスプラットフォームアプリケーション開発フレームワーク
- 各クラウドストレージプロバイダー