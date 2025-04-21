import axios from 'axios';
import { getToken } from '../utils/token';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/user',
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
  const res = await API.get('/feed');
  return res.data;
};
