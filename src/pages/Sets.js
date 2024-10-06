// Sets.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import pokemonSets from '../scrapes/pokemon_sets.json';

const Sets = () => {
  const [sets, setSets] = useState([]);

  useEffect(() => {
    const formattedSets = Object.entries(pokemonSets).map(([series, setNames]) => ({
      series,
      setNames,
    }));
    setSets(formattedSets);
  }, []);

  return (
    <Grid container spacing={3}>
      {sets.map((set) => (
        <Grid item xs={12} key={set.series}>
          <Card>
            <CardContent>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ArrowDownwardIcon />}
                  aria-controls={`${set.series}-content`}
                  id={`${set.series}-header`}
                >
                  <Typography variant="h5">{set.series}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" gutterBottom>
                    Sets:
                  </Typography>
                  <ul>
                    {set.setNames.map((name) => (
                      <li key={name}>
                        <Link to={`/sets/${encodeURIComponent(name)}`} style={{ textDecoration: 'none' }}>
                          {name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Sets;
