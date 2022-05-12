import { BaseButtonMaintenance } from "./BaseButtonMaintenance";
import {
  MessageEmbed,
  EmbedFieldData,
  ApplicationCommand,
  ApplicationCommandOption,
} from "discord.js";

/**
 * コマンド一覧の表示
 */
export class ShowCommands extends BaseButtonMaintenance {
  client;
  channel;

  constructor(client, channel) {
    super();
    this.client = client;
    this.channel = channel;
  }

  async action(interaction) {
    const guildId = interaction.guildId;
    const guild = this.client.guilds.cache.get(guildId);

    await interaction.editReply({
      content: "栞子Botで実装しているコマンドを順に表示します。",
      components: [],
    });

    // ギルドコマンド表示
    let guildCommands = await guild.commands.fetch();
    guildCommands.each((gc) => {
      this.showCommand(gc);
    });

    // アプリケーションコマンド表示
    const appliCommands = await this.client.application.commands.fetch();
    appliCommands.each((ac) => {
      this.showCommand(ac);
    });
  }

  /**
   * コマンドを表示
   * @param cmnd
   * @returns
   */
  private async showCommand(cmnd: ApplicationCommand) {
    const fields: EmbedFieldData[] = [
      {
        name: "ID",
        value: cmnd.id,
      },
      {
        name: "名前",
        value: cmnd.name,
      },
      {
        name: "説明",
        value: cmnd.description,
      },
      {
        name: "コマンド種類",
        value: `> ${
          cmnd.guild != null ? "ギルド" : "アプリケーション"
        }コマンド`,
      },
    ];

    const options: ApplicationCommandOption[] = cmnd.options;
    for (const opt of options) {
      fields.push({
        name: `オプション ${opt.name}`,
        value: opt.description,
      });
    }

    const embed = new MessageEmbed();
    embed.setTitle(`${cmnd.id} - ${cmnd.name}`);
    embed.setDescription(cmnd.description);
    embed.setFields(fields);

    this.channel.send({
      embeds: [embed],
    });

    return;
  }
}
