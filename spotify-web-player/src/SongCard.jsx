import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Form, Row } from 'react-bootstrap'
import './SongCard.css';

const SongCard = ({ card_id }) => {


    /* TODO: 
        -Add control monitor in App.js so only one song place at a time
        -Add button on bottom that updates all four 
        -Add text form for user input guess
            -Create recommendation system
        -Switch press me button to a guess button
        
        Long term design:
        -Multiple guesses
        -Guess years for bonuses
    */

    const [isBlur, setBlur] = useState(true);
    const [song_data, setSongData] = useState(null);
    const [audio_data, setAudioData] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const initialLoad = useRef(false);
    const [myColor, setColor] = useState(null);
    const [buttonStyle, setButtonStyle] = useState(null);
    const [bandGuess, setBandGuess] = useState("");
    const toggleBlur = (isBlur) => {
        setBlur(!isBlur);
    };



    useEffect(() => {
        var temp_color = null;
        switch (card_id) {
            case 0:
                temp_color = "#61dafb";
                setColor("#61dafb");
                break;
            case 1:
                temp_color = "red";
                setColor("red");
                break;
            case 2:
                temp_color = "orange"
                setColor("green");
                break;
            case 3:
                temp_color = "green";
                setColor("orange");
                break;
            default:
                setColor("");
        }

        var buttonStyle = {
            backgroundColor: temp_color,
            color: "black"
        }
        setButtonStyle(buttonStyle);
        if (!initialLoad.current) {
            requestNewSong();
            initialLoad.current = true;
        }
    }, []);

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

    const checkGuess = (event) => {
        event.preventDefault();
        console.log("Submitted Value:", bandGuess)
    };

    const handleChange = (event) => {
        console.log("Updated Band Guess to: ", event.target.value);
        setBandGuess(event.target.value);
    };

    return (
        <>
            {(song_data && audio_data) ? (
                <div className="container position-relative">
                    <Row className="search-container d-flex flex-column justify-content-center align-items-center position-absolute w-100">
                        <Form className="d-flex" onSubmit={checkGuess}>
                            <Form.Group controlId="formBasicText">
                                <Form.Control className="guess-input" type="text" placeholder="Type Guess Here . . ." value={bandGuess} onChange={handleChange} />
                            </Form.Group>
                            <div className="button-container">
                                <Button variant="secondary" type="submit" onClick={handleButtonClick} style={buttonStyle}>Guess</Button>
                            </div>
                        </Form>
                    </Row>
                    <Row className="audio-container d-flex flex-column justify-content-center align-items-center position-absolute w-100">
                        {audio_data && (
                            <audio key={audio_data} controls>
                                <source src={audio_data} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>)}
                    </Row>
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