import React, { useEffect, useState } from 'react';
import CardList from '../components/CardList';
import SetsSidebar from '../components/SetsSideBar';
import Navbar from '../components/Navbar';
import { useUser } from '../pages/UserContext';
import { fetchSeries, fetchCardsForSet, searchCard, fetchSubTypes, addCardToCollection, removeCardFromCollection } from '../services/api';
import '../styling/Index.css'; 

const Index = () => {
    const [, setSets] = useState([]);
    const [series, setSeries] = useState([]);
    const [, setSelectedSetId] = useState(null);
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [, setOriginalCards] = useState([]); 
    const [searchResults, setSearchResults] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [subTypes, setSubTypes] = useState([]);
    const [, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false); 
    const { user, userLoading } = useUser(); 

    const handleAddCard = async (card_id, count, variant) => {
        if (!user) {
            console.warn('User must be logged in to handle their collection');
            return; 
        }

        try {
            const response = await addCardToCollection(user.email, card_id, count, variant);
            console.log('Card added to collection:', response);
        } catch (error) {
            console.error('Failed to add card to collection:', error);
        }
    };

    const handleRemoveCard = async (card_id, count) => {
        if (!user) {
            console.warn('User must be logged in to handle their collection');
            return; 
        }

        try {
            const response = await removeCardFromCollection(user.email, card_id, count);
            console.log('Card removed from collection:', response);
        } catch (error) {
            console.error('Failed to remove card from collection:', error);
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
            filtered = filtered.sort((a, b) => a.evolutionStage - b.evolutionStage);
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


    return (
        <div className="index-container">
    <Navbar setSearchTerm={setSearchTerm} onSearch={handleSearch} />
    <div className="sidebar">
        <SetsSidebar
            series={series} 
            onSetSelect={handleSetSelect} 
            onSeriesSelect={handleSeriesSelect} 
            availableTypes={allTypes}
            availableSubTypes={subTypes}
            onFilter={handleFilter}  
        />
    </div>
    <div className='main-content'>
        <div className="cards-display-area">
            <CardList 
                cards={searchResults.length > 0 ? searchResults : filteredCards} 
                onAddCard={handleAddCard} 
                onRemoveCard={handleRemoveCard}
            />
        </div>
    </div>
</div>
    );
};

export default Index;
