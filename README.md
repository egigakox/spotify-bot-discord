# spotify bot discord
 bot wyszukujący informacje o piosenkach i artystach poprzez api spotify

**wymagane biblioteki**:
- axios
- discord.js
- qs

**pliki wymagane do działania bota to**:
- bot.js
- deploy.js
- config.json zawierający:
  - token discorda, url api spotify, discord id oraz client id, secret, dane spotify zakodowane w base64 oraz refresh token
  - token: zakładka bot w discord developer portal
  - adres api spotify: https://api.spotify.com/v1
  - discordid: client id z zakładki oauth2 w developer portal
  - clientid: id z api spotify https://developer.spotify.com/dashboard/applications
  - secret: pod client id w dashboardzie spotify
  - base64 to clientid:secret zakodowane np na stronie https://www.base64encode.org/
  - refresh token pobierany z api spotify:
    ```
    curl -H "Authorization: Basic <dane base64>" -d grant_type=authorization_code -d code= <kod> -d redirect_uri=<musi być taki sam  jak w ustawieniach aplikacji spotify>             https://accounts.spotify.com/api/token
    ```
