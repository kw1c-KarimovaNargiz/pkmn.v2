// src/components/CardList.js
import React from 'react';
import { Grid } from '@mui/material';
import CardDisplay from './CardDisplay';

const CardList = ({ cards }) => {
    return (
        <Grid container spacing={3}>
            {cards.map((card) => (
                <Grid item xs={12} sm={6} md={4} key={card.number}>
                    <CardDisplay card={card} />
                </Grid>
            ))}
        </Grid>
    );
};
export default CardList;
