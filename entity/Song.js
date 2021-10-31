/**
 * 楽曲のクラス
 */
class Song {

    constructor(id, name, artistName, seriesIds) {
        this.id = id;
        this.name = name;
        this.artistName = artistName;
        this.seriesIds = seriesIds;
    }

    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getArtistName() {
        return this.artistName;
    }
    getSeriesIds() {
        return this.seriesIds;
    }
}

module.exports = Song;