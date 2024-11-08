import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '../pages/UserContext';
import CardList from '../components/CardList';
import SetsSidebar from '../components/SetsSideBar';
import '../styling/Index.css';
import { fetchSeries, fetchCardsForSet, fetchSubTypes } from '../services/api';
import useApi from '../hooks/useApi';

const CollectionPage = () => {
    const { authToken, userLoading } = useUser();
    const [userCollection, setUserCollection] = useState([]);
    const [sets, setSets] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSetId, setSelectedSetId] = useState('all');
    const [series, setSeries] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [subTypes, setSubTypes] = useState([]);
    const [cards, setCards] = useState([]);
    const [isOwnedFilterActive, setIsOwnedFilterActive] = useState(false);


    const { data: collectionData, error: collectionError, isLoading: collectionLoading, triggerFetch: refetchCollection } = useApi('collections', {}, false, 'GET');

    useEffect(() => {
        if (authToken && !userLoading) {
            refetchCollection();
        }
    }, [authToken, userLoading]);

    useEffect(() => {
        if (collectionData) {
            setUserCollection(collectionData);
            setLoading(false);
        }
        if (collectionError) {
            setError('Failed to fetch user collection');
            setLoading(false);
        }
    }, [collectionData, collectionError, collectionLoading]);

    useEffect(() => {
        const loadSeries = async () => {
            if (!authToken || userLoading) return;

            setLoading(true);
            try {
                const seriesData = await fetchSeries();
                setSeries(seriesData);
                if (seriesData.length > 0) {
                    setSets(seriesData[0].sets || []);
                }
            } catch (error) {
                console.error("Cannot fetch series/sets", error);
                setError("Failed to load series data");
            } finally {
                setLoading(false);
            }
        };

        loadSeries();
    }, [authToken, userLoading]);

    const handleSetSelect = useCallback(async (setId) => {
        setLoading(false);
        setSelectedSetId(setId);

        try {
            const [cardData, subTypeData] = await Promise.all([
                fetchCardsForSet(setId),
                fetchSubTypes(setId)
            ]);
            setCards(cardData);
            setFilteredCards(cardData);
            setSubTypes(subTypeData);

            const uniqueTypes = [...new Set(cardData.flatMap(card => card.types || []))];
            setAllTypes(uniqueTypes);
        } catch (error) {
            console.error("Error loading set data:", error);
            setCards([]);
            setFilteredCards([]);
            setSubTypes([]);
            setAllTypes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSeriesSelect = useCallback((selectedSeries) => {
        setSets(selectedSeries.sets || []);
    }, []);

    const isCardInCollection = useCallback((cardId) => {
        return userCollection.some(item => item.card.id === cardId);
    }, [userCollection]);

    const handleFilter = useCallback((types, subtypes, isSortedByEvo, filterOwned) => {
        let filtered = [...cards];

        // Filter by types
        if (types.length > 0) {
            filtered = filtered.filter((card) =>
                types.some((type) => card.types?.includes(type))
            );
        }

        // Filter by subtypes
        if (subtypes.length > 0) {
            filtered = filtered.filter((card) =>
                subtypes.some((subtype) => card.subtypes?.includes(subtype))
            );
        }

        // Filter by owned cards
        if (filterOwned) {
            filtered = filtered.filter(card => isCardInCollection(card.id)); // Adjust based on your card ID structure
        }

        // Sort by evolution stage if needed
        if (isSortedByEvo) {
            filtered.sort((a, b) => (a.evolutionStage || 0) - (b.evolutionStage || 0));
        }

        setFilteredCards(filtered);
    }, [cards, isCardInCollection]);

    if (userLoading || loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='index-container'>
            <div className="sidebar">
                <SetsSidebar
                    series={series}
                    onSetSelect={handleSetSelect}
                    onSeriesSelect={handleSeriesSelect}
                    availableTypes={allTypes}
                    availableSubTypes={subTypes}
                    onFilter={handleFilter}
                    isCollectionView={true}
                    isOwnedFilterActive={isOwnedFilterActive} 
    setIsOwnedFilterActive={setIsOwnedFilterActive}
                />
            </div>

            <div className="main-content">
            <div className="cards-display-area" sx={{top: '10',}}>
                {selectedSetId === 'all' ? (
                    userCollection.length > 0 ? (
                        <CardList cards={userCollection.map(item => item.card)} />
                    ) : (
                        <p>No cards in your collection.</p>
                    )
                ) : (
                    <CardList 
                        cards={filteredCards}
                        isCollectionView={true}
                        isCardInCollection={isCardInCollection}
                    />
                )}
            </div>
            </div>
        </div>
    );
};

export default CollectionPage;