import axios, { AxiosInstance, AxiosResponse } from "axios";
import { TwitterUserInfo } from "../entity/LLFansDB";
import dotenv from "dotenv";
dotenv.config();

interface LLFansDBApiParam {
  key: string;
  method: string;
  data?: string;
}

interface GetResponse {
  data: TwitterUserInfo;
}

export class LLFansTwitterDBClient {
  /**
   * 最新の情報を取得する
   * @returns
   */
  static async getLatestInfo(): Promise<TwitterUserInfo> {
    const client: AxiosInstance =
      this.createLLFansDBAxiosClient("getLatestInfo");

    const response: AxiosResponse = await client.get(process.env.DB_URL);
    return (response.data as GetResponse).data;
  }

  /**
   * 情報を保存する
   * @param formattedTime
   * @param tweetCount
   * @param followersCount
   * @param followingCount
   * @param latestFavTweetId
   * @param incrementFavCount
   * @returns
   */
  static async saveInfo(
    formattedTime: string,
    tweetCount: number,
    followersCount: number,
    followingCount: number,
    latestFavTweetId: string,
    incrementFavCount: number
  ): Promise<void> {
    const sendData = {
      formattedTime: formattedTime,
      tweetCount: tweetCount,
      followersCount: followersCount,
      followingCount: followingCount,
      latestFavTweetId: latestFavTweetId,
      incrementFavCount: incrementFavCount,
    };
    const client: AxiosInstance = this.createLLFansDBAxiosClient(
      "saveInfo",
      sendData
    );

    await client.post(process.env.DB_URL);
    return;
  }

  /**
   * LLFansの記録DB通信用クライアントを作成する
   * @param method
   * @param sendData
   * @returns
   */
  private static createLLFansDBAxiosClient(
    method: string,
    sendData: any = null
  ): AxiosInstance {
    // 送信パラメータ作成
    let sendParam: LLFansDBApiParam = {
      key: process.env.DB_KEY,
      method: method,
    };
    if (sendData != null) {
      sendParam.data = JSON.stringify(sendData);
    }

    return axios.create({
      params: sendParam,
      timeout: 8000,
    });
  }
}
