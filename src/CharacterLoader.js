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
  CardActions,
  IconButton,
  Pagination,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

function CharacterLoader() {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1); // Estado para la página actual
  const charactersPerPage = 12; // Número de personajes por página

  useEffect(() => {
    // Carga los personajes cuando se monta el componente
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    setLoading(true);
    try {
      // Obtener todos los personajes de SWAPI
      let allCharacters = [];
      let url = 'https://swapi.dev/api/people/';
      while (url) {
        const response = await axios.get(url);
        allCharacters = [...allCharacters, ...response.data.results];
        url = response.data.next; // La API de SWAPI devuelve `next` si hay más datos
      }
      const sortedCharacters = allCharacters.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setCharacters(sortedCharacters);
      setFilteredCharacters(sortedCharacters); // Inicialmente muestra todos los personajes
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setPage(1); // Reiniciar la página a la primera en cada búsqueda

    if (term === '') {
      setFilteredCharacters(characters);
    } else {
      const exactMatches = characters.filter((character) =>
        character.name.toLowerCase().startsWith(term)
      );
      const partialMatches = characters.filter(
        (character) =>
          character.name.toLowerCase().includes(term) &&
          !character.name.toLowerCase().startsWith(term)
      );
      const sortedResults = [
        ...exactMatches.sort((a, b) => a.name.localeCompare(b.name)),
        ...partialMatches.sort((a, b) => a.name.localeCompare(b.name)),
      ];
      setFilteredCharacters(sortedResults);
    }
  };

  // Manejar cambio de página
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calcular los personajes de la página actual
  const indexOfLastCharacter = page * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = filteredCharacters.slice(indexOfFirstCharacter, indexOfLastCharacter);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Personajes de Star Wars
      </Typography>

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
        <>
          <Grid container spacing={3}>
            {currentCharacters.map((character, index) => (
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
                  <CardActions>
                    <IconButton color="primary" aria-label="character icon">
                      <PersonIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Paginador */}
          <Pagination
            count={Math.ceil(filteredCharacters.length / charactersPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
          />
        </>
      )}
    </Container>
  );
}

export default CharacterLoader;
