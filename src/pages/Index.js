import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import CardList from '../components/CardList';
import SetsSidebar from '../components/SetsSideBar'; 
import CombinedSearchFilterBar from '../components/CombinedSearchFilterBar'; // Make sure the import path is correct
import { fetchSeries, fetchCardsForSet, searchCard } from '../services/api';
import '../styling/Index.css'; 

const Index = () => {
    const [sets, setSets] = useState([]);
    const [series, setSeries] = useState([]);
    const [selectedSetId, setSelectedSetId] = useState(null);
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    
   
    const availableTypes = allTypes;

    useEffect(() => {
        const loadSeries = async () => {
            try {
                const seriesData = await fetchSeries(); 
                setSeries(seriesData);
            } catch (error) {
                console.error("Cannot fetch series/sets", error);
            }
        };
        loadSeries(); 
    }, []);

    const handleSetSelect = async (setId) => {
        setSelectedSetId(setId); 
        try {
            const cardData = await fetchCardsForSet(setId);
            setCards(cardData); 
            setFilteredCards(cardData);
        } catch (error) {
            console.error("Error loading cards:", error);
            setCards([]); 
            setFilteredCards([]); 
        }
    };

    const handleSearch = async (searchTerm) => {
        try {
            const results = await searchCard(searchTerm); 
            setSearchResults(results);
        } catch (error) {
            console.error("Error searching Pokémon:", error);
            setSearchResults([]);
        }
    };

    const handleFilterByType = (types) => {
        if (types.length === 0) {
            return setFilteredCards(cards);
        }

        const filtered = cards.filter((card) =>
            types.some((type) => card.types.includes(type))
        );

        setFilteredCards(filtered); 
    };

    const handleSeriesSelect = (selectedSeries) => {
        setSets(selectedSeries.sets || []); 
    };

    useEffect(() => {
        const uniqueTypes = [...new Set(cards.flatMap((card) => card.types))];
        setAllTypes(uniqueTypes);
    }, [cards]);

    return (
        <div className="index-container">
            <div className="sidebar">
                <SetsSidebar
                    sets={sets}
                    series={series} 
                    onSetSelect={handleSetSelect} 
                    onSeriesSelect={handleSeriesSelect} 
                />
            </div>
            <div className="search-filter-container">
                <CombinedSearchFilterBar 
                    availableTypes={availableTypes} 
                    onSearch={handleSearch}
                    onFilter={handleFilterByType}
                    selectedTypes={selectedTypes}
                    setSelectedTypes={setSelectedTypes}
                />
            </div>
            <div className="cards-display-area">
                {searchResults.length > 0 ? (
                    <CardList cards={searchResults} /> 
                ) : (
                    <CardList cards={filteredCards} /> 
                )}
                {cards.length === 0 && (
                    <Typography variant="h6" component="div" align="center">
                        Select a set or search for a Pokémon to see the cards.
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default Index;
