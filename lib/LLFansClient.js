const LLFansApiClient = require('../lib/LLFansApiClient');
const Song = require('../entity/Song');
const Setlist = require('../entity/Setlist');
const MyCache = require('../lib/MyCache');
const moment = require('moment');
const MyConst = require('../lib/MyConst');


class LLFansClient {

    static async getSongListRawJson() {
        // キャッシュ時刻（分）
        const CALL_API_INTERVAL_MINUTES = 180;


        let songListCache = MyCache.get(MyConst.CACHE_KEY_LLFANS_SONG_LIST);
        if (songListCache == null || moment().diff(songListCache.callMoment, 'minutes') > CALL_API_INTERVAL_MINUTES) {
            const data = await LLFansApiClient.getAllSongList();
            songListCache = {
                callMoment: moment(),
                songlist: data.props.pageProps.res.songList
            }
            MyCache.set(MyConst.CACHE_KEY_LLFANS_SONG_LIST, songListCache);

        }

        return songListCache.songlist;
    }

    static async getSongData(songid) {
        const data = await LLFansApiClient.getSongData(songid);
        const song = data.props.pageProps.res.song
        return new Song(
            song.id,
            song.name,
            song.artistVersion.artistName,
            song.seriesIds,
        );
    }

    static async getSetlists(songid) {
        const data = await LLFansApiClient.getSetlists(songid);
        let list = data.setlistList || [];

        // ソートされていないので発表準に並び替え
        list.sort((a, b) => {
            if (a.performanceSummary.date < b.performanceSummary.date) {
                return -1;
            } else if (a.performanceSummary.date > b.performanceSummary.date) {
                return 1;
            } else {
                return 0;
            }
        });

        const setlists = list.map((e) => {
            return new Setlist(
                e.id,
                e.performanceSummary.tourName,
                e.performanceSummary.concertName,
                e.performanceSummary.name,
                e.performanceSummary.date
            );
        });

        return setlists;
    }

}

module.exports = LLFansClient;