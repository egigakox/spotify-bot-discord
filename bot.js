const { Client, Collection, Intents, Message, IntegrationApplication, MessageEmbed } = require('discord.js');
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
const config = require('./config.json');
const {token, prefix, url,  clientid, secret} = config;
const qs = require('qs');
const axios = require('axios').default;
const base_64 = config.base64;
const refresh_token = config.refreshtoken;
var spotifytoken;

var spotifyinfo = [];

//
//powiadomienie o działaniu bota
//

client.on('ready', () => {
    console.log(`${client.user.tag} łączy się z discordem`);
    client.user.setActivity('your mom moaning', {type: "LISTENING"});
    refresh();
    setInterval(() => {
        refresh();
    }, 3590000); 
});

//
//pobieranie klucza do API
//

async function refresh() {
    const url = 'https://accounts.spotify.com/api/token'
    var data = {grant_type: "refresh_token", "refresh_token": refresh_token}
    const headerstoken = {
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        "Authorization": `Basic ${base_64}`,
    },
}
    const response = await axios.post(url,
        qs.stringify(data),
        headerstoken);
    spotifytoken = response.data.access_token;
    console.log("Odświeżono token")
}

//
//info o artyscie
//

function getArtistInformation(artist) {
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifytoken}`
    };

    axios.get(encodeURI(url+`/search?q=${artist}&type=artist&limit=1`), {headers}).then(response => {
        spotifyinfo = [];
       if(response.data.artists.items.length != 0 ) {
            spotifyinfo.push(response.data.artists.items[0].name);
            spotifyinfo.push(response.data.artists.items[0].followers.total);
            spotifyinfo.push(response.data.artists.items[0].genres);
            spotifyinfo.push(response.data.artists.items[0].id);
            if(typeof response.data.artists.items[0].images[0] === 'object') {
            spotifyinfo.push(response.data.artists.items[0].images[0].url);
            } if (typeof response.data.artists.items[0].images[0] === 'undefined') {
                spotifyinfo.push('https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png')
            }
        } else {
            spotifyinfo = [];
            spotifyinfo.push('Nie znaleziono takiego artysty w Spotify');
        }
   })       
}

//
//info o piosence
//

var songinfo = [];
function getSongInformation(songtitle) {
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifytoken}`
    };

    songinfo = [];
    axios.get(encodeURI(`https://api.spotify.com/v1/search?q=${songtitle}&type=track&limit=1`), {headers}).then(response => {
        if(response.data.tracks.items.length != 0 ) {
    songinfo.push(response.data.tracks.items[0].name);
    songinfo.push(response.data.tracks.items[0].album.release_date);
    songinfo.push(response.data.tracks.items[0].artists[0].name);
    songinfo.push(response.data.tracks.items[0].album.name);
    songinfo.push(response.data.tracks.items[0].external_urls.spotify);
    songinfo.push(response.data.tracks.items[0].album.images[0].url);
        } if (response.data.tracks.items.length == 0) {
            songinfo = [];
            songinfo.push('Nie znaleziono takiego utworu');
        }
})
}

//
//komendy 
//

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    if(interaction.commandName === 'test') {
        await interaction.reply({ content: ':sunglasses:', allowedMentions: {repliedUser: false}});
    } else if (interaction.commandName === 'pomoc') {
            const embedhelp = new MessageEmbed().setColor('0x00AE86').setTitle('Pomoc').setThumbnail('http://cdn.onlinewebfonts.com/svg/img_555509.png').setDescription(
                "Komendy \r\n /artist nazwa - podaje dane o wybranym artyście, w tym obrazek profilowy \r\n /song - podaje informacje o piosence oraz okładkę albumu \r\n /test - sprawdza czy bot jest online"
            ).setTimestamp()
            interaction.reply({embeds: [embedhelp]});
    } else if (interaction.commandName === 'artist') {
        var artist = interaction.options.getString('nazwa');

        getArtistInformation(artist)

        setTimeout(function () {
            if(spotifyinfo.length == 5) {
            var artistname = spotifyinfo[0];
            var followerscount = spotifyinfo[1];
            var genre= spotifyinfo[2];
            if (genre.length == 0) {
                genre = "No genre provided";
            }
            var id = spotifyinfo[3];
        }

            if(spotifyinfo.length == 5) {
            var embeddane = new MessageEmbed().setColor('#ffcbd9').setTitle('Informacje o '+artistname).setURL('https://open.spotify.com/artist/'+id).setThumbnail(spotifyinfo[4])
            .addFields(
                {name: 'Nazwa Artysty:', value: `${artistname}`},
                {name: 'Liczba obserwacji:', value: `${followerscount}`},
                {name: 'Gatunki:', value: `${genre}`}
            ).setFooter({text: 'Dane pobrane z API spotify', url:'https://open.spotify.com/artist/'+id})
            } else {
                var embeddane = new MessageEmbed().setColor('#FF2D00').setTitle(artist).addFields({name: 'Błąd', value: ':x:'+spotifyinfo[0]});
            }
            try {
                interaction.reply({embeds: [embeddane]});
            } catch (error) {
                console.error(error);
            }
        }, 200)
    } else if (interaction.commandName === 'song') {
        try {
            var songtitle = interaction.options.getString('tytuł');
            getSongInformation(songtitle);
            setTimeout(function() {
                if(songinfo.length == 6) {
                    var title = songinfo[0];
                    var release_date = songinfo[1];
                    var artist_name = songinfo[2];
                    var album_name = songinfo[3];
                    var uri = songinfo[4];
                    var image = songinfo[5];

                    var embedsong = new MessageEmbed().setColor('#1DB954').setTitle('Informacje o piosence: '+title).setURL(uri).setThumbnail(image)
                    .addFields(
                        {name: 'Tytuł: ', value: title},
                        {name: 'Wykonawca: ', value: artist_name},
                        {name: 'Album: ', value: album_name},
                        {name: 'Data wydania: ', value: release_date},
                    ).setFooter({text: 'Dane pobrane z API spotify'});
                    
                } else if (songinfo.length == 1) {
                    throw new SongNotFoundException();
                    //var embedsong = new MessageEmbed().setColor('RED').setTitle(songtitle).addFields({name: 'Błąd: ', value: ':x: '+songinfo[0]});
                }
                try {
                    interaction.reply({embeds: [embedsong]});
                } catch (error) {
                    console.error("Nie udało się wysłać embeda")
                }
            }, 200)
            } catch(SongNotFoundException) {
                interaction.reply({embers: [new MessageEmbed().setColor('RED').setTitle(songtitle).addFields({name: 'Błąd: ', value: ':x: '+songinfo[0]})]})
            }      
    }
});

//
//autorskie rozwiązanie
//

process.on('uncaughtException', function (error) {
    console.error("Wystąpił bład LIKE");
 });

client.login(token);