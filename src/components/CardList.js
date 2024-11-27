import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Grid, Typography, Badge, Checkbox, FormControlLabel, IconButton, Box } from '@mui/material';
import { toast } from 'react-toastify';
import { Add, Remove } from '@mui/icons-material';
import CardDisplay from './CardDisplay';
import SetsSidebar from './SetsSideBar';
import { addCardToCollection, removeCardFromCollection, fetchUserCollection, fetchSeries, fetchCardsForSet, searchCard, fetchSubTypes } from '../services/api';
import { useUser } from '../pages/UserContext';
import useApi from '../hooks/useApi';
import { LinearProgress } from '@mui/material';
import '../styling/cardlist.css';

const CardList = ({ type, isCollectionView, sx, searchResults, setSearchResults }) => {
    const { authToken } = useUser();
    const loadingRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [cardCounts, setCardCounts] = useState({});
    const [userCards, setUserCards] = useState({});
    const [selectedCard, setSelectedCard] = useState(null);
    const [toastId, setToastId] = useState(null);
    const [toastCount, setToastCount] = useState(0);
    const [displayCount, setDisplayCount] = useState(12);
    const [loadingImages, setLoadingImages] = useState({});
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
    const [originalCards, setOriginalCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userCollection, setUserCollection] = useState([]);

    const [error, setError] = useState(null);
    const [filterOwnedCards, setFilterOwnedCards] = useState(false);
    const [totalCollectionValue, setTotalCollectionValue] = useState(0);
    const [totalCardCount, setTotalCardCount] = useState(0);

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
        setLoading(true);

        if (type === 'collection' && !setAnyway) {

            if (collectionData) {
                console.log('Collection data:', collectionData);

                //array items in collection - cards - value
                const collectionItems = Object.values(collectionData).find(Array.isArray);

                const totalValue = collectionData.total_collection_value || 0;

                setUserCollection(collectionItems || []);
                setTotalCollectionValue(totalValue);

                //total card count
                const totalCount = collectionItems.reduce((sum, item) => {
                    return sum + (item.normal_count || 0) + (item.holo_count || 0) + (item.reverse_holo_count || 0);
                }, 0);
                setTotalCardCount(totalCount);
                setLoading(false);
            }
            if (collectionError) {
                setError('Failed to fetch user collection');
                setLoading(false);
            }


        } else {

            //keep false to prevent rerendering index container 
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
        }
    }, [collectionData]);

    const handleImageLoad = (cardId) => {
        setLoadingImages((prev) => ({ ...prev, [cardId]: false }));
    };

    const [cardStatus, setCardStatus] = useState(
        cards.reduce((acc, card) => {
            acc[card.id] = true;
            return acc;
        }, {})
    );
    const getVariantColor = (variant) => {
        switch (variant) {
            case 'normal':
                return 'yellow';
            case 'holofoil':
                return 'purple';
            case 'reverseHolofoil':
                return 'blue';
            default:
                return 'white';
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

            setCardStatus(prevStatus => ({
                ...prevStatus,
                [cardId]: false

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
        if (!allSetCards || !cardCounts) return 0;

        return allSetCards.reduce((count, card) => {
            const cardCount = cardCounts[card.card_id];
            if (cardCount) {
                const hasAnyCount = Object.values(cardCount).some(count => count > 0);
                return hasAnyCount ? count + 1 : count;
            }
            return count;
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

    useEffect(() => {
        const uniqueTypes = [...new Set(cards.flatMap((card) => card.types))];
        setAllTypes(uniqueTypes);

        const uniqueSubTypes = [...new Set(cards.flatMap((card) => card.subtypes || []))];
        setSubTypes(uniqueSubTypes);
    }, [cards]);

    useEffect(() => {
        if (cards.length > 0 && cards[0].set) {
            setTotalSetCards(cards[0].set.printed_total);
            if (allSetCards.length === 0) {
                setAllSetCards(cards);
            }
        }
    }, [selectedSetId]);


    // useEffect(() => {
    //     const observer = new IntersectionObserver((entries) => {
    //         if (entries[0].isIntersecting) {
    //             setDisplayCount((prevCount) => prevCount + 12);
    //         }
    //     });

    //     if (loadingRef.current) {
    //         observer.observe(loadingRef.current);
    //     }

    //     return () => {
    //         if (loadingRef.current) {
    //             observer.unobserve(loadingRef.current);
    //         }
    //     };
    // }, [loadingRef]);


    useEffect(() => {
        if (collectionData && Array.isArray(collectionData[0])) {
            const ownedCardIds = new Set(collectionData[0].map(card => card.card_id));
            setOwnedCards(ownedCardIds);
        }
    }, [collectionData]);

    useEffect(() => {
        setLoading(cards.length === 0 && collectionLoading);
    }, [cards, collectionLoading]);

    useEffect(() => {
        setLoading(true);
        if (cards.length > 0) {
            setLoading(false);
        }
    }, [cards]);


    useEffect(() => {
        setUserCards(collectionData);
    }, [collectionData, collectionError, collectionLoading]);



    useEffect(() => {
        console.log('Collection Data:', collectionData);
        const initialCounts = {};

        //if collectionData is not null and has the expected structure
        if (collectionData && typeof collectionData === 'object' && Array.isArray(collectionData[0])) {
            const cardsArray = collectionData[0];

            cardsArray.forEach(card => {
                initialCounts[card.card_id] = {
                    normal: card.normal_count,
                    holofoil: card.holo_count,
                    reverseHolofoil: card.reverse_holo_count,
                };
            });
        } else {
            console.warn('Null collection');
        }

        console.log('Initial Counts:', initialCounts);
        setCardCounts(initialCounts);
    }, [collectionData]);


    useEffect(() => {
        if (collectionData) {
            console.log('Collection data:', collectionData);

            //array items in collection - cards - value
            const collectionItems = Object.values(collectionData).find(Array.isArray);

            const totalValue = collectionData.total_collection_value || 0;

            setUserCollection(collectionItems || []);
            setTotalCollectionValue(totalValue);

            //total card count
            const totalCount = collectionItems.reduce((sum, item) => {
                return sum + (item.normal_count || 0) + (item.holo_count || 0) + (item.reverse_holo_count || 0);
            }, 0);
            setTotalCardCount(totalCount);
            setLoading(false);
        }
        if (collectionError) {
            setError('Failed to fetch user collection');
            setLoading(false);
        }
    }, [collectionData, collectionError, collectionLoading]);

    const showCollectionTitle = type === 'collection';
    const showSetTitle = !showCollectionTitle;
    const progressPercentage = (uniqueOwnedCardsCount() / totalSetCards) * 100;
    const setTitle = cards.length > 0 && cards[0].set ? cards[0].set.set_name : "";


    return (
        <Box sx={{ flex: 1, width: '100%' }}>
            <Box sx={{ ...sx, width: '100%' }}>
                <div className="card-set-name-index">
                    {showCollectionTitle && (
                        <Box sx={{ width: '100%', paddingLeft: '20%' }}>
                            <Typography variant="h4">YOUR COLLECTION</Typography>
                            <div className="collection-value">
                                <Typography variant="h6">Total Value: ${totalCollectionValue.toFixed(2)}</Typography>
                            </div>
                            <div className="total-card-count">
                                <Typography variant="h6">Total Cards: {totalCardCount}</Typography>
                            </div>
                        </Box>
                    )}
                    {showSetTitle && (
                        <>
                            <Typography variant="h3" sx={{ width: '100%', paddingLeft: '20%' }}>
                                {`${setTitle}`}
                            </Typography>
                            {isCollectionView && (
                                <div style={{
                                    marginTop: '10px',
                                    marginBottom: '20px',
                                    width: '100%',
                                    maxWidth: '300px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '5px'
                                    }}>
                                    </div>

                                    <div className="collection-progress">

                                        {/* <Typography variant="body1" sx={{ color: '#999' }}>
                                    Collection Progress
                                </Typography> */}
                                        <Typography variant="body1" sx={{ color: '#999' }}>
                                            {uniqueOwnedCardsCount()} / {totalSetCards}
                                        </Typography>

                                        <div className="linear-progress">
                                            <LinearProgress
                                                variant="determinate"
                                                value={progressPercentage}
                                                sx={{
                                                    height: 10,
                                                    borderRadius: 5,
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
                </div>


                <Grid container spacing={8}>
                    {cards.slice(0).map((card) => (
                        <Grid item key={card.id} xs={12} sm={6} md={4} lg={4} className="card-item">
                            <div>
                                <CardDisplay
                                    card={card}
                                    isNotInCollection={isCollectionView && !isCardInCollection(card.id)}
                                    isCollectionView={isCollectionView}
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
                                                <div
                                                    style={{
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
                                                    }}
                                                >
                                                    {cardCounts[card.card_id]?.[variant] || 0}

                                                    <div className="variant-buttons">

                                                        <IconButton sx={{ color: '#999', '& .MuiSvgIcon-root': { fontSize: 18 } }}
                                                            onClick={() => handleIncrement(card.card_id, variant)}
                                                            size="small"
                                                        >
                                                            <Add />
                                                        </IconButton>
                                                        <IconButton sx={{ color: '#999', '& .MuiSvgIcon-root': { fontSize: 18 } }}
                                                            onClick={() => handleDecrement(card.card_id, variant)}
                                                            size="small"
                                                            disabled={(cardCounts[card.card_id]?.[variant] || 0) === 0}
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
                        </Grid>
                    ))}

                </Grid>

            </Box>

            <SetsSidebar
                series={series}
                onSetSelect={handleSetSelect}
                onSeriesSelect={handleSeriesSelect}
                availableTypes={allTypes}
                availableSubTypes={subTypes}
                onFilter={handleFilter}
                onToggleSidebar={(visible) => setSidebarVisible(visible)}
            />

        </Box>

    );
};

export default CardList;
