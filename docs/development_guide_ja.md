# Rclone Config App 開発ガイド

このガイドでは、開発目的でソースコードからRclone Config Appをセットアップして実行する方法を説明します。

## 開発要件

- Node.js 18.x以降
- npm 9.x以降
- Git
- システムにインストールされたrclone

## 開発環境のセットアップ

1. Node.jsとnpmのインストール:
   - https://nodejs.org にアクセス
   - LTSバージョンをダウンロードしてインストール
   - インストールの確認:
     ```bash
     node --version
     npm --version
     ```

2. rcloneのインストール:
   - macOS: `brew install rclone`
   - Windows: https://rclone.org/downloads/ からダウンロード
   - インストールの確認: `rclone --version`

3. リポジトリのクローン:
   ```bash
   git clone <repository-url>
   cd rclone-config-app
   ```

4. 依存関係のインストール:
   ```bash
   npm install
   ```

## アプリケーションの実行

1. 開発モードでアプリケーションを起動:
   ```bash
   npm start
   ```
   これにより、ホットリロードが有効な状態でElectronアプリケーションが起動します。

## ソースからのビルド

1. 現在のプラットフォーム用にビルド:
   ```bash
   npm run dist
   ```

2. 特定のプラットフォーム用にビルド:
   - macOSのみ: `npm run dist -- -m`
   - Windowsのみ: `npm run dist -- -w`
   - 両プラットフォーム: `npm run dist -- -mw`

ビルドされたパッケージは`dist`ディレクトリに生成されます。

## プロジェクト構造

```
rclone-config-app/
├── src/                    # ソースコードファイル
│   ├── main.js            # メインElectronプロセス
│   ├── renderer.js        # レンダラープロセス
│   └── index.html         # メインアプリケーションウィンドウ
│
├── scripts/               # ユーティリティスクリプト
│   ├── kill-app.bat      # Windowsプロセスクリーンアップ
│   ├── kill-app.sh       # macOSプロセスクリーンアップ
│   ├── setup-scheduler.bat# Windowsスケジューラー設定
│   └── setup-scheduler.sh # macOSスケジューラー設定
│
├── docs/                  # ドキュメント
├── build/                 # 配布パッケージ
├── package.json          # プロジェクト設定
└── package-lock.json     # ロックされた依存関係
```

## 開発スクリプト

- `npm start`: 開発モードでアプリを実行
- `npm run pack`: テスト用の未パッケージビルドを作成
- `npm run dist`: 配布可能なパッケージを作成

## 変更の加え方

1. メインプロセス (main.js):
   - アプリケーションのライフサイクルを処理
   - rclone設定を管理
   - IPC通信を実装

2. レンダラープロセス (renderer.js):
   - UIロジックを実装
   - ユーザー操作を処理
   - メインプロセスと通信

3. ユーザーインターフェース (index.html):
   - アプリケーションレイアウトを定義
   - スタイルとマークアップを含む
   - renderer.jsを参照

## 配布パッケージのビルド

1. package.jsonのバージョンを更新
2. パッケージをビルド:
   ```bash
   npm run dist
   ```
3. ビルドされたパッケージをテスト:
   - macOS: .dmgインストーラーをテスト
   - Windows: setup.exeとportable.exeの両方をテスト

## 開発のトラブルシューティング

1. アプリが起動しない場合:
   ```bash
   # npmキャッシュをクリア
   npm cache clean --force
   # 依存関係を再インストール
   rm -rf node_modules
   npm install
   ```

2. 変更が反映されない場合:
   - アプリケーションを再起動
   - アプリデータをクリア:
     ```bash
     # macOS
     rm -rf ~/.config/rclone-config-app
     # Windows
     rd /s /q "%APPDATA%\rclone-config-app"
     ```

3. デバッグログ:
   - メインプロセス: npm startを実行したコンソール
   - レンダラープロセス: DevTools (Ctrl+Shift+IまたはCmd+Option+I)

## コードスタイル

- 一貫したインデント（2スペース）を使用
- JavaScript Standard Styleに従う
- 複雑なロジックにはコメントを追加
- 関数は焦点を絞ってモジュール化
- エラーを適切に処理

## テスト

変更を提出する前に:
1. 基本機能をテスト
2. rclone統合を確認
3. エラー処理を確認
4. 可能であればmacOSとWindows両方でテスト
5. クリーンビルドが動作することを確認