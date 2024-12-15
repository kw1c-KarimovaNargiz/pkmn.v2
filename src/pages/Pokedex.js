import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CardList from '../components/CardList';
import { fetchCardsForSet } from '../services/api';

const Pokedex = ({ 
    isCollectionView = true,
    showCollectionTitle = false,
    totalCollectionValue = 0,
    totalCardCount = 0,
    uniqueOwnedCardsCount = () => 0,
    searchResults,
    setSearchResults 
}) => {
    const { setId } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        if (setId === 'search' && location.state?.searchResults) {
            // Handle search results
            setCards(location.state.searchResults);
            setLoading(false);
        } else if (setId && setId !== 'search') {
            // Handle normal set viewing
            const loadSetCards = async () => {
                try {
                    const cardData = await fetchCardsForSet(setId);
                    setCards(cardData);
                } catch (error) {
                    console.error("Error loading cards:", error);
                } finally {
                    setLoading(false);
                }
            };
            loadSetCards();
        }
    }, [setId, location.state]);

    return (
        <div>
            <CardList 
                type="pokedex"
                isCollectionView={isCollectionView}
                initialSetId={setId !== 'search' ? setId : null}
                showCollectionTitle={showCollectionTitle}
                totalCollectionValue={totalCollectionValue}
                totalCardCount={totalCardCount}
                uniqueOwnedCardsCount={uniqueOwnedCardsCount}
                searchResults={setId === 'search' ? cards : null}
                setSearchResults={setSearchResults}
            />
        </div>
    );
};

export default Pokedex;