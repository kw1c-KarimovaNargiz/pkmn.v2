import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Checkbox, FormControlLabel, IconButton, Skeleton} from '@mui/material';
import { toast } from 'react-toastify';
import { Add, Remove } from '@mui/icons-material';
import CardDisplay from './CardDisplay';
import { addCardToCollection, removeCardFromCollection, fetchUserCollection } from '../services/api';
import { useUser } from '../pages/UserContext';
import useApi from '../hooks/useApi';

const CardList = ({ cards }) => {
    const { authToken } = useUser();
    const [loading, setLoading] = useState(true);
    const [cardCounts, setCardCounts] = useState({});
    const [userCards, setUserCards] = useState({});
    const [selectedCard, setSelectedCard] = useState(null);
    const [toastId, setToastId] = useState(null);
    const [toastCount, setToastCount] = useState(0);

    const { data: collectionData, error: collectionError, isLoading: collectionLoading, triggerFetch: refetchCollection } = useApi('collections', {}, true, 'GET');

    useEffect(() => {
        setLoading(cards.length === 0 && collectionLoading);
    }, [cards, collectionLoading]);
    useEffect(() => {

        setLoading(true);
        if (cards.length > 0) {
            setLoading(false);
        }
    }, [cards]);
    
    const handleCardToCollection = useCallback(async (cardId, variant, count) => {
        if (count <= 0) {
            alert('You must select at least one card to update to your collection.');
            return;
        }

        const payload = {
            authToken: authToken,
            card_id: cardId,
            variant,
            count: count,
        };

        try {
            const response = await addCardToCollection(payload);
            
            console.log('Card updated:', response.data);

            setCardCounts(prevCounts => ({
                ...prevCounts,
               
                    ...prevCounts,
                    [variant]: count,

            }));

            refetchCollection();
            
            // Handle toast notification
            if (toast.isActive(toastId)) {
                let newToastCount = toastCount + 1;
                setToastCount(newToastCount);
                toast.update(toastId, {
                    render: `Card added successfully! (${++newToastCount})`,
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
    }, [authToken]);

    //handle remove card
    const handleRemoveCardFromCollection = useCallback(async (cardId, variant, count) => {
        if (!authToken) {
            alert('You must be logged in to do this');
            return;
        }
        if (count <= 0) {
            alert('You must select at least one card to update to your collection.');
            return;
        }

     
        try {
            const response = await removeCardFromCollection(authToken, cardId, count, variant);

            setCardCounts(prevCounts => ({
                ...prevCounts,
                [variant]: response.count,
            }));
            
            alert(response.message);
            
            //update/refresh collection
          refetchCollection();
            setUserCards(collectionData);
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred while removing the card';
            alert(errorMessage);

            //refresh collection to ensure proper state
            const collectionData = await fetchUserCollection(authToken);
            setUserCards(collectionData);
        }
    }, [authToken]);

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
        const newCount = currentCount - 1;
    
                setCardCounts(prevCounts => ({
                    ...prevCounts,
                    [cardId]: {
                        ...prevCounts[cardId],
                        [variant]: newCount
                    }
                }));
    
                await handleRemoveCardFromCollection( cardId , variant,  newCount);

    }, [cardCounts, handleRemoveCardFromCollection]);

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
                            {/* Pass only the necessary props to CardDisplay */}
                            {loading ? (
        <Skeleton 
            variant="rectangular" 
            width="100%" 
            sx={{ paddingTop: '139%', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} 
        />
    ) : (
        <CardDisplay 
            card={card} 
            onClick={() => handleCardClick(card)} 
        />
    )}
                            <div className="flex flex-col items-center w-full mt-2 gap-2">
                                {/* Normal variant controls */}
                                {card.price_data?.tcgplayer?.normal && (
                                <div className="flex items-center gap-2">
                                     <FormControlLabel
                                    control={
                                        <Checkbox 
                                        checked={!!cardCounts[card.card_id]?.normal} 
                                        sx={{
                                            '&.Mui-checked': {
                                                color: 'yellow', 
                                            },
                                          
                                        }} 
                                    />
                                    }
                                    label={cardCounts[card.card_id]?.normal || 0} 
                                />
                                    <IconButton 
                                        onClick={() => handleDecrement(card.card_id, 'normal')} 
                                        size="small" 
                                        disabled={(cardCounts[card.card_id]?.normal || 0) === 0}
                                    >
                                        <Remove />
                                    </IconButton>
                                 

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

                                <FormControlLabel
                                    control={
                                        <Checkbox 
                                        checked={!!cardCounts[card.card_id]?.holofoil} 
                                        sx={{
                                            '&.Mui-checked': {
                                                color: 'purple', 
                                            },
                                          
                                        }} 
                                    />
                                    }
                                    label={cardCounts[card.card_id]?.holofoil || 0} 
                                />
                                        <IconButton 
                                            onClick={() => handleDecrement(card.card_id, 'holofoil')} 
                                            size="small" 
                                            disabled={(cardCounts[card.card_id]?.holofoil || 0) === 0}
                                        >
                                            <Remove />
                                        </IconButton>

                                 

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
                                    <FormControlLabel
                                    control={
                                        <Checkbox 
                                        checked={!!cardCounts[card.card_id]?.reverseHolofoil} 
                                        sx={{
                                            '&.Mui-checked': {
                                                color: 'blue', 
                                            },
                                          
                                        }} 
                                    />
                                    }
                                    label={cardCounts[card.card_id]?.reverseHolofoil || 0} 
                                />
                                        <IconButton 
                                            onClick={() => handleDecrement(card.card_id, 'reverseHolofoil')} 
                                            size="small" 
                                            disabled={(cardCounts[card.card_id]?.reverseHolofoil || 0) === 0}
                                        >
                                            <Remove />
                                        </IconButton>

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