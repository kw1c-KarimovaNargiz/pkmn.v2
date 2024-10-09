import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Box, Chip, Button } from '@mui/material'; 
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
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

const CombinedSearchFilterBar = ({ availableTypes, onFilter, onSearch, selectedTypes = [], setSelectedTypes, onSortByEvo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  const handleTypeChange = (event) => {
    const value = event.target.value;

    if (value && !selectedTypes.includes(value)) {
      const newSelectedTypes = [...selectedTypes, value];
      setSelectedTypes(newSelectedTypes);
      onFilter(newSelectedTypes);
    }
    setSelectedType(value);
  };

  const handleRemoveType = (typeToRemove) => {
    const updatedTypes = selectedTypes.filter((type) => type !== typeToRemove);
    setSelectedTypes(updatedTypes);
    onFilter(updatedTypes);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginTop: '8px' }}>
      <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            value={searchTerm}
            onChange={handleSearchChange}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
      </form>

      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
        {selectedTypes.map((type) => (
          <Chip
            key={type}
            label={type}
            onDelete={() => handleRemoveType(type)}
            sx={{ margin: '4px' }}
          />
        ))}

        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="filter-select-label">Type</InputLabel>
          <Select
            labelId="filter-select-label"
            id="filter-select"
            value={selectedType}
            label="Select a Type"
            onChange={handleTypeChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {availableTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={onSortByEvo}>
    Sort by Evo
</Button>
      </Box>
    </Box>
  );
};

export default CombinedSearchFilterBar;
