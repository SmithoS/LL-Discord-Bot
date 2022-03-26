require('dotenv').config();
const { MessageEmbed  } = require('discord.js');
const LLFansTwitterDBClient = require('../lib/LLFansTwitterDBClient');
const LLFansTwitterApiClient = require('../lib/LLFansTwitterApiClient');
const MyMoment  = require('../lib/MyMoment');

class LLFansTwitterChecker {

    static async checkUserStatusAndSendMessage(client) {

        // メッセージ送信チャンネルを取得
        const channel = await client.channels.fetch(process.env.SEND_LLFANS_STATUS_CHANNEL_ID);
        if (channel != null) {

            // 前回の情報を取得
            const beforeInfo = await LLFansTwitterDBClient.getLatestInfo();
            let beforeFavTweetId = null;
            if (beforeInfo != null) beforeFavTweetId = beforeInfo.latestFavTweetId;

            // 最新の情報を取得
            const currentUserInfo = await LLFansTwitterApiClient.getUserInfo();
            const currentFavList = await LLFansTwitterApiClient.getFavoritesList(beforeFavTweetId);
            let currentFavTweetId = "";
            let incrementFavCount = 0;
            if (currentFavList != null && currentFavList.length > 0) {
                currentFavTweetId = String(currentFavList[0].id_str);
                incrementFavCount = currentFavList.length;
            } else {
                currentFavTweetId = beforeFavTweetId;
                incrementFavCount = 0;
            }

            // 取得データを保存
            await LLFansTwitterDBClient.saveInfo(
                MyMoment.getJSTnow().format('YYYY-MM-DD HH:mm:ss'),
                currentUserInfo.public_metrics.tweet_count,
                currentUserInfo.public_metrics.followers_count,
                currentUserInfo.public_metrics.following_count,
                currentFavTweetId,
                incrementFavCount
            );

            // 通知情報
            let changeInfo = [];
            if (incrementFavCount > 0) {
                changeInfo.push({
                    name: '■ いいね',
                    value: `新しく ${ incrementFavCount } 件のツイートを「いいね」しました。`,
                });
            }
            if (beforeInfo != null) {
                if (beforeInfo.followingCount < currentUserInfo.public_metrics.following_count) {
                    changeInfo.push({
                        name: '■ フォローしているユーザ',
                        value: `フォローしているユーザが ${currentUserInfo.public_metrics.following_count} 人に増えました。`,
                    });
                }
                if (Math.floor(beforeInfo.followersCount / 100) < Math.floor(currentUserInfo.public_metrics.followers_count / 100)) {
                    changeInfo.push({
                        name: '■ フォロワー',
                        value: `フォロワーが ${Math.floor(currentUserInfo.public_metrics.followers_count / 100) * 100} 人を突破しました。`,
                    });
                }
                if (Math.floor(beforeInfo.tweetCount / 100) < Math.floor(currentUserInfo.public_metrics.tweet_count / 100)) {
                    changeInfo.push({
                        name: '■ ツイート数',
                        value: `ツイート数が ${Math.floor(currentUserInfo.public_metrics.tweet_count / 100) * 100} 件を突破しました。`,
                    });
                }
            }

            // LL-FansのURL
            const twitterUrl = `https://twitter.com/${ currentUserInfo.username }/`;

            if (changeInfo != null && changeInfo.length > 0) {
                const embed = new MessageEmbed();
                embed.setTitle('LL-Fans ツイッターアカウント情報');
                embed.setDescription(`[LL-Fansツイッターアカウント](${ twitterUrl }) \n [過去情報](${ process.env.DB_SHEET_URL })`);
                embed.setFields(changeInfo);

                channel.send({
                    embeds: [embed]
                });
            }
        }
    }
}


module.exports = LLFansTwitterChecker;