// src/pages/Index.js
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import CardList from '../components/CardList';
import SetsSidebar from '../components/SetsSideBar'; 
import axios from 'axios';  
import '../styling/Index.css'; 

const Index = () => {
    const [sets, setSets] = useState([]); 
    const [series, setSeries] = useState([]); 
    const [selectedSetId, setSelectedSetId] = useState([]); 
    const [cards, setCards] = useState([]); 

   //series and their sets at once
    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/series'); 
                setSeries(response.data);
            } catch (error) {
                console.error("Cannot fetch series/sets", error);
            }
        };
        fetchSeries(); 
    }, []);

    //cards from their
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

    //selectign series,
    const handleSeriesSelect = (selectedSeries) => {
        setSets(selectedSeries.sets || []);
     
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
                    <Typography variant="h6" component="div" align="center"> 
                        Select a set to see the cards.
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default Index;
