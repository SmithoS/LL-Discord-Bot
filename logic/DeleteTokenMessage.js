require('dotenv').config();

class DeleteTokenMessage {
    static async checkAndDeleteMessage(message) {
        try {

            // ロールを取得し、メッセージ検査対象か確認する
            const roles = [...message.member.roles.cache.values()];
            if ((process.env.MESSAGE_CHECK_CONTAIN_BOT != "1" && message.member.user.bot)              // ボットは精査の対象外とする
                || roles.some((r) => { return r.name == process.env.MESSAGE_CHECK_EXCLUDE_ROLE_NAME }) // 対象外のロールが付与されている
            ) {
                return ;
            }


            // 半角英数の部分文字列を取得
            const TOKEN_REGEX = /[a-zA-Z0-9\:\-\/\.!#;&'=@_~%,\$\(\)\*\?\+]{20,}/g;

            const messageContent = message.content || "";
            const matchAry = messageContent.match(TOKEN_REGEX);

            // 取得した文字列のいずれかがトークンらしいか確認
            let isContainToken = false;
            if (matchAry) {
                isContainToken = matchAry.some((str) => {
                    // 英数字でもトークンでないものがあるので確認
                    return !str.startsWith("http:")
                        && !str.startsWith("https:");
                });
            }

            if (isContainToken) {
                await message.delete();
                message.channel.send("トークンらしき文字列なので削除しました。");
            }
        } catch (e) {
        }
    }
}

module.exports = DeleteTokenMessage;