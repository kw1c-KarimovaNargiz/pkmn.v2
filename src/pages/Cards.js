// Cards.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import pokemonData from '../scrapes/gen_scarlet_violet.json'; // Adjust the path if needed

const Cards = () => {
  const { setName } = useParams();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const filteredCards = pokemonData.filter(card => card.set === decodeURIComponent(setName));
    setCards(filteredCards);
  }, [setName]);

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={4} key={card.number}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {card.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.flavor_text}
              </Typography>
              <Typography variant="body1">
                HP: {card.hp}
              </Typography>
              <Typography variant="body1">
                Retreat cost: {card.retreat_cost}
              </Typography>
              <Typography variant="body1">
                Evolves into: {card.evolves_into}
              </Typography>
              <Typography variant="body1">
                Number: {card.number}
              </Typography>
              <Typography variant="body1">
                Rarity: {card.rarity}
              </Typography>
              
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Cards;
