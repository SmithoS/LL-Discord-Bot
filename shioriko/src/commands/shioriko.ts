import {
  MessageActionRow,
  MessageButton,
  ButtonInteraction,
  MessageButtonStyleResolvable,
} from "discord.js";
import { BaseButtonAction } from "../buttonAction/BaseButtonAction";
import { GetDeletedMessages } from "../buttonAction/GetDeletedMessages";
import { CancelAction } from "../buttonAction/CancelAction";

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
    buttonActionClass: new GetDeletedMessages(),
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
  description: "削除されたメッセージを取得します。",
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
        "栞子Botが持っているアクションを表示します。適正（権限）を持っている人のみ実行できます。",
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
        await interaction.editReply("はい、何でしょうか？");
        break;
    }
  },
};

async function subcommandGreet(interaction) {
  await interaction.editReply(
    "お初にお目にかかります。栞子Botです。この Discord サーバの監視をしております。"
  );
}

async function subcommandAction(channel, interaction) {
  // ユーザのロールをチェック
  let hasRole: boolean = true;
  const botActionRole: string =
    process.env.AVAILABLE_BOT_ACTION_ROLE_NAME || "";
  if (botActionRole != "") {
    const roles = [...interaction.member.roles.cache.values()];
    hasRole = roles.some((r) => {
      return r.name == botActionRole;
    });
  }

  if (!hasRole) {
    await interaction.editReply(
      "申し訳ありません。適正（権限）を持たれているかたにしかお答えすることができません。"
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
    content: "どのような御用でしょうか？",
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
