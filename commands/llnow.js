const LLNowClient = require('../lib/LLNowClient');
const MyConst = require('../lib/MyConst');
const MyCache = require('../lib/MyCache');

// 定期取得の開始用オプション
const OPTION_START01 = 'start';
const OPTION_START02 = 'begin';

// 定期取得の終了用オプション
const OPTION_END01 = 'end';
const OPTION_END02 = 'finish';
const OPTION_END03 = 'stop';

// 取得用オプション
const OPTION_GET01 = 'get';
const OPTION_GET02 = 'now';


module.exports = {
    category: 'LL Now commands',
    description: 'LL Now のツイートを取得して表示します。 ',
    descriptionExAry: [`　オプション "${OPTION_START01}"または"${OPTION_START02}" ：\n　　定期的にツイートを表示します。`,
        `　オプション"${OPTION_END01}"または"${OPTION_END02}"または"${OPTION_END03}"：\n　　定期的な表示を停止します。`,
        `　オプション"${OPTION_GET01}"または"${OPTION_GET02}"：\n　　最新のツイート1件を取得して表示します。`
    ],
    testOnly: true,
    slash: true,
    expectedArgs: '<option>',
    minArgs: 1,
    maxArgs: 1,
    syntaxError: '',
    callback: async ({ channel, args, interaction }) => {

        let option = '';
        if (args.length > 0) {
            option = args[0];
        }

        switch (option) {
            case OPTION_START01:
            case OPTION_START02:

                // ツイート取得処理が残っていた場合は、以前のものを解除して再設定する
                const currentIntervalId = MyCache.get(MyConst.CACHE_KEY_LLNOW_INTERVAL_KEY);
                if (currentIntervalId != null) {
                    clearAutoGetTweet();
                    interaction.reply(`LL Now の最新ツイート取得処理を再設定します。${ MyConst.LLNOW_AUTO_SEND_INTERVAL_MINUTES }分ごとに自動取得します。`);
                } else {
                    interaction.reply(`LL Now の最新ツイートを${ MyConst.LLNOW_AUTO_SEND_INTERVAL_MINUTES }分ごとに自動取得します。`);
                }

                // 自動取得を設定
                const sendFunction = async () => {
                    const replyText = await getOneTweetAndReplyText();
                    if (replyText != null && replyText != '') {
                        channel.send(replyText);
                    }
                }
                sendFunction();
                const intervalId = setInterval(sendFunction, MyConst.LLNOW_AUTO_SEND_INTERVAL_MINUTES * 60 * 1000 );
                MyCache.set(MyConst.CACHE_KEY_LLNOW_INTERVAL_KEY, intervalId);

                // 自動取得の停止し忘れたことを考慮し、強制停止を設定
                const timeoutID = setTimeout(() => {
                    const interId = MyCache.get(MyConst.CACHE_KEY_LLNOW_INTERVAL_KEY);
                    if (interId != null) {
                        clearInterval(interId);
                        MyCache.set(MyConst.CACHE_KEY_LLNOW_INTERVAL_KEY, null);
                        channel.send('LL Now のツイート自動取得を長時間実行しているため、強制停止します。');
                    }
                }, MyConst.LLNOW_AUTO_SEND_FORCE_TERMINATE_HOURS * 60 * 60 * 1000);
                MyCache.set(MyConst.CACHE_KEY_LLNOW_TIMEOUT_KEY, timeoutID);

                break;

            case OPTION_END01:
            case OPTION_END02:
            case OPTION_END03:
                // 自動ツイート取得処理を終了

                clearAutoGetTweet();
                interaction.reply('LL Now のツイート自動取得を解除します。');

                break;

            case OPTION_GET01:
            case OPTION_GET02:
                // 現時点のツイートを取得

                // 処理に時間がかかるだろうから deferReply で一旦返答しておく
                await interaction.deferReply();

                // 発言するテキストを取得
                let replyText = await getOneTweetAndReplyText();
                if (replyText == null || replyText == '') {
                    replyText = '最新ツイートが更新されていません。';
                }
                interaction.editReply({
                    content: replyText
                });
                break;

            default:
                interaction.reply('オプションの指定が間違っています。ヘルプで確認してください。');
        }

    }
};

/**
 * ツイート取得処理を削除する
 */
function clearAutoGetTweet() {
    // ツイート自動取得処理を削除
    const intervalId = MyCache.get(MyConst.CACHE_KEY_LLNOW_INTERVAL_KEY);
    if (intervalId != null) {
        clearInterval(intervalId);
        MyCache.set(MyConst.CACHE_KEY_LLNOW_INTERVAL_KEY, null);
    } 

    // 強制終了処理を削除
    const timeoutId = MyCache.get(MyConst.CACHE_KEY_LLNOW_TIMEOUT_KEY);
    if (timeoutId != null) {
        clearTimeout(timeoutId);
        MyCache.set(MyConst.CACHE_KEY_LLNOW_TIMEOUT_KEY, null);
    }
}

/**
 * ツイートを取得して発言用テキストを取得する
 */
async function getOneTweetAndReplyText() {

    // LL Now から最新1ツイートを取得
    let tweet = null;
    const tweetList = await LLNowClient.getRecentTweets(1);
    if (tweetList.length > 0) {
        tweet = tweetList[0];
    }

    // 以前の取得ツイートを取得
    const beforeTweet = MyCache.get(MyConst.CACHE_KEY_LLNOW_CURRENT_REPLY_TWEET);

    // 発言用テキストを作成する
    if (tweet == null) {
        return `連続してLL Nowのツイートを取得することはできません。${ MyConst.LLNOW_CALL_API_COOLDOWN_MINUTES }分以上の間隔を開けてください。`;
    } else if (beforeTweet != null && beforeTweet.id == tweet.id ) {
        return null;
    } else {
        MyCache.set(MyConst.CACHE_KEY_LLNOW_CURRENT_REPLY_TWEET, tweet);
        return LLNowClient.makeTweetUrl(tweet);
    }
}