const LLNowApiClient = require('../lib/LLNowApiClient');
const Tweet = require('../entity/Tweet');
const moment = require('moment');
const MyCache = require('../lib/MyCache');
const MyConst = require('../lib/MyConst');

class LLNowClient {

    /**
     * LL Now の直近のTLを取得
     * @param { 取得件数 } count 
     * @returns 
     */
    static async getRecentTweets(count) {

        // 前回の呼び出しから指定時刻（分）経過していない場合はAPI呼び出しを行わない
        let beforeCallMoment = MyCache.get(MyConst.CACHE_KEY_LLNOW_BEFORE_CALL_MOMENT);
        if (beforeCallMoment != null) {
            if (moment().diff(beforeCallMoment, 'minutes') < MyConst.LLNOW_CALL_API_COOLDOWN_MINUTES) {
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
        const tweets = await LLNowApiClient.getRecetTweets(limit);
        let tweetList = tweets.data.map((e) => {
            return new Tweet(
                e.id,
                e.text
            );
        });

        // API呼び出し時刻を更新
        MyCache.set(MyConst.CACHE_KEY_LLNOW_BEFORE_CALL_MOMENT, moment());

        // 指定件数のツイートのみ返却
        if (count < tweetList.length) {
            tweetList = tweetList.slice(0, count);
        }

        return tweetList;
    }


    /**
     * ツイートからLL Now のURLを作成する。
     * ※現在は取得元が「LL Now」前提の作り。マジックナンバーが埋め込まれているのを解決しなきゃいけない
     * @param { ツイート } tweet 
     * @returns 
     */
    static makeTweetUrl(tweet) {
        return `https://twitter.com/LLNow_jp/status/${ tweet.id }`;
    }
}


module.exports = LLNowClient;