import React, { useEffect, useState } from 'react';
import { useUser } from '../pages/UserContext';
import CardList from '../components/CardList';
import SetsSidebar from '../components/SetsSideBar';
import '../styling/Index.css';
import { fetchSeries, fetchCardsForSet, searchCard, fetchSubTypes, addCardToCollection, removeCardFromCollection } from '../services/api';
import useApi from '../hooks/useApi';

const CollectionPage = () => {
    const { user, authToken, userLoading } = useUser ();
    const [userCollection, setUserCollection] = useState([]);
    const [, setSets] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSetId, setSelectedSetId] = useState('all');
    const [series, setSeries] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [subTypes, setSubTypes] = useState([]);
    const [cards, setCards] = useState([]);
    const [, setOriginalCards] = useState([]); 

    const { data: collectionData, error: collectionError, isLoading: collectionLoading, triggerFetch: refetchCollection } = useApi('collections', {}, false, 'GET');

    useEffect(() => {
        if (authToken && !userLoading) {
            refetchCollection();
        }
    }, [authToken, userLoading]);

    useEffect(() => {
        if (collectionData) {
            setUserCollection(collectionData);
            setLoading(false);
        }
        if (collectionError) {
            setError('Failed to fetch user collection');
            setLoading(false);
        }
    }, [collectionData, collectionError, collectionLoading]);
    useEffect(() => {
        const loadSeries = async () => {
            setLoading(true);
            try {
                const seriesData = await fetchSeries(); 
                setSeries(seriesData);
    
                if (seriesData.length > 0) {
                    const firstSeries = seriesData[0];
                    setSets(firstSeries.sets || []);
    
                    if (firstSeries.sets && firstSeries.sets.length > 0) {
                        const firstSet = firstSeries.sets[0];
                        setSelectedSetId(firstSet.id);
                        await handleSetSelect(firstSet.id);
                    }
                }
            } catch (error) {
                console.error("Cannot fetch series/sets", error);
            } finally {
                setLoading(false); 
            }
        };
        loadSeries(); 
    }, []);
    const handleSetSelect = async (setId) => {
        setLoading(true);
        setSelectedSetId(setId);

        try {
            const cardData = await fetchCardsForSet(setId); 
            setCards(cardData);
            setOriginalCards(cardData); 
            setFilteredCards(cardData);

            const subTypeData = await fetchSubTypes(setId); 
            setSubTypes(subTypeData);
        } catch (error) {
            console.error("Error loading cards:", error);
            setCards([]); 
            setFilteredCards([]); 
            setSubTypes([]);
        } finally {
            setLoading(false); 
        }
    };


    useEffect(() => {
        const uniqueTypes = [...new Set(cards.flatMap((card) => card.types))];
        setAllTypes(uniqueTypes);
      
        const uniqueSubTypes = [...new Set(cards.flatMap((card) => card.subtypes || []))];
        setSubTypes(uniqueSubTypes); 
    }, [cards]); // This effect is now correctly placed

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    const handleSeriesSelect = (selectedSeries) => {
        setSets(selectedSeries.sets || []); 
    };
    
    const handleFilter = (types, subtypes, isSortedByEvo) => {
        let filtered = cards;
      
        if (types.length > 0) {
            filtered = filtered.filter((card) =>
                types.some((type) => card.types.includes(type))
            );
        }
      
        if (subtypes.length > 0) {
            filtered = filtered.filter((card) =>
                subtypes.some((subtype) => card.subtypes.includes(subtype))
            );
        }

        if (isSortedByEvo) {
            filtered = filtered.sort((a, b) => a.evolutionStage - b.evolutionStage);
        }

        setFilteredCards(filtered);
    };
    
    return (
        <div className='index-container'>
        <div className="sidebar">
        <SetsSidebar
              series={series} 
              onSetSelect={handleSetSelect} 
              onSeriesSelect={handleSeriesSelect} 
              availableTypes={allTypes}
              availableSubTypes={subTypes}
              onFilter={handleFilter}    
          isCollectionView={true}
        />
         </div>
      <div className="cards-display-area">
            {userCollection.length > 0 ? (
                <CardList cards={userCollection.map(item => item.card)} />
            ) : (
                <p>No cards in your collection.</p>
            )}
        </div>
      </div>
    );
};

export default CollectionPage;