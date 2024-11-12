import React, { useState, useEffect } from 'react';
import WebPlayback from './Webplayback';
import Login from './Login';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [refresh_token, setRefresh] = useState('');
  const [expiration_time, setExpiry] = useState('');

  useEffect(() => {
    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      setToken(json.access_token);
      setRefresh(json.refresh_token);
      setExpiry(json.expiration_time);
      console.log("Access Token:", json.access_token)
      console.log("Refresh Token:", json.refresh_token)
      console.log("Expiration Time:", json.expiration_time)
    }

    getToken();
    
  }, []);

  return (
    <>
      { token === '' ? <Login /> : <WebPlayback token={token} refresh_token={refresh_token}/> }
    </>
  );
}

export default App;
