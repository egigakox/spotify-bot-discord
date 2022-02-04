var tokenik = '';
var axios = require('axios');
const { encode } = require('utf8');

var headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tokenik}`
};

var id1 = '5cj0lLjcoR7YOSnhnX0Po5';
var id2 = '41MozSoPIsD1dJM0CLPjZF'

axios.get(`https://api.spotify.com/v1/me/following/contains?type=artist&ids=${id1}%2C${id2}`, {headers}).then(response => {
    console.log(response.data)
    var id1folid2 = response.data[0];
    var id2folid1 = response.data[1];
    console.log('ID1 follow ID2 '+id1folid2);
    console.log('ID2 follow ID1 '+id2folid1);

});