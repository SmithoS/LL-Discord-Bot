require("dotenv").config();
import { DeleteMessageDBClient } from "../lib/DeleteMessageDBClient";
import { DeleteMessageReason } from "../model/DeleteMessageReason";
import {
  BaseValidater,
  ValidateResult,
} from "./messageValidater/BaseValidater";
import { TokenValidater } from "./messageValidater/TokenValidater";
import { LineCountValidater } from "./messageValidater/LineCountValidater";
import { MentionValidater } from "./messageValidater/MentionValidater";
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
        return prev + (prev != "" ? "\n" : "") + curr.type;
      }, "");
      const messages: string = errorResult.reduce((prev, curr) => {
        return prev + (prev != "" ? "\n" : "") + curr.message;
      }, "");

      // 削除理由の登録、メッセージ削除
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
      promiseList.push(message.delete());

      await Promise.all(promiseList);
      await message.channel.send(
        "セキュリティ上の問題によりメッセージを削除しました。詳しくは管理者までお問い合わせください。\n" +
          "I delete your message due to security issues. Please contact the administrator for more information."
      );
    }
  }
}
