// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import setBodyColor from './setBodyColor';
import Navbar from './components/Navbar'; 
import Home from './pages/Home';
import Decks from './pages/Decks';
import Index from './pages/Index'; 
function App() {
    return (
        <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Navbar />
                <Box sx={{ flexGrow: 1 }}>
                    <Container>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/Decks" element={<Decks />} />
                            <Route path="/Index" element={<Index />} />
                        </Routes>
                    </Container>
                </Box>
            </Box>
        </Router>
    );
}
setBodyColor({ color: "#262626" });
export default App;
