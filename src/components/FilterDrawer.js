import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
    Box, 
    Chip, 
    FormControlLabel, 
    Checkbox, 
    Autocomplete, 
    TextField, 
    Typography, 
    Drawer,
    Divider,
    IconButton,
    styled
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const DrawerPeek = styled(Box)(({ theme, open }) => ({
    // position: 'fixed',
    // left: '73px',
    // top: 0,
    // bottom: 0,
    // width: '4px',
    // backgroundColor: '#8B0000',
    // cursor: 'pointer',
    // zIndex: 0,
    // opacity: open ? 0 : 1,
    // transition: 'opacity 0.3s ease',
}));

const FilterDrawer = ({
    open,
    onClose,
    onOpen,
    availableTypes,
    availableSubTypes,
    selectedTypes,
    setSelectedTypes,
    selectedSubTypes,
    setSelectedSubTypes,
    isSortedByEvo,
    setIsSortedByEvo,
    onFilter,
    selectedSet,
    filterOwnedCards,
    setFilterOwnedCards
}) => {
    const location = useLocation();
    const isCollectionView = location.pathname === '/collection';

    const handleTypeChange = (event, newValue) => {
        setSelectedTypes(newValue);
        onFilter(newValue, selectedSubTypes, isSortedByEvo, selectedSet, filterOwnedCards);
    };

    const handleSubTypeChange = (event, newValue) => {
        setSelectedSubTypes(newValue);
        onFilter(selectedTypes, newValue, isSortedByEvo, selectedSet, filterOwnedCards);
    };

    const handleSortByEvoChange = (event) => {
        const checked = event.target.checked;
        setIsSortedByEvo(checked);
        onFilter(selectedTypes, selectedSubTypes, checked, selectedSet, filterOwnedCards);
    };

    const handleFilterOwnedCards = (event) => {
        const checked = event.target.checked;
        setFilterOwnedCards(checked);
        onFilter(selectedTypes, selectedSubTypes, isSortedByEvo, selectedSet, checked);
    };

    return (
        <>
            <DrawerPeek 
                open={open}
                onClick={onOpen}
                sx={{
                    '&:hover': {
                        width: '6px',
                        transition: 'width 0.2s ease'
                    }
                }}
            />

            <Drawer
                anchor="left"
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: {
                        width: '18%',
                        bgcolor: '#212121',
                        color: '#999',
                        // borderLeft: '4px solid #8A3F3F',
                        left: '0',
                        right: 'auto',
                        height: '100%',
                        '& .MuiDrawer-paper': {
                            left: '73px',
                            right: 'auto',
                        }
                    }
                }}
                sx={{
                    '& .MuiDrawer-root': {
                        position: 'absolute',
                    },
                    '& .MuiBackdrop-root': {
                        left: '73px',
                    },
                }}
                variant="persistent"
            >
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '100%', 
                    p: 3 
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 3 
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Filters
                        </Typography>
                        <IconButton onClick={onClose} sx={{ color: '#999' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Types
                        </Typography>
                        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {selectedTypes.map((type) => (
                                <Chip
                                    key={type}
                                    label={type}
                                    onDelete={() => {
                                        const updatedTypes = selectedTypes.filter((t) => t !== type);
                                        setSelectedTypes(updatedTypes);
                                        onFilter(updatedTypes, selectedSubTypes, isSortedByEvo, selectedSet);
                                    }}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.08)',
                                        color: '#fff',
                                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)' }
                                    }}
                                />
                            ))}
                        </Box>
                        <Autocomplete
                            multiple
                            options={availableTypes}
                            disableCloseOnSelect
                            value={selectedTypes}
                            onChange={handleTypeChange}
                            getOptionLabel={(option) => option}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option}
                                </li>
                            )}
                            renderTags={() => null}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    label="Select types" 
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: '#fff',
                                            '& fieldset': {
                                                borderColor: 'rgba(255, 255, 255)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(255, 255, 255)',
                                            },
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#999',
                                        }
                                    }}
                                />
                            )}
                        />
                    </Box>


                <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                {/* Additional Options */}
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Sort & Filter
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isSortedByEvo}
                                onChange={handleSortByEvoChange}
                                sx={{
                                    color: '#999',
                                    '&.Mui-checked': {
                                        color: '#fff',
                                    },
                                }}
                            />
                        }
                        label="Sort by Evolution"
                        sx={{ color: '#999', mb: 1 }}
                    />
                    {isCollectionView && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={filterOwnedCards}
                                    onChange={handleFilterOwnedCards}
                                    sx={{
                                        color: '#999',
                                        '&.Mui-checked': {
                                            color: '#fff',
                                        },
                                    }}
                                />
                            }
                            label="Show Owned Cards Only"
                            sx={{ color: '#999' }}
                        />
                    )}

 </Box>   </Box>
            </Drawer>
        </>
    );
};

export default FilterDrawer;