import React, { useEffect, useState, useRef, useCallback } from 'react';
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
        //intersect observer
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
        const newCount = (cardCounts[cardId] || 0) - 1;

        if (newCount < 0) return; 

        setCardCounts((prev) => ({
            ...prev,
            [cardId]: newCount,
        }));

        if (newCount > 0) {
            await handleRemoveCardFromCollection(cardId, newCount);
        } else {
            await handleRemoveCardFromCollection(cardId, 0);
        }
    }, [cardCounts, cards]);

    const handleAddCardToCollection = async (cardId, count) => {
        if (count <= 0) {
            alert('You must select at least one card to add to your collection.');
            return;
        }

        const payload = {
            email: user.email,
            card_id: cardId,
            count: count,
        };

        try {
            const response = await addCardToCollection(payload);
            console.log('Card added:', response.data);
            alert('Card added successfully!');
        } catch (error) {
            console.error('Error adding card:', error.response ? error.response.data : error.message);
            alert('An error occurred while adding the card.');
        }
    };

    const handleRemoveCardFromCollection = async (cardId, count) => {
        if (count < 0) {
            alert('You cannot remove less than zero cards.');
            return;
        }

        const email = user.email;

        try {
            const response = await removeCardFromCollection(email, cardId, count);
            console.log('Card removed:', response);
            alert('Card removed successfully!');
        } catch (error) {
            console.error('Error removing card:', error.response ? error.response.data : error.message);
            alert('An error occurred while removing the card.');
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