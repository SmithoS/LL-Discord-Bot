import { BaseButtonMaintenance } from "./BaseButtonMaintenance";

/**
 * ボタン呼び出しのキャンセル
 */
export class CancelMaintenance extends BaseButtonMaintenance {
  async action(interaction) {
    await interaction.editReply({
      content: "そうですか。何か御用がありましたらおよびください。",
      components: [],
    });
  }
}
