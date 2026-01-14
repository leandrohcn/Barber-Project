import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Apontando para o Backend novo
});

// Interceptador: Toda vez que o frontend chamar a API,
// ele verifica se tem token e já anexa no cabeçalho automaticamente.
api.interceptors.request.use((config) => {
  const token = Cookies.get('barber_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;