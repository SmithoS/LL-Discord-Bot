import {
  BaseValidater,
  ValidateResult,
  ValidateErrorType,
} from "./BaseValidater";

/** 削除判定する行数 */
const MAX_LINE_COUNT = 100;

export class LineCountValidater extends BaseValidater {
  validate(message: string): ValidateResult {
    const rtnResult: ValidateResult = {
      result: true,
      type: ValidateErrorType.LineCount,
      message: "",
    };

    const crlfs: string[] = message.match(/\r\n|\n/g) || [];
    if (crlfs.length >= MAX_LINE_COUNT) {
      rtnResult.result = false;
      rtnResult.message = `行数が${MAX_LINE_COUNT}を越えています。`;
    }

    return rtnResult;
  }
}
