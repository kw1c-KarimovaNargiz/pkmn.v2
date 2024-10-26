import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Grid, Typography, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import { Add, Remove } from '@mui/icons-material';
import CardDisplay from './CardDisplay';
import { addCardToCollection,  removeCardFromCollection, fetchUserCollection } from '../services/api';
import { useUser } from '../pages/UserContext';

const CardList = ({ cards }) => {
    const { user } = useUser(); 
    const [visibleCards, setVisibleCards] = useState([]);
    const [cardCounts, setCardCounts] = useState({});
    const [userCards, setUserCards] = useState([]);
    const observerRef = useRef(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [toastId, setToastId] = useState(null);
    const [toastCount, setToastCount] = useState(0);
    //handle add card
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
            console.log('Sending payload:', payload);
            
            const response = await addCardToCollection(payload);
            console.log('Card updated:', response.data);
            
            setCardCounts(prevCounts => ({
                ...prevCounts,
                [cardId]: count
            }));
            
            alert('Collection updated');
    
            //refresh collection
            const collectionData = await fetchUserCollection(user?.email);
            setUserCards(collectionData);
            
            console.log('toast is active:', toast.isActive(toastId));
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
    }, [user?.email]);

    //handle remove card
    const handleRemoveCardFromCollection = useCallback(async (cardId, count) => {
        if (!user?.email) {
            alert('You must be logged in to do this');
            return;
        }
        // if (count <= 0) {
        //     alert('Please specify a valid number of cards to remove');
        //     return;
        // }
    
        try {
            const response = await removeCardFromCollection(user.email, cardId, count);
            console.log('Card removed:', response);
            
            //local state update
            setCardCounts(prevCounts => ({
                ...prevCounts,
                [cardId]: response.count
            }));
            
            alert(response.message);
            
            //update/refresh collection
            const collectionData = await fetchUserCollection(user.email);
            setUserCards(collectionData);
            
        } catch (error) {
            console.error('Error removing card:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred while removing the card';
            alert(errorMessage);
            
            //refresh collection to ensure proper state
            const collectionData = await fetchUserCollection(user.email);
            setUserCards(collectionData);
        }
    }, [user?.email]);

 
    //increment for addcard function
    const handleIncrement = useCallback(async (index) => {
        const cardId = cards[index].id;
        const newCount = (cardCounts[cardId] || 0) + 1;
    
        setCardCounts((prev) => ({
            ...prev,
            [cardId]: newCount,
        }));
    
        await handleCardToCollection(cardId, newCount);
    }, [cards, cardCounts, handleCardToCollection]);
    
    //decrement for remove card function
    const handleDecrement = useCallback(async (index) => {
        const cardId = cards[index].id;
        const currentCount = cardCounts[cardId] || 0; 
      
        setCardCounts((prev) => ({
          ...prev,
          [cardId]: currentCount - 1, 
        }));
      
        await handleRemoveCardFromCollection(cardId, 1); 
        //check if last card 1 to 0 succeeded
        if (currentCount === 1) {
          alert("Last card removed from your collection.");
        }
      }, [cards, cardCounts, handleRemoveCardFromCollection]);

      
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

 
    // const setTitle = cards.length > 0 && cards[0].set ? cards[0].set.set_name : "";
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