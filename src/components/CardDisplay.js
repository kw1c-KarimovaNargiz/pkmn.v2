import React, { useState } from 'react';
import { Card, CardContent, Typography, Dialog, DialogContent, Box, Checkbox } from '@mui/material';

const CardDisplay = React.memo(({ card, isOwned, ownedCount, onClick, isNotInCollection  }) => {
    const [open, setOpen] = useState(false);

    const handleCardClick = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        
        <>
            <Card 
    sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}
    onClick={handleCardClick}
    style={{ display: 'flex', flexDirection: 'column' }}
>
    <Typography
        variant="h5"
        component="div"
        sx={{ textAlign: 'right', width: '90%' }}
    >
        {card.name}
    </Typography>
    <CardContent sx={{ background: 'none', backgroundColor: 'transparent' }}>
        <img
            src={card.images.large}
            alt={card.name}
            loading="lazy"
            style={{ width: '100%', height: 'auto' }}
        />
     <div style={{
            filter: isNotInCollection ? 'grayscale(100%)' : 'none',
            opacity: isNotInCollection ? '0.7' : '1',
            transition: 'filter 0.3s ease, opacity 0.3s ease'
        }}></div>

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
                        boxShadow: 'none', 
                        borderRadius: '20px', 
                    } 
                }}
            >
                <DialogContent 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        background: 'rgba(0, 0, 0, 0.90)', 
                        borderRadius: '40px'
                    }}
                >
                    <Card 
                        sx={{ 
                            width: '80%', 
                            height: '500px', 
                            display: 'flex', 
                            backgroundColor: 'transparent', 
                            boxShadow: 'none'
                        }}
                    >
                        {/*img and deets */}
                        <div style={{ flex: 1 }}>
                            <img 
                                src={card.images.large}
                                alt={card.name} 
                                loading="lazy" 
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </div>
                        <div style={{ flex: 1, padding: '0px', color: 'white', textAlign: 'right' }}>
                            <Typography variant="h5" component="div" sx={{ textAlign: 'right', marginBottom: '20px' }}>
                                {card.name}
                            </Typography>
                            <Typography variant="h6">
                                 {card.set ? card.set.set_name : "Unknown Set"}
                            </Typography>
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
                                            {attack.name} - {attack.damage || "N/A"}
                                        </Typography>
                                        <Typography>
                                            {attack.text || " "}
                                        </Typography>
                                    </div>
                                ))
                            ) : (
                                <Typography></Typography>
                            )}
                         
                        </div>
                    </Card>
                </DialogContent>
            </Dialog>
        </>
    );
});

export default CardDisplay;