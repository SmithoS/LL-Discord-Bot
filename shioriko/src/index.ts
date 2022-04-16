require("dotenv").config();
import { DeleteMessage } from "./logic/DeleteMessage";
const Discord = require("discord.js");

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

// メッセージの精査
client.on("messageCreate", async (message) => {
  await DeleteMessage.checkAndDeleteMessage(message, client);
});
client.on("messageUpdate", async (oldMessage, newMessage) => {
  await DeleteMessage.checkAndDeleteMessage(newMessage, client);
});

client.login(process.env.TOKEN);
