import { apiFetch } from './client.js';

export function login({ login, password }) {
  return apiFetch('/auth/login', { method: 'POST', body: { login, password } });
}