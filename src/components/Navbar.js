import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Pokemons', path: '/Index' },
  { name: 'My decks', path: '/Decks' },
];

function Navbar() {
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const handleClick = (path) => {
    if (location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path);
    }
  };

  return (
    <AppBar sx={{ backgroundColor: '#8a3f3f', position: 'fixed', zIndex: '1100' }}>
      <Toolbar sx={{ justifyContent: 'start' }}>
        {pages.map((page) => (
          <Button
            key={page.name}
            onClick={() => handleClick(page.path)} 
            sx={{ color: 'white' }}
          >
            {page.name}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
