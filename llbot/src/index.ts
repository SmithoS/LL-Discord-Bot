import Discord from "discord.js";
import dotenv from "dotenv";
// WOKCommands ライブラリは型定義ファイルがおかしく、import するとトランスパイル時にエラーとなるのでrequireで読み込んでエラーを避ける
const WOKCommands = require("wokcommands");
import path from "path";
// import cron from "node-cron";
const cron = require("node-cron");
import { LLFansTwitterChecker } from "./logic/LLFansTwitterChecker";
dotenv.config();

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

// Botのコマンド設定;
client.on("ready", () => {
  new WOKCommands(client, {
    commandsDir: path.join(__dirname, "commands"),
    testServers: [process.env.SERVER_ID],
  });
});

// 定期的な処理の設定
// -> 栞子Botに機能を移動
// cron.schedule(process.env.LLFANS_TWITTER_CHECKER_CRON, async () => {
//   console.log("cron call");
//   await LLFansTwitterChecker.checkUserStatusAndSendMessage(client);
// });

// Node.js のエラーハンドリング
// 申し訳程度の機能
process.on("unhandledRejection", (error) => {
  console.log("-- ERROR --");
  console.log(error);
});

client.login(process.env.TOKEN);
