import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Library', path: '/Index' },
  { name: 'My decks', path: '/Decks' },
  { name: 'My Collection', path: '/Collection'
  }
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('authToken');

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

  const handleLogoutClick = () => {
    localStorage.removeItem('authToken'); 
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

        {isLoggedIn ? (
          <Button color="inherit" onClick={handleLogoutClick}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" onClick={handleLoginClick}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
