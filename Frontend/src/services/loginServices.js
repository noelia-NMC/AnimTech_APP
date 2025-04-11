import API from './http';

export const loginUsuario = (email, password) =>
  API.post('/auth/login', { email, password });

export const registrarUsuario = (email, password) =>
    API.post('/auth/register', { email, password });