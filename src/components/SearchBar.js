import React, { useState, useRef } from 'react'; // Import useRef
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '100%',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.up('sm')]: {
    width: '100%',
  },
}));


const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  color: '#3c3c3c',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#1f1f1f',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      '&:focus': {
        width: '100%',
      },
    },
  },
}));

const SearchBar = ({
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null); 

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  console.log('searchbar onsearch', onSearch)
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Submitted:', searchTerm)
    console.log(typeof onSearch)
    console.log('', onSearch)
    onSearch(searchTerm);
    if (inputRef.current) {
      inputRef.current.blur(); 
    }
  };

  return (
    <Box>
      <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex'}}>
        <Search sx={{ borderStyle: 'none', width: '100%' }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            value={searchTerm}
            onChange={handleSearchChange}
            inputProps={{ 'aria-label': 'search' }}
            inputRef={inputRef} 
          />
        </Search>
      </form>
    </Box>
  );
};

export default SearchBar;