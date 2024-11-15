import React, { useState, useEffect } from 'react';
import SongCard from './SongCard'
import "./index.css" 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Button} from 'react-bootstrap';

function App() {


  const RefreshCards = () => {
    
  };
 
  return (
    <>
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={6} md={3} className="p-2">
            <div className="songcard-container" id="songcard0">
              <SongCard card_id={0}></SongCard>
            </div>
          </Col>           
          <Col xs={12} sm={6} md={3} className="p-2">
            <div className="songcard-container" id="songcard1">
              <SongCard card_id={1}></SongCard>
            </div>
          </Col> 
        </Row> 
        <Row className="justify-content-center">
          <Col xs={12} sm={6} md={3} className="p-2">
            <div className="songcard-container" id="songcard2">
              <SongCard card_id={2}></SongCard>
            </div>
          </Col>           
          <Col xs={12} sm={6} md={3} className="p-2">
            <div className="songcard-container" id="songcard3">
              <SongCard card_id={3}></SongCard>
            </div>
          </Col> 
        </Row> 
        <Row className='justify-content-center'>
          <Col md={3} className='d-flex justify-content-center'>
            <Button onClick={RefreshCards}>Refresh</Button>
          </Col> 
        </Row>
      </Container>
    </>
  );
}

export default App;
