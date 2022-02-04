const axios = require('axios');
const base_64 = '';
const config = require('./config.json')
const refresh_token = config.refreshtoken;
const url = 'https://accounts.spotify.com/api/token'
const qs = require('qs')



var data = {grant_type: "refresh_token", "refresh_token": refresh_token}
const headers = {
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        "Authorization": `Basic ${base_64}`,
    },
}

async function refresh() {
    const response = await axios.post(url,
        qs.stringify(data),
        headers);
    //console.log(response.data)
    return response.data.access_token
}
refresh();

