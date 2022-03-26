require('dotenv').config();
const axios = require('axios');

class LLFansTwitterApiClient {
    static async getUserInfo() {
        const endpointUrl = `https://api.twitter.com/2/users/${ process.env.LLFANS_TWITTER_ID }`;

        const client = axios.create({
            headers: {
                'Authorization': `Bearer ${ process.env.TWITTER_BEARER_TOKEN }`,
                'Content-Type': 'application/json',
            },
            params: {
                "user.fields": "public_metrics"
            },
            timeout: 3000,
        });

        const response = await client.get(endpointUrl);
        return response.data.data;
    }

    static async getFavoritesList(sinceTweetId) {
        let endpointUrl = 'https://api.twitter.com/1.1/favorites/list.json';
        let sendParams = {
            'user_id': process.env.LLFANS_TWITTER_ID,
            'include_entities': false
        }
        if (sinceTweetId != null && sinceTweetId != "") {
            sendParams['since_id'] = sinceTweetId;
        }

        const client = axios.create({
            headers: {
                'Authorization': `Bearer ${ process.env.TWITTER_BEARER_TOKEN }`,
                'Content-Type': 'application/json',
            },
            params: sendParams,
            timeout: 3000,
        });

        const response = await client.get(endpointUrl);
        return response.data;
    }
}

module.exports = LLFansTwitterApiClient;