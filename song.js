var tokenik = '';
var axios = require('axios');

var headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${tokenik}`
}
var trackname = "barka"

axios.get(`https://api.spotify.com/v1/search?q=${trackname}&type=track&limit=1`, {headers}).then(response => {
    var name = response.data.tracks.items[0].name;
    var preview = response.data.tracks.items[0].preview_url;
    var date = response.data.tracks.items[0].album.release_date;
    var artist = response.data.tracks.items[0].artists[0].name;
    var album_name = response.data.tracks.items[0].album.name;
    var track_url = response.data.tracks.items[0].uri
    console.log(response.data.tracks.items[0].external_urls.spotify)
    console.log(name, artist , album_name, track_url, date, preview)
})