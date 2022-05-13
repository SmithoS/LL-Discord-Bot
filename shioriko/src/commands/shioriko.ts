import {
  MessageActionRow,
  MessageButton,
  ButtonInteraction,
  MessageButtonStyleResolvable,
} from "discord.js";
import { BaseButtonAction } from "../buttonAction/BaseButtonAction";
import { GetDeletedMessages } from "../buttonAction/GetDeletedMessages";
import { CancelAction } from "../buttonAction/CancelAction";
import { BaseButtonMaintenance } from "../buttonMaintenance/BaseButtonMaintenance";
import { CancelMaintenance } from "../buttonMaintenance/CancelMaintenance";
import { ShowCommands } from "../buttonMaintenance/ShowCommands";
import {
  DeleteCommand,
  COMMAND_TYPE,
} from "../buttonMaintenance/DeleteCommand";

/**
 * サブコマンド定義
 */
interface SubcommantInterface {
  name: string;
  description: string;
  action(client, channel, interaction): Promise<void>;
}

/**
 * アクションの選択肢のボタン定義
 */
interface ActionButtonInterface {
  id: string;
  name: string;
  style: MessageButtonStyleResolvable;
  buttonActionClass: BaseButtonAction;
}

/**
 * メンテナンスの選択肢のボタン定義
 */
interface MaintenanceButtonInterface {
  id: string;
  name: string;
  style: MessageButtonStyleResolvable;
  buttonActionClass: BaseButtonMaintenance;
}

/**
 * サブコマンド一覧
 */
const Subcommands: SubcommantInterface[] = [
  {
    name: "greet",
    description: "挨拶をします。",
    action: subcommandGreet,
  },
  {
    name: "talk",
    description: "会話をします。",
    action: subcommandTalk,
  },
  {
    name: "action",
    description:
      "栞子Botが持っているアクションを表示します。特定のロールの人のみ実行できます。",
    action: subcommandAction,
  },
  {
    name: "maintenance",
    description:
      "栞子Botのメンテナンス用コマンドです。ボットのオーナーのみ実行できます。",
    action: subcommandMaintenance,
  },
];

/**
 * アクション選択肢のボタン
 */
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

module.exports = {
  category: "Shioriko Bot command",
  description: "栞子Botのアクションです。",
  testOnly: true,
  slash: true,
  syntaxError: "",
  options: Subcommands.map((sc) => {
    return {
      type: "SUB_COMMAND",
      name: sc.name,
      description: sc.description,
    };
  }),
  callback: async ({ client, channel, interaction }) => {
    // 処理に時間がかかるだろうから deferReply で一旦返答しておく
    await interaction.deferReply();

    // 選択されたサブコマンドを取得
    const selectSubcommandName: string = interaction.options.getSubcommand();
    const selectSubcommand: SubcommantInterface = Subcommands.find((sc) => {
      return sc.name == selectSubcommandName;
    });

    if (selectSubcommand) {
      await selectSubcommand.action(client, channel, interaction);
    } else {
      await interaction.editReply("はい、何でしょうか？" + "\nYes, sir?");
    }
  },
};

/**
 * 挨拶をするサブコマンド
 * @param channel
 * @param interaction
 */
async function subcommandGreet(client, channel, interaction) {
  await interaction.editReply(
    "お初にお目にかかります。栞子Botです。この Discord サーバの監視をしております。\n" +
      "I see you for the first time. I'm Shioriko bot. I'm monitoring this Discord server."
  );
}

/**
 * トークをするサブコマンド
 * @param channel
 * @param interaction
 */
async function subcommandTalk(client, channel, interaction) {
  // トークの候補
  const talkList: string[] = [
    "英語をミアさんから教えてもらっているのですが、難しいですね。\n" +
      "I am learning English from Mia, but it is difficult.",
    "円周率は 3.141592653589 793238462643……。もう十分ですか？\n" +
      "The pi is 3.141592653589793238462643……. Is it enough?",
    "平安京が遷都されたのは西暦794年です。「鳴くよ（794）ウグイス平安京」という語呂合わせが有名ですね。\n" +
      'The capital was moved to Heian-kyo in 794 A.D. The word "Nakuyo (794) uguisu Heian-kyo"  (Warbler purr in Heian-kyo) is well-known.',
    "武家諸法度を発布したのは西暦1615年です。「いろんなイチゴ（1615）の武家諸法度」という語呂合わせが有名ですね。\n" +
      '"Bukesyohatto" (The Samurai Laws) were promulgated in 1615 A.D. The word "Ironna ichigo (1615) no Bukesyohatto" (Bukesyohatto has various strawberries) is well-known.',
  ];
  const talkStr: string = talkList[Math.floor(Math.random() * talkList.length)];

  await interaction.editReply(talkStr);
}

/**
 * アクション一覧を表示するサブコマンド
 * @param channel
 * @param interaction
 */
async function subcommandAction(client, channel, interaction) {
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

async function subcommandMaintenance(client, channel, interaction) {
  // ボットオーナーからの呼び出し化確認
  const botOwnerId: string = process.env.BOT_OWNER_ID || "";
  if (interaction.user.id != botOwnerId) {
    await interaction.editReply(
      `申し訳ありません。栞子Botのオーナーのかたにしかお答えすることができません。\n` +
        `I'm sorry. I can only answer to those who is owner of Shioriko bot.`
    );
    return;
  }

  const MaintenanceButtons: MaintenanceButtonInterface[] = [
    {
      id: "maint01",
      name: "コマンド一覧の表示",
      style: "PRIMARY",
      buttonActionClass: new ShowCommands(client, channel),
    },
    {
      id: "maint02",
      name: "ギルドコマンド削除",
      style: "PRIMARY",
      buttonActionClass: new DeleteCommand(
        client,
        channel,
        COMMAND_TYPE.GUILD_COMMAND
      ),
    },
    {
      id: "maint03",
      name: "アプリケーションコマンド削除",
      style: "PRIMARY",
      buttonActionClass: new DeleteCommand(
        client,
        channel,
        COMMAND_TYPE.APPLICATION_COMMAND
      ),
    },
    {
      id: "maint99",
      name: "キャンセル",
      style: "SECONDARY",
      buttonActionClass: new CancelMaintenance(),
    },
  ];

  // 実施できるアクションを並べて表示
  const row = new MessageActionRow();
  MaintenanceButtons.forEach((ab) => {
    row.addComponents(
      new MessageButton()
        .setCustomId(ab.id)
        .setLabel(ab.name)
        .setStyle(ab.style)
    );
  });

  await interaction.editReply({
    content: "どのようなメンテナンス内容でしょうか？",
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
    const actBtn: MaintenanceButtonInterface = MaintenanceButtons.find((ab) => {
      return ab.id == customId;
    });

    if (actBtn != null) {
      actBtn.buttonActionClass.action(interaction);
    }
  });
}
