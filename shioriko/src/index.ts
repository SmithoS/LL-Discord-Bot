require("dotenv").config();
const Discord = require("discord.js");

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

client.on("messageCreate", async (message) => {
  // 動作確認用処理
  const messageContent = message.content || "";
  if (messageContent == "しお") {
    message.channel.send("しおしお！");
  } else if (messageContent == "おはよう") {
    message.channel.send("おはしお！");
  }
});

client.login(process.env.TOKEN);
