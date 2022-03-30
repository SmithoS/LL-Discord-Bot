require('dotenv').config();

/** トークンらしい文字列と判断する正規表現 */
const TOKEN_REGEX = /[a-zA-Z0-9\:\-\/\.!#;&'=@_~%,\$\(\)\*\?\+]{20,}/g;

/** 草原の正規表現 */
const KUSA_REGEX = /^[wW]+$/;
/** メンションの正規表現 */
const MENTION_REGEX = /^@![0-9]+$/;
const ROLE_MENTION_REGEX = /^@&[0-9]+$/;
/** 絵文字の正規表現 */
const EMOJI_REGEX = /^\:[a-zA-Z0-9_\-\:\+]+\:[0-9]+$/;
/** アニメーション絵文字の正規表現 */
const ANIMATED_EMOJI_REGEX = /^a\:[a-zA-Z0-9_\-\:\+]+\:[0-9]+$/;
/** Twemoji */
// const TWEMOJI_REGEX = new RegExp(require('twemoji-parser/dist/lib/regex').default, '');
// Twemojiは要調査

class DeleteTokenMessage {
    static async checkAndDeleteMessage(message, client) {
        try {

            // 自分自身の発言は無視する
            if (client.user.id == message.author.id) {
                return ;
            }

            // ロールを取得し、メッセージ検査対象か確認する
            const excludeRoleName = process.env.MESSAGE_CHECK_EXCLUDE_ROLE_NAME || "";
            if (excludeRoleName != "") {
                const roles = [...message.member.roles.cache.values()];
                if (roles.some((r) => { return r.name == process.env.MESSAGE_CHECK_EXCLUDE_ROLE_NAME;})) {
                    return ;
                }
            }

            // 半角英数の部分文字列を取得
            const messageContent = message.content || "";
            const matchAry = messageContent.match(TOKEN_REGEX);

            // 取得した文字列のいずれかがトークンらしいか確認
            let isContainToken = false;
            if (matchAry) {
                isContainToken = matchAry.some((str) => {
                    return !str.startsWith("http:")     // URLは削除対象から除外
                        && !str.startsWith("https:")    // URLは削除対象から除外
                        && !str.match(KUSA_REGEX)       // 草原は削除対象から除外
                        && !str.match(MENTION_REGEX)    // メンションは削除対象から除外
                        && !str.match(ROLE_MENTION_REGEX) // メンションは削除対象から除外
                        && !str.match(EMOJI_REGEX)      // 絵文字は削除対象から除外
                        && !str.match(ANIMATED_EMOJI_REGEX);// 絵文字は削除対象から除外
                });
            }

            if (isContainToken) {
                await message.delete();
                message.channel.send("セキュリティ上の問題によりメッセージを削除しました。詳しくは管理者までお問い合わせください。");
            }
        } catch (e) {
        }
    }
}

module.exports = DeleteTokenMessage;