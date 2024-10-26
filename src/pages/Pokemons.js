import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Pokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get('https://api.pokemontcg.io/v2/cards');
        setPokemons(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching Pokémon data');
        setLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <div>
      <h1>Pokémonssss Overview</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {pokemons.map((pokemon) => (
          <div key={pokemon.id} style={{ border: '1px solid #ccc', padding: '10px', width: '150px' }}>
            <img src={pokemon.images.small} alt={pokemon.name} />
            <h2>{pokemon.name}</h2>
            <p>{pokemon.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pokemons;
