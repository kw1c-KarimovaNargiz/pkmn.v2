import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Grid, Typography, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import { Add, Remove } from '@mui/icons-material';
import CardDisplay from './CardDisplay'; 
import { fetchCardPrices, addCardToCollection, removeCardFromCollection, fetchUserCollection } from '../services/api';
import { useUser } from '../pages/UserContext';
import PriceDisplay from './PriceDisplay'; // Import your PriceDisplay component

const CardList = ({ cards }) => {
    const { user } = useUser();
    const [cardCounts, setCardCounts] = useState({});
    const [userCards, setUserCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [toastId, setToastId] = useState(null);
    const [toastCount, setToastCount] = useState(0);
    const [cardPrices, setCardPrices] = useState({});
    const [loadingPrices, setLoadingPrices] = useState(true);
    const [priceError, setPriceError] = useState(null);
    

    const displayPriceInfo = (cardPrice) => {
        if (cardPrice) {
            return (
                <div>
                    <p>URL: {cardPrice.url}</p>
                    <p>Updated At: {cardPrice.updatedAt}</p>
                    <p>Low: {cardPrice.prices?.holofoil?.low ?? 'N/A'}</p>
                    <p>Mid: {cardPrice.prices?.holofoil?.mid ?? 'N/A'}</p>
                    <p>High: {cardPrice.prices?.holofoil?.high ?? 'N/A'}</p>
                    <p>Market: {cardPrice.prices?.holofoil?.market ?? 'N/A'}</p>
                    <p>Direct Low: {cardPrice.prices?.holofoil?.directLow ?? 'N/A'}</p>
                </div>
            );
        }
        return <p>No price data available</p>;
    };

    useEffect(() => {
        const fetchPricesForCards = async () => {
            setLoadingPrices(true);
            setPriceError(null);
        
            try {
                const pricePromises = cards.map(card => fetchCardPrices(card.card_id));
                const prices = await Promise.all(pricePromises);
                
                // Create a lookup object for faster access (key by card_id), skipping those without prices
                const pricesById = prices.reduce((acc, priceData, index) => {
                    if (priceData && cards[index]) {
                        // Only add to the accumulator if priceData is valid
                        acc[cards[index].card_id] = priceData;
                    }
                    return acc;
                }, {});
        
                setCardPrices(pricesById);
            } catch (error) {
                console.error("Error fetching prices:", error);
                setPriceError("An error occurred fetching prices.");
            } finally {
                setLoadingPrices(false);
            }
        };
    
        fetchPricesForCards();
    }, [cards]);
    
    // Handle adding card to collection
    const handleCardToCollection = useCallback(async (cardId, count) => {
        if (count <= 0) {
            alert('You must select at least one card to update to your collection.');
            return;
        }

        const payload = {
            email: user?.email,
            card_id: cardId,
            count: count,
        };

        try {
            const response = await addCardToCollection(payload);
            console.log('Card updated:', response.data);
            setCardCounts(prevCounts => ({ ...prevCounts, [cardId]: count }));
            alert('Collection updated');

            // Refresh collection
            const collectionData = await fetchUserCollection(user?.email);
            setUserCards(collectionData);

            // Handle toast notification
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
    }, [user?.email, toastId, toastCount]);

    // Handle removing card from collection
    const handleRemoveCardFromCollection = useCallback(async (cardId) => {
        if (!user?.email) {
            alert('You must be logged in to do this');
            return;
        }

        try {
            const response = await removeCardFromCollection(user.email, cardId, 1);
            console.log('Card removed:', response);
            setCardCounts(prevCounts => ({ ...prevCounts, [cardId]: response.count }));
            alert(response.message);

            // Update/refresh collection
            const collectionData = await fetchUserCollection(user.email);
            setUserCards(collectionData);
        } catch (error) {
            console.error('Error removing card:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred while removing the card';
            alert(errorMessage);

            // Refresh collection to ensure proper state
            const collectionData = await fetchUserCollection(user.email);
            setUserCards(collectionData);
        }
    }, [user?.email]);

    // Increment card count
    const handleIncrement = useCallback(async (index) => {
        const cardId = cards[index].id;
        const newCount = (cardCounts[cardId] || 0) + 1;

        setCardCounts(prev => ({ ...prev, [cardId]: newCount }));
        await handleCardToCollection(cardId, newCount);
    }, [cards, cardCounts, handleCardToCollection]);

    // Decrement card count
    const handleDecrement = useCallback(async (index) => {
        const cardId = cards[index].id;
        const currentCount = cardCounts[cardId] || 0;

        if (currentCount > 0) {
            setCardCounts(prev => ({ ...prev, [cardId]: currentCount - 1 }));
            await handleRemoveCardFromCollection(cardId);

            if (currentCount === 1) {
                alert("Last card removed from your collection.");
            }
        }
    }, [cards, cardCounts, handleRemoveCardFromCollection]);

    // Fetch user collection on user change
    useEffect(() => {
        const fetchCollection = async () => {
            if (!user || !user.email) {
                console.error('User is not logged in, cannot fetch their collection');
                return;
            }

            try {
                const data = await fetchUserCollection(user.email);
                setUserCards(data);
            } catch (error) {
                console.error('Error fetching user collection:', error);
            }
        };

        fetchCollection();
    }, [user]);

    // Initialize card counts from user cards
    useEffect(() => {
        const initialCounts = {};
        if (Array.isArray(userCards)) {
            userCards.forEach(card => {
                initialCounts[card.card_id] = card.count;
            });
        }
        setCardCounts(prevCounts => {
            const hasDifferentCounts = Object.keys(initialCounts).some(id => initialCounts[id] !== prevCounts[id]);
            return hasDifferentCounts ? initialCounts : prevCounts;
        });
    }, [userCards]);

    // Card click handling
    const handleCardClick = (card) => {
        setSelectedCard(card);
    };

    const handleCloseCardDisplay = () => {
        setSelectedCard(null);
    };

    return (
        <div>
            <Grid container spacing={2}>
                {cards.map((card, index) => {
                    const priceData = cardPrices[card.card_id];

                    // Skip cards without price data
                    if (!priceData) {
                        return null; // Skip rendering this card
                    }

                    return (
                        <Grid 
                            item 
                            key={card.id} 
                            xs={12} 
                            sm={6} 
                            md={4} 
                            className="card-item" 
                            data-index={index} 
                        >
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <CardDisplay card={card} onClick={() => handleCardClick(card)} />
                                
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    marginTop: '-30px'
                                }}>
                                    <IconButton 
                                        onClick={() => handleDecrement(index)} 
                                        size="small" 
                                        disabled={cardCounts[card.id] === 0}
                                    >
                                        <Remove />
                                    </IconButton>

                                    <FormControlLabel
                                        control={
                                            <Checkbox 
                                                checked={!!cardCounts[card.id]} 
                                                color="primary" 
                                            />
                                        }
                                        label={cardCounts[card.id] || 0} 
                                    />

                                    <IconButton 
                                        onClick={() => handleIncrement(index)} 
                                        size="small"
                                    >
                                        <Add />
                                    </IconButton>
                                    
                                    {/* Use displayPriceInfo function to display card prices */}
                                    {displayPriceInfo(priceData)}
                                </div>
                            </div>
                        </Grid>
                    );
                })}
            </Grid>

            {selectedCard && (
                <CardDisplay card={selectedCard} onClose={handleCloseCardDisplay} />
            )}
            {loadingPrices && <Typography>Loading prices...</Typography>}
            {priceError && <Typography color="error">{priceError}</Typography>}
        </div>
    );
};

export default CardList;