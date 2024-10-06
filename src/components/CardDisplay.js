// src/components/CardDisplay.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CardDisplay = ({ card }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {card.name}
                </Typography>
                <img 
                    src={card.images.large}
                    alt={card.name} 
                    style={{ width: '100%', height: 'auto' }}
                />
                <Typography variant="body2" color="text.secondary">
                    {card.flavorText}
                </Typography>
                <Typography variant="body1">HP: {card.hp}</Typography>
                <Typography variant="body1">Retreat cost: {card.retreatCost}</Typography>
                <Typography variant="body1">Evolves into: {card.evolvesFrom}</Typography>
                <Typography variant="body1">Number: {card.number}</Typography>
                <Typography variant="body1">Rarity: {card.rarity}</Typography>
            </CardContent>
        </Card>
    );
};

export default CardDisplay;
