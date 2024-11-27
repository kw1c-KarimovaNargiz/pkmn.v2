import React from 'react';
import CardList from '../components/CardList';
import { useUser } from '../pages/UserContext';
import '../styling/Index.css';
import { Box } from '@mui/material';

const Index = ({ searchResults, setSearchResults }) => {
    const { userLoading } = useUser();

    if (userLoading) return null;

    return (
        <Box sx={{ display: 'flex', }}>
            <CardList type='index' searchResults={searchResults} setSearchResults={setSearchResults} />
        </Box>
    );
};

export default Index;