import React, { useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import { Box, Chip, FormControlLabel, Checkbox, Autocomplete, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
  searchTerm,
  setSearchTerm,
}) => {
  const [isSortedByEvo, setIsSortedByEvo] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  const handleTypeChange = (event, newValue) => {
    setSelectedTypes(newValue);
    onFilter(newValue, selectedSubTypes, isSortedByEvo);
};

  const handleSubTypeChange = (event, newValue) => {
    setSelectedSubTypes(newValue);
    onFilter(selectedTypes, newValue, isSortedByEvo);
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
          {selectedTypes.map((type) => (
         <Chip
         key={type}
         label={type}
         onDelete={() => {
             const updatedTypes = selectedTypes.filter((t) => t !== type);
             setSelectedTypes(updatedTypes);
             onFilter(updatedTypes, selectedSubTypes, isSortedByEvo); // Update the filter here
         }}
         sx={{ margin: '4px' }}
     />
          ))}
        </Box>

        {/* (energy)type filter with checkboxes */}
        <Autocomplete
          multiple
          id="checkboxes-types"
          options={availableTypes}
          disableCloseOnSelect
          value={selectedTypes}
          onChange={handleTypeChange}
          getOptionLabel={(option) => option}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </li>
          )}
          renderTags={() => null} 
          renderInput={(params) => (
            <TextField {...params} label="Type" placeholder="Select types" />
          )}
          sx={{ width: 200, marginRight: 2 }}
        />

        {/* subtype filter with checkboxes */}
        <Autocomplete
          multiple
          id="checkboxes-subtypes"
          options={availableSubTypes}
          disableCloseOnSelect
          value={selectedSubTypes}
          onChange={handleSubTypeChange}
          getOptionLabel={(option) => option}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Subtype" placeholder="Select subtypes" />
          )}
          sx={{ width: 200 }}
        />

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
          sx={{ marginLeft: 2 }}
        />
      </Box>
    </Box>
  );
};

export default CombinedSearchFilterBar;
