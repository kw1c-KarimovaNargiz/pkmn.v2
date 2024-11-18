import React from 'react';
import { Typography } from '@mui/material';

const PriceDisplay = ({ priceData }) => {
    return (
        <div>
            <Typography variant="body2" color="textSecondary">
                Price:
            </Typography>
            {priceData.prices && (
                <div>
                    <Typography variant="body2">Low: ${priceData.prices.holofoil.low}</Typography>
                    <Typography variant="body2">Mid: ${priceData.prices.holofoil.mid}</Typography>
                    <Typography variant="body2">High: ${priceData.prices.holofoil.high}</Typography>
                </div>
            )}
        </div>
    );
};

export default PriceDisplay;
