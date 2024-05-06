require("dotenv").config();
import axis from "axios";
import { DeleteMessageReason } from "../model/DeleteMessageReason";

/**
 * 削除理由テーブルのクライアント
 */
export class DeleteMessageDBClient {
  /**
   * 削除理由を登録する
   * @param reason
   */
  static async registDeleteMsg(reason: DeleteMessageReason): Promise<void> {
    await axis.post(
      process.env.REGIST_DELETED_MSG_API_URL,
      this.convertDeleteMsgReasonJsonString(reason),
      {
        headers: {
          "x-api-key": process.env.REGIST_DELETED_MSG_API_KEY,
        },
      }
    );
  }

  private static convertDeleteMsgReasonJsonString(
    reason: DeleteMessageReason
  ): string {
    return JSON.stringify({
      userId: reason.userId,
      datetime: reason.datetime,
      userName: reason.userName,
      serverId: reason.serverId,
      channelId: reason.channelId,
      channelName: reason.channelName,
      type: reason.type,
      message: reason.message,
      reasonMsg: reason.reasonMsg,
    });
  }
}
