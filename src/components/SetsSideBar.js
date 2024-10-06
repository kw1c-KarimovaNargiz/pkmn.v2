// src/components/SetsSidebar.js
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const SetsSidebar = ({ sets, onSetSelect, onSeriesSelect }) => {
    return (
        <div className="sets-sidebar">
            {sets.map((set) => (
                <Accordion 
                    key={set.series} 
                    sx={{ 
                        backgroundColor: '#3c3c3c', 
                        color: 'white',
                        '&:not(:last-child)': {
                            marginBottom: 0, 
                            marginTop: 0,
                        },
                        '&:before': {
                            display: 'none' 
                        }
                    }} >
                    <AccordionSummary
                        expandIcon={<ArrowDownwardIcon />}
                        aria-controls={`${set.series}-content`}
                        id={`${set.series}-header`}
                        onClick={() => onSeriesSelect(set.series)}  >
                        <Typography variant="h6" sx={{ color: 'white' }}>{set.series}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ backgroundColor: '#3c3c3c', color: 'white' }}>
                        <ul style={{listStyleType: 'none' }}>
                            {set.setNames.map((setInfo) => (
                                <li key={setInfo.id}>
                                    <button
                                        onClick={() => onSetSelect(setInfo.id)}
                                        style={{ 
                                            textDecoration: 'none', 
                                            background: 'none', 
                                            border: 'none',
                                            cursor: 'pointer', 
                                            color: 'white' 
                                        }} 
                                    >
                                        {setInfo.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default SetsSidebar;
