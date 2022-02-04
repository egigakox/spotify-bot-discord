var axios = require('axios').default;
const {clientid, secret} = require('./config.json');
const qs = require('qs');
var tokens;

const getAuth = async () => {
    const clientId = clientid;
    const clientSecret = secret;

    const headers = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username: clientId,
            password: clientSecret,
        },
};
const data = { grant_type: 'client_credentials',};

try {
    const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        qs.stringify(data),
        headers
    );
    tokens = response.data.access_token;
    return response.data.access_token;
} catch (error) {
    console.log(error);
}
};
getAuth();
setTimeout(function () {
    console.log(tokens);
}, 200)

