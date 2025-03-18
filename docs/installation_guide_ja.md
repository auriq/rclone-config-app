# Rclone Config App インストールガイド (macOS)

## Rclone Config Appについて

Rclone Config Appは、rcloneの設定を管理するためのグラフィカルユーザーインターフェースです。以下の機能を提供します：

- クラウドストレージプロバイダー（Google Drive、OneDrive、Dropbox、Box）の設定
- 複数のリモート接続の管理
- リモート接続のテスト
- リモートストレージの内容表示
- リモート設定の削除

このアプリは、コマンドラインコマンドを使用する代わりに、ユーザーフレンドリーなインターフェースを提供することで、rcloneのセットアップ過程を簡素化します。

## システム要件

- macOS 10.12以降
- arm64（Apple Silicon）プロセッサ
- npmやNode.jsは不要（アプリはビルド済みですぐに使用可能）

## 前提条件

アプリケーションの使用にはrcloneのみが必要です：

1. Homebrewのインストール（まだインストールされていない場合）:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Homebrewを使用してrcloneをインストール:
```bash
brew install rclone
```
これにより、rcloneがデフォルトの場所（`/usr/local/bin/rclone`）にインストールされます。

## Rclone Config Appのインストール

1. `Rclone Config App-1.0.0-mac-arm64-installer.dmg`を開く
2. DMGウィンドウが開いたら、Rclone Config Appをアプリケーションフォルダにドラッグ
3. DMGウィンドウを閉じる
4. DMGファイルを右クリック（またはControlキーを押しながらクリック）して「取り出す」を選択

## 初回起動

1. Finderを開き、アプリケーションフォルダに移動
2. "Rclone Config App"を右クリック（またはControlキーを押しながらクリック）して「開く」を選択
3. セキュリティダイアログが表示された場合は「開く」をクリック
4. アプリは自動的に`/usr/local/bin/rclone`のrcloneを検出します
5. rcloneが検出されない場合は、セットアップダイアログで「デフォルトパスを使用」ボタンを使用してください

## インストールの確認

- アプリのメインインターフェースに各クラウドプロバイダーのボタンが表示されます
- クラウドプロバイダーのボタンをクリックして新しいリモートを追加できます
- アプリはシステムにインストールされたrcloneを使用して操作を行います

## トラブルシューティング

### rcloneが見つからない場合
"rclone not found"エラーが表示される場合は、以下のコマンドでrcloneがインストールされているか確認してください：
```bash
which rclone
```

### カスタムrcloneの場所
rcloneがデフォルトの場所以外にインストールされている場合は、セットアップダイアログで正しいパスを入力してください。

### アンインストール
アプリケーションとそのデータを削除する場合：

```bash
# アプリの削除
rm -rf "/Applications/Rclone Config App.app"

# アプリデータの削除（オプション）
rm -rf ~/.config/rclone-config-app

# rcloneの削除（オプション）
brew uninstall rclone
```

## サポート

問題が発生した場合：
1. `rclone version`を実行して、rcloneが正しくインストールされ動作していることを確認
2. アプリの設定ディレクトリ`~/.config/rclone-config-app`を確認
3. アプリケーションフォルダへの適切なアクセス権限があることを確認