import React, { useState, useEffect } from "react";
import GetNewSong from './GetNewSong';
import './SongCard.css';

const SongCard = ({ }) => {


    const [song_data, setSongData] = useState(null);
    const [audio_data, setAudioData] = useState(null);

    const handleReceivedData = (newData) => {
        let image = newData['album_image'][0].url;
        let audio = newData['song_preview'];
        setSongData(image);
        setAudioData(audio)
        console.log("Updating Song_Data", image);
    }

    return (
        <div className="container">
            {audio_data && (
                <audio controls autoplay="Play">
                    <source src={audio_data} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>)}
            {song_data && <img src={song_data} alt="Passed from child" />}
            <GetNewSong onDataReceived={handleReceivedData} />
        </div>
    );
};


export default SongCard;