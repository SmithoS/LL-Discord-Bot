require('dotenv').config();
const axios = require('axios');

class LLFansTwitterDBClient {

    static async getLatestInfo() {
        const endpointUrl = process.env.DB_URL;

        const client = axios.create({
            params: {
                "key": process.env.DB_KEY,
                "method": "getLatestInfo"
            },
            timeout: 5000,
        });

        const response = await client.get(endpointUrl);
        return response.data.data;
    }


    static async saveInfo(
        formattedTime,
        tweetCount,
        followersCount,
        followingCount,
        latestFavTweetId,
        incrementFavCount
    ) {
        const endpointUrl = process.env.DB_URL;

        const client = axios.create({
            params: {
                "key": process.env.DB_KEY,
                "method": "saveInfo",
                "data": {
                    "formattedTime": formattedTime,
                    "tweetCount": tweetCount,
                    "followersCount": followersCount,
                    "followingCount": followingCount,
                    "latestFavTweetId": latestFavTweetId,
                    "incrementFavCount": incrementFavCount
                }
            },
            timeout: 8000,
        });

        const response = await client.post(endpointUrl);
        return response.message;
    }
}

module.exports = LLFansTwitterDBClient;