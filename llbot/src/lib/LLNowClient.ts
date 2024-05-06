import { Tweet } from "../entity/Twitter";
import { MyMoment } from "../lib/MyMoment";
import { MyCache } from "../lib/MyCache";
import { MyConst } from "../lib/MyConst";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import dotenv from "dotenv";
dotenv.config();

interface getTweetApiResponse {
  data: Tweet[];
  // 上記以外のパラメータは利用しない。上記外のパラメータが来ても受け止められるようにする
  [extraProps: string]: any;
}

export class LLNowClient {
  /**
   * LL Now の直近のツイートを取得
   * @param { 取得件数 } count
   * @returns
   */
  static async getRecentTweets(count): Promise<Tweet[]> {
    // 前回の呼び出しから指定時刻（分）経過していない場合はAPI呼び出しを行わない
    let beforeCallMoment = MyCache.get(
      MyConst.CACHE_KEY_LLNOW_BEFORE_CALL_MOMENT
    );
    if (beforeCallMoment != null) {
      if (
        MyMoment.getJSTnow().diff(beforeCallMoment, "seconds") <
        MyConst.LLNOW_CALL_API_COOLDOWN_MINUTES * 60
      ) {
        return [];
      }
    }

    // 取得件数の設定。
    // APIの制約で最小は5らしい。なので5未満なら5に書き換え
    let limit = 5;
    if (limit < count) {
      limit = count;
    }

    // ツイートを取得
    let tweets: Tweet[] = await this.getRecetTimelines(limit);

    // API呼び出し時刻を更新
    MyCache.set(
      MyConst.CACHE_KEY_LLNOW_BEFORE_CALL_MOMENT,
      MyMoment.getJSTnow()
    );

    // 指定件数のツイートのみ返却
    if (count < tweets.length) {
      tweets = tweets.slice(0, count);
    }

    return tweets;
  }

  /**
   * ツイートからLL Now のURLを作成する。
   * ※現在は取得元が「LL Now」前提の作り。マジックナンバーが埋め込まれているのを解決しなきゃいけない
   * @param { ツイート } tweet
   * @returns
   */
  static makeTweetUrl(tweet) {
    return `https://twitter.com/LLNow_jp/status/${tweet.id}`;
  }

  /**
   * ツイートを取得する
   * @param count
   * @returns
   */
  private static async getRecetTimelines(count): Promise<Tweet[]> {
    const endpointUrl: string = `https://api.twitter.com/2/users/${process.env.LLNOW_USER_ID}/tweets`;

    const client: AxiosInstance = axios.create({
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
      params: {
        max_results: count,
      },
      timeout: 3000,
    });

    const response: AxiosResponse = await client.get(endpointUrl);
    return (response.data as getTweetApiResponse).data || [];
  }
}
