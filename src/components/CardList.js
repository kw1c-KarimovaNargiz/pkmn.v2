import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Grid, Typography, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import CardDisplay from './CardDisplay';
import { addCardToCollection } from '../services/api';
import { useUser } from '../pages/UserContext';

const CardList = ({ cards }) => {
    const { user } = useUser();
    const [visibleCards, setVisibleCards] = useState([]);
    const [cardCounts, setCardCounts] = useState({});
    const observerRef = useRef(null);

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

    const setTitle = cards.length > 0 && cards[0].set ? cards[0].set.set_name : "Unknown Set";

    const handleIncrement = (index) => {
        console.log(`Incrementing card at index ${index}`);
        setCardCounts((prev) => ({
            ...prev,
            [index]: (prev[index] || 0) + 1,
        }));
    };

    const handleDecrement = (index) => {
        setCardCounts((prev) => ({
            ...prev,
            [index]: Math.max((prev[index] || 0) - 1, 0),
        }));
    };

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
    
        console.log('Payload:', payload); 
    
        try {
            const response = await addCardToCollection(payload);
            console.log('Card added:', response.data);
            alert('Card added successfully!');
        } catch (error) {
            console.error('Error adding card:', error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                alert('You must be logged in to add cards to your collection.');
            }
        }
    };
    

    const handleCheckboxChange = (index) => {
        const cardId = cards[index].card_id; // Assuming the card object has an 'id'
        const count = cardCounts[index] || 0;

        console.log(`Checkbox changed for card ${cardId} with count ${count}`);
        handleAddCardToCollection(cardId, count);
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
                        key={card.id || index} 
                        xs={12} 
                        sm={6} 
                        md={4} 
                        className="card-item" 
                        data-index={index} 
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => handleDecrement(index)} size="small" disabled={cardCounts[index] === 0}>
                                <Remove />
                            </IconButton>

                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        checked={!!cardCounts[index]} 
                                        color="primary" 
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                }
                                label={cardCounts[index] || 0}
                            />

                            <IconButton onClick={() => handleIncrement(index)} size="small">
                                <Add />
                            </IconButton>
                        </div>
                        
                        {visibleCards.includes(card) ? (
                            <CardDisplay card={card} />
                        ) : (
                            <div style={{ minHeight: '150px' }}>Loading...</div>
                        )}
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default CardList;
