import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import setBodyColor from './setBodyColor'
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Pokemons from './pages/Pokemons';
import Decks from './pages/Decks';
import Sets from './pages/Sets';
import Cards from './pages/Cards'; 

function App() {
    return (
        <Router>
            <Box sx={{ display: 'flex' }}>
                <Navbar />
                <Box sx={{ flexGrow: 1, p: 2 }}>
                    <Container>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/Pokemons" element={<Pokemons />} />
                            <Route path="/Decks" element={<Decks />} />
                            <Route path="/sets" element={<Sets />} />
                            <Route path="/sets/:setName" element={<Cards />} />
                        </Routes>
                    </Container>
                </Box>
            </Box>
        </Router>
    );
}
setBodyColor({color: "#262626"})
export default App;
