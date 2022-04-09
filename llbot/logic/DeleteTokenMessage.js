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
                    return isDeleteStr(str);
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

function isDeleteStr(str) {
    // URLは削除対象外
    if (str.startsWith("http:") || str.startsWith("https:")) {
        return false;
    }
    // 草原は削除対象外
    if (str.match(KUSA_REGEX)) {
        return false;
    }
    // メンションは削除対象外
    if (str.match(MENTION_REGEX) || str.match(ROLE_MENTION_REGEX)) {
        return false;
    }
    // 絵文字は削除対象外
    if (str.match(EMOJI_REGEX) || str.match(ANIMATED_EMOJI_REGEX)) {
        return false;
    }
    // 文字が全て大文字 or 小文字なら削除対象外
    // 記号が含まれるこもとあるので、正規表現にせず文字変換した結果と照らし合わせる
    if (str == str.toUpperCase() || str == str.toLowerCase()) {
        return false;
    }
  
    return true;
}

module.exports = DeleteTokenMessage;