import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export class LLFansApiClient {
  static async requestGet(url) {
    const client = axios.create({
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 3000,
    });

    const response = await client.get(url);
    return response.data;
  }

  static async getAllSongList() {
    // APIが無かったので、HTMLに埋め込まれたjsonを無理やり取得
    const url = process.env.LLFANS_SONG_LIST_URL;
    const response = (await this.requestGet(url)) as string;
    const regexp =
      /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/;
    const json = regexp.exec(response);
    return JSON.parse(json[1]);
  }

  static async getSongData(id) {
    // APIが無かったので、HTMLに埋め込まれたjsonを無理やり取得
    let url = process.env.LLFANS_SONG_URL;
    url = url.replace("____id____", id);
    const response = (await this.requestGet(url)) as string;
    const regexp =
      /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/;
    const json = regexp.exec(response);
    return JSON.parse(json[1]);
  }

  static async getSetlists(id) {
    let url = process.env.LLFANS_SETLIST_API_URL;
    url = url.replace("____id____", id);
    return await this.requestGet(url);
  }
}
