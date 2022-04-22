/**
 * キャッシュクラス。
 * javascriptの成約により、かなり無理矢理な形で実装。
 * キャッシュといいつつインメモリで持つため、あまり巨大なデータは持たないようにすること。
 */
export class MyCache {
  private static cache: object = {};

  static get(key: string): any {
    if (typeof this.cache === "undefined" || this.cache == null) {
      this.cache = {};
    }
    let val = this.cache[key];
    if (typeof val === "undefined") {
      val = null;
    }
    return val;
  }

  static set(key: string, value: any) {
    if (typeof this.cache === "undefined" || this.cache == null) {
      this.cache = {};
    }
    this.cache[key] = value;
  }

  static clear(key: string) {
    if (typeof this.cache === "undefined" || this.cache == null) {
      return;
    }
    delete this.cache[key];
  }
}
