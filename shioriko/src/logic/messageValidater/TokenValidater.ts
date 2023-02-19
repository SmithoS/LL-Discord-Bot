import {
  BaseValidater,
  ValidateResult,
  ValidateErrorType,
} from "./BaseValidater";

/** トークンらしい文字列と判断する正規表現 */
const TOKEN_REGEX =
  /[a-zA-Z0-9_\-]{15,}\.[a-zA-Z0-9_\-]{5,10}\.[a-zA-Z0-9_\-]{20,}/;

// トークンらしき文字列と検出されたものを確認する。
// トークンと判定しない条件があれば追加する
const isTokenStr = (str): boolean => {
  return true;
};

export class TokenValidater extends BaseValidater {
  validate(message: string): ValidateResult {
    const rtnResult: ValidateResult = {
      result: true,
      type: ValidateErrorType.Token,
      message: "",
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
