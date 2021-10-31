require('dotenv').config();
const Discord = require('discord.js');
const WOKCommands = require('wokcommands');
const path = require('path');


const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS
        , Discord.Intents.FLAGS.GUILD_MESSAGES
        , Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

client.on('ready', () => {
    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        testServers: [process.env.SERVER_ID]
    });
});

// Node.js のエラーハンドリング
// 申し訳程度の機能
process.on('unhandledRejection', error => {
    console.log('-- ERROR --');
    console.log(error);
});

client.login(process.env.TOKEN);