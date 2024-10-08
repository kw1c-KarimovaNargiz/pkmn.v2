// src/components/SetsSidebar.js
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const SetsSidebar = ({ series = [], onSetSelect, onSeriesSelect }) => {


    return (
        <div className="sets-sidebar">
            {series.map((s) => (
                <Accordion 
                    key={s.id} 
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
                    }} 
                >
                    <AccordionSummary
                        expandIcon={<ArrowDownwardIcon />}
                        aria-controls={`${s.id}-content`}
                        id={`${s.id}-header`}
                        onClick={() => onSeriesSelect(s)} 
                    >
                        <Typography variant="h6" sx={{ color: 'white' }}>{s.series_name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ backgroundColor: '#3c3c3c', color: 'white' }}>
                        <ul style={{ listStyleType: 'none' }}>
                           
                               { s.sets.map((setInfo) => ( 
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
                                            {setInfo.set_name} 
                                        </button>
                                    </li>
                                ))
                            }
                                <Typography variant="body2" sx={{ color: 'white' }}>
                                    No sets available for this series.
                                </Typography>
                           
                        </ul>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default SetsSidebar;
