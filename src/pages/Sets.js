// Sets.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Card, CardContent } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import pokemonSets from '../scrapes/pokemon_sets.json';
import pokemonData from '../scrapes/gen_scarlet_violet.json'; // Import your cards data
import './Sets.css'; // Ensure this path is correct

const Sets = () => {
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null); // State for selected set
  const [cards, setCards] = useState([]); // State for cards of the selected set

  useEffect(() => {
    const formattedSets = Object.entries(pokemonSets).map(([series, setNames]) => ({
      series,
      setNames,
    }));
    setSets(formattedSets);
  }, []);

  // Function to handle set selection and fetch corresponding cards
  const handleSetSelect = (setName) => {
    const filteredCards = pokemonData.filter(card => card.set === decodeURIComponent(setName));
    setSelectedSet(setName);
    setCards(filteredCards);
  };

  return (
    <div className="sets-container">
      <div className="sidebar">
        {sets.map((set) => (
          <Accordion key={set.series}>
            <AccordionSummary
              expandIcon={<ArrowDownwardIcon />}
              aria-controls={`${set.series}-content`}
              id={`${set.series}-header`}
            >
              <Typography variant="h6">{set.series}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" gutterBottom>
                Sets:
              </Typography>
              <ul>
                {set.setNames.map((name) => (
                  <li key={name}>
                    <button
                      onClick={() => handleSetSelect(name)}
                      style={{ textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

      {/* Cards Display Area */}
      <div className="cards-display-area">
        {selectedSet ? (
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
        ) : (
          <Typography variant="h6" component="div" align="center">
        
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Sets;
