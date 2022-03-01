# LL-Discord-Bot
LL-Fans 用 Discord ボット

# 特徴
LL-Fans の Discord サーバ用のボットです。
Discord サーバが盛り上がることをサポートするのが目的です。

# 要件
このボットを動作させるためには以下が必要です。

* Node.js 16 以上

# 使用法

* Discord Developer Portal にてボットの申請を行う。
* `.env.sample`ファイルをコピーして`.env`にリネーム。各種値を設定する
* 次のコマンドを実行
```bash
npm ci
node index.js
```
* Discord Developer Portal にてSCOPES、BOT PERMISSIONSに以下をチェックして招待URLを作成する
  * SCOPES
    * bot
    * applications.commands
  * BOT PERMISSIONS
    * Send Messages
    * Manage Messages
* 取得したURLでBOTをDiscordサーバに招待する。



# 注意事項
このボットは特定の Discord サーバでのみ動かすことを想定しています。


# 作者
スミソ