import { LLFansApiClient } from "../lib/LLFansApiClient";
import { Song } from "../entity/Song";
import { Setlist } from "../entity/Setlist";
import { MyCache } from "../lib/MyCache";
import { MyMoment } from "../lib/MyMoment";
import { MyConst } from "../lib/MyConst";

export class LLFansClient {
  static async getSongListRawJson() {
    // キャッシュ時刻（分）
    const CALL_API_INTERVAL_MINUTES = 180;

    let songListCache = MyCache.get(MyConst.CACHE_KEY_LLFANS_SONG_LIST);
    if (
      songListCache == null ||
      MyMoment.getJSTnow().diff(songListCache.callMoment, "minutes") >
        CALL_API_INTERVAL_MINUTES
    ) {
      const data = await LLFansApiClient.getAllSongList();
      songListCache = {
        callMoment: MyMoment.getJSTnow(),
        songlist: data.props.pageProps.res.songList,
      };
      MyCache.set(MyConst.CACHE_KEY_LLFANS_SONG_LIST, songListCache);
    }

    return songListCache.songlist;
  }

  static async getSongData(songid) {
    const data = await LLFansApiClient.getSongData(songid);
    const song = data.props.pageProps.res.song;
    return new Song(
      song.id,
      song.name,
      song.artistVersion.artistName,
      song.seriesIds
    );
  }

  static async getSetlists(songid) {
    let setlists: Array<any> = [];
    // const data = await LLFansApiClient.getSetlists(songid);
    // let list = data.setlistList || [];

    // // ソートされていないので発表準に並び替え
    // list.sort((a, b) => {
    //   if (a.performanceSummary.date < b.performanceSummary.date) {
    //     return -1;
    //   } else if (a.performanceSummary.date > b.performanceSummary.date) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // });

    // const setlists = list.map((e) => {
    //   return new Setlist(
    //     e.id,
    //     e.performanceSummary.tourName,
    //     e.performanceSummary.concertName,
    //     e.performanceSummary.name,
    //     e.performanceSummary.date
    //   );
    // });

    return setlists;
  }
}
