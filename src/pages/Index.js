// src/pages/Index.js
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import CardList from '../components/CardList';
import SetsSidebar from '../components/SetsSideBar'; 
import axios from 'axios';  // Import Axios
import '../styling/Index.css'; 

const Index = () => {
    const [sets, setSets] = useState([]); 
    const [series, setSeries] = useState([]); 
    const [selectedSeries, setSelectedSeries] = useState(null); 
    const [selectedSetId, setSelectedSetId] = useState(null); 
    const [cards, setCards] = useState([]); 

   
     //sorted series - sorted sets
     useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/series'); 
                const fetchedSeries = response.data;
    
                const sortedSeries = fetchedSeries.sort((a, b) => {
                    const latestReleaseDateA = new Date(
                        Math.max(...a.sets.map(set => new Date(set.release_date)))
                    );
    
                    const latestReleaseDateB = new Date(
                        Math.max(...b.sets.map(set => new Date(set.release_date)))
                    );
    
                    return latestReleaseDateB - latestReleaseDateA;
                });
    
                //for each series, sort the sets from new to old
                const sortedSeriesSets = sortedSeries.map(series => {
                    return {
                        ...series,
                        sets: series.sets.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                    };
                });
    
                setSeries(sortedSeriesSets); 
            } catch (error) {
                console.error("Cannot fetch series or sets:", error);
            }
        };
    
        fetchSeries(); 
    }, []);
    
    

    //cards by selected set
    const handleSetSelect = async (setId) => {
        setSelectedSetId(setId); 
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/sets/${setId}/cards`); 
            setCards(response.data); 
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
                    series={series} 
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
