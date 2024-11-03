import React from 'react';
import { Box, Chip, FormControlLabel, Checkbox, Autocomplete, TextField, Typography } from '@mui/material';
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
}) => {
  
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
              onFilter(updatedTypes, selectedSubTypes, isSortedByEvo);
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
    </Box>
  );
};

export default CombinedSearchFilterBar;
