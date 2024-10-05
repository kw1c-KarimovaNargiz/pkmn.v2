import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import setBodyColor from './setBodyColor'
import Home from './pages/Home';
import Pokemons from './pages/Pokemons';
import Decks from './pages/Decks';


function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Pokemons" element={<Pokemons />} />
        <Route path="/Decks" element={<Decks />} />
      </Routes>
    </Router>
  );
}
setBodyColor({color: "#262626"})

export default App;
