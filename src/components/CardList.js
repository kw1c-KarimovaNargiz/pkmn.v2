import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Grid, Badge, Checkbox, FormControlLabel, IconButton, Skeleton } from '@mui/material';
import { toast } from 'react-toastify';
import { Add, Remove } from '@mui/icons-material';
import CardDisplay from './CardDisplay';
import { addCardToCollection, removeCardFromCollection, fetchUserCollection } from '../services/api';
import { useUser } from '../pages/UserContext';
import useApi from '../hooks/useApi';

const CardList = ({ cards, isCollectionView, isCardInCollection }) => {
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
            const response = await addCardToCollection(payload);
            console.log('Card updated:', response.data);

            setCardCounts(prevCounts => ({
                ...prevCounts,
               
                    ...prevCounts,
                    [variant]: count,
                  
             
            }));
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
        const newCount = currentCount - 1;

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
        const initialCounts = {};
        if (Array.isArray(collectionData) ){
            collectionData.forEach(card => {
                initialCounts[card.card_id] = {
                    normal: card.normal_count,
                    holofoil: card.holo_count,
                    reverseHolofoil: card.reverse_holo_count,
                };
            });
        }
        setCardCounts(initialCounts);
    }, [collectionData]);

    const handleCardClick = (card) => {
        setSelectedCard(card);
    };
    return (
        <div>
         <Grid container spacing={2}>
                {cards.slice(0, displayCount).map((card) => (
                    <Grid item key={card.id} xs={12} sm={6} md={4} className="card-item">
                        <div style={{ position: 'relative', width: '100%' }}>
                            <CardDisplay
                                card={card}
                                isNotInCollection={isCollectionView && !isCardInCollection(card.id)}
                                onClick={() => handleCardClick(card)}
                            />


                                <div className="flex flex-col items-center w-full mt-2 gap-2">
                                {['normal', 'holofoil', 'reverseHolofoil'].map((variant) => (
                                card.price_data?.tcgplayer?.[variant] && (
                                    <div key={variant} className="flex items-center gap-2">
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
            </div>
            <IconButton
                onClick={() => handleDecrement(card.card_id, variant)}
                size="small"
                disabled={(cardCounts[card.card_id]?.[variant] || 0) === 0}
            >
                <Remove />
            </IconButton>
            <IconButton
                onClick={() => handleIncrement(card.card_id, variant)}
                size="small"
            >
                <Add />
            </IconButton>
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
