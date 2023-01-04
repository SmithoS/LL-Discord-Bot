import { DeleteMessage } from "./logic/DeleteMessage";
import { LLFansTwitterChecker } from "./logic/LLFansTwitterChecker";
import Discord from "discord.js";
// WOKCommands ライブラリは型定義ファイルがおかしく、import するとトランスパイル時にエラーとなるのでrequireで読み込んでエラーを避ける
const WOKCommands = require("wokcommands");
import path from "path";
import dotenv from "dotenv";
const cron = require("node-cron");
dotenv.config();

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

// Botのコマンド登録
client.on("ready", () => {
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, "commands"),
    ignoreBots: true,
    testServers: [process.env.SERVER_ID],
  });
});

// 定期的な処理の設定
const cronTime = process.env.LLFANS_TWITTER_CHECKER_CRON || "0 1 0 * * *";
cron.schedule(cronTime, async () => {
  await LLFansTwitterChecker.checkUserStatusAndSendMessage(client);
});

// メッセージの精査
client.on("messageCreate", async (message) => {
  await DeleteMessage.checkAndDeleteMessage(message, client);
});
client.on("messageUpdate", async (oldMessage, newMessage) => {
  await DeleteMessage.checkAndDeleteMessage(newMessage, client);
});

client.login(process.env.TOKEN);
