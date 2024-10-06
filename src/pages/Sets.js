// Sets.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid } from '@mui/material';
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
        <Grid item xs={12} sm={6} md={4} key={set.series}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {set.series}
              </Typography>
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
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Sets;
