import React, { useState, useRef, useCallback } from 'react'; // Import useRef
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
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
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
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  // Add explicit prop validation
  const isSearchFunction = typeof onSearch === 'function';
  console.log("SearchBar validation:", { 
      onSearchType: typeof onSearch, 
      isFunction: isSearchFunction 
  });

  const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
  };
  console.log("SearchBar received onSearch type:", typeof onSearch);
  const handleSearchSubmit = useCallback((event) => {
    event.preventDefault();
    console.log("Attempting search with term:", searchTerm);
    
    if (typeof onSearch === 'function' && searchTerm.trim()) {
        onSearch(searchTerm.trim());
        console.log("Search function called successfully");
    } else {
        console.error("Search validation failed:", {
            hasSearchFunction: typeof onSearch === 'function',
            searchTerm: searchTerm,
            onSearchType: typeof onSearch
        });
    }
    
    if (inputRef.current) {
        inputRef.current.blur();
    }
}, [searchTerm, onSearch]); 

  return (
      <Box sx={{ width: '100%' }}>
          <form onSubmit={handleSearchSubmit} style={{ width: '100%' }}>
              <Search>
                  <SearchIconWrapper>
                      <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                      placeholder="Search…"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      inputProps={{ 'aria-label': 'search' }}
                      inputRef={inputRef}
                      fullWidth
                  />
              </Search>
          </form>
      </Box>
  );
};

export default SearchBar;
