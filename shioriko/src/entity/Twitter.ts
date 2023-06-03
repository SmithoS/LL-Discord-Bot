/**
 * Twitterのユーザ情報
 */
export interface TwitterApiUserInfo {
  id: string;
  name: string;
  username: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
  // 上記以外のパラメータは利用しない。上記外のパラメータが来ても受け止められるようにする
  [extraProps: string]: any;
}

/**
 * ツイート
 */
export interface Tweet {
  id: string;
  text: string;
}
