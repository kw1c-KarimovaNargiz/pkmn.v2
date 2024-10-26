import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const SetsSidebar = ({ series = [], onSetSelect, onSeriesSelect }) => {
    const [expanded, setExpanded] = useState(null); 
    const handleChange = (seriesId) => ( isExpanded) => {
        setExpanded(isExpanded ? seriesId : null); 
        onSeriesSelect(seriesId); 
    };
    return (
        <div className="sets-sidebar">
            {series.map((s) => (
                <Accordion 
                    key={s.id} 
                    sx={{ 
                        backgroundColor: '#212121',
                        borderBottom: expanded === s.id ?    '0px 15px 10px -15px #111; ' : '#3c3c3c' ,
                        color: 'bla',
                        '&:not(:last-child)': {
                            marginBottom: 0, 
                            marginTop: 0,
                        },
                        '&:before': {
                            display: 'none' 
                        },
                        top: '10px',
                       padding: '10px'
                    }} 
                    expanded={expanded === s.id} 
                    onChange={handleChange(s.id)}
                >
                    <AccordionSummary
                        expandIcon={<ArrowDownwardIcon />}
                        aria-controls={`${s.id}-content`}
                        id={`${s.id}-header`}
                        onClick={() => onSeriesSelect(s)} 
                        style={{
                            textTransform: 'uppercase',
                            justifyContent: 'center',
                            height: '50px',
                            padding: '10px',
                    
                            
                        }}
                    >
                        <Typography variant="h6" sx={{ color: '#999' }}>{s.series_name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ backgroundColor: '#363636', color: '#999' }}>
                        <ul style={{ listStyleType: 'none' , margin: 0, width: '100%' }}>
                           
                               { s.sets.map((setInfo) => ( 
                                    <li key={setInfo.id}>
                                        <button
                                            onClick={() => onSetSelect(setInfo.id)}
                                            style={{ 
                                              
                                                textDecoration: 'none', 
                                                background: 'none', 
                                                border: 'none',
                                                cursor: 'pointer', 
                                                color: '#999', 
                                                fontSize: '15px',
                                                marginLeft: '-40px',
                                                 height: '30px',
                                                // 
                                               
                                            
                                            }} 
                                        >
                                            {setInfo.set_name} 
                                        </button>
                                    </li>
                                ))
                            }
                              
                           
                        </ul>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default SetsSidebar;
