import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Card, CardContent } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import pokemonSets from '../scrapes/pokemon_sets.json'; 
import './Sets.css'; 

const Sets = () => {
    const [sets, setSets] = useState([]);
    const [selectedSetId, setSelectedSetId] = useState(null); 
    const [cards, setCards] = useState([]); 


    //sets in series & release date
    useEffect(() => {
        const seriesMap = {};
        pokemonSets.forEach(set => {
            const { series, id, name, releaseDate } = set;
            if (!seriesMap[series]) {
                seriesMap[series] = []; 
            }
            seriesMap[series].push({ id, name, releaseDate }); 
        });

        //formatting latest series / sets descending
        const formattedSets = Object.entries(seriesMap).map(([series, setNames]) => {
            setNames.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)); 

            const latestRelease = Math.max(...setNames.map(set => new Date(set.releaseDate)));
            return {
                series,
                setNames,
                latestRelease 
            };
        });

        const sortedSets = formattedSets.sort((a, b) => b.latestRelease - a.latestRelease); 

        setSets(sortedSets); 
    }, []);

   //load cards rfrom selected set
    const handleSetSelect = async (setId) => {
        setSelectedSetId(setId); 
        console.log("Attempting to load cards for set:", setId); 
        try {
            const cardsData = await import(`../scrapes/cards/${setId}.json`);
            setCards(cardsData.default); 
        } catch (error) {
            console.error("Error loading cards:", error);
            setCards([]); 
        }
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
                                {set.setNames.map((setInfo) => (
                                    <li key={setInfo.id}>
                                        <button
                                            onClick={() => handleSetSelect(setInfo.id)} 
                                            style={{ textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            {setInfo.name} 
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>

         
            <div className="cards-display-area">
                {selectedSetId ? (
                    <Grid container spacing={3}>
                        {cards.map((card) => (
                            <Grid item xs={12} sm={6} md={4} key={card.number}>
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
                                        <Typography variant="body1">
                                            HP: {card.hp}
                                        </Typography>
                                        <Typography variant="body1">
                                            Retreat cost: {card.retreatCost} 
                                        </Typography>
                                        <Typography variant="body1">
                                            Evolves into: {card.evolvesFrom}
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
                        Select a set to see the cards.
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default Sets;
