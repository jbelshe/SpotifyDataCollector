import React, { useState, useEffect, useRef } from "react";
import './SongCard.css';

const SongCard = ({ }) => {

    const [isBlur, setBlur] = useState(true);
    const [song_data, setSongData] = useState(null);
    const [audio_data, setAudioData] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const initialLoad = useRef(false);

    const toggleBlur = (isBlur) => {
        setBlur(!isBlur);
    };


    const requestNewSong = async () => {
        console.log("Requesting New Song /song/random")
        try {
            setIsLoading(true)
            const response = await fetch('/song/random');
            console.log(response)
            const data = await response.json();
            console.log(data)
            let image = data['album_image'][0].url;
            let audio = data['song_preview'];
            setSongData(image);
            setAudioData(audio)
            console.log("Updating Song_Data", image);
        } catch (error) {
            console.log("ERROR with /song/random : ", error);
        }
        finally {
            console.log("Setting isLoading to false");
            setIsLoading(false);
        }
    };

    const handleButtonClick = async () => {
        console.log("Button Clicked requesting /song/random")
        try {
            if (isBlur) {
                toggleBlur(isBlur);
            }
            else {
                requestNewSong();
                toggleBlur(isBlur);
            }
        } catch (error) {
            console.log("ERROR with /song/random : ", error)
        }
    };

    useEffect(() => {
        if (!initialLoad.current) {
            requestNewSong();
            initialLoad.current = true;
        }
    }, []);

    return (
        <>
            {(song_data && audio_data) ? (
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <div className="audio-container d-flex flex-column justify-content-center align-items-center position-absolute w-100">
                        {audio_data && (
                            <audio key={audio_data} controls >
                                <source src={audio_data} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>)}
                        <div className="button-container">
                            <button onClick={handleButtonClick}>Press Me!</button>
                        </div>
                    </div>
                    <div className="img-container position-relative">
                        {song_data && <img src={song_data} className={isBlur ? "blurred" : "clear"} />}
                    </div>
                </div>)
                : (<div className="container d-flex flex-column justify-content-center align-items-center">
                    LOADING
                    </div>)
            }
        </>
    );
};


export default SongCard;