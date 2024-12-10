import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CardList from '../components/CardList';
import { fetchCardsForSet } from '../services/api';

const Pokedex = ({ 
    isCollectionView = true,
    showCollectionTitle = false,
    totalCollectionValue = 0,
    totalCardCount = 0,
    uniqueOwnedCardsCount = () => 0 
}) => {
    const { setId } = useParams();
    const [loading, setLoading] = useState(true);

    return (
        <div>
            <CardList 
                type="pokedex"
                isCollectionView={isCollectionView}
                initialSetId={setId}
                showCollectionTitle={showCollectionTitle}
                totalCollectionValue={totalCollectionValue}
                totalCardCount={totalCardCount}
                uniqueOwnedCardsCount={uniqueOwnedCardsCount}
            />
        </div>
    );
};

export default Pokedex;