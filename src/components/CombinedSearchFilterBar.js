import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Box, Chip, FormControlLabel, Checkbox } from '@mui/material';
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

const CombinedSearchFilterBar = ({
  availableTypes,
  availableSubTypes,
  onFilter,
  onSearch,
  selectedTypes = [],
  setSelectedTypes,
  selectedSubTypes = [],
  setSelectedSubTypes,
  onSortByEvo,
  onRestoreOriginal,
  searchTerm,
  setSearchTerm,
}) => {

  const [selectedType, setSelectedType] = useState('');
  const [isSortedByEvo, setIsSortedByEvo] = useState(false);

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
      onFilter(newSelectedTypes, selectedSubTypes, isSortedByEvo);
    }
    setSelectedType(value);
  };

  const handleRemoveType = (typeToRemove) => {
    const updatedTypes = selectedTypes.filter((type) => type !== typeToRemove);
    setSelectedTypes(updatedTypes);
    onFilter(updatedTypes, selectedSubTypes);
  };

  const handleSubTypeChange = (event) => {
    const { value } = event.target;
    const newSelectedSubTypes = typeof value === 'string' ? value.split(',') : value;
    
    setSelectedSubTypes(newSelectedSubTypes);
    onFilter(selectedTypes, newSelectedSubTypes); 
  };

  const handleRemoveSubType = (subTypeToRemove) => {
    const updatedSubTypes = selectedSubTypes.filter((subtype) => subtype !== subTypeToRemove);
    setSelectedSubTypes(updatedSubTypes);
    onFilter(selectedTypes, updatedSubTypes); 
  };

  const handleSortByEvoChange = (event) => {
    const checked = event.target.checked;
    setIsSortedByEvo(checked);
  
    onFilter(selectedTypes, selectedSubTypes, checked);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginTop: '8px' }}>
      {/*search form*/}
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

      {/* filters */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
        {selectedTypes.map((type) => (
          <Chip
            key={type}
            label={type}
            onDelete={() => handleRemoveType(type)}
            sx={{ margin: '4px' }}
          />
        ))}

        {/* (energy)type filter */}
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="type-select-label">Type</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
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

        {/* subtype filter */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
          {selectedSubTypes.map((subtype) => (
            <Chip
              key={subtype}
              label={subtype}
              onDelete={() => handleRemoveSubType(subtype)}
              sx={{ margin: '4px' }}
            />
          ))}
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="subtype-select-label">Subtype</InputLabel>
            <Select
              labelId="subtype-select-label"
              id="subtype-select"
              multiple
              value={selectedSubTypes}
              label="Select a Subtype"
              onChange={handleSubTypeChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {availableSubTypes.map((subtype) => (
                <MenuItem key={subtype} value={subtype}>
                  {subtype}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/*sort by evo checkbox*/}
          <FormControlLabel
            control={
              <Checkbox
                checked={isSortedByEvo}
                onChange={handleSortByEvoChange}
                color="primary"
              />
            }
            label="Evo-sort"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CombinedSearchFilterBar;