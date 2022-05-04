export interface ValidateResult {
  result: boolean;
  type: string;
  message: string;
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
