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
  const [page, setPage] = useState(1);
  const charactersPerPage = 12;

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    setLoading(true);
    try {
      let allCharacters = [];
      let url = 'https://swapi.dev/api/people/';
      while (url) {
        const response = await axios.get(url);
        allCharacters = [...allCharacters, ...response.data.results];
        url = response.data.next;
      }
      const sortedCharacters = allCharacters.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setCharacters(sortedCharacters);
      setFilteredCharacters(sortedCharacters);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setPage(1);

    if (term === '') {
      setFilteredCharacters(characters);
    } else {
      const filtered = characters.filter((character) => {
        const { name, gender, height, eye_color } = character;
        return (
          (name && name.toLowerCase().includes(term)) ||
          (gender && gender.toLowerCase().includes(term)) ||
          (height && height.toString().includes(term)) ||
          (eye_color && eye_color.toLowerCase().includes(term))
        );
      });

      const exactMatches = filtered.filter((character) =>
        character.name.toLowerCase().startsWith(term)
      );
      const partialMatches = filtered.filter(
        (character) => !character.name.toLowerCase().startsWith(term)
      );

      const sortedResults = [
        ...exactMatches.sort((a, b) => a.name.localeCompare(b.name)),
        ...partialMatches.sort((a, b) => a.name.localeCompare(b.name)),
      ];

      setFilteredCharacters(sortedResults);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

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
                    <Typography variant="body2" color="text.secondary">
                      <strong>Altura:</strong> {character.height}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Masa:</strong> {character.mass}
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
