import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, Avatar } from '@mui/material';

function TestPageSeriesSets() {
    const { seriesId } = useParams(); // Get seriesId from the URL
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the sets for the selected series when the component mounts
    useEffect(() => {
        const fetchSets = async () => {
            try {
                const response = await fetch(`https://api.tcgdex.net/v2/en/series/${seriesId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch sets for series');
                }
                const data = await response.json();
                setSets(data.sets); // Assuming `data.sets` contains the sets of the series
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch sets for series');
                setLoading(false);
            }
        };

        fetchSets();
    }, [seriesId]); // Fetch sets again if seriesId changes

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Sets in {seriesId} Series
            </Typography>
            <List>
                {sets.map((set) => (
                    <ListItem key={set.id}>
                        <Avatar src={set.logo} alt={`${set.name} logo`} sx={{ mr: 2 }} />
                        <ListItemText
                            primary={set.name}
                            secondary={`Official Cards: ${set.cardCount.official}, Total Cards: ${set.cardCount.total}`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}

export default TestPageSeriesSets;
