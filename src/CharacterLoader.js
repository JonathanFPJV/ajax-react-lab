import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
} from '@mui/material';

function CharacterLoader() {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Carga los personajes cuando se monta el componente
    loadCharacters();
  }, []);

  const loadCharacters = () => {
    setLoading(true);
    axios
      .get('https://swapi.dev/api/people/')
      .then((response) => {
        const sortedCharacters = response.data.results.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCharacters(sortedCharacters);
        setFilteredCharacters(sortedCharacters); // Inicialmente muestra todos los personajes
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      // Si el campo de búsqueda está vacío, mostramos todos los personajes
      setFilteredCharacters(characters);
    } else {
      // Dividir personajes en coincidencias exactas y parciales
      const exactMatches = characters.filter((character) =>
        character.name.toLowerCase().startsWith(term)
      );

      const partialMatches = characters.filter(
        (character) =>
          character.name.toLowerCase().includes(term) &&
          !character.name.toLowerCase().startsWith(term)
      );

      // Ordenar ambas listas y combinarlas: primero exactas, luego parciales
      const sortedResults = [
        ...exactMatches.sort((a, b) => a.name.localeCompare(b.name)),
        ...partialMatches.sort((a, b) => a.name.localeCompare(b.name)),
      ];

      setFilteredCharacters(sortedResults);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Personajes de Star Wars
      </Typography>

      {/* Campo de búsqueda */}
      <TextField
        label="Buscar personajes"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 4 }}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {filteredCharacters.map((character, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {character.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Género:</strong> {character.gender}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Año de nacimiento:</strong> {character.birth_year}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default CharacterLoader;
