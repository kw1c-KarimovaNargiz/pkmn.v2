import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Grid, Typography, Badge, Checkbox, FormControlLabel, IconButton, Skeleton } from '@mui/material';
import { toast } from 'react-toastify';
import { Add, Remove } from '@mui/icons-material';
import CardDisplay from './CardDisplay';
import { addCardToCollection, removeCardFromCollection, fetchUserCollection } from '../services/api';
import { useUser } from '../pages/UserContext';
import useApi from '../hooks/useApi';

const CardList = ({ cards, isCollectionView, isCardInCollection,  selectedSetId }) => {
    const { user, authToken } = useUser();
    const [loading, setLoading] = useState(true);
    const [cardCounts, setCardCounts] = useState({});
    const [userCards, setUserCards] = useState({});
    const [selectedCard, setSelectedCard] = useState(null);
    const [toastId, setToastId] = useState(null);
    const [toastCount, setToastCount] = useState(0);
    const [displayCount, setDisplayCount] = useState(12);
    const loadingRef = useRef(null);
    const { data: collectionData, error: collectionError, isLoading: collectionLoading, triggerFetch: refetchCollection } = useApi('collections', {}, true, 'GET');
    const [loadingImages, setLoadingImages] = useState({});
    const showSetTitle = !!selectedSetId;
    const [ownedCards, setOwnedCards] = useState(new Set());
    const [instantlyAddedCards, setInstantlyAddedCards] = useState(new Set());

    const [currentIndex, setCurrentIndex] = useState({});
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setDisplayCount((prevCount) => prevCount + 12);
            }
        });

        if (loadingRef.current) {
            observer.observe(loadingRef.current);
        }

        return () => {
            if (loadingRef.current) {
                observer.unobserve(loadingRef.current);
            }
        };
    }, [loadingRef]);

        
    useEffect(() => {
        if (collectionData && Array.isArray(collectionData[0])) {
            const ownedCardIds = new Set(collectionData[0].map(card => card.card_id));
            setOwnedCards(ownedCardIds);
        }
    }, [collectionData]);

    const isCardOwned = useCallback((cardId) => {
        return ownedCards.has(cardId) || instantlyAddedCards.has(cardId);
    }, [ownedCards, instantlyAddedCards]);


    useEffect(() => {
        setLoading(cards.length === 0 && collectionLoading);
    }, [cards, collectionLoading]);

    useEffect(() => {
        setLoading(true);
        if (cards.length > 0) {
            setLoading(false);
        }
    }, [cards]);

    const handleImageLoad = (cardId) => {
        setLoadingImages((prev) => ({ ...prev, [cardId]: false }));
    };

     const [cardStatus, setCardStatus] = useState(
        cards.reduce((acc, card) => {
            acc[card.id] = true; 
            return acc;
        }, {})
    );
    useEffect(() => {
        setUserCards(collectionData);
    }, [collectionData, collectionError, collectionLoading]);
    
    const getVariantColor = (variant) => {
        switch (variant) {
            case 'normal':
                return 'yellow';
            case 'holofoil':
                return 'purple';
            case 'reverseHolofoil':
                return 'blue';
            default:
                return 'white';
        }
    };
    const handleCardToCollection = useCallback(async (cardId, variant, count) => {

        const payload = {
            authToken: authToken,
            card_id: cardId,
            variant,
            count: count,
        };

        try {

            setInstantlyAddedCards(prev => new Set([...prev, cardId]));

            const response = await addCardToCollection(payload);
            
            console.log('Card updated:', response.data);
            setOwnedCards(prev => new Set([...prev, cardId]));
            setCardCounts(prevCounts => ({
                ...prevCounts,
                [cardId]: {
                    ...prevCounts[cardId],
                    [variant]: count,
                }
             
            }));

            setCardStatus(prevStatus => ({
                ...prevStatus,
                [cardId]: false 

            }));

            setOwnedCards(prev => new Set([...prev, cardId]));
         
            refetchCollection();

            if (toast.isActive(toastId)) {
                let newToastCount = toastCount + 1;
                setToastCount(newToastCount);
                toast.update(toastId, {
                    render: `Card added successfully! (${newToastCount})`,
                    type: 'success',
                    autoClose: 3000,
                });
            } else {
                setToastId(toast.success(toastCount ? `Card added successfully! (${toastCount})` : 'Card added successfully!'), {
                    onClose: () => {
                        setToastId(null);
                    }
                });
            }
        } catch (error) {
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat().join('\n');
                alert(`Validation failed: ${errorMessage}`);
            } else if (error.response?.status === 401) {
                alert('You must be logged in to update cards to your collection.');
            } else if (error.response?.status === 404) {
                alert('The card was not found.');
            } else {
                alert('An error occurred while adding the card.');
            }
        }
    }, [authToken, toastId, toastCount, refetchCollection]);

    const handleRemoveCardFromCollection = useCallback(async (cardId, variant, count) => {
        if (!authToken) {
            alert('You must be logged in to remove cards from your collection');
            return;
        }
    
        const payload = {
            token: authToken,
            authToken: authToken,
            card_id: cardId,
            variant: variant,
            count: count
        };
    
        try {
            const response = await removeCardFromCollection(payload);
            console.log('Card removed:', response);
            refetchCollection();
        } catch (error) {
            console.error('Error removing card:', error);
            const errorMessage = error.response?.data?.message || 'An error occurred while removing the card';
            alert(errorMessage);
        }
    }, [authToken, refetchCollection]);
    
    const handleIncrement = useCallback(async (cardId, variant) => {
        const currentCount = cardCounts[cardId]?.[variant] || 0;
        const newCount = currentCount + 1;

        setCardCounts(prevCounts => ({
            ...prevCounts,
            [cardId]: {
                ...prevCounts[cardId],
                [variant]: newCount
            }
        }));

       

        await handleCardToCollection(cardId, variant, newCount);
    }, [cardCounts, handleCardToCollection]);

    
    const handleDecrement = useCallback(async (cardId, variant) => {
        const currentCount = cardCounts[cardId]?.[variant] || 0;
        const newCount = currentCount;

        setCardCounts(prevCounts => ({
            ...prevCounts,
            [cardId]: {
                ...prevCounts[cardId],
                [variant]: newCount
            }
        }));

        await handleRemoveCardFromCollection(cardId, variant, newCount);
    }, [cardCounts, handleRemoveCardFromCollection]);

 

    useEffect(() => {
        console.log('Collection Data:', collectionData);
        const initialCounts = {};
    
        //if collectionData is not null and has the expected structure
        if (collectionData && typeof collectionData === 'object' && Array.isArray(collectionData[0])) {
            const cardsArray = collectionData[0]; 
    
            cardsArray.forEach(card => {
                initialCounts[card.card_id] = {
                    normal: card.normal_count,
                    holofoil: card.holo_count,
                    reverseHolofoil: card.reverse_holo_count,
                };
            });
        } else {
            console.warn('Null collection');
        }
    
        console.log('Initial Counts:', initialCounts);
        setCardCounts(initialCounts);
    }, [collectionData]);

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setCurrentIndex(cards.indexOf(card));
    };


    const setTitle = cards.length > 0 && cards[0].set ? cards[0].set.set_name : "";

    return (
        <div className="card-container">
          <div className= "card-set-name-index">
            {showSetTitle && (
                <Typography  variant="h4" >
                    
                    {`${setTitle}`} 
                </Typography>
            )}    
       </div>

         <Grid container spacing={8}>
         {cards.slice(0, displayCount).map((card) => (
            <Grid item key={card.id} xs={12} sm={6} md={4} lg={4}className="card-item" >
                <div style={{  }}>
                    <CardDisplay
                        card={card}
                        isNotInCollection={isCollectionView && !isCardInCollection(card.id)}
                        onClick={() => handleCardClick(card)}
                        cards={cards} 
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex} 
                        onCardAdded={handleCardToCollection}
                        instantlyAddedCards={instantlyAddedCards}
                    />
                    <div className="variant-container">
                        {['normal', 'holofoil', 'reverseHolofoil'].map((variant) => (
                            card.price_data?.tcgplayer?.[variant] && (
                                <div key={variant} className="variant-boxes">
                                    <div
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            border: '2px solid',
                                            borderColor: getVariantColor(variant),
                                            borderRadius: '4px',
                                            backgroundColor: getVariantColor(variant),
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: '#1f1f1f',  
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {cardCounts[card.card_id]?.[variant] || 0}
                                   
                                    <div className="variant-buttons">
                                        
                                        <IconButton sx={{ color: '#999', '& .MuiSvgIcon-root': { fontSize: 18 } }}
                                            onClick={() => handleIncrement(card.card_id, variant)}
                                            size="small"
                                        >
                                            <Add />
                                        </IconButton>
                                        <IconButton sx={{color: '#999', '& .MuiSvgIcon-root': { fontSize: 18 } }}
                                            onClick={() => handleDecrement(card.card_id, variant)}
                                            size="small"
                                            disabled={(cardCounts[card.card_id]?.[variant] || 0) === 0}
                                        >
                                            <Remove />
                                        </IconButton>
                                     </div>
                                     </div>
                                     </div>
                                )
                                ))}
                            </div>
                        </div>
                    </Grid>
                ))}
                {loading && Array.from(new Array(6)).map((_, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <Skeleton variant="rectangular" height={250} />
                    </Grid>
                ))}
            </Grid>
            <div ref={loadingRef} />
        </div>
    );
};

export default CardList;
