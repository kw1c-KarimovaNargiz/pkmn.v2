import React, { useState } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HomeIcon from '@mui/icons-material/Home';
import AccountIcon from '@mui/icons-material/AccountCircle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import '../styling/sidebar.css';

const Sidebar = ({ series = [], onSeriesSelect }) => {
    const [expanded, setExpanded] = useState(null);
    const [showSeries, setShowSeries] = useState(false);
    const navigate = useNavigate();

    const handleChange = (seriesId) => (event, isExpanded) => {
        setExpanded(isExpanded ? seriesId : null);
        onSeriesSelect(series.find(s => s.id === seriesId));
    };

    const handleSetSelect = (setId) => {
        navigate(`/pokedex/${setId}`);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                bgcolor: '#212121',
                color: '#999',
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
            }}
        >
            {/* Main content */}
            <List
                sx={{
                    width: '100%',
                    maxWidth: 360,
                    padding: 0,
                    flex: 1,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar-track': {
                        WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
                        borderRadius: '10px',
                        backgroundColor: 'transparant',
                    },
                    '&::-webkit-scrollbar': {
                        width: '12px',
                        backgroundColor: 'transparant',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        borderRadius: '10px',
                        WebkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,.3)',
                        backgroundColor: 'transparant',
                    },
                
                }}
                component="nav"
            >
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/home')}>
                        <ListItemIcon>
                            <HomeIcon sx={{ color: '#999', textTransform: 'uppercase' }} />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={() => setShowSeries(!showSeries)}>
                        <ListItemText sx={{ textTransform: 'uppercase' }} primary="Series and Sets" />
                        {showSeries ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>

                <Collapse
                    in={showSeries}
                    unmountOnExit
                    sx={{
                        backgroundColor: '#212121',
                        '& .MuiCollapse-wrapper': {
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }
                    }}
                    timeout={400}
                >
                    <List component="div" disablePadding>
                        {series.map((s) => (
                            <Accordion
                                key={s.id}
                                sx={{
                                    backgroundColor: '#212121',
                                    color: '#999',
                                    '&:not(:last-child)': {
                                        marginBottom: 0,
                                        marginTop: 0,
                                    },
                                    '&:before': {
                                        display: 'none'
                                    },
                                    '& .MuiCollapse-root': {
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                    },
                                    '& .MuiAccordionSummary-root': {
                                        backgroundColor: '#212121',
                                    },
                                    '& .MuiAccordionDetails-root': {
                                        backgroundColor: '#212121',
                                    },
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                                expanded={expanded === s.id}
                                onChange={handleChange(s.id)}
                                elevation={0}
                            >
                                <AccordionSummary
                                    expandIcon={<ArrowDownwardIcon sx={{ color: '#999' }} />}
                                    aria-controls={`${s.id}-content`}
                                    id={`${s.id}-header`}
                                    sx={{
                                        textTransform: 'uppercase',
                                        justifyContent: 'center',
                                        height: '50px',
                                        backgroundColor: '#212121',
                                    }}
                                >
                                    <Typography sx={{ color: '#999' }}>
                                        {s.series_name}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                    sx={{
                                        backgroundColor: '#212121',
                                        color: '#999',
                                        padding: 0,
                                    }}
                                >
                                    <List component="div" disablePadding>
                                        {s.sets.map((setInfo) => (
                                            <ListItemButton
                                                key={setInfo.id}
                                                onClick={() => handleSetSelect(setInfo.id)}
                                                sx={{
                                                    pl: 4,
                                                    backgroundColor: '#212121',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(153, 153, 153, 0.1)'
                                                    }
                                                }}
                                            >
                                                <ListItemText primary={setInfo.set_name} />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </List>
                </Collapse>
            </List>

            <Box
                sx={{
                    width: '100%',
                    borderTop: '1px solid rgba(153, 153, 153, 0.1)',
                    mt: 'auto',
                }}
            >
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => navigate('/login')}
                        sx={{
                            backgroundColor: '#212121',
                            '&:hover': {
                                backgroundColor: 'rgba(153, 153, 153, 0.1)'
                            }
                        }}
                    >
                        <ListItemIcon>
                            <AccountIcon sx={{ color: '#999' }} />
                        </ListItemIcon>
                        <ListItemText primary="Login" />
                    </ListItemButton>
                </ListItem>
            </Box>
        </Box>
    );
};

export default Sidebar;