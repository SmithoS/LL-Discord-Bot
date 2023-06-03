import { MessageEmbed } from "discord.js";
import { BaseButtonAction } from "../BaseButtonAction";
import { LLFansTwitterApiClient } from "../../lib/LLFansTwitterApiClient";
import { TwitterApiUserInfo } from "../../entity/Twitter";
import dotenv from "dotenv";
dotenv.config();

export class TelLLFansTwitterInfoUrl extends BaseButtonAction {
  async action(interaction) {
    // 最新のユーザ情報を取得
    const currentUserInfo: TwitterApiUserInfo =
      await LLFansTwitterApiClient.getUserInfo();
    const twitterUrl: string = `https://twitter.com/${currentUserInfo.username}/`;

    const embed = new MessageEmbed();
    embed.setTitle("LL-Fans ツイッターアカウント情報");
    embed.setDescription(
      `[LL-Fansツイッターアカウント](${twitterUrl}) \n [過去情報](${process.env.DB_SHEET_URL})`
    );
    embed.setFields([
      {
        name: "■ ツイート数",
        value: `${currentUserInfo.public_metrics.tweet_count}`,
      },
      {
        name: "■ フォローしているユーザ",
        value: `${currentUserInfo.public_metrics.following_count}`,
      },
      {
        name: "■ フォロワー数",
        value: `${currentUserInfo.public_metrics.followers_count}`,
      },
    ]);

    await interaction.editReply({
      content: `LL-Fansのツイッター情報です`,
      components: [],
      embeds: [embed],
    });
  }
}
