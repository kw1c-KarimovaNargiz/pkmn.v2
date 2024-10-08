// src/pages/Index.js
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import CardList from '../components/CardList';
import SetsSidebar from '../components/SetsSideBar'; 
import SearchBar from '../components/SearchBar'; 
import { fetchSeries, fetchCardsForSet, searchCard } from '../services/api';
import '../styling/Index.css'; 

const Index = () => {
    const [sets, setSets] = useState([]); 
    const [series, setSeries] = useState([]); 
    const [selectedSetId, setSelectedSetId] = useState(null); 
    const [cards, setCards] = useState([]); 
    const [searchResults, setSearchResults] = useState([]);
  
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

    //fetch card when set selected
    const handleSetSelect = async (setId) => {
        setSelectedSetId(setId); 
        try {
            const cardData = await fetchCardsForSet(setId);
            setCards(cardData); 
        } catch (error) {
            console.error("Error loading cards:", error);
            setCards([]); 
        }
    };

    //handle search
    const handleSearch = async (searchTerm) => {
        try {
            const results = await searchCard(searchTerm); 
            setSearchResults(results); 
        } catch (error) {
            console.error("Error searching Pokémon:", error);
            setSearchResults([]); 
        }
    }

   //series selection
    const handleSeriesSelect = (selectedSeries) => {
        setSets(selectedSeries.sets || []); 
    };

    return (
        <div className="index-container">
            <div className="sidebar">
                <SearchBar onSearch={handleSearch} />
                <SetsSidebar
                    sets={sets}
                    series={series} 
                    onSetSelect={handleSetSelect}
                    onSeriesSelect={handleSeriesSelect} 
                />
            </div>
            <div className="cards-display-area">
                {searchResults.length > 0 ? (
                    <CardList cards={searchResults} /> 
                ) : selectedSetId ? (
                    <CardList cards={cards} /> 
                ) : (
                    <Typography variant="h6" component="div" align="center"> 
                        Select a set or search for a Pokémon to see the cards.
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default Index;
