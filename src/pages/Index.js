import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import CardList from '../components/CardList';
import SetsSidebar from '../components/SetsSideBar'; 
import CombinedSearchFilterBar from '../components/CombinedSearchFilterBar'; 
import Navbar from '../components/Navbar';

import { useUser  } from '../pages/UserContext';
import { fetchSeries, fetchCardsForSet, searchCard, fetchSortedEvolutionCards, fetchSubTypes, addCardToCollection, removeCardFromCollection } from '../services/api';
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
    const [subTypes, setSubTypes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false); 
    const { user, userLoading  } = useUser(); 

    const handleAddCard = async (cardId, count) => {
        if (!user) {
            console.warn('User must be logged in to handle their collection');
            return; 
        }

        try {
            const response = await addCardToCollection(user.email, cardId, count);
            console.log('Card added to collection:', response);
        } catch (error) {
            console.error('Failed to add card to collection:', error);
        }
    };

    
    const handleRemoveCard = async (cardId, count) => {
        if (!user) {
            console.warn('User must be logged in to handle their collection');
            return; 
        }

        try {
            const response = await removeCardFromCollection(user.email, cardId, count);
            console.log('Card removed from collection:', response);
        } catch (error) {
            console.error('Failed to remove card from collection:', error);
        }
    };

    const handleSortByEvo = async () => {
        if (selectedSetId) {
            setLoading(true); 
            try {
                setOriginalCards(cards);

                const sortedCards = await fetchSortedEvolutionCards(selectedSetId);
                const uniqueSortedCards = sortedCards.filter((card, index, self) => 
                    index === self.findIndex((c) => c.id === card.id)
                );

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
            } finally { 
                setLoading(false);
            }
        }
    };

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
            setLoading(true);
            try {
                const seriesData = await fetchSeries(); 
                setSeries(seriesData);
    
                if (seriesData.length > 0) {
                    const firstSeries = seriesData[0];
                    setSets(firstSeries.sets || []);
    
                    if (firstSeries.sets && firstSeries.sets.length > 0) {
                        const firstSet = firstSeries.sets[0];
                        setSelectedSetId(firstSet.id);
                        await handleSetSelect(firstSet.id);
                    }
                }
            } catch (error) {
                console.error("Cannot fetch series/sets", error);
            } finally {
                setLoading(false); 
            }
        };
        loadSeries(); 
    }, []);
    

    const handleSetSelect = async (setId) => {
        setLoading(true);
        setSelectedSetId(setId);
        setSearchResults([]);


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
        } finally {
            setLoading(false); 
        }
    };

    const handleSearch = async (term) => {
        setLoading(true); 
        try {
            const results = await searchCard(term); 
            setSearchResults(results);
        } catch (error) {
            console.error("Error searching Pokémon:", error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (types, subtypes, isSortedByEvo) => {
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
        if (isSortedByEvo) {
            filtered = filtered.sort((a, b) => {
                return a.evolutionStage - b.evolutionStage;
            });
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
        setSubTypes(uniqueSubTypes); 
    }, [cards]);

    if( userLoading ) return null;
    const setTitle = cards.length > 0 && cards[0].set ? cards[0].set.set_name : "No Title Available";

   
    return (
        <div className="index-container">
            <Navbar 
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch} 
            />
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
                  availableTypes={allTypes} 
                  availableSubTypes={subTypes}
                  onFilter={handleFilter}  
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                  selectedSubTypes={selectedSubTypes}
                  setSelectedSubTypes={setSelectedSubTypes}
                  onSortByEvo={handleSortByEvo}
                  onRestoreOriginal={handleRestoreOriginal} 
                  setTitle={setTitle}
                />
            </div>
            <div className="cards-display-area">
                <CardList 
                  cards={searchResults.length > 0 ? searchResults : filteredCards} 
                  onAddCard={handleAddCard} 
                  onRemoveCard={handleRemoveCard}
                />
            </div>
        </div>
    );
};

export default Index;
