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



    const handleReceivedData = (newData) => {
        let image = newData['album_image'][0].url;
        let audio = newData['song_preview'];
        setSongData(image);
        setAudioData(audio)
        console.log("Updating Song_Data", image);
    }





    return (
        <>
            <div className="container">
                <div className="main-wrapper">
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

