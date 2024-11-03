import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Grid, Typography, Checkbox, FormControlLabel, IconButton, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { Add, Remove } from '@mui/icons-material';
import CardDisplay from './CardDisplay';
import { addCardToCollection, removeCardFromCollection, fetchUserCollection } from '../services/api';
import { useUser } from '../pages/UserContext';

const CardList = ({ cards }) => {
    const { user } = useUser();
    const [cardCounts, setCardCounts] = useState({});
    const [userCards, setUserCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [toastId, setToastId] = useState(null);
    const [toastCount, setToastCount] = useState(0);

    const handleCardToCollection = useCallback(async (cardId, variant, count) => {
        if (!user?.email) {
            alert('You must be logged in to do this');
            return;
        }
        
        if (count <= 0) {
            alert('You must select at least one card to update to your collection.');
            return;
        }

        const payload = {
            email: user.email,
            card_id: cardId,
            variant,
            count: count,
        };

        try {
            const response = await addCardToCollection(payload);
            
            setCardCounts(prevCounts => ({
                ...prevCounts,
               
                    ...prevCounts,
                    [variant]: count,
                  
             
            }));

            // Handle toast notification
            if (toast.isActive(toastId)) {
                const newToastCount = toastCount + 1;
                setToastCount(newToastCount);
                toast.update(toastId, {
                    render: `Card added successfully! (${newToastCount})`,
                    type: 'success',
                    autoClose: 3000,
                });
            } else {
                setToastId(toast.success('Card added successfully!'));
            }

            // Refresh collection
            const collectionData = await fetchUserCollection(user.email);
            setUserCards(collectionData);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred while adding the card';
            alert(errorMessage);
        }
    }, [user?.email, toastId, toastCount]);

    const handleRemoveCardFromCollection = useCallback(async (cardId, variant, count) => {
        if (!user?.email) {
            alert('You must be logged in to do this');
            return;
        }

        try {
            await removeCardFromCollection(user.email, cardId, variant, count);
            
            setCardCounts(prevCounts => ({
                ...prevCounts,
                [cardId]: {
                    ...prevCounts[cardId],
                    [variant]: Math.max(0, (prevCounts[cardId]?.[variant] || 0) - count)
                }
            }));

            // Refresh collection
            const collectionData = await fetchUserCollection(user.email);
            setUserCards(collectionData);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred while removing the card';
            alert(errorMessage);
        }
    }, [user?.email]);

    const handleIncrement = useCallback(async (cardId, variant) => {
        const currentCount = cardCounts[cardId]?.[variant] || 0;
        const newCount = currentCount + 1;
        await handleCardToCollection(cardId, variant, newCount);
    }, [cardCounts, handleCardToCollection]);

    const handleDecrement = useCallback(async (cardId, variant) => {
        const currentCount = cardCounts[cardId]?.[variant] || 0;
        if (currentCount > 0) {
            await handleRemoveCardFromCollection(cardId, variant, 1);
        }
    }, [handleRemoveCardFromCollection]);

    useEffect(() => {
        const fetchCollection = async () => {
            if (!user?.email) return;

            try {
                const data = await fetchUserCollection(user.email);
                setUserCards(data);
            } catch (error) {
                console.error('Error fetching user collection:', error);
            }
        };

        fetchCollection();
    }, [user]);

    useEffect(() => {
        const initialCounts = {};
        
        if (Array.isArray(userCards)) {
            userCards.forEach(card => {
                initialCounts[card.card_id] = {
                    normal: card.normal_count,
                    holofoil: card.holo_count,
                    reverseHolofoil: card.reverse_holo_count,
                };
            });
        }
        
        setCardCounts(initialCounts);
    }, [userCards]);

    const handleCardClick = (card) => {
        setSelectedCard(card);
    };

    const handleCloseCardDisplay = () => {
        setSelectedCard(null);
    };

    return (
        <div>
            <Grid container spacing={2}>
                {cards.map((card) => (
                    <Grid 
                        item 
                        key={card.id} 
                        xs={12} 
                        sm={6} 
                        md={4} 
                        className="card-item"
                    >
                        <div className="flex flex-col items-center gap-1">
                            <CardDisplay card={card} onClick={() => handleCardClick(card)} />
                            
                            <div className="flex flex-col items-center w-full mt-4 gap-2">
                                {/* Normal variant controls */}
                                {card.price_data?.tcgplayer?.normal && (
                                <div className="flex items-center gap-2">
                                    <IconButton 
                                        onClick={() => handleDecrement(card.normal_count, 'normal')} 
                                        size="small" 
                                        disabled={(cardCounts[card.card_id]?.normal || 0) === 0}
                                    >
                                        <Remove />
                                    </IconButton>

                                    <Typography>
                                        Normal: {cardCounts[card.card_id]?.normal || 0}
                                    </Typography>

                                    <IconButton 
                                        onClick={() => handleIncrement(card.card_id, 'normal')} 
                                        size="small"
                                    >
                                        <Add />
                                    </IconButton>
                                </div>
                                 )}

                                {/* Holofoil variant controls */}
                                {card.price_data?.tcgplayer?.holofoil && (
                                    <div className="flex items-center gap-2">
                                        <IconButton 
                                            onClick={() => handleDecrement(card.card_id, 'holofoil')} 
                                            size="small" 
                                            disabled={(cardCounts[card.card_id]?.holofoil || 0) === 0}
                                        >
                                            <Remove />
                                        </IconButton>

                                        <Typography>
                                            Holofoil: {cardCounts[card.card_id]?.holofoil || 0}
                                        </Typography>

                                        <IconButton 
                                            onClick={() => handleIncrement(card.card_id, 'holofoil')} 
                                            size="small"
                                        >
                                            <Add />
                                        </IconButton>
                                    </div>
                                )}

                                {/* Reverse Holofoil variant controls */}
                                {card.price_data?.tcgplayer?.reverseHolofoil && (
                                    <div className="flex items-center gap-2">
                                        <IconButton 
                                            onClick={() => handleDecrement(card.card_id, 'reverseHolofoil')} 
                                            size="small" 
                                            disabled={(cardCounts[card.card_id]?.reverseHolofoil || 0) === 0}
                                        >
                                            <Remove />
                                        </IconButton>

                                        <Typography>
                                            Reverse Holo: {cardCounts[card.card_id]?.reverseHolofoil || 0}
                                        </Typography>

                                        <IconButton 
                                            onClick={() => handleIncrement(card.card_id, 'reverseHolofoil')} 
                                            size="small"
                                        >
                                            <Add />
                                        </IconButton>
                                    </div>
                                )}
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