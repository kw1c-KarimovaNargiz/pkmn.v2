import React, { useState } from 'react';
import { Card, CardContent, Typography, Dialog, DialogContent, Box, Checkbox } from '@mui/material';
import '../styling/carddisplay.css';
const CardDisplay = React.memo(({ card, isNotInCollection  }) => {
    const [open, setOpen] = useState(false);

    const handleCardClick = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const cardNumber = card.card_id.split('-')[1];

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

    return (
        
        <>
            <Card 
    sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
    onClick={handleCardClick}
    style={{}}
>
    <Typography
        variant="h5"
        component="div"
        sx={{ textAlign: 'center', color: '#999', textTransform: 'uppercase', fontSize: '16px'}}

    >
        {card.name}
    </Typography>
    <CardContent sx={{ background: 'none', backgroundColor: 'transparent' }}>
                    <div style={{
                        filter: isNotInCollection ? 'grayscale(100%)' : 'none',
                        opacity: isNotInCollection ? '0.7' : '1',
                        transition: 'filter 0.3s ease, opacity 0.3s ease'
                    }}>
                        <img sx={{}}
                            src={card.images.large}
                            alt={card.name}
                            loading="lazy"
                            style={{ boxShadow: '10px 10px #1a1a1a ', borderRadius:'5px', width: '100%', height: 'auto',
                               


                             }}
                             
                        />
                    </div>
                </CardContent>
</Card>

        {/*card deets*/}
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
                        borderRadius: '40px'
                    }}
                >
                    <Card 
                        sx={{ 
                            width: '100%', 
                            height: '500px', 
                         
                            backgroundColor: 'transparent', 
                            boxShadow: 'none',
                           
                        }}
                    >
                        {/*img and deets */}
                      
                     <div >

                         <div className= "card-title">
                            <Typography  variant="h5" component="div" >
                                {card.name}
                            </Typography>
                            </div>
                            
                            <div className="card-numberTotal" >
                            <Typography variant="h6">
                            
                            {cardNumber} / 
                            {card.set.printed_total}
                           </Typography>
                           </div>
                          
                        <div className= "card-set-name" >
                            <Typography variant="h6">
                                 {card.set ? card.set.set_name : "Unknown Set"}
                            </Typography>
                         </div>
                         </div>
                         <div className="parent-container">
                        <div className= "img-container shine">
                            <img className="shine"
                                src={card.images.large}
                                alt={card.name} 
                                loading="lazy" 
                                style={{flex: '1', width: '300px'}}
                            />
                        </div>

                             <div className='card-details'>
                            
                        
                            
                            <Typography variant="h6">
                                {card.hp} HP
                            </Typography>
                            <Typography variant="h6">
                                  Type: {card.types}
                             </Typography>
                            {card.attacks && card.attacks.length > 0 ? (
                                card.attacks.map((attack, index) => (
                                    <div key={index}>
                                        <Typography variant="h6">
                                            {attack.name} - {attack.damage || "//"}
                                        </Typography>
                                        <Typography>
                                           
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
                                    card.price_data?.tcgplayer?.[variant] && (
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
                                            >
                                                {/* {variant.charAt(0).toUpperCase() + variant.slice(1)} Capitalize the first letter */}
                                            </div>
                                            <Typography variant="body2" style={{ marginTop: '4px', textAlign: 'center' }}>
                    {/* Displaying the market price, fallback to '--' if not available */}
                    ${card.price_data.tcgplayer[variant].market ? card.price_data.tcgplayer[variant].market.toFixed(2) : '--'}
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