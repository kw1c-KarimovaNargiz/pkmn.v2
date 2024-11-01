import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { fetchCardPrices } from '../services/api'; // Importing fetchCardPrices

const PriceDisplay = ({ cardId }) => {
  const [prices, setPrices] = useState([]);

  // Fetch card prices when the component mounts
  useEffect(() => {
    const getPrices = async () => {
      try {
        const data = await fetchCardPrices(); // Fetching prices
        setPrices(data); // Updating state with fetched prices
      } catch (error) {
        console.error("Error fetching card prices:", error);
      }
    };

    getPrices();
  }, []); // Empty dependency array means this runs once when the component mounts

  const relevantPrices = prices.filter(price => price.id === cardId);

  if (!Array.isArray(relevantPrices) || relevantPrices.length === 0) {
    return <Typography className="text-sm text-gray-600">Loading prices...</Typography>;
  }

  return (
    <div className="space-y-2">
      {relevantPrices.map(priceData => {
        const { price } = priceData;

        if (!price) {
          return <Typography key={priceData.id} className="text-sm text-gray-600">No price data available.</Typography>;
        }

        const { normal, reverseHolofoil, holofoil } = price;

        return (
          <div key={priceData.id} className="space-y-1">
            <Typography className="font-medium">Prices:</Typography>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {/* Normal Prices */}
              <div className="flex justify-between pr-4">
                <span className="text-gray-600">Normal:</span>
                <span>${normal?.market?.toFixed(2) || 'N/A'}</span>
              </div>
              {/* Reverse Holofoil Prices */}
              <div className="flex justify-between pr-4">
                <span className="text-gray-600">Reverse Holofoil:</span>
                <span>${reverseHolofoil?.market?.toFixed(2) || 'N/A'}</span>
              </div>
              {/* Holofoil Prices */}
              <div className="flex justify-between pr-4">
                <span className="text-gray-600">Holofoil:</span>
                <span>${holofoil?.market?.toFixed(2) || 'N/A'}</span>
              </div>
            </div>
            <Typography className="text-xs text-gray-500">
              Last updated: {new Date(price.updatedAt).toLocaleDateString()}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};

export default PriceDisplay;