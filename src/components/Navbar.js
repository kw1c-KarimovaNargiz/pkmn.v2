import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Pokemons', path: '/Index' },
  { name: 'My decks', path: '/Decks' },
 
];

function Navbar() {
  return (
    <AppBar  sx={{ backgroundColor: '#8a3f3f' , position: 'fixed', zIndex: '1100'}}>
      <Toolbar sx={{ justifyContent: 'start' }}>
        {/* <Typography variant="h6" sx={{ flexGrow: 1 }}>
          User menu incoming
        </Typography> */}
        {pages.map((page) => (
          <Button
            key={page.name}
            component={Link}
            to={page.path}
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
