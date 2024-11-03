import * as React from 'react';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { styled } from '@mui/system';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AccountMenu = ({ isLoggedIn, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out');
    navigate('/login');
  };

  const handleCollection = () => {
    navigate('/collection');
  };

  const handleDecks = () => {
    navigate('/decks')
  }


  if (!isLoggedIn) {
    return (
      <IconButton onClick={() => navigate('/login')}>
        <AccountCircleIcon sx={{ color: 'white' }} />
      </IconButton>
    );
  }

  return (
    <Dropdown>
      <MenuButton>
        <AccountCircleIcon sx={{ color: 'white' }} />
      </MenuButton>
      <Menu 
        slots={{ listbox: Listbox }}
        slotProps={{
          listbox: {
            className: 'menu-listbox'
          }
        }}
      >
        <MenuItem onClick={handleCollection}>My Collection</MenuItem>
        <MenuItem onClick={handleDecks}>My Decks</MenuItem>
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Menu>
    </Dropdown>
  );
};

//icon
const IconButton = styled('button')`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
  }
`;
//list
const Listbox = styled('ul')`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 200px;
  border-radius: 8px;
  overflow: auto;
  outline: 0;
  background: :  #303740;
  color: #999;
  box-shadow: 0px 4px 6px rgba(0,0,0, 0.50);
  z-index: 1;
`;
//items
const MenuItem = styled(BaseMenuItem)`
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;
  color: #999;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:focus {
    background-color: rgba(255, 255, 255, 0.1);
    outline: none;
  }

  &.${menuItemClasses.disabled} {
    opacity: 0.5;
  }
`;

const MenuButton = styled(BaseMenuButton)`
  background: transparent;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
  }
`;

export default AccountMenu;