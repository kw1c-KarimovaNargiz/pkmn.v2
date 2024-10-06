import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Pokemons', path: '/Pokemons' },
  { name: 'My decks', path: '/Decks' },
  { name: 'Index',  path: '/Index' },
  // { name: 'TestPageSeries',  path: '/' },

];

function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer = (open) => () => {
    setIsOpen(open);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
      <IconButton onClick={toggleDrawer(true)} edge="start" sx={{ ml: 2, mt: 2 }}>
        <MenuIcon />
      </IconButton>
      
      <Drawer anchor="left" open={isOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250, height: '100%', backgroundColor: '#8a3f3f' }} 
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2 }}>
            <Typography variant="h4" sx={{ ml: 1 }}>
              Menu
            </Typography>
          </Box>
          <List>
            {pages.map((page) => (
              <ListItem button component={Link} to={page.path} key={page.name} sx={{ color: 'white', justifyContent: 'flex-start' }}>
                <ListItemIcon sx={{ color: 'white' }}>
                 
                </ListItemIcon>
                <ListItemText primary={page.name} sx={{ textAlign: 'left' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default Navbar;