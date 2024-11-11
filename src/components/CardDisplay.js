import React, { useState, useCallback} from 'react';
import { Card, CardContent, Typography, Dialog, DialogContent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '../styling/carddisplay.css';

const CardDisplay = React.memo(({ card, isNotInCollection, cards, currentIndex, setCurrentIndex, instantlyAddedCards, instantlyRemovedCards, cardCounts }) => {
    const [open, setOpen] = useState(false);
    //visual feedback for added card in set through collectionpage
    const isCardInstantlyAdded = instantlyAddedCards?.has(card.card_id);
    const isCardInstantlyRemoved = instantlyRemovedCards?.has(card.card_id);

    const handleCardClick = () => {
        setCurrentIndex(cards.findIndex(c => c.card_id === card.card_id));
        setOpen(true);
    };
    
    const handleClose = () => setOpen(false);

    const handleNextCard = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePreviousCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const displayCard = cards[currentIndex] || card;
    const cardNumber = displayCard.card_id.split('-')[1];

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


   
    
    // Check if card has any counts
    const hasNoCounts = useCallback(() => {
        const counts = cardCounts[card.card_id];
        if (!counts) return true;
        return Object.values(counts).every(count => !count || count === 0);
    }, [cardCounts, card.card_id]);
    
    return (
        <>
            <Card 
                sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
                onClick={handleCardClick}
            >
                <div className="card-content-list">
                    <div className="card-title-list">
                        <Typography
                            variant="h5"
                            sx={{ color: '#999', textTransform: 'uppercase', fontSize: '16px', opacity: '0.6' }}
                        >
                            {card.name}
                        </Typography>
                    </div>
                    <CardContent sx={{ background: 'none', backgroundColor: 'transparent' }}>
                        <div className="collection-view" style={{
                            filter: (isNotInCollection && !isCardInstantlyAdded) || isCardInstantlyRemoved || hasNoCounts() ? 'grayscale(100%)' : 'none',
                            opacity: (isNotInCollection && !isCardInstantlyAdded) || isCardInstantlyRemoved || hasNoCounts() ? '0.7' : '1',
                            transition: 'filter 0.3s ease, opacity 0.3s ease'
                        }}>
                            <div className="shine-img">
                                <img 
                                    src={card.images.large}
                                    alt={card.name}
                                    loading="lazy"
                                    style={{ 
                                        boxShadow: '10px 10px #1a1a1a',
                                        borderRadius: '5px',
                                        width: '100%',
                                        height: 'auto'
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </div>
            </Card>

            <Dialog 
                open={open} 
                onClose={handleClose} 
                maxWidth="md" 
                fullWidth 
                sx={{ 
                    '.MuiDialog-paper': { 
                        backgroundColor: 'transparent', 
                        boxShadow: '10px 10px 10px rgba(26, 26, 26, 0.4)', 
                        borderRadius: '20px', 
                        overflowX: 'hidden',
                    } 
                }}
            >
                <DialogContent 
                    sx={{ 
                        background: 'rgba(26, 26, 26, 0.90)', 
                        borderRadius: '40px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{ 
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0 20px',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                    }}>
                        <IconButton 
                            onClick={handlePreviousCard} 
                            disabled={currentIndex <= 0}
                            sx={{ 
                                color: 'white',
                                bgcolor: 'rgba(0,0,0,0.5)',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <IconButton 
                            onClick={handleNextCard}
                            disabled={currentIndex >= cards.length - 1}
                            sx={{ 
                                color: 'white',
                                bgcolor: 'rgba(0,0,0,0.5)',
                                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' }
                            }}
                        >
                            <ArrowForwardIcon />
                        </IconButton>
                    </div>

                    <Card 
                        sx={{ 
                            width: '100%', 
                            height: '500px',
                            backgroundColor: 'transparent', 
                            boxShadow: 'none',
                        }}
                    >
                        <div>
                            <div className="card-title">
                                <Typography variant="h5" component="div">
                                    {displayCard.name}
                                </Typography>
                            </div>
                            
                            <div className="card-numberTotal">
                                <Typography variant="h6">
                                    {cardNumber} / {displayCard.set.printed_total}
                                </Typography>
                            </div>
                          
                            <div className="card-set-name">
                                <Typography variant="h6">
                                    {displayCard.set ? displayCard.set.set_name : "Unknown Set"}
                                </Typography>
                            </div>
                        </div>

                        <div className="parent-container">
                            <div className="img-container shine">
                                <img 
                                    className="shine"
                                    src={displayCard.images.large}
                                    alt={displayCard.name} 
                                    loading="lazy" 
                                    style={{flex: '1', width: '300px'}}
                                />
                            </div>

                            <div className='card-details'>
                                <Typography variant="h6">
                                    {displayCard.hp} HP
                                </Typography>
                                <Typography variant="h6">
                                    Type: {displayCard.types}
                                </Typography>
                                {displayCard.attacks && displayCard.attacks.length > 0 ? (
                                    displayCard.attacks.map((attack, index) => (
                                        <div key={index}>
                                            <Typography variant="h6">
                                                {attack.name} - {attack.damage || "//"}
                                            </Typography>
                                        </div>
                                    ))
                                ) : (
                                    <Typography></Typography>
                                )}
                            </div>
                        </div>

                        <div className="variant-container-display">
                            {['normal', 'holofoil', 'reverseHolofoil'].map((variant) => (
                                displayCard.price_data?.tcgplayer?.[variant] && (
                                    <div key={variant} className="variant-boxes-display">
                                        <div
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                border: '2px solid',
                                                borderColor: getVariantColor(variant),
                                                borderRadius: '4px',
                                                backgroundColor: getVariantColor(variant),
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: '#1f1f1f',
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                        <Typography variant="body2" style={{ marginTop: '4px', textAlign: 'center' }}>
                                            ${displayCard.price_data.tcgplayer[variant].market ? 
                                                displayCard.price_data.tcgplayer[variant].market.toFixed(2) : '--'}
                                        </Typography>
                                    </div>
                                )
                            ))}
                        </div>
                    </Card>
                </DialogContent>
            </Dialog>
        </>
    );
});

export default CardDisplay;