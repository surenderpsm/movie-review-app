import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { getToken, setToken, removeToken } from '../utils/token';
import { User } from '../types/User';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const login = async (email: string, password: string) => {
  const res = await API.post('/api/auth/login', { email, password });
  setToken(res.data.token);
  return res.data;
};

export const register = async (data: {
  username: string;
  email: string;
  password: string;
  role: string;
}) => {
  const res = await API.post('/api/auth/register', data);
  return res.data;
};

export const logout = () => removeToken();

export const getCurrentUser = (): User | null => {
  const token = getToken();
  try {
    return token ? jwtDecode<User>(token) : null;
  } catch {
    return null;
  }
};
