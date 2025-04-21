import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL+'/movies',
});

export const searchMovies = async (query: string) => {
  const res = await API.get(`/search?q=${encodeURIComponent(query)}`);
  return res.data;
};

export const getMovieDetails = async (imdbID: string) => {
  const res = await API.get(`/${imdbID}`);
  return res.data;
};

