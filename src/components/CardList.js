// src/components/CardList.js
import React from 'react';
import { Grid } from '@mui/material';
import CardDisplay from './CardDisplay';

const CardList = ({ cards }) => {
    return (
        <Grid container spacing={2}>
            {cards.map((card, index) => (
                <Grid item key={card.id || index} xs={12} sm={6} md={4} > {/* Ensure unique key here */}
                    <CardDisplay card={card} />
                </Grid>
            ))}
        </Grid>
    );
};

export default CardList;
