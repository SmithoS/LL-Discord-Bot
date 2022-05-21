require("dotenv").config();
import { DeleteMessageDBClient } from "../lib/DeleteMessageDBClient";
import { DeleteMessageReason } from "../model/DeleteMessageReason";
import {
  BaseValidater,
  ValidateResult,
  ValidateErrorType,
} from "./messageValidater/BaseValidater";
import { TokenValidater } from "./messageValidater/TokenValidater";
import { LineCountValidater } from "./messageValidater/LineCountValidater";
import { MentionValidater } from "./messageValidater/MentionValidater";
import { MessageEmbed, EmbedFieldData } from "discord.js";
const moment = require("moment");

/** 日時フォーマット */
const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

/**
 * メッセージ削除モジュール
 */
export class DeleteMessage {
  static async checkAndDeleteMessage(message, client) {
    // 自分自身の発言は無視する
    if (client.user.id == message.author.id) {
      return;
    }

    // 発言者のロールが削除対象外の場合は無視する
    const excludeRoleName = process.env.MESSAGE_CHECK_EXCLUDE_ROLE_NAME || "";
    if (excludeRoleName != "") {
      const roles = [...message.member.roles.cache.values()];
      if (
        roles.some((r) => {
          return r.name == process.env.MESSAGE_CHECK_EXCLUDE_ROLE_NAME;
        })
      ) {
        return;
      }
    }

    // 送信メッセージ
    const messageContent: string = message.content || "";

    // チェックするモジュール一覧
    const validateModuleList: Array<BaseValidater> = [
      new TokenValidater(),
      new LineCountValidater(),
      new MentionValidater(),
    ];
    const errorResult: Array<ValidateResult> = [];

    // 各種モジュールでチェック
    for (const validateModule of validateModuleList) {
      const result: ValidateResult = validateModule.validate(messageContent);
      if (!result.result) {
        errorResult.push(result);
      }
    }

    // 何かしら問題があれば削除
    if (errorResult.length > 0) {
      const now = moment();
      const types: string = errorResult.reduce((prev, curr) => {
        return prev + (prev != "" ? "," : "") + curr.type;
      }, "");
      const messages: string = errorResult.reduce((prev, curr) => {
        return prev + (prev != "" ? "\n" : "") + curr.message;
      }, "");

      // 削除理由の登録、
      const promiseList: Array<Promise<any>> = [];
      promiseList.push(
        DeleteMessageDBClient.registDeleteMsg(
          new DeleteMessageReason(
            message.author.id,
            now.format(DATE_FORMAT),
            message.author.username,
            message.guildId,
            message.channelId,
            message.channel.name,
            types,
            messageContent,
            messages
          )
        )
      );
      // メッセージ削除
      promiseList.push(message.delete());
      await Promise.all(promiseList);

      // 削除時のメンション相手を指定
      const mentionUserIds: string =
        process.env.USER_MENTION_IDS_WHEN_MSG_DELETED || "";
      const mentionRoleId: string =
        process.env.ROLE_MENTION_ID_WHEN_MSG_DELETED || "";
      let mentions: string[] = [];
      if (mentionUserIds) {
        mentions = mentionUserIds.split(",").map((id) => {
          return `<@${id}>`;
        });
      }
      if (mentionRoleId) {
        mentions.push(`<@&${mentionRoleId}>`);
      }
      let mentionText: string = "";
      if (mentions.length > 0) {
        mentionText = `（ ${mentions.join(" ")} ）`;
      }

      // 削除理由を表示
      const me = this;
      const embed = new MessageEmbed();
      embed.setTitle("理由 Reason");
      embed.setFields(
        errorResult.map((r) => me.getDisplayErrorReasonEmbedFieldData(r))
      );
      await message.channel.send({
        content:
          `セキュリティ上の問題によりメッセージを削除しました。詳しくは管理者${mentionText}までお問い合わせください。\n` +
          "I delete your message due to security issues. Please contact the administrator for more information.",
        embeds: [embed],
      });
    }
  }

  private static getDisplayErrorReasonEmbedFieldData(
    result: ValidateResult
  ): EmbedFieldData {
    if (result.result) return null;

    let msgType: string = "";
    let msgRsn: string = "";
    switch (result.type) {
      case ValidateErrorType.Token:
        msgType = "セキュリティ上の問題 Security problems";
        msgRsn =
          "セキュリティ上の問題がある文章が含まれているメッセージです。\n This message contains text that has a security problem.";
        break;
      case ValidateErrorType.Mention:
        msgType = "メンション Mentions";
        msgRsn = "メンション数が多すぎます。\n Too many mentions.";
        break;
      case ValidateErrorType.LineCount:
        msgType = "行数 Number of lines";
        msgRsn = "行数が多すぎます。\n Too many number of lines.";
        break;
    }

    return {
      name: msgType,
      value: msgRsn,
    };
  }
}
