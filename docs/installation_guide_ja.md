# Rclone Config App インストールガイド (macOS)

## ダウンロード

### 最新リリース (v1.0.0)

ダウンロードリンク：
- [Rclone Config App-1.0.0-mac-arm64-installer.dmg](https://asi-opendata.s3.us-east-1.amazonaws.com/rclone-config-app/Rclone+Config+App-1.0.0-mac-arm64-installer.dmg)

## 前提条件

1. Homebrewのインストール（まだインストールされていない場合）:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Homebrewを使用してrcloneをインストール:
```bash
brew install rclone
```

## インストール手順

1. 上記リンクから.dmgインストーラーをダウンロード
2. ダウンロードした.dmgファイルを開く
3. Rclone Config AppをApplicationsフォルダにドラッグ
4. インストーラーウィンドウを閉じる
5. DMGファイルを右クリック（またはControlキーを押しながらクリック）して「取り出す」を選択

## 初回起動

1. Finderを開き、Applicationsフォルダに移動
2. "Rclone Config App"を右クリック（またはControlキーを押しながらクリック）して「開く」を選択
3. セキュリティダイアログが表示された場合は「開く」をクリック
4. アプリは自動的に`/usr/local/bin/rclone`のrcloneを検出します
5. rcloneが検出されない場合は、セットアップダイアログで「デフォルトパスを使用」ボタンを使用

## 確認事項

インストール後、以下を確認してください：
- アプリがApplicationsフォルダに表示されている
- セキュリティ警告なしで起動できる
- rcloneが自動的に検出される
- メインインターフェースにアクセスできる

## トラブルシューティング

### 初回起動時のセキュリティ警告
セキュリティ警告が表示された場合：
1. アプリを右クリック（またはControlキーを押しながらクリック）
2. コンテキストメニューから「開く」を選択
3. ダイアログで「開く」をクリック

### rcloneが見つからない場合
"rclone not found"エラーが表示される場合：
1. rcloneがインストールされているか確認：
   ```bash
   which rclone
   ```
2. デフォルトの場所（`/usr/local/bin/rclone`）にあることを確認
3. 別の場所にインストールされている場合は、アプリの設定で正しいパスを入力

### 権限の問題
権限の問題が発生した場合：
1. ユーザー権限を確認
2. rcloneが正しくインストールされているか確認
3. Applicationsフォルダへのアクセス権限を確認

## アンインストール

アプリケーションを削除する場合：

1. アプリケーションを終了
2. アプリを削除：
   ```bash
   rm -rf "/Applications/Rclone Config App.app"
   ```
3. 設定を削除（任意）：
   ```bash
   rm -rf ~/.config/rclone-config-app
   ```
4. rcloneが不要な場合は削除：
   ```bash
   brew uninstall rclone
   ```

## サポート

問題が発生した場合：
1. rcloneのインストールを確認：`rclone version`
2. アプリの設定を確認：`~/.config/rclone-config-app`
3. 適切な権限があることを確認
4. 使用方法については[ユーザーガイド](users_guide_ja.md)を参照してください
