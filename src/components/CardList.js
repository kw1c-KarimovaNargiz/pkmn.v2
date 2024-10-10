// src/components/CardList.js
import React, { useEffect, useState, useRef } from 'react';
import { Grid } from '@mui/material';
import CardDisplay from './CardDisplay';

const CardList = ({ cards }) => {
    const [visibleCards, setVisibleCards] = useState([]);
    const observerRef = useRef(null);

    useEffect(() => {
        const handleIntersect = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const cardIndex = parseInt(entry.target.getAttribute('data-index'));
                    setVisibleCards((prev) => [...prev, cards[cardIndex]]);
                    observerRef.current.unobserve(entry.target); // Stop observing once card is visible
                }
            });
        };

        // Initialize Intersection Observer
        observerRef.current = new IntersectionObserver(handleIntersect, {
            root: null, // Viewport is the default root
            rootMargin: '0px',
            threshold: 0.1, // Trigger when 10% of the card is visible
        });

        // Observe each card item
        const elements = document.querySelectorAll('.card-item');
        elements.forEach((element) => observerRef.current.observe(element));

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [cards]);

    return (
        <Grid container spacing={2}>
            {cards.map((card, index) => (
                <Grid 
                    item 
                    key={card.id || index} 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    className="card-item" 
                    data-index={index} // Use data attribute to keep track of the card index
                >
                    {visibleCards.includes(card) ? (
                        <CardDisplay card={card} />
                    ) : (
                        <div style={{ minHeight: '150px' }}>Loading...</div> // Placeholder until card is visible
                    )}
                </Grid>
            ))}
        </Grid>
    );
};

export default CardList;
