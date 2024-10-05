import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import setBodyColor from './setBodyColor'
import Home from './pages/Home';
import Pokemons from './pages/Pokemons';
import Decks from './pages/Decks';


function App() {


    return (

        <Router>
          <Box sx={{ display: 'flex' }}>
            <Navbar /> {/* Render the sidebar */}
            <Box sx={{ flexGrow: 1, p: 2 }}>
              <Container>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/Pokemons" element={<Pokemons />} />
                  <Route path="/Decks" element={<Decks />} />
                </Routes>
              </Container>
            </Box>
          </Box>
        </Router>
  
    );
  }
setBodyColor({color: "#262626"})

export default App;
