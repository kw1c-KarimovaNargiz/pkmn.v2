import React from 'react';
import CardList from '../components/CardList';
import { useUser } from '../pages/UserContext';
import '../styling/Index.css';
import { Box } from '@mui/material';

const Index = ({ searchResults, setSearchResults, setSearchTerm }) => {
    const { userLoading } = useUser();

    if (userLoading) return null;

    return (
     
          
            <CardList type='index' searchResults={searchResults} setSearchResults={setSearchResults} setSearchTerm={setSearchTerm} />
        
     

    );
};

export default Index;