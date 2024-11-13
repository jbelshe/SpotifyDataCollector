import React, { useState, useEffect } from 'react';
import SongCard from './SongCard'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col} from 'react-bootstrap';

function App() {
 
  return (
    <>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={6} md={3} className="p-2">
            <div className="songcard-container">
              <SongCard></SongCard>
            </div>
          </Col>           
          <Col xs={12} sm={6} md={3} className="p-2">
            <div className="songcard-container">
              <SongCard></SongCard>
            </div>
          </Col> 
        </Row> 
        <Row className="justify-content-center">
          <Col xs={12} sm={6} md={3} className="p-2">
            <div className="songcard-container">
              <SongCard></SongCard>
            </div>
          </Col>           
          <Col xs={12} sm={6} md={3} className="p-2">
            <div className="songcard-container">
              <SongCard></SongCard>
            </div>
          </Col> 
        </Row> 
      </Container>
    </>
  );
}

export default App;
