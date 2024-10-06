// src/pages/Index.js
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import CardList from '../components/CardList';
import SetsSidebar from '../components/SetsSideBar'; 
import pokemonSets from '../scrapes/pokemon_sets.json'; 
import '../styling/Index.css'; 

const Index = () => {
    const [sets, setSets] = useState([]); 
    const [selectedSeries, setSelectedSeries] = useState(null); 
    const [selectedSetId, setSelectedSetId] = useState(null); 
    const [cards, setCards] = useState([]); 

    useEffect(() => {
        const seriesMap = {};
        pokemonSets.forEach(set => {
            const { series, id, name, releaseDate } = set;
            if (!seriesMap[series]) {
                seriesMap[series] = []; 
            }
            seriesMap[series].push({ id, name, releaseDate }); 
        });

        const formattedSets = Object.entries(seriesMap).map(([series, setNames]) => {
            setNames.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)); 
            const latestReleaseDate = new Date(setNames[0].releaseDate);
            return { series, setNames, latestReleaseDate };
        });

        const sortedSets = formattedSets.sort((a, b) => b.latestReleaseDate - a.latestReleaseDate);

        setSets(sortedSets);
    }, []);

    const handleSetSelect = async (setId) => {
        setSelectedSetId(setId); 
        try {
            const cardsData = await import(`../scrapes/cards/${setId}.json`);
            setCards(cardsData.default); 
        } catch (error) {
            console.error("Error loading cards:", error);
            setCards([]); 
        }
    };

    const handleSeriesSelect = (series) => {
        setSelectedSeries(series);
        setSelectedSetId(null); 
        setCards([]); 
    };

    return (
        <div className="index-container">
            <div className="sidebar">
                <SetsSidebar
                    sets={sets}
                    onSetSelect={handleSetSelect}
                    onSeriesSelect={handleSeriesSelect} 
                />
            </div>
            <div className="cards-display-area">
                {selectedSetId ? (
                    <CardList cards={cards} /> 
                ) : (
                    <Typography variant="h6" component="div" align="center" > 
                        Select a set to see the cards.
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default Index;
