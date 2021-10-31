require('dotenv').config();
const axios = require('axios');

class LLNowApiClient {
    static async getRecetTweets(count) {

        // タイムラインのURL
        const endpointUrl = `https://api.twitter.com/2/users/${ process.env.LLNOW_USER_ID }/tweets`;

        const client = axios.create({
            headers: {
                'Authorization': `Bearer ${ process.env.TWITTER_BEARER_TOKEN }`,
                'Content-Type': 'application/json',
            },
            params: {
                max_results: count
            },
            timeout: 3000,
        });

        const response = await client.get(endpointUrl);
        return response.data;
    }
}


module.exports = LLNowApiClient;