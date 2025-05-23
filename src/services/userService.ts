import axios from 'axios';
import { getToken } from '../utils/token';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/user',
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getMyProfile = async () => {
  const res = await API.get('/me');
  return res.data;
};

export const getProfile = async (id: string) => {
  const res = await API.get(`/${id}`);
  return res.data;
};

export const followUser = async (id: string) => {
  const res = await API.post(`/follow/${id}`);
  return res.data;
};

export const unfollowUser = async (id: string) => {
  const res = await API.post(`/unfollow/${id}`);
  return res.data;
};

export const getFeed = async () => {
  let url = '/feed/all'; // Default to the all reviews endpoint for anonymous users

  const token = getToken();
  if (token) {
    url = '/feed'; // If there's a token, use the authenticated user's feed
  }

  const res = await API.get(url);
  return res.data;
};
export const searchUsers = async (query: string) => {
  const res = await API.get(`/search?q=${encodeURIComponent(query)}`);
  return res.data;
};
