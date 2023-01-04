/**
 * ツイッターのユーザ情報
 */
export interface TwitterUserInfo {
  formattedTime: string;
  tweetCount: number;
  followersCount: number;
  followingCount: number;
  latestFavTweetId: string;
  incrementFavCount: number;
}
