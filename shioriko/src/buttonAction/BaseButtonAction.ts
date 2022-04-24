/**
 * ボタン押下時の処理の基底クラス
 */
export abstract class BaseButtonAction {
  /**
   * ボタン押下時の処理
   * @param interaction
   */
  abstract action(interaction): Promise<void>;
}
