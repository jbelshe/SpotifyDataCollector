const express = require('express')
const dotenv = require('dotenv')
const request = require('request')
const { createProxyMiddleware } = require('http-proxy-middleware')

const song_catelog = require('./data.json');
//console.log(song_data);

const port = 5001
let access_token = ''
let refresh_token = ''
let expiration = ''

let auth_callback = "http://localhost:3000/auth/callback"

dotenv.config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET


var app = express()

var router = express.Router()

app.use('/', router)

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};



// User approves access for scope requests on spotify account
// Once approved, forwarded to /auth/callback
router.get('/auth/login', (req, res) => {
    console.log("ROUTER /AUTH/LOGIN")

    // Figure out what else can be in scope (space separated values)
    var scope = "streaming user-read-email user-read-private"

    var state = generateRandomString(16);

    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: auth_callback,
        state: state
    })
    console.log('Forwarding to: ' + 'https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString())
    // 
    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
});

"https://api.spotify.com/v1/tracks/"

app.get('/auth/callback', (req, res) => {

    console.log("ROUTER /AUTH/CALLBACK")
    var code = req.query.code  // Code is exchanged for an access token

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: auth_callback,  // only for validation (not actually redirected)
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("No Error in /auth/callback posting\n")
            expiration = body.expires_in
            refresh_token = body.refresh_token
            access_token = body.access_token;
            console.log("Access Token: ", body.access_token)
            console.log("Refresh Token:", refresh_token)
            console.log("Expiration:", expiration)
            res.redirect('/')
        }
    })
});


app.get('/auth/refresh', (req, res) => {
    console.log("App.get /auth/refresh")
    //var refresh_token = req.query.refresh_token
    var authOptions = {
        url: "https://accounts.spotify.com/api/token",
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          grant_type: 'refresh_token',
          refresh_token: refresh_token,
        },
        json: true
    }

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token,
                refresh_token = body.refresh_token || refresh_token;
            res.send({
                'access_token': access_token,
                'refresh_token': refresh_token
            })
        }
    })

})


app.get('/auth/token', (req, res) => {
    console.log("APP /auth/token")
    if (access_token != '') {
        console.log("Token Found = ", access_token)
        res.json({ access_token: access_token, expiration: expiration, refresh_token: refresh_token});
    } else {
        console.log("Access Token not found => 404")
        res.status(404).json({ access_token: access_token, error: 'Access token not found' });
    }
});


app.get('/song/random', (req, res) => {
    
    console.log("APP /song/random");
    song_index = Math.floor(Math.random()*song_catelog.length);
    song = song_catelog[song_index];

    const options = {
        url : "https://api.spotify.com/v1/tracks/" + song['song_id'],
        headers: {
            authorization : "Bearer " + access_token
        }
    };

    request.get(options, (error, response, body) => {
        if(error) {
            console.log("ERROR retrieving: ", song['name']);
            res.status(500).send("Error Retrieving Song: " + error)
        }
        else {
            if(response.statusCode == 200) {
                try {  
                    const data = JSON.parse(body);
                    //console.log(data);

                    artists_data = data['artists'];
                    artists = []
                    for (let i = 0; i < artists_data.length; i++) {
                        artists.push(artists_data[i]['name'])
                    }
                    song_data = {
                        song: data['name'],
                        album_name: data['album']['name'],
                        album_image: data['album']['images'],
                        artist_names: artists,
                        song_preview: data['preview_url'],
                        song_url: data['external_urls']['spotify']
                    };
                    console.log(song_data);
                    res.send(song_data);
                }
                catch (error) {
                    console.log("Error parsing JSON:", error)
                    res.status(500).send("Error parsing JSON: " + error)
                }
            }
            else {
                console.log("ERROR: ", response.statusCode);
                res.status(500).send("ERROR: response code ", response.statusCode)
            }
        }
    });
    


});








app.get('/callback', (req, res) => {
    res.send("CALLBACK OH FUCK OH SHIT")
});

app.get('/token', (req, res) => {
    res.send("TOKENS OH FUCK OH SHIT")
});


app.get('/', (req, res) => {
    console.log(req)
    res.send("EMPTY FAIL")
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// app.listen(port, () => {
//     console.log('Listening at http://localhost:${port}')
// });

