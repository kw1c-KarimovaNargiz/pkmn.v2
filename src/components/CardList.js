import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Typography, IconButton, Box } from '@mui/material';
import {Grid, AutoSizer } from 'react-virtualized';
import { toast } from 'react-toastify';
import { Add, Remove } from '@mui/icons-material';
import CardDisplay from './CardDisplay';
import { addCardToCollection, removeCardFromCollection, fetchUserCollection, fetchSeries, fetchCardsForSet, searchCard, fetchSubTypes } from '../services/api';
import { useUser } from '../pages/UserContext';
import useApi from '../hooks/useApi';
import { LinearProgress } from '@mui/material';
import '../styling/cardlist.css';

const CardList = ({ 
    type,
    isCollectionView,
    initialSetId,
    sx,
    searchResults,
    setSearchResults 
}) => {
    const { authToken } = useUser();
    const loadingRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [cardCounts, setCardCounts] = useState({});
    const [userCards, setUserCards] = useState({});
    const [selectedCard, setSelectedCard] = useState(null);
    const [toastId, setToastId] = useState(null);
    const [toastCount, setToastCount] = useState(0);
    const [displayCount, setDisplayCount] = useState(12);
    const [originalCards, setOriginalCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOwnedCards, setFilterOwnedCards] = useState(false);

    const [ownedCards, setOwnedCards] = useState(new Set());
    const [instantlyAddedCards, setInstantlyAddedCards] = useState(new Set());
    const [instantlyRemovedCards, setInstantlyRemovedCards] = useState(new Set());
    const [currentIndex, setCurrentIndex] = useState({});
    const [totalSetCards, setTotalSetCards] = useState(0);
    const [allSetCards, setAllSetCards] = useState([]);

    const [series, setSeries] = useState([]);
    const [sets, setSets] = useState([]);
    const [cards, setCards] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [subTypes, setSubTypes] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [selectedSetId, setSelectedSetId] = useState(null);
    const [filteredCards, setFilteredCards] = useState([]);
    const [userCollection, setUserCollection] = useState([]);

    const [error, setError] = useState(null);
    const [totalCollectionValue, setTotalCollectionValue] = useState(0);
    const [totalCardCount, setTotalCardCount] = useState(0);

    // const [cardStatus, setCardStatus] = useState(
    //     cards.reduce((acc, card) => {
    //         acc[card.id] = true;
    //         return acc;
    //     }, {})
    // );

    const { data: collectionData, error: collectionError, isLoading: collectionLoading, triggerFetch: refetchCollection } = useApi('collections', {}, true, 'GET');

    const isCardOwned = useCallback((cardId) => {

        const cardCounts = cardCounts[cardId] || {};
        const hasNonZeroCount = Object.values(cardCounts).some(count => count > 0);

        return (ownedCards.has(cardId) || instantlyAddedCards.has(cardId))
            && !instantlyRemovedCards.has(cardId)
            && hasNonZeroCount;
    }, [ownedCards, instantlyAddedCards, instantlyRemovedCards, cardCounts]);

    const handleSetSelect = useCallback(async (setId, setAnyway) => {
        console.log('Load Selected set:', setId);
        if (!setId) return;
        
        setLoading(true);
        setSelectedSetId(setId);

        try {
            const [cardData, subTypeData] = await Promise.all([
                fetchCardsForSet(setId),
                fetchSubTypes(setId)
            ]);

            console.log('Received card data:', cardData);

            // Update all card-related states at once
            setCards(cardData);
            setFilteredCards(cardData);
            setOriginalCards(cardData);
            setSubTypes(subTypeData);
            setAllTypes([...new Set(cardData.flatMap(card => card.types || []))]);

            if (cardData.length > 0 && cardData[0].set) {
                setTotalSetCards(cardData[0].set.printed_total);
                setAllSetCards(cardData);
            }

            // Reset filters
            setSearchTerm('');
            setFilterOwnedCards(false);
        } catch (error) {
            console.error("Error loading set data:", error);
            setError('Failed to load set data');
            setCards([]);
            setFilteredCards([]);
            setSubTypes([]);
            setAllTypes([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (initialSetId && initialSetId !== selectedSetId) {
            handleSetSelect(initialSetId);
        }
    }, [initialSetId, handleSetSelect]);


    const getVariantColor = (variant) => {
        switch (variant) {
            case 'normal': return 'yellow';
            case 'holofoil': return 'purple';
            case 'reverseHolofoil': return 'blue';
            default: return 'white';
        }
    };


    const handleCardToCollection = useCallback(async (cardId, variant, count) => {
        const payload = {
            authToken: authToken,
            card_id: cardId,
            variant,
            count: count,
        };

        try {

            setInstantlyAddedCards(prev => new Set([...prev, cardId]));

            const response = await addCardToCollection(payload);

            console.log('Card updated:', response.data);
            setOwnedCards(prev => new Set([...prev, cardId]));
            setCardCounts(prevCounts => ({
                ...prevCounts,
                [cardId]: {
                    ...prevCounts[cardId],
                    [variant]: count,
                }

            }));

     
            setOwnedCards(prev => new Set([...prev, cardId]));

            refetchCollection();

            if (toast.isActive(toastId)) {
                let newToastCount = toastCount + 1;
                setToastCount(newToastCount);
                toast.update(toastId, {
                    render: `Card added successfully! (${newToastCount})`,
                    type: 'success',
                    autoClose: 3000,
                });
            } else {
                setToastId(toast.success(toastCount ? `Card added successfully! (${toastCount})` : 'Card added successfully!'), {
                    onClose: () => {
                        setToastId(null);
                    }
                });
            }
        } catch (error) {
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat().join('\n');
                alert(`Validation failed: ${errorMessage}`);
            } else if (error.response?.status === 401) {
                alert('You must be logged in to update cards to your collection.');
            } else if (error.response?.status === 404) {
                alert('The card was not found.');
            } else {
                alert('An error occurred while adding the card.');
            }
        }
    }, [authToken, toastId, toastCount, refetchCollection]);

    const handleRemoveCardFromCollection = useCallback(async (cardId, variant, count) => {
        if (!authToken) {
            alert('You must be logged in to remove cards from your collection');
            return;
        }

        const payload = {
            token: authToken,
            authToken: authToken,
            card_id: cardId,
            variant: variant,
            count: count
        };

        try {
            const response = await removeCardFromCollection(payload);
            console.log('Card removed:', response);

            refetchCollection();

            if (toast.isActive(toastId)) {
                let newToastCount = toastCount - 1;
                setToastCount(newToastCount);
                toast.update(toastId, {
                    render: `Card removed successfully! (${newToastCount})`,
                    type: 'success',
                    autoClose: 3000,
                });
            } else {
                setToastId(toast.success(toastCount ? `Card removed successfully! (${toastCount})` : 'Card removed successfully!'), {
                    onClose: () => {
                        setToastId(null);
                    }
                });
            }
        } catch (error) {
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat().join('\n');
                alert(`Validation failed: ${errorMessage}`);
            } else if (error.response?.status === 401) {
                alert('You must be logged in to update cards to your collection.');
            } else if (error.response?.status === 404) {
                alert('The card was not found.');
            } else {
                alert('An error occurred while adding the card.');
            }
        }
    }, [authToken, toastId, toastCount, refetchCollection]);

    const handleIncrement = useCallback(async (cardId, variant) => {
        const currentCount = cardCounts[cardId]?.[variant] || 0;
        const newCount = currentCount + 1;

        setCardCounts(prevCounts => ({
            ...prevCounts,
            [cardId]: {
                ...prevCounts[cardId],
                [variant]: newCount
            }
        }));

        await handleCardToCollection(cardId, variant, newCount);
    }, [cardCounts, handleCardToCollection]);

    const handleDecrement = useCallback(async (cardId, variant) => {
        const currentCount = cardCounts[cardId]?.[variant] || 0;
        const newCount = currentCount;

        setCardCounts(prevCounts => ({
            ...prevCounts,
            [cardId]: {
                ...prevCounts[cardId],
                [variant]: newCount
            }
        }));

        const updatedCounts = {
            ...cardCounts[cardId],
            [variant]: newCount
        };

        const allCountsZero = Object.values(updatedCounts).every(count => count === 0);

        //if all counts are 0, mark the card as instantly removed
        if (allCountsZero) {
            setInstantlyRemovedCards(prev => new Set([...prev, cardId]));
        }

        await handleRemoveCardFromCollection(cardId, variant, newCount);
    }, [cardCounts, handleRemoveCardFromCollection]);

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setCurrentIndex(cards.indexOf(card));
    };

    const uniqueOwnedCardsCount = useCallback(() => {
        if (!allSetCards?.length || !cardCounts) return 0;
        return allSetCards.reduce((count, card) => {
            const cardCount = cardCounts[card.card_id];
            return cardCount && Object.values(cardCount).some(count => count > 0) 
                ? count + 1 
                : count;
        }, 0);
    }, [allSetCards, cardCounts]);

    const handleSeriesSelect = useCallback((selectedSeries) => {
        setSets(selectedSeries.sets || []);
    }, []);

    const isCardInCollection = useCallback((cardId) => {
        return userCollection.some(item => item.card.id === cardId);
    }, [userCollection]);

    const handleFilter = useCallback((types, subtypes, isSortedByEvo, filterOwnedCards) => {
        let filtered = [...cards];

        if (types.length > 0) {
            filtered = filtered.filter((card) =>
                types.some((type) => card.types?.includes(type))
            );
        }

        if (subtypes.length > 0) {
            filtered = filtered.filter((card) =>
                subtypes.some((subtype) => card.subtypes?.includes(subtype))
            );
        }

        if (filterOwnedCards) {
            filtered = filtered.filter(card => isCardInCollection(card.id));
        }

        if (isSortedByEvo) {
            filtered.sort((a, b) => (a.evolutionStage || 0) - (b.evolutionStage || 0));
        }

        setFilteredCards(filtered);
    }, [cards, isCardInCollection]);


    const loadSeries = async () => {
        console.log('load series')
        setLoading(true);
        try {
            const seriesData = await fetchSeries();
            setSeries(seriesData);

            if (initialSetId) {
                // If we have an initial set ID from the route, use that
                await handleSetSelect(initialSetId);
                setSelectedSetId(initialSetId);
            } else if (seriesData.length > 0) {
                // Otherwise use the first set from the first series
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
            setError('Failed to load series data');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (cards.length > 0) {
            const uniqueTypes = [...new Set(cards.flatMap((card) => card.types || []))];
            const uniqueSubTypes = [...new Set(cards.flatMap((card) => card.subtypes || []))];
            setAllTypes(uniqueTypes);
            setSubTypes(uniqueSubTypes);
        }
    }, [cards]);

    useEffect(() => {
        if (cards.length > 0 && cards[0].set) {

            const updates = {
                totalSetCards: cards[0].set.printed_total,
                allSetCards: allSetCards.length === 0 ? cards : allSetCards
            };
            setTotalSetCards(updates.totalSetCards);
            setAllSetCards(updates.allSetCards);
        }
    }, [selectedSetId]);

    useEffect(() => {
        const currentRef = loadingRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && displayCount < cards.length) {
                    setDisplayCount(prevCount => Math.min(prevCount + 12, cards.length));
                }
            },
            { threshold: 0.1 }
        );
    
        if (currentRef) {
            observer.observe(currentRef);
        }
    
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [displayCount, cards.length]);


    useEffect(() => {
        //always load series data for the sidebar
        loadSeries();
    }, []);

    useEffect(() => {
        if (collectionData && Array.isArray(collectionData[0])) {
            const cardsArray = collectionData[0];
            const updates = {
                initialCounts: {},
                ownedCardIds: new Set(),
                collectionItems: [],
                totalValue: 0,
                totalCount: 0,
                cards: []
            };
    
            //calculations in one pass / loop 
            updates.collectionItems = Object.values(collectionData).find(Array.isArray) || [];
            updates.totalValue = collectionData.total_collection_value || 0;
            updates.ownedCardIds = new Set(cardsArray.map(card => card.card_id));
            
          
            cardsArray.forEach(card => {
                updates.initialCounts[card.card_id] = {
                    normal: card.normal_count,
                    holofoil: card.holo_count,
                    reverseHolofoil: card.reverse_holo_count,
                };
                updates.totalCount += (card.normal_count || 0) + 
                                    (card.holo_count || 0) + 
                                    (card.reverse_holo_count || 0);
            });
    
            setCardCounts(updates.initialCounts);
            setOwnedCards(updates.ownedCardIds);
            setUserCollection(updates.collectionItems);
            setTotalCollectionValue(updates.totalValue);
            setTotalCardCount(updates.totalCount);
            setUserCards(collectionData);
    
            if (type === 'collection') {
                setCards(cardsArray.map(item => item.card));
            }
            
            setLoading(false);
        }
    }, [collectionData, type]);

    const columnCount = 3;
    const rowHeight = 500;
    const cardMargin = 8;
    

    const showCollectionTitle = type === 'collection';
    const showSetTitle = !showCollectionTitle;
    const progressPercentage = (uniqueOwnedCardsCount() / totalSetCards) * 100;
    const setTitle = cards.length > 0 && cards[0].set ? cards[0].set.set_name : "";

    console.log('before cardlist return', cards)

    const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
        const index = rowIndex * columnCount + columnIndex;
        const card = cards[index];

        if (!card) return null;

        const cardStyle = {
            ...style,
            padding: cardMargin,
        };

        return (
            <div key={key} style={cardStyle}>
                <div className="border rounded-lg hover:shadow-lg transition-shadow h-full">
                    <CardDisplay
                        card={card}
                        isNotInCollection={isCollectionView && !isCardInCollection(card.id)}
                        onClick={() => handleCardClick(card)}
                        cards={cards}
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        onCardAdded={handleCardToCollection}
                        instantlyAddedCards={instantlyAddedCards}
                        instantlyRemovedCards={instantlyRemovedCards}
                        cardCounts={cardCounts}
                        selectedSetId={selectedSetId}
                    />
                    <div className="variant-container">
                        {['normal', 'holofoil', 'reverseHolofoil'].map((variant) => (
                            card.price_data?.tcgplayer?.[variant] && (
                                <div key={variant} className="variant-boxes">
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        border: '2px solid',
                                        borderColor: getVariantColor(variant),
                                        borderRadius: '4px',
                                        backgroundColor: getVariantColor(variant),
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: '#1f1f1f',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}>
                                        {cardCounts[card.card_id]?.[variant] || 0}
                                        <div className="variant-buttons">
                                            <IconButton 
                                                onClick={() => handleIncrement(card.card_id, variant)}
                                                size="small"
                                                sx={{ color: '#999', '& .MuiSvgIcon-root': { fontSize: 18 } }}
                                            >
                                                <Add />
                                            </IconButton>
                                            <IconButton 
                                                onClick={() => handleDecrement(card.card_id, variant)}
                                                size="small"
                                                disabled={(cardCounts[card.card_id]?.[variant] || 0) === 0}
                                                sx={{ color: '#999', '& .MuiSvgIcon-root': { fontSize: 18 } }}
                                            >
                                                <Remove />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Box sx={{ flex: 1 }}>
            <div className="header">
            <div className="header-content">
            
                    {showSetTitle && (
                        <>
                        <div className="card-set-name-index">
                            <Typography variant="h3" sx={{ width: '100%', paddingLeft: '20%' }}>
                                {setTitle}
                            </Typography>
                         </div>
                            <Typography variant="h6">Total Value: ${totalCollectionValue.toFixed(2)}</Typography>
                            {isCollectionView && (
                                <div style={{
                                 
                                }}>
                                    <div className="collection-progress">
                                        <Typography variant="body1" sx={{ color:'#999', }}>
                                            {uniqueOwnedCardsCount()} / {totalSetCards}
                                        </Typography>
                                        <div className="linear-progress">
                                            <LinearProgress
                                                variant="determinate"
                                                value={progressPercentage}
                                                sx={{
                                                    width: '30%',
                                                    bottom: 10,
                                                    height: 10,
                                                    borderRadius: 5,
                                                    marginLeft: '20%',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: '#4CAF50',
                                                        borderRadius: 5
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div></div>
               

                <div style={{ 
                height: '100vh', 
                width: '90%',
                paddingLeft: '14%',
            }}>
                <AutoSizer>
                    {({ height, width }) => {
                        const calculatedColumnWidth = width / columnCount;
                        const rowCount = Math.ceil(cards.length / columnCount);
                        
                        return (
                            <Grid
                                height={height}
                                width={width}
                                columnCount={columnCount}
                                columnWidth={calculatedColumnWidth}
                                rowCount={rowCount}
                                rowHeight={rowHeight}
                                cellRenderer={cellRenderer}
                                style={{ overflowX: 'hidden' }}
                            />
                        );
                    }}
                </AutoSizer>
            </div>
        </Box>
    );
};

export default CardList;