import React, { useState } from 'react';
import { Box, Chip, FormControlLabel, Checkbox, Autocomplete, TextField, Typography, Button } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const CombinedSearchFilterBar = ({
  availableTypes,
  availableSubTypes,
  selectedTypes,
  setSelectedTypes,
  selectedSubTypes,
  setSelectedSubTypes,
  isSortedByEvo,
  setIsSortedByEvo,
  onFilter,
  selectedSet, // New prop for the selected set
  setSelectedSet, // New prop for setting the selected set
  ownedCards, // New prop for owned cards
}) => {
  
  const handleTypeChange = (event, newValue) => {
    setSelectedTypes(newValue);
    onFilter(newValue, selectedSubTypes, isSortedByEvo, selectedSet);
  };

  const handleSubTypeChange = (event, newValue) => {
    setSelectedSubTypes(newValue);
    onFilter(selectedTypes, newValue, isSortedByEvo, selectedSet);
  };

  const handleSortByEvoChange = (event) => {
    const checked = event.target.checked;
    setIsSortedByEvo(checked);
    onFilter(selectedTypes, selectedSubTypes, checked, selectedSet);
  };

  const handleFilterOwnedCards = () => {
    // Call the onFilter function with the selected set to filter the owned cards
    onFilter(selectedTypes, selectedSubTypes, isSortedByEvo, selectedSet);
  };

  return (
    <Box sx={{ width: 300, padding: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Filter Options</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
        {selectedTypes.map((type) => (
          <Chip
            key={type}
            label={type}
            onDelete={() => {
              const updatedTypes = selectedTypes.filter((t) => t !== type);
              setSelectedTypes(updatedTypes);
              onFilter(updatedTypes, selectedSubTypes, isSortedByEvo, selectedSet);
            }}
            sx={{ margin: '4px' }}
          />
        ))}
      </Box>

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
        sx={{ width: '100%', mb: 2 }}
      />

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
        sx={{ width: '100%', mb: 2 }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={isSortedByEvo}
            onChange={handleSortByEvoChange}
            color="primary"
          />
        }
        label="Sort by Evolution"
      />

      <Button variant="contained" onClick={handleFilterOwnedCards}>
        Filter Owned Cards
      </Button>
    </Box>
  );
};

export default CombinedSearchFilterBar;