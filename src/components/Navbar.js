import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useUser } from '../pages/UserContext';
import SearchBar from './SearchBar';
import AccountMenu from './AccountMenu'; // Import the new AccountMenu component

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Index', path: '/Index' },
  // { name: 'My Collection', path: '/Collection' },
  // { name: 'My decks', path: '/Decks' }
];

function Navbar({ searchTerm, setSearchTerm, onSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const isLoggedIn = !!user;

  const handleClick = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  return (
    <AppBar sx={{ backgroundColor: '#8a3f3f', position: 'fixed', zIndex: '1100' }}>
      <Toolbar sx={{ display:'flex', justifyContent: 'space-between' }}>
        <Box sx={{display:'flex'}}>
          {pages.map((page) => (
            <Button
              key={page.name}
              onClick={() => handleClick(page.path)}
              sx={{ color: 'white' }}
            >
              {page.name}
            </Button>
          ))}
        </Box>
        <Box>
          <SearchBar onSearch={onSearch} />
        </Box>
        <Box/>
        
        <AccountMenu isLoggedIn={isLoggedIn} logout={logout} />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;