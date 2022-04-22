import { MessageEmbed } from "discord.js";
import { readdirSync } from "fs";

/** コマンドファイルが置かれているパス */
const COMMANDS_FILE_PATH = "./dist/commands/";

module.exports = {
  category: "ll fans commands",
  description: "LL Discord Bot が実装しているコマンドの一覧を表示します。",
  testOnly: true,
  slash: true,
  syntaxError: "",
  callback: async ({ interaction }) => {
    // 自作のコマンド名を取得（ファイル名＝コマンド名なのでファイル名を取得）
    const commandFiles: string[] = readdirSync(__dirname).filter((file) =>
      file.endsWith(".js")
    );

    // ファイル情報から表示用のフィールド作成
    const commandsFields = commandFiles.map((fileName: string) => {
      let c = require(`./${fileName}`);
      let description: string = c.description || "";
      if (
        typeof c.descriptionExAry !== "undefined" &&
        c.descriptionExAry != null
      ) {
        description += "\n" + c.descriptionExAry.join("\n");
      }

      let paramsStr: string = "";
      if (typeof c.expectedArgs !== "undefined" && c.expectedArgs != null) {
        paramsStr = " " + c.expectedArgs;
      }

      return {
        name: "/" + fileName.replace(".js", "") + paramsStr,
        value: description,
      };
    });

    // リプライ
    const embed = new MessageEmbed();
    embed.setTitle("LL Discord ボット　コマンド一覧");
    embed.setFields(commandsFields);

    await interaction.reply({
      content: "ヘルプ - LL Discord ボット　コマンド一覧",
      embeds: [embed],
    });
  },
};
