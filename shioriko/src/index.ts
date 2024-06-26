import { DeleteMessage } from "./logic/DeleteMessage";
import Discord from "discord.js";
// WOKCommands ライブラリは型定義ファイルがおかしく、import するとトランスパイル時にエラーとなるのでrequireで読み込んでエラーを避ける
const WOKCommands = require("wokcommands");
import path from "path";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

// Discord Botのクライアント作成
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

// Discord Botのコマンド登録
client.on("ready", () => {
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, "commands"),
    ignoreBots: true,
    testServers: [process.env.SERVER_ID],
  });
});

// Discord Botの起動設定（メッセージ送信時に起動）
client.on("messageCreate", async (message) => {
  await DeleteMessage.checkAndDeleteMessage(message, client);
});
client.on("messageUpdate", async (oldMessage, newMessage) => {
  await DeleteMessage.checkAndDeleteMessage(newMessage, client);
});

client.login(process.env.TOKEN);

// ヘルスチェック用API
const app = express();
app.get("/", (req, res) => {
  res.send("OK");
});
app.listen(8000);
