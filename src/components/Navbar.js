import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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

  const handleLoginClick = () => {
    navigate('/login'); 
  };

  return (
    <AppBar sx={{ backgroundColor: '#8a3f3f', position: 'fixed', zIndex: '1100' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <div>
          {pages.map((page) => (
            <Button
              key={page.name}
              onClick={() => handleClick(page.path)}
              sx={{ color: 'white' }}
            >
              {page.name}
            </Button>
          ))}
        </div>

        {/* Login Icon */}
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleLoginClick} 
          aria-label="login"
        >
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
