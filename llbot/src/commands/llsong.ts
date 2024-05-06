import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { LLFansClient } from "../lib/LLFansClient";
import { MyMoment } from "../lib/MyMoment";
import Fuse from "fuse.js";
import moment from "moment";

module.exports = {
  category: "llfans commands",
  description:
    "現在停止中（LL-Fansから楽曲情報を取得するコマンドです。LL-Fansの調整中につき一時停止中。）",
  //    descriptionExAry: ['パラメータに曲名または曲名の一部を指定してください。'],
  testOnly: true,
  slash: true,
  expectedArgs: "<songName>",
  minArgs: 1,
  maxArgs: 1,
  syntaxError: "",
  callback: async ({ args, channel, interaction }) => {
    const NOT_ANY_BUTTON_ID = "dummy";

    // 処理に時間がかかるだろうから deferReply で一旦返答しておく
    await interaction.deferReply();

    await interaction.editReply({
      content:
        "申し訳ありませんが、負荷軽減用のAPI作成中につき動作を一時停止中です。",
    });

    // // 楽曲候補を取得
    // const songName = args[0];
    // let candidates = await getCandidates(songName);
    // if (candidates.length > 4) {
    //     // 候補が多すぎるとボタンに表示できないので絞っておく
    //     candidates = candidates.slice(0, 4);
    // }

    // if (candidates.length === 0) {
    //     // 候補の楽曲が見つからない場合は残念
    //     await interaction.editReply({
    //         content: `${ songName }に一致しそうな楽曲が見つかりません。`
    //     });

    // } else if (candidates.length === 1) {
    //     // １件のみ見つかったなら、それであっているだろうので返答
    //     await replySong(candidates[0].id, interaction);

    // } else {
    //     // 複数の候補が見つかった場合は候補を表示して確認する
    //     const row = new MessageActionRow();
    //     candidates.forEach((e) => {
    //         row.addComponents(
    //             new MessageButton()
    //                 .setCustomId(e.id)
    //                 .setLabel(e.name)
    //                 .setStyle('PRIMARY')
    //         );
    //     });
    //     row.addComponents(
    //         new MessageButton()
    //             .setCustomId(NOT_ANY_BUTTON_ID)
    //             .setLabel('どれでもない')
    //             .setStyle('SECONDARY')
    //     );

    //     await interaction.editReply({
    //         content: `「${ songName }」の候補を表示します`,
    //         components: [row]
    //     });

    //     // ボタンの入力受付を登録
    //     const filter = (buttonInteration) => {
    //         return interaction.user.id === buttonInteration.user.id
    //     };
    //     const collector = channel.createMessageComponentCollector({
    //         filter,
    //         max: 1,
    //         time: 1000 * 15
    //     });
    //     collector.on('end', async (collection) => {
    //         const selectButton = collection.first();
    //         let songId = '';
    //         if (selectButton != null) {
    //             songId = selectButton.customId;
    //         }

    //         if (songId === '') {
    //             await interaction.editReply({
    //                 content: '時間切れ。再度問い合わせてしてください。',
    //                 components: []
    //             });
    //         } else if (songId === NOT_ANY_BUTTON_ID) {
    //             await interaction.editReply({
    //                 content: `楽曲が見つかりませんか？「${ songName }」でなく、より曲名を正確に入力してください。`,
    //                 components: []
    //             });
    //         } else {
    //             await replySong(songId, interaction);
    //         }
    //     });
    // }
  },
};

/**
 * 入力された楽曲名から、可能性のある候補を取得
 * @param {*} songName
 * @returns
 */
async function getCandidates(songName) {
  // // 曲名一覧からあいまい検索
  // const list = await LLFansClient.getSongListRawJson();
  // const options = {
  //   threshold: 0.6,
  //   keys: ["name"],
  // };
  // const fuse = new Fuse(list, options);
  // const searchResult = fuse.search(songName);
  // // 検索結果から楽曲情報だけ取り出す。
  // let candidates = searchResult.map((e) => {
  //   return {
  //     id: String(e.item.id),
  //     name: e.item.name,
  //   };
  // });
  // return candidates;
}

/**
 * 指定されたIDがいつ歌唱されたか検索してリプライする
 * @param {*} songId
 * @param {*} interaction
 */
async function replySong(songId, interaction) {
  // 曲情報の取得
  const song = await LLFansClient.getSongData(songId);

  // セットリストの検索
  const setlists = await LLFansClient.getSetlists(songId);
  let lastSetlist = null;
  if (setlists.length > 0) {
    lastSetlist = setlists[setlists.length - 1];
  }

  const embed = new MessageEmbed();
  embed.setTitle(song.getName());
  embed.setDescription(song.getArtistName());
  switch (song.getSeriesIds()[0]) {
    case 1: // μ's
      embed.setColor("LUMINOUS_VIVID_PINK");
      break;
    case 2: // Aqours
      embed.setColor("BLUE");
      break;
    case 3: // 虹学
      embed.setColor("GOLD");
      break;
    case 4: // Liella!
      embed.setColor("PURPLE");
      break;
    default:
      embed.setColor("DEFAULT");
      break;
  }
  if (lastSetlist == null) {
    embed.setFields([
      {
        name: "最新の披露",
        value: "まだ披露されていません。",
      },
    ]);
  } else {
    let performanceStageDisplayName = "";
    performanceStageDisplayName += lastSetlist.getTourName();
    performanceStageDisplayName +=
      lastSetlist.getConcertName() == "-"
        ? ""
        : `【${lastSetlist.getConcertName()}】`;
    performanceStageDisplayName +=
      lastSetlist.getName() == "-" ? "" : `（${lastSetlist.getName()}）`;
    embed.setFields([
      {
        name: "最新の披露と日付",
        value: `${performanceStageDisplayName}\n ${lastSetlist
          .getDate()
          .format("YYYY/MM/DD")}（${MyMoment.getJSTnow().diff(
          lastSetlist.getDate(),
          "days"
        )}日前）`,
      },
      {
        name: "披露回数",
        value: `${setlists.length}回`,
      },
    ]);
  }

  // リプライ
  await interaction.editReply({
    content: "LL-Fansより楽曲検索",
    components: [],
    embeds: [embed],
  });
}
