import React from 'react';

const FilterBar = ({ onFilter, availableTypes, selectedTypes, setSelectedTypes }) => {
    const handleChange = (e) => {
        const value = e.target.value;

    
        if (value && !selectedTypes.includes(value)) {
            const newSelectedTypes = [...selectedTypes, value];
            setSelectedTypes(newSelectedTypes);
            onFilter(newSelectedTypes);
        }
    };

    const handleRemoveType = (typeToRemove) => {
        const updatedTypes = selectedTypes.filter((type) => type !== typeToRemove);
        setSelectedTypes(updatedTypes);
        onFilter(updatedTypes); 
    };

    return (
        <div>
            <select onChange={handleChange} defaultValue="">
                <option value="">Select a Type</option>
                {availableTypes.map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </select>
            <div>
                <strong>Selected Types:</strong>
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
