import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import CardList from '../components/CardList';
import SetsSidebar from '../components/SetsSideBar'; 
import CombinedSearchFilterBar from '../components/CombinedSearchFilterBar'; 
import { fetchSeries, fetchCardsForSet, searchCard, fetchSortedEvolutionCards, fetchSubTypes } from '../services/api';
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
    const [selectedSubTypes, setSelectedSubTypes] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [allSubTypes, setAllSubTypes] = useState([]);
    const [subTypes, setSubTypes] = useState([]);

    const availableTypes = allTypes;
    const availableSubTypes = allSubTypes;

   const handleSortByEvo = async () => {
    if (selectedSetId) {
        try {

            setOriginalCards(cards);

            //fetch sorted cards by evo without filtering by type yet
            const sortedCards = await fetchSortedEvolutionCards(selectedSetId);

            //deduplicate sorted cards
            const uniqueSortedCards = sortedCards.filter((card, index, self) => 
                index === self.findIndex((c) => c.id === card.id)
            );

            //filter sorted cards based on selected types
            const sortedFilteredCards = uniqueSortedCards.filter(card => 
                (selectedTypes.length === 0 || selectedTypes.some(type => card.types.includes(type))) &&
                (selectedSubTypes.length === 0 || selectedSubTypes.some(subtype => card.subtypes.includes(subtype)))
            );
            

            setCards(sortedFilteredCards);
            setFilteredCards(sortedFilteredCards);
          } catch (error) {
            console.error("Error fetching sorted evolution cards:", error);
            setCards([]);
            setFilteredCards([]);
          }
        }
};



    
    //to original unsorted state // also when filter is on - evo checked unchecked 
    const handleRestoreOriginal = () => {
        if (selectedTypes.length === 0 && selectedSubTypes.length === 0) {
          setCards(originalCards);
          setFilteredCards(originalCards);
        } else {
          setFilteredCards(originalCards.filter(card =>
            (selectedTypes.length === 0 || selectedTypes.some(type => card.types.includes(type))) &&
            (selectedSubTypes.length === 0 || selectedSubTypes.some(subtype => card.subtypes.includes(subtype)))
          ));
        }
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

            const subTypeData = await fetchSubTypes(setId); 
            setSubTypes(subTypeData);

        } catch (error) {
            console.error("Error loading cards:", error);
            setCards([]); 
            setFilteredCards([]); 
            setSubTypes([]);
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

    //filter types(energy) and subtypes
    const handleFilter = (types, subtypes) => {
        let filtered = cards;
      
        if (types.length > 0) {
          filtered = filtered.filter((card) =>
            types.some((type) => card.types.includes(type))
          );
        }
      
        if (subtypes.length > 0) {
          filtered = filtered.filter((card) =>
            subtypes.some((subtype) => card.subtypes.includes(subtype))
          );
        }
        setFilteredCards(filtered);
      };
      

    const handleSeriesSelect = (selectedSeries) => {
        setSets(selectedSeries.sets || []); 
    };

    useEffect(() => {
        const uniqueTypes = [...new Set(cards.flatMap((card) => card.types))];
        setAllTypes(uniqueTypes);
      
        const uniqueSubTypes = [...new Set(cards.flatMap((card) => card.subtypes || []))];
        setAllSubTypes(uniqueSubTypes); 
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
                  onSearch={handleSearch}
                   availableTypes={availableTypes} 
                   availableSubTypes={subTypes}
                   onFilter={handleFilter}  
                   selectedTypes={selectedTypes}
                   setSelectedTypes={setSelectedTypes}
                   selectedSubTypes={selectedSubTypes}
                   setSelectedSubTypes={setSelectedSubTypes}
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
