import {
  MessageActionRow,
  MessageButton,
  ButtonInteraction,
  MessageButtonStyleResolvable,
} from "discord.js";
import { BaseButtonAction } from "../buttonAction/BaseButtonAction";
import { GetDeletedMessages } from "../buttonAction/GetDeletedMessages";
import { CancelAction } from "../buttonAction/CancelAction";

/**
 * アクションの選択肢のボタン定義
 */
interface ActionButtonInterface {
  id: string;
  name: string;
  style: MessageButtonStyleResolvable;
  buttonActionClass: BaseButtonAction;
}

const ActionButtons: ActionButtonInterface[] = [
  {
    id: "act01",
    name: "直近の削除されたメッセージを教えて",
    style: "PRIMARY",
    buttonActionClass: new GetDeletedMessages(1),
  },
  {
    id: "act99",
    name: "なんでもないです",
    style: "SECONDARY",
    buttonActionClass: new CancelAction(),
  },
];

const SUB_COMMAND_GREET = "greet";
const SUB_COMMAND_ACTION = "action";

module.exports = {
  category: "Shioriko Bot command",
  description: "栞子Botのアクションです。",
  testOnly: true,
  slash: true,
  syntaxError: "",
  options: [
    {
      type: "SUB_COMMAND",
      name: SUB_COMMAND_GREET,
      description: "挨拶をします。",
    },
    {
      type: "SUB_COMMAND",
      name: SUB_COMMAND_ACTION,
      description:
        "栞子Botが持っているアクションを表示します。特定のロールの人のみ実行できます。",
    },
  ],
  callback: async ({ channel, interaction }) => {
    // 処理に時間がかかるだろうから deferReply で一旦返答しておく
    await interaction.deferReply();

    switch (interaction.options.getSubcommand()) {
      case SUB_COMMAND_GREET:
        subcommandGreet(interaction);
        break;
      case SUB_COMMAND_ACTION:
        subcommandAction(channel, interaction);
        break;
      default:
        await interaction.editReply("はい、何でしょうか？" + "\nYes, sir?");
        break;
    }
  },
};

async function subcommandGreet(interaction) {
  await interaction.editReply(
    "お初にお目にかかります。栞子Botです。この Discord サーバの監視をしております。\n" +
      "I see you for the first time. I'm Shioriko bot. I'm monitoring this Discord server."
  );
}

async function subcommandAction(channel, interaction) {
  // ユーザのロールをチェック
  let hasRole: boolean = true;
  const availableBotActionRole: string =
    process.env.AVAILABLE_BOT_ACTION_ROLE_NAME || "";
  if (availableBotActionRole != "") {
    const roles = [...interaction.member.roles.cache.values()];
    hasRole = roles.some((r) => {
      return r.name == availableBotActionRole;
    });
  }

  if (!hasRole) {
    await interaction.editReply(
      `申し訳ありません。特定のロール（${availableBotActionRole}）を持たれているかたにしかお答えすることができません。\n` +
        `I'm sorry. I can only answer to those who have a specific role (${availableBotActionRole} role).`
    );
    return;
  }

  // 実施できるアクションを並べて表示
  const row = new MessageActionRow();
  ActionButtons.forEach((ab) => {
    row.addComponents(
      new MessageButton()
        .setCustomId(ab.id)
        .setLabel(ab.name)
        .setStyle(ab.style)
    );
  });

  await interaction.editReply({
    content: "どのような御用でしょうか？\n" + "May I help you?",
    components: [row],
  });

  const filter = (btnInt: ButtonInteraction) => {
    return interaction.user.id === btnInt.user.id;
  };
  const collector = channel.createMessageComponentCollector({
    filter,
    max: 1,
    time: 1000 * 15,
  });
  collector.on("end", async (collection) => {
    const customId: string = collection.first()?.customId;
    const actBtn: ActionButtonInterface = ActionButtons.find((ab) => {
      return ab.id == customId;
    });

    if (actBtn != null) {
      actBtn.buttonActionClass.action(interaction);
    }
  });
}
