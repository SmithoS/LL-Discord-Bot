import axios, { AxiosInstance, AxiosResponse } from "axios";
import { TwitterApiUserInfo } from "../entity/Twitter";
import dotenv from "dotenv";
dotenv.config();

const FAVORITES_URL = "https://api.twitter.com/1.1/favorites/list.json";

interface TwitterUserInfoApiResponse {
  data: TwitterApiUserInfo;
}

export class LLFansTwitterApiClient {
  /**
   * ユーザ情報の取得
   * @returns
   */
  static async getUserInfo(): Promise<TwitterApiUserInfo> {
    const endpointUrl: string = `https://api.twitter.com/2/users/${process.env.LLFANS_TWITTER_ID}`;

    const sendParam = {
      "user.fields": "public_metrics",
    };

    const response: AxiosResponse = await this.getRequest(
      sendParam,
      endpointUrl
    );
    return (response.data as TwitterUserInfoApiResponse)
      .data as TwitterApiUserInfo;
  }

  /**
   * お気に入りツイートの取得
   * @param sinceTweetId
   * @returns
   */
  static async getFavoritesList(sinceTweetId: string): Promise<Array<any>> {
    // 送信パラメータを作成
    let sendParams = {
      user_id: process.env.LLFANS_TWITTER_ID,
      include_entities: false,
    };
    if (sinceTweetId != null && sinceTweetId != "") {
      sendParams["since_id"] = sinceTweetId;
    }

    const response: AxiosResponse = await this.getRequest(
      sendParams,
      FAVORITES_URL
    );
    return response.data as Array<any>;
  }

  /**
   * TwitterのAPIを呼び出し（get）
   * @param sendParams
   * @param url
   * @returns
   */
  private static getRequest(
    sendParams: any,
    url: string
  ): Promise<AxiosResponse> {
    const client: AxiosInstance = axios.create({
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      params: sendParams,
      timeout: 3000,
    });

    return client.get(url);
  }
}
