import axios from 'axios';
import { getToken } from '../utils/token';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/reviews',
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getSummary = async (imdbID: string) => {
  const res = await API.get(`/summary/${imdbID}`);
  return res.data;
};

export const createReview = async (data: {
  imdbID: string;
  title: string;
  content: string;
  rating: number;
}) => {
  const res = await API.post('/', data);
  return res.data;
};

export const voteReview = async (id: string, vote: 'helpful' | 'unhelpful') => {
  const res = await API.post(`/vote/${id}`, { vote });
  return res.data;
};
