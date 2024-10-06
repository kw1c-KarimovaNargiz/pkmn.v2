import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function TestPageSeries() {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch all series data when the component mounts
    useEffect(() => {
        const fetchSeries = async () => {
            try {
                const response = await fetch('https://api.tcgdex.net/v2/en/series/');
                if (!response.ok) {
                    throw new Error('Failed to fetch series');
                }
                const data = await response.json();
                setSeries(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch series');
                setLoading(false);
            }
        };

        fetchSeries();
    }, []);

    const handleSeriesClick = (id) => {
        // Navigate to TestPageSeriesSets.js with the selected series' id
        navigate(`/series/${id}`);
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                All Pokémon TCG Series
            </Typography>
            <List>
                {series.map((serie) => (
                    <ListItem key={serie.id} button onClick={() => handleSeriesClick(serie.id)}>
                        <Avatar src={serie.logo} alt={`${serie.name} logo`} sx={{ mr: 2 }} />
                        <ListItemText primary={serie.name} secondary={`ID: ${serie.id}`} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export default TestPageSeries;
