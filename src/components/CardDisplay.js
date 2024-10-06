// src/components/CardDisplay.js
import React, { useState } from 'react';
import { Card, CardContent, Typography, Dialog, DialogContent } from '@mui/material';

const CardDisplay = ({ card }) => {
    const [open, setOpen] = useState(false);

    const handleCardClick = () => {
        setOpen(true); 
    };

    const handleClose = () => {
        setOpen(false); 
    };

    return (
        <>
            <Card sx={{ backgroundColor: 'transparent', boxShadow: 'none' }} onClick={handleCardClick}>
                <CardContent sx={{ background: 'none', backgroundColor: 'transparent' }}>
                    <img 
                        src={card.images.large}
                        alt={card.name} 
                        style={{ width: '100%', height: 'auto' }}
                    />
                    <Typography variant="h5" component="div">
                        {card.name}
                    </Typography>
                </CardContent>
            </Card>

           
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth   sx={{ 
              //for the white border around the  dialog

             '.MuiDialog-paper': { 
            backgroundColor: 'transparent', 
            boxShadow: 'none', 
            borderRadius: '20px', 
        } 
    }}>
    <DialogContent sx={{ display: 'flex', alignItems: 'center', background: 'rgba(0, 0, 0, 0.90)',  borderRadius: '40px'}}>
        {/* container - img and card details*/}
        <Card sx={{ width: '80%', height: '500px', display: 'flex', backgroundColor: 'transparent', boxShadow: 'none'}}>
            <div style={{ flex: 1}}>
                <img 
                    src={card.images.large}
                    alt={card.name} 
                    style={{ width: '100%', height: 'auto'}}
                />
            </div>

            <div style={{ flex: 1, padding: '0px', color: 'white',  textAlign: 'right'}}>
                <Typography variant="h5" component="div" sx={{ textAlign: 'right', marginBottom: '20px' }}>
                    {card.name}
                </Typography>
                <Typography variant="h6">
                    Type: {card.types}
                </Typography>
                <Typography variant="h6">
                    {card.hp} HP
                </Typography>
                <Typography variant="h6">
                    Evolves into: {card.evolvesTo}
                </Typography>
            </div>
        </Card>
    </DialogContent>
</Dialog>

        </>
    );
};

export default CardDisplay;
