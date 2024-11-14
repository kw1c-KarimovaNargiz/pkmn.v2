import {useCallback} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useUser } from '../pages/UserContext';
import SearchBar from './SearchBar';
import AccountMenu from './AccountMenu';

const pages = [
    { name: 'Home', path: '/' },
    { name: 'Index', path: '/Index' },
];

const Navbar = ({ onSearch }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const isLoggedIn = !!user;

    // Add validation and wrapping of the search function
    const handleSearch = useCallback((term) => {
      console.log("Navbar handling search for term:", term);
      if (typeof onSearch === 'function') {
          onSearch(term);
      } else {
          console.error("Search function not properly passed to Navbar", {
              onSearchType: typeof onSearch,
              onSearch
          });
      }
  }, [onSearch]);

    const handleClick = (path) => {
        if (location.pathname !== path) {
            navigate(path);
        }
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
                
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', maxWidth: '400px' }}>
                    <SearchBar onSearch={handleSearch} />
                </Box>

                <AccountMenu isLoggedIn={isLoggedIn} logout={logout} />
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;