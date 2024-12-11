import React, { useState } from 'react';
import { Box, styled } from '@mui/material';
import FilterDrawer from './FilterDrawer';
import { useLocation } from 'react-router-dom';


const DrawerPeek = styled(Box)(({ theme, isactive }) => ({
    position: 'fixed',
    top: 0,
    bottom: 0,
    width: '20%',
    
    backgroundColor: '#8A3F3F',
    cursor: isactive ? 'pointer' : 'default',
    zIndex: 0,
    opacity: isactive ? 100 : 50,
    transition: 'opacity 0.3s ease',
    '&:hover': {
        opacity: isactive ? 100 : 50, 
    }
}));

const PersistentFilterDrawer = ({ 
    availableTypes = [], 
    availableSubTypes = [], 
    onFilter,
    selectedSet,
    filterOwnedCards,
    setFilterOwnedCards 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedSubTypes, setSelectedSubTypes] = useState([]);
    const [isSortedByEvo, setIsSortedByEvo] = useState(false);
    
    const location = useLocation();
    
   //only usable in /pokedex
    const isPokedexSetRoute = /^\/pokedex\/[^/]+$/.test(location.pathname);
    
    const handlePeekClick = (e) => {
        e.stopPropagation();
        if (isPokedexSetRoute) {
            console.log('Opening drawer - Route match:', location.pathname);
            setIsOpen(true);
        } else {
            console.log('Not in pokedex set route:', location.pathname);
        }
    };

    return (
        <>
            <DrawerPeek 
                onClick={handlePeekClick}
                isactive={isPokedexSetRoute ? 1 : 0}
                sx={{
                    pointerEvents: isPokedexSetRoute ? 'auto' : 'none'
                }}
            />
            <FilterDrawer
                open={isOpen}
                onClose={() => setIsOpen(false)}
                onOpen={() => setIsOpen(true)}
                availableTypes={availableTypes}
                availableSubTypes={availableSubTypes}
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                selectedSubTypes={selectedSubTypes}
                setSelectedSubTypes={setSelectedSubTypes}
                isSortedByEvo={isSortedByEvo}
                setIsSortedByEvo={setIsSortedByEvo}
                onFilter={onFilter}
                selectedSet={selectedSet}
                filterOwnedCards={filterOwnedCards}
                setFilterOwnedCards={setFilterOwnedCards}
            />
        </>
    );
};

export default PersistentFilterDrawer;