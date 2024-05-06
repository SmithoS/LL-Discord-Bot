require("dotenv").config();
import { MessageEmbed } from "discord.js";
import { BaseButtonAction } from "../BaseButtonAction";

/**
 * 削除されたメッセージを取得する
 */
export class GetDeletedMessages extends BaseButtonAction {
  count: number;

  constructor(count: number) {
    super();
    this.count = count;
  }

  async action(interaction) {
    const embed = new MessageEmbed();
    embed.setTitle("削除メッセージ情報");
    embed.setFields([
      {
        name: "URL",
        value: process.env.LIST_DELETED_MSG_PAGE_URL,
      },
    ]);

    await interaction.editReply({
      content: `栞子Botのダイエット（費用削減）に伴いDiscord上で確認できなくなりました。以下のページで確認をお願いします。`,
      components: [],
      embeds: [embed],
    });
  }
}
