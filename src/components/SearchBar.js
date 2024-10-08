// src/components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm); 
    };

    return (
        <form onSubmit={handleSearchSubmit}>
            <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                    padding: '10px',
                    fontSize: '16px',
                    width: '100%',
                    boxSizing: 'border-box',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                }}
            />
            <button type="submit" style={{ display: 'none' }}>Search</button>
        </form>
    );
};

export default SearchBar;
