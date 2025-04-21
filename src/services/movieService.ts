import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/movies',
});

export const searchMovies = async (query: string) => {
  const res = await API.get(`/search?q=${encodeURIComponent(query)}`);
  return res.data;
};

export const getMovieDetails = async (imdbID: string) => {
  const res = await API.get(`/${imdbID}`);
  return res.data;
};

