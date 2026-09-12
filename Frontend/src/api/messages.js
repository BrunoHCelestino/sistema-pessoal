import { apiFetch } from './client.js';

export function fetchMessages({ signal } = {}) {
  return apiFetch('/messages?recibo=true', { auth: true, signal });
}