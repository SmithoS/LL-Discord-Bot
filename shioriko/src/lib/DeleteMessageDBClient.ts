import {
  PutItemCommand,
  QueryCommand,
  DynamoDBClient,
  DynamoDBClientConfig,
} from "@aws-sdk/client-dynamodb";
import { DeleteMessageReason } from "../model/DeleteMessageReason";

/** 削除理由テーブルの名前 */
const DELETE_MSG_TABLE = "DeleteMessages";

/** テーブルの接続設定 */
const config: DynamoDBClientConfig = {
  region: process.env.DYNAMODB_REGION ?? "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID ?? "dummy",
    secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY ?? "dummy",
  },
};

/**
 * 削除理由テーブルのクライアント
 */
export class DeleteMessageDBClient {
  /**
   * 削除理由を登録する
   * @param reason
   */
  static async registDeleteMsg(reason: DeleteMessageReason): Promise<void> {
    const dbClient: DynamoDBClient = new DynamoDBClient(config);

    const command: PutItemCommand = new PutItemCommand({
      TableName: DELETE_MSG_TABLE,
      Item: this.convertDeleteMsgReason2TableItem(reason),
    });
    await dbClient.send(command);
  }

  /**
   * 削除理由のうち最新のN件を取得
   * @returns
   */
  static async getDeleteMsgByCount(
    serverId: string,
    count: number
  ): Promise<Array<DeleteMessageReason>> {
    const me = this;
    const dbClient: DynamoDBClient = new DynamoDBClient(config);

    const command: QueryCommand = new QueryCommand({
      TableName: DELETE_MSG_TABLE,
      KeyConditionExpression: "ServerId = :s",
      ExpressionAttributeValues: {
        ":s": { S: serverId },
      },
      Limit: count,
      IndexName: "ServerId-Datetime-index",
      ScanIndexForward: false,
    });
    const output = await dbClient.send(command);

    let delMsgList: Array<DeleteMessageReason> = output.Items.map((i) => {
      return me.convertTableItem2DeleteMsgReasonFrom(i);
    });
    return delMsgList;
  }

  /**
   * 削除理由クラスをテーブル項目に変換する
   * @param reason
   * @returns
   */
  private static convertDeleteMsgReason2TableItem(reason: DeleteMessageReason) {
    return {
      UserId: { S: reason.userId },
      Datetime: { S: reason.datetime },
      UserName: { S: reason.userName },
      ServerId: { S: reason.serverId },
      ChannelId: { S: reason.channelId },
      ChannelName: { S: reason.channelName },
      Type: { S: reason.type },
      Message: { S: reason.message },
      ReasonMsg: { S: reason.reasonMsg },
    };
  }

  /**
   * テーブル項目を削除理由クラスに変換する
   * @param item
   * @returns
   */
  private static convertTableItem2DeleteMsgReasonFrom(
    item: any
  ): DeleteMessageReason {
    return new DeleteMessageReason(
      item.UserId.S,
      item.Datetime.S,
      item.UserName.S,
      item.ServerId.S,
      item.ChannelId.S,
      item.ChannelName.S,
      item.Type.S,
      item.Message.S,
      item.ReasonMsg.S
    );
  }
}
