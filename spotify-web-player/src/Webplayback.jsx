import React, { useState, useEffect } from 'react';
import myAudio from './assets/TOM.mp3';
import GetNewSong from './GetNewSong';


const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}



function WebPlayback(props) {
    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [token, setToken] = useState(props.token);


    const [song_data, setSongData] = useState(null);
    const [audio_data, setAudioData] = useState(null);

    var done = 0

    const setupPlayer = (token) => {
        try {
            window.onSpotifyWebPlaybackSDKReady = () => {
                const player = new window.Spotify.Player({
                    name: 'Web Playback SDK',
                    getOAuthToken: cb => { cb(props.token); }, // use the token passed from App.js
                    volume: 0.5
                });
                setPlayer(player);

                console.log("Set Player");

                player.addListener('initialization_error', ({ message }) => {
                    console.error(message);
                });
              
                player.addListener('authentication_error', ({ message }) => {
                    console.error(message);
                });
              
                player.addListener('account_error', ({ message }) => {
                    console.error(message);
                });

                player.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                    player.getCurrentState().then(state => {
                        if (state) {
                            let x = state.track_window.current_track; // Store the current track
                            console.log('Current track', x); // Log the current track
                        } else {
                            console.log('No track is currently playing');
                        }
                    });

                    const connect_to_device = () => {
                        console.log("Changing Devices");
                        let change_device = fetch("https://api.spotify.com/v1/me/player", {
                            method: "PUT",
                            body: JSON.stringify({device_ids : [device_id],
                            play: true}),
                            headers: new Headers({
                                Authorization: "Bearer " + token
                            }),
                        }).then((response) => console.log(response));
                    };
                    connect_to_device();
                });

                player.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                });

                player.addListener('player_state_changed', (state => {
                    console.log("Added Listener for Player State Changed");
                    if (!state) {
                        return;
                    }
                    else {
                        console.log('Current track:', state.track_window.current_track);
                        console.log('Track name:', state.track_window.current_track.name);
                        console.log('Artist name:', state.track_window.current_track.artists[0].name);
                        console.log('Album name:', state.track_window.current_track.album.name);
                    }

                    setTrack(state.track_window.current_track);
                    setPaused(state.paused);


                    player.getCurrentState().then(state => {
                        (!state) ? setActive(false) : setActive(true)
                    });

                }));


                console.log("Added Listeners");


                player.connect().then(success => {
                    if (success) {
                      console.log('The Web Playback SDK successfully connected to Spotify!');
                    }
                    else {
                        console.log("Failed connection");
                        handleTokenExpiration();
                    }
                  })

            };
        } catch (error) {
            console.log("ERROR during WebPlaybackSDKReady: ", error)
            if (error.status === 401) {
                handleTokenExpiration();
            }
        };
    };

    const handleTokenExpiration = async () => {
        console.log("HERE6")
        try {
            const param = new URLSearchParams( {
                'refresh_token': props.refresh_token
            }).toString();

            const response = await fetch('/auth/refresh' + '?' + param); // Call your backend for a new token
            const data = await response.json();
            console.log("New Token: ", data.access_token)
            // Update the token and reconnect the player
            setToken(data.access_token);
            // setupPlayer(newToken); // Reconnect with the new token
            if(player) {
                player.disconnect(); // Disconnect the current player
            }

        } catch (error) {
            console.error('Failed to refresh token', error);
        }
    };


    const handleReceivedData = (newData) => {
        let image = newData['album_image'][0].url;
        let audio = newData['song_preview'];
        setSongData(image);
        setAudioData(audio)
        console.log("Updating Song_Data", image);
    }

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        console.log("Loaded spotify SDK")
        setupPlayer(token);
    }, [token]);



    return (
        <>
            <div className="container">
                <div className="main-wrapper">
                    {current_track ? <div>Now playing: {current_track.name}</div> : <div>Loading player...</div>}
                    <audio controls >
                        <source src={myAudio} type="audio/mpeg"/>
                        Your browser does not support the audio tag.
                    </audio>
                    <img src={current_track.album.images[0].url}
                        className="now-playing__cover" alt="" />
                    {audio_data && (
                    <audio controls autoplay="Play">
                        <source src={audio_data} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>)}
                    {song_data && <img src={song_data} alt="Passed from child" />}
                    <GetNewSong onDataReceived={handleReceivedData} />
                </div>
            </div>
        </>
    );
}

export default WebPlayback;

