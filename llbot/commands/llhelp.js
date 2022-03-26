const { MessageEmbed  } = require('discord.js');
const { readdirSync } = require('fs');

module.exports =  {
    category: 'll fans commands',
    description: 'LL Discord Bot が実装しているコマンドの一覧を表示します。',
    testOnly: true,
    slash: true,
    syntaxError: '',
    callback: async ({ interaction }) => {


        // 自作のコマンド名を取得（ファイル名＝コマンド名なのでファイル名を取得）
        const commandFiles = readdirSync('./commands/').filter((file) => file.endsWith('.js'));


        // ファイル情報から表示用のフィールド作成
        const commandsFields = commandFiles.map((fileName) => {
            let c = require(`../commands/${ fileName }`);
            let description = c.description;
            if (typeof c.descriptionExAry !== 'undefined' && c.descriptionExAry != null) {
                description += '\n' + c.descriptionExAry.join('\n');
            }

            let paramsSttr = '';
            if (typeof c.expectedArgs !== 'undefined' && c.expectedArgs != null) {
                paramsSttr = ' ' + c.expectedArgs;
            }

            return {
                name: '/' + fileName.replace(".js", "") + paramsSttr,
                value: description,
            }
        });

        // リプライ
        const embed = new MessageEmbed();
        embed.setTitle('LL Discord ボット　コマンド一覧');
        embed.setFields(commandsFields);

        await interaction.reply({
            content: 'ヘルプ - LL Discord ボット　コマンド一覧',
            embeds: [embed]
        });
    }
}
