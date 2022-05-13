import { BaseButtonMaintenance } from "./BaseButtonMaintenance";

/** 入力待ち時間（秒） */
const TIMEOUT_SEC = 10;

/**
 * コマンド種別
 */
export enum COMMAND_TYPE {
  /** アプリケーションコマンド */
  APPLICATION_COMMAND,
  /** ギルドコマンド */
  GUILD_COMMAND,
}

/**
 * コマンド一覧の表示
 */
export class DeleteCommand extends BaseButtonMaintenance {
  client;
  channel;
  commandType: COMMAND_TYPE;

  constructor(client, channel, commandType: COMMAND_TYPE) {
    super();
    this.client = client;
    this.channel = channel;
    this.commandType = commandType;
  }

  async action(interaction) {
    await interaction.editReply({
      content: `削除する${
        this.commandType == COMMAND_TYPE.APPLICATION_COMMAND
          ? "アプリケーション"
          : "ギルド"
      }コマンドのIDを入力してください。`,
      components: [],
    });

    // ユーザからの入力待ち
    const filter = (msg) => {
      return msg.author.id === interaction.user.id;
    };
    const collected = await this.channel.awaitMessages({
      filter,
      max: 1,
      time: TIMEOUT_SEC * 1000,
    });
    const response = collected.first();
    if (!response) {
      this.channel.send("タイムアウトです。");
      return;
    }

    // コマンド削除
    const deleteCommandId: string = response.content;
    let deleteResult: boolean;
    if (this.commandType == COMMAND_TYPE.APPLICATION_COMMAND) {
      deleteResult = await this.deleteApplicationCommand(deleteCommandId);
    } else {
      deleteResult = await this.deleteGuildCommand(
        deleteCommandId,
        interaction.guildId
      );
    }

    // 削除結果の通知
    if (deleteResult) {
      this.channel.send("コマンドを削除しました。");
    } else {
      this.channel.send(
        "該当コマンドが見つかりません。または削除に失敗しました。"
      );
    }
  }

  /**
   * アプリケーションコマンドの削除
   * @param commandId
   * @returns
   */
  private async deleteApplicationCommand(commandId: string): Promise<boolean> {
    try {
      const commandManager = this.client.application.commands;
      if (commandManager.resolve(commandId) == null) return false;

      await commandManager.delete(commandId);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * ギルドコマンドの削除
   * @param commandId
   * @param guildId
   * @returns
   */
  private async deleteGuildCommand(
    commandId: string,
    guildId: string
  ): Promise<boolean> {
    try {
      const guild = this.client.guilds.cache.get(guildId);
      const commandManager = guild.commands;
      if (commandManager.resolve(commandId) == null) return false;

      await commandManager.delete(commandId);
      return true;
    } catch (e) {
      return false;
    }
  }
}
