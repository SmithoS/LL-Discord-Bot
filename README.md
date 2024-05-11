# LL-Discord-Bot

LL-Fans 用 各種 Discord ボット

# 特徴

LL-Fans の Discord サーバ用のボットです。  
目的別にボットを作成しており、ボットと対応するコードは以下のようになっています

コードと対応ボット
|名前|コードのディレクトリ|説明|
|----|----|----|
| ~~LL-Fans Bot~~ |llbot|LL-Fans のユーティリティ的な機能を提供する。現在は廃止中|
|栞子 Bot|shioriko|簡易的なセキュリティ監視を行う|

# 要件

このボットを動作させるためには以下が必要です。

- Node.js 18 以上

# 使用法

- Discord Developer Portal にてボットの申請を行う。
- `.env.sample`ファイルをコピーして`.env`にリネーム。各種値を設定する。
- 次のコマンドを実行

```bash
npm ci
npm run compile
npm run start
```

- Discord Developer Portal にて SCOPES、BOT PERMISSIONS に以下をチェックして招待 URL を作成する
  - SCOPES
    - bot
    - applications.commands
  - BOT PERMISSIONS
    - Send Messages
    - Manage Messages
- 取得した URL で BOT を Discord サーバに招待する。

# 注意事項

- このボットは特定の Discord サーバでのみ動かすことを想定しています。  
  複数のサーバをまとめて管理するような想定ではないことに注意してください。
- llbot にコードは残っていますが、現在は開発が廃止されています。動くかどうかは保証できません。
- 削除メッセージを外部に送信しています。

# 作者

スミソ
