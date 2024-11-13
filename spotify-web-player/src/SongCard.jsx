import React, { useState, useEffect } from "react";
import GetNewSong from './GetNewSong';
import './SongCard.css';

const SongCard = ({ }) => {


    const [song_data, setSongData] = useState(null);
    const [audio_data, setAudioData] = useState(null);


    const requestNewSong = async () => {
        console.log("Requesting New Song /song/random")
        try {
            const response = await fetch('/song/random'); 
            console.log(response)
            const data = await response.json();
            console.log(data)
            handleReceivedData(data)
        } catch (error) {
            console.log("ERROR with /song/random : ", error)
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
        requestNewSong();
    }, [] );

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center">
            <div class="overlay d-flex flex-column justify-content-center align-items-center position-absolute w-100">
                {audio_data && (
                    <audio controls autoplay="Play">
                        <source src={audio_data} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>)}
                <div class="button-container">
                    <GetNewSong onDataReceived={handleReceivedData} />
                </div>
            </div>
            <div class="img-container position-relative">
                {song_data && <img src={song_data} className="blurred"/>}
            </div>
        </div>
    );
};


export default SongCard;