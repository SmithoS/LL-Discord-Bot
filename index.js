require('dotenv').config();
const Discord = require('discord.js');
const WOKCommands = require('wokcommands');
const path = require('path');
const cron = require('node-cron');
const LLFansTwitterChecker = require('./logic/LLFansTwitterChecker');


const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS
        , Discord.Intents.FLAGS.GUILD_MESSAGES
        , Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

// Botのコマンド設定
client.on('ready', () => {
    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        testServers: [process.env.SERVER_ID]
    });
});

// 定期的な処理の設定
cron.schedule(process.env.LLFANS_TWITTER_CHECKER_CRON, async () => {
    await LLFansTwitterChecker.checkUserStatusAndSendMessage(client);
});


// Node.js のエラーハンドリング
// 申し訳程度の機能
process.on('unhandledRejection', error => {
    console.log('-- ERROR --');
    console.log(error);
});



client.login(process.env.TOKEN);