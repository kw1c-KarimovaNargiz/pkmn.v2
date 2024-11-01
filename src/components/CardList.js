import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Grid, Typography, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import { Add, Remove } from '@mui/icons-material';
import CardDisplay from './CardDisplay'; 
import PriceDisplay from './PriceDisplay';
import { fetchCardPrices, addCardToCollection, removeCardFromCollection, fetchUserCollection } from '../services/api';
import { useUser } from '../pages/UserContext';

const CardList = ({ cards }) => {
    const { user } = useUser();
    const [cardCounts, setCardCounts] = useState({});
    const [userCards, setUserCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [toastId, setToastId] = useState(null);
    const [toastCount, setToastCount] = useState(0);
    const [cardPrices, setCardPrices] = useState([]); // State to store card prices

    // Fetch card prices on component mount
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const prices = await fetchCardPrices();
                const pricesByCardId = prices.reduce((acc, price) => {
                    acc[price.card_id] = price; // Map prices by card_id for quick lookup
                    return acc;
                }, {});
                setCardPrices(pricesByCardId);
            } catch (error) {
                console.error("Error fetching card prices:", error);
            }
        };

        fetchPrices();
    }, []);

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
            {/* <Typography variant="h4" gutterBottom className="card-list-title">
  {setTitle}
</Typography> */}

            <Grid container spacing={2}>
                {cards.map((card, index) => (
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
                                <PriceDisplay price={cardPrices[card.id]?.prices} />
                            </div>
                        </div>
                    </Grid>
                ))}
            </Grid>

            {selectedCard && (
                <CardDisplay card={selectedCard} onClose={handleCloseCardDisplay} />
            )}
        </div>
    );
};

export default CardList;