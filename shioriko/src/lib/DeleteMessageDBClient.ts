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
      Item: this.createDeleteMsgTableItem(reason),
    });
    await dbClient.send(command);
  }

  // /**
  //  * 削除理由を取得
  //  * @returns
  //  */
  // static async getDeleteMsg(
  //   datetime: string
  // ): Promise<Array<DeleteMessageReason>> {
  //   const dbClient: DynamoDBClient = new DynamoDBClient(config);

  //   const command: QueryCommand = new QueryCommand({
  //     TableName: DELETE_MSG_TABLE,
  //     IndexName: "role-index",
  //     KeyConditionExpression: "Datetime = :datetime",
  //     ExpressionAttributeValues: {
  //       ":datetime": { S: datetime },
  //     },
  //   });
  //   const output = await dbClient.send(command);

  //   let delMsgList: Array<DeleteMessageReason> = [];
  //   return delMsgList;
  // }

  /**
   * 削除理由をDB登録用パラメータに変換する
   * @param reason
   * @returns
   */
  private static createDeleteMsgTableItem(reason: DeleteMessageReason) {
    return {
      UserId: { S: reason.userId },
      Datetime: { S: reason.datetime },
      UserName: { S: reason.userName },
      ChannelId: { S: reason.channelId },
      ChannelName: { S: reason.channelName },
      Type: { S: reason.type },
      Message: { S: reason.message },
      ReasonMsg: { S: reason.reasonMsg },
    };
  }
}
