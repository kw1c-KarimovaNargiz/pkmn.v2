import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import CardList from '../components/CardList';
import SetsSidebar from '../components/SetsSideBar'; 
import CombinedSearchFilterBar from '../components/CombinedSearchFilterBar'; 
import { fetchSeries, fetchCardsForSet, searchCard, fetchSortedEvolutionCards } from '../services/api';
import '../styling/Index.css'; 

const Index = () => {
    const [sets, setSets] = useState([]);
    const [series, setSeries] = useState([]);
    const [selectedSetId, setSelectedSetId] = useState(null);
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [originalCards, setOriginalCards] = useState([]); 
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    
    const availableTypes = allTypes;

    const handleSortByEvo = async () => {
        if (selectedSetId) {
            try {
                const sortedCards = await fetchSortedEvolutionCards(selectedSetId);
    
                //setting deduplicate card by id
                const uniqueSortedCards = sortedCards.filter((card, index, self) => 
                    index === self.findIndex((c) => c.id === card.id)
                );

                setCards(uniqueSortedCards); 
                setFilteredCards(uniqueSortedCards); 
            } catch (error) {
                console.error("Error fetching sorted evolution cards:", error);
                setCards([]); 
                setFilteredCards([]); 
            }
        }
    };
    
    //to original unsorted state
    const handleRestoreOriginal = () => {
        setCards(originalCards); 
        setFilteredCards(originalCards); 
    };

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


    //selecting set - saving the original unsorted state 
    const handleSetSelect = async (setId) => {
        setSelectedSetId(setId);
        try {
            const cardData = await fetchCardsForSet(setId); 
            setCards(cardData);
            setOriginalCards(cardData); 
            setFilteredCards(cardData);
        } catch (error) {
            console.error("Error loading cards:", error);
            setCards([]); 
            setFilteredCards([]); 
        }
    };
    
    //searching
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
                    onSortByEvo={handleSortByEvo}
                    onRestoreOriginal={handleRestoreOriginal} 
                />
            </div>
            <div className="cards-display-area">
                <CardList cards={searchResults.length > 0 ? searchResults : filteredCards} />

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
