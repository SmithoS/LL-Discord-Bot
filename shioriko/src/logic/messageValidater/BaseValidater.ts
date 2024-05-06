export interface ValidateResult {
  result: boolean;
  type: ValidateErrorType;
  message: string;
}

export enum ValidateErrorType {
  Token = "token",
  Mention = "mention",
  LineCount = "lineCount",
}

/**
 * ボタン押下時の処理の基底クラス
 */
export abstract class BaseValidater {
  /**
   * ボタン押下時の処理
   * @param interaction
   */
  abstract validate(message: string): ValidateResult;
}
