/**
 * 定数クラス
 * javascriptの成約により、かなり無理矢理な形で実装
 */
export class MyConst {
  /** キャッシュのキー：LL Fans から楽曲一覧の取得結果 */
  static get CACHE_KEY_LLFANS_SONG_LIST(): string {
    return "CACHE_KEY_LLFANS_SONG_LIST";
  }

  /** キャッシュのキー：LL Now の前回API呼び出し時刻 */
  static get CACHE_KEY_LLNOW_BEFORE_CALL_MOMENT(): string {
    return "CACHE_KEY_LLNOW_BEFORE_CALL_MOMENT";
  }

  /** キャッシュのキー：LL Now の定期呼び出し処理（interval）のキー */
  static get CACHE_KEY_LLNOW_INTERVAL_KEY(): string {
    return "CACHE_KEY_LLNOW_INTERVAL_KEY";
  }

  /** キャッシュのキー：LL Now の強制停止の呼び出し処理（timeout）のキー */
  static get CACHE_KEY_LLNOW_TIMEOUT_KEY(): string {
    return "CACHE_KEY_LLNOW_TIMEOUT_KEY";
  }

  /** キャッシュのキー：LL Now でつぶやいた最新のツイート */
  static get CACHE_KEY_LLNOW_CURRENT_REPLY_TWEET(): string {
    return "CACHE_KEY_LLNOW_CURRENT_REPLY_TWEET";
  }

  /** LL Now の API 呼び出しクールダウン（分） */
  static get LLNOW_CALL_API_COOLDOWN_MINUTES(): number {
    return 1;
  }

  /** LL Now の 自動取得の間隔（分）。上記のクールダウンより長い必要あり　 */
  static get LLNOW_AUTO_SEND_INTERVAL_MINUTES(): number {
    return 1.5;
  }

  /** LL Now の 自動取得の強制終了（時間）。24より小さい値にすること（もっと大きな数字も行けるが、とりあえずは24時間以内に収める） */
  static get LLNOW_AUTO_SEND_FORCE_TERMINATE_HOURS(): number {
    return 5;
  }
}
