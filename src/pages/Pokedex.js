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
    const [cardData, setCardData] = useState([]);
    const [totalSetCards, setTotalSetCards] = useState(0);

    useEffect(() => {
        const loadCardData = async () => {
            try {
                const data = await fetchCardsForSet(setId);
                setCardData(data);
                setTotalSetCards(data.length);
            } catch (error) {
                console.error("Error loading card data:", error);
            }
        };

        loadCardData();
    }, [setId]);

    return (
        <div>
            <CardList 
                data={cardData}
                showCollectionTitle={showCollectionTitle}
                isCollectionView={isCollectionView}
                totalCollectionValue={totalCollectionValue}
                totalCardCount={totalCardCount}
                totalSetCards={totalSetCards}
                uniqueOwnedCardsCount={uniqueOwnedCardsCount}
            />
        </div>
    );
};

export default Pokedex;