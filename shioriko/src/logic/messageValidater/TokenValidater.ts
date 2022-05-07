import { BaseValidater, ValidateResult } from "./BaseValidater";

/** トークンらしい文字列と判断する正規表現 */
const TOKEN_REGEX = /[a-zA-Z0-9\:\-\/\.!#;&'=@_~%,\$\(\)\*\?\+]{25,}/g;

/** 草原の正規表現 */
const KUSA_REGEX = /^[wW]+$/;
/** メンションの正規表現 */
const MENTION_REGEX = /^@![0-9]+$/;
const ROLE_MENTION_REGEX = /^@&[0-9]+$/;
/** 絵文字の正規表現 */
const EMOJI_REGEX = /^\:[a-zA-Z0-9_\-\:\+]+\:[0-9]+$/;
/** アニメーション絵文字の正規表現 */
const ANIMATED_EMOJI_REGEX = /^a\:[a-zA-Z0-9_\-\:\+]+\:[0-9]+$/;

export class TokenValidater extends BaseValidater {
  validate(message: string): ValidateResult {
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
    const matchAry: string[] = message.match(TOKEN_REGEX) || [];
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
        "が検出されています。";
    }

    return rtnResult;
  }
}
