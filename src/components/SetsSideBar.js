import React, { useEffect, useState } from 'react';


import { Accordion, AccordionSummary, AccordionDetails, Typography, Drawer, Button, Box } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort';
import CombinedSearchFilterBar from './CombinedSearchFilterBar';


const SetsSidebar = ({ series = [], onSetSelect, onSeriesSelect, availableTypes, availableSubTypes, onFilter, filterOwnedCards,
    setFilterOwnedCards, onToggleSidebar = () => {} }) => {
    const [expanded, setExpanded] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedSubTypes, setSelectedSubTypes] = useState([]);
    const [isSortedByEvo, setIsSortedByEvo] = useState(false);
    //     const location = useLocation();
    const [sidebarVisible, setSidebarVisible] = useState(false);
    // const isCollectionView = location.pathname === '/collection'; 



    const handleChange = (seriesId) => (event, isExpanded) => {
        setExpanded(isExpanded ? seriesId : null);
        onSeriesSelect(series.find(s => s.id === seriesId));
    };

    const handleDrawerToggle = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    useEffect(() => {
        onToggleSidebar(sidebarVisible);
    }, [sidebarVisible]);


    return (
        <>
            <Button sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                zIndex: 100,
                width: '100%',
                backgroundColor: '#8a3f3f',
                color: 'white',
            }} onClick={() => setSidebarVisible(!sidebarVisible)}>{sidebarVisible ? 'Hide' : 'Show'} Sidebar</Button>
            {sidebarVisible && <Box sx={{ position: 'fixed', top: 60, left: 0, zIndex: 100, maxHeight: '85%', overflowX: 'auto' }}>
                <Button
                    onClick={handleDrawerToggle}
                    startIcon={<SortIcon />}
                    sx={{
                        margin: 0,
                        zIndex: 1,
                        color: 'white',
                        top: 20,
                        width: '100%',

                    }}
                >
                </Button>

                {series.map((s) => (
                    <Accordion
                        key={s.id}
                        sx={{
                            backgroundColor: '#212121',
                            borderBottom: expanded === s.id ? '0px 15px 10px -15px #111' : '#3c3c3c',
                            color: 'black',
                            '&:not(:last-child)': {
                                marginBottom: 0,
                                marginTop: 0,
                            },
                            '&:before': {
                                display: 'none'
                            },
                            top: '20px',
                        }}
                        expanded={expanded === s.id}
                        onChange={handleChange(s.id)}
                    >
                        <AccordionSummary
                            expandIcon={<ArrowDownwardIcon />}
                            aria-controls={`${s.id}-content`}
                            id={`${s.id}-header`}
                            style={{
                                textTransform: 'uppercase',
                                justifyContent: 'center',
                                height: '50px',
                            }}
                        >
                            <Typography variant="h6" sx={{ color: '#999' }}>{s.series_name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ backgroundColor: 'rgba(33, 33, 33, 10)', color: '#999' }}>
                            <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                                {s.sets.map((setInfo) => (
                                    <li key={setInfo.id} style={{ marginBottom: 10 }}>
                                        <button
                                            onClick={() => onSetSelect(setInfo.id)}
                                            style={{
                                                padding: 12,
                                                justifyContent: 'center',
                                                textDecoration: 'none',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#999',
                                                fontSize: '15px',
                                                width: '100%',
                                                textAlign: 'left',
                                            }}
                                        >
                                            {setInfo.set_name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </AccordionDetails>
                    </Accordion>
                ))}

                <Drawer
                    anchor="right"
                    open={isDrawerOpen}
                    onClose={handleDrawerToggle}
                >
                    <CombinedSearchFilterBar
                        availableTypes={availableTypes}
                        availableSubTypes={availableSubTypes}
                        selectedTypes={selectedTypes}
                        setSelectedTypes={setSelectedTypes}
                        selectedSubTypes={selectedSubTypes}
                        setSelectedSubTypes={setSelectedSubTypes}
                        isSortedByEvo={isSortedByEvo}
                        setIsSortedByEvo={setIsSortedByEvo}
                        onFilter={onFilter}
                        filterOwnedCards={filterOwnedCards}
                        setFilterOwnedCards={setFilterOwnedCards}

                    />
                </Drawer>
            </Box>}
        </>
    );
};

export default SetsSidebar;