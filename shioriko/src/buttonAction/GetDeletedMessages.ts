import { MessageEmbed } from "discord.js";
import { DeleteMessageReason } from "../model/DeleteMessageReason";
import { DeleteMessageDBClient } from "../lib/DeleteMessageDBClient";
import { BaseButtonAction } from "./BaseButtonAction";

/** 表示メッセージを削除するまでの時間（秒） */
const DISPLAY_SECONDS = 60;

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
    // 削除メッセージを取得
    const delMsgs: DeleteMessageReason[] =
      await DeleteMessageDBClient.getDeleteMsgByCount(
        interaction.guildId,
        this.count
      );

    if (delMsgs.length == 0) {
      await interaction.editReply({
        content: "削除されたメッセージは特にありません。",
      });
      return;
    }

    // 表示用に整形
    let embed: MessageEmbed[] = delMsgs.map((d) => {
      const embed = new MessageEmbed();
      embed.setTitle("削除メッセージ情報");
      embed.setDescription("削除されたメッセージの詳細です。");
      embed.setFields([
        {
          name: "■ 日時",
          value: d.datetime,
        },
        {
          name: "■ 発言チャンネル",
          value: d.channelName,
        },
        {
          name: "■ 発言ユーザ",
          value: d.userName,
        },
        {
          name: "■ 削除理由",
          value: d.reasonMsg,
        },
        {
          name: "■ 原文",
          value: d.message,
        },
      ]);
      return embed;
    });

    await interaction.editReply({
      content: `直近の削除メッセージ${this.count}件を表示します。\nこのメッセージ自体にセキュリティ違反文章が含まれているので、${DISPLAY_SECONDS}秒後に自動削除することにご注意ください。`,
      components: [],
      embeds: embed,
    });

    setTimeout(() => {
      interaction.deleteReply();
    }, DISPLAY_SECONDS * 1000);
  }
}
