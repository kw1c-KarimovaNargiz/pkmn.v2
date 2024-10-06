// src/components/SetsSidebar.js
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const SetsSidebar = ({ sets, onSetSelect, onSeriesSelect }) => {
    return (
        <div className="sets-sidebar">
            {sets.map((set) => (
                <Accordion key={set.series}>
                    <AccordionSummary
                        expandIcon={<ArrowDownwardIcon />}
                        aria-controls={`${set.series}-content`}
                        id={`${set.series}-header`}
                        onClick={() => onSeriesSelect(set.series)} >
                        <Typography variant="h6">{set.series}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <ul>
                            {set.setNames.map((setInfo) => (
                                <a key={setInfo.id}>
                                    <button
                                        onClick={() => onSetSelect(setInfo.id)}
                                        style={{ textDecoration: 'none', 
                                                background: 'none', 
                                                border: 'none',
                                                 cursor: 'pointer' }} >
                                        {setInfo.name}
                                    </button>
                                </a>
                            ))}
                        </ul>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default SetsSidebar;
