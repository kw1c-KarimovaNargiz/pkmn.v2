import React, { useEffect, useState, useRef, useCallback } from 'react';
import {toast} from 'react-toastify';
import { Grid, Typography, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import CardDisplay from './CardDisplay';
import { addCardToCollection, removeCardFromCollection, fetchUserCollection } from '../services/api';
import { useUser } from '../pages/UserContext';

const CardList = ({ cards }) => {
    const { user } = useUser(); 
    const [visibleCards, setVisibleCards] = useState([]);
    const [cardCounts, setCardCounts] = useState({});
    const [userCards, setUserCards] = useState([]);
    const observerRef = useRef(null);
    const [selectedCard, setSelectedCard] = useState(null);

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

    useEffect(() => {
        const handleIntersect = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const cardIndex = parseInt(entry.target.getAttribute('data-index'));
                    setVisibleCards((prev) => [...prev, cards[cardIndex]]);
                    observerRef.current.unobserve(entry.target);
                }
            });
        };

        observerRef.current = new IntersectionObserver(handleIntersect, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        });

        const elements = document.querySelectorAll('.card-item');
        elements.forEach((element) => observerRef.current.observe(element));

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [cards]);

    const setTitle = cards.length > 0 && cards[0].set ? cards[0].set.set_name : "";

    const handleIncrement = useCallback(async (index) => {
        const cardId = cards[index].id;
        const newCount = (cardCounts[cardId] || 0) + 1;

        setCardCounts((prev) => ({
            ...prev,
            [cardId]: newCount,
        }));

        await handleAddCardToCollection(cardId, newCount);
    }, [cardCounts, cards]);

    const handleDecrement = useCallback(async (index) => {
        const cardId = cards[index].id;
        const newCount = Math.max((cardCounts[cardId] || 0) - 1, 0);
        
        setCardCounts((prev) => ({
            ...prev,
            [cardId]: newCount,
        }));

        if (newCount > 0) {
            await handleAddCardToCollection(cardId, newCount);
        }
    }, [cardCounts, cards]);


    //when adding it adds 3x the count
    const handleAddCardToCollection = async (cardId, count) => {
        if (count <= 0) {
            toast.error('You must select at least one card to add to your collection.');
            return;
        }
    
        const payload = {
            email: user.email,
            card_id: cardId,
            count: count,
        };
    
        try {
            // Add logging to debug the payload
            console.log('Sending payload:', payload);
            
            const response = await addCardToCollection(payload);
            console.log('Card added:', response.data);
            
            // Update the local state
            setCardCounts(prevCounts => ({
                ...prevCounts,
                [cardId]: count
            }));
            
            // Optional: Show success message
            toast.success('Card added successfully!');
        } catch (error) {
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat().join('\n');
                toast.error(`Validation failed: ${errorMessage}`);
            } else if (error.response?.status === 401) {
                toast.error('You must be logged in to add cards to your collection.');
            } else if (error.response?.status === 404) {
                toast.error('The card was not found.');
            } else {
                toast.error('An error occurred while adding the card.');
            }
        }
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
    };

    const handleCloseCardDisplay = () => {
        setSelectedCard(null);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                {setTitle}
            </Typography>

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
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => handleDecrement(index)} size="small" disabled={cardCounts[card.id] === 0}>
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

                            <IconButton onClick={() => handleIncrement(index)} size="small">
                                <Add />
                            </IconButton>
                        </div>

                        <CardDisplay card={card} onClick={() => handleCardClick(card)} /> 
                    </Grid>
                ))}
            </Grid>

            {/* Card Details Dialog */}
            {selectedCard && (
                <CardDisplay card={selectedCard} onClose={handleCloseCardDisplay} />
            )}
        </div>
    );
};

export default CardList;