const moment = require('moment');

/**
 * momentクラス
 */
 class MyMoment {
    
    /**
     * 日本時刻での「今」を取得する
     * @returns 
     */
    static getJSTnow() {
        // サーバのタイムゾーンが不明なので、UTCから9時間（日本の時差）を足して算出
        return moment.utc().add(9, 'hours');
    }
 }

 
 module.exports = MyMoment;