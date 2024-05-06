import { BaseButtonAction } from "../BaseButtonAction";

/**
 * ボタン呼び出しのキャンセル
 */
export class CancelAction extends BaseButtonAction {
  async action(interaction) {
    await interaction.editReply({
      content: "そうですか。何か御用がありましたらおよびください。",
      components: [],
    });
  }
}
