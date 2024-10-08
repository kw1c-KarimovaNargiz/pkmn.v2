import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const FilterBar = ({ onFilter, availableTypes, selectedTypes, setSelectedTypes }) => {
    const [selectedType, setSelectedType] = React.useState('');

    const handleChange = (event) => {
        const value = event.target.value;

        //add type to filtermode
        if (value && !selectedTypes.includes(value)) {
            const newSelectedTypes = [...selectedTypes, value];
            setSelectedTypes(newSelectedTypes);
            onFilter(newSelectedTypes);
        }

        setSelectedType(value);
    };

    //remove type in filtermode
    const handleRemoveType = (typeToRemove) => {
        const updatedTypes = selectedTypes.filter((type) => type !== typeToRemove);
        setSelectedTypes(updatedTypes);
        onFilter(updatedTypes);
    };

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 120,}} size="small">
                <InputLabel id="filter-select-label">Type</InputLabel>
                <Select
                    labelId="filter-select-label"
                    id="filter-select"
                    value={selectedType}
                    label="Select a Type"
                    onChange={handleChange}
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
            <div>
                {selectedTypes.map((type) => (
                    <span key={type} style={{ margin: '0 5px' }}>
                        {type} <button onClick={() => handleRemoveType(type)}>x</button>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default FilterBar;
