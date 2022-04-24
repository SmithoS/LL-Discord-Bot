require("dotenv").config();
import { DeleteMessageDBClient } from "../lib/DeleteMessageDBClient";
import { DeleteMessageReason } from "../model/DeleteMessageReason";
const moment = require("moment");

/** トークンらしい文字列と判断する正規表現 */
const TOKEN_REGEX = /[a-zA-Z0-9\:\-\/\.!#;&'=@_~%,\$\(\)\*\?\+]{20,}/g;

/** 草原の正規表現 */
const KUSA_REGEX = /^[wW]+$/;
/** メンションの正規表現 */
const MENTION_REGEX = /^@![0-9]+$/;
const ROLE_MENTION_REGEX = /^@&[0-9]+$/;
/** 絵文字の正規表現 */
const EMOJI_REGEX = /^\:[a-zA-Z0-9_\-\:\+]+\:[0-9]+$/;
/** アニメーション絵文字の正規表現 */
const ANIMATED_EMOJI_REGEX = /^a\:[a-zA-Z0-9_\-\:\+]+\:[0-9]+$/;

/** 日時フォーマット */
const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

/** メッセージが正しいどうか判定するための内部用モジュールのインタフェース */
interface ValidateModule {
  validate(text: string): ValidateResult;
}

/** 判定結果のインタフェース */
interface ValidateResult {
  result: boolean;
  type: string;
  message: string;
}

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
    const validateModuleList: Array<ValidateModule> = [tokenValidater];
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
        return (prev != "" ? "," : "") + curr.type;
      }, "");
      const messages: string = errorResult.reduce((prev, curr) => {
        return (prev != "" ? "," : "") + curr.message;
      }, "");

      // 登録
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
        "セキュリティ上の問題によりメッセージを削除しました。詳しくは管理者までお問い合わせください。"
      );
    }
  }
}

/**
 * 文字列にトークンらしき文字列が含まれているか判断するモジュール
 */
const tokenValidater: ValidateModule = {
  validate(text: string): ValidateResult {
    const rtnResult: ValidateResult = {
      result: true,
      type: "token",
      message: "",
    };

    const isTokenStr = (str): boolean => {
      // URLは削除対象外
      if (str.startsWith("http:") || str.startsWith("https:")) {
        return false;
      }
      // 草原は削除対象外
      if (str.match(KUSA_REGEX)) {
        return false;
      }
      // メンションは削除対象外
      if (str.match(MENTION_REGEX) || str.match(ROLE_MENTION_REGEX)) {
        return false;
      }
      // 絵文字は削除対象外
      if (str.match(EMOJI_REGEX) || str.match(ANIMATED_EMOJI_REGEX)) {
        return false;
      }
      // 文字が全て大文字 or 小文字なら削除対象外
      // 記号が含まれるこもとあるので、正規表現にせず文字変換した結果と照らし合わせる
      if (str == str.toUpperCase() || str == str.toLowerCase()) {
        return false;
      }

      return true;
    };

    // トークンらしい文字列を抽出
    const matchAry: string[] = text.match(TOKEN_REGEX) || [];
    const tokenStrList: string[] = matchAry.filter((t) => {
      return isTokenStr(t);
    });

    // トークンらしき文字列が見つかった場合は異常系としてエラー設定
    if (tokenStrList.length > 0) {
      rtnResult.result = false;
      rtnResult.message =
        "トークンらしき文字列として" +
        tokenStrList.reduce((pre, cur) => {
          return pre + "「" + cur + "」";
        }, "") +
        "が検出されました";
    }

    return rtnResult;
  },
};
