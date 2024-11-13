import React from 'react';

const GetNewSong = ({onDataReceived}) => {

    const handleButtonClick = async () => {
        console.log("Button Clicked requesting /song/random")
        try {
            const response = await fetch('/song/random'); 
            console.log(response)
            const data = await response.json();
            console.log(data)
            onDataReceived(data)
        } catch (error) {
            console.log("ERROR with /song/random : ", error)
        }
    };



    return (
        <div>
            <h1>Generate A New Song</h1>
            <img></img>
            <button onClick={handleButtonClick}>Press Me!</button>
        </div>
    );
};

export default GetNewSong;