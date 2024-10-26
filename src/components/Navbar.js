import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppBar, Toolbar, Button } from '@mui/material';
import { useUser } from '../pages/UserContext'; 

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Index', path: '/Index' },
  { name: 'My Collection', path: '/Collection' },
  { name: 'My decks', path: '/Decks' }
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const isLoggedIn = !!user; 
  
  const handleClick = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    logout(); 
    toast.success('You have been logged out');
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
