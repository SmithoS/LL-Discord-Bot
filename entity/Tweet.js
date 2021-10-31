/**
 * ツイートのクラス
 */
 class Tweet {

    constructor(id, text) {
        this.id = id;
        this.text = text;
    }

    getId() {
        return this.id;
    }
    getText() {
        return this.text;
    }
}

module.exports = Tweet;