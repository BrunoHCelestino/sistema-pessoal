const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function getToken() {
  return (
    sessionStorage.getItem('bc_system_token') ??
    localStorage.getItem('bc_system_token')
  );
}

export async function apiFetch(path, { method = 'GET', body = null, auth = false, signal } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError('Não foi possível conectar ao servidor. Verifique se o backend está no ar.', 0);
  }

  if (!response.ok) {
    let message = `Falha na requisição (${response.status})`;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
      else if (data?.error) message = data.error;
    } catch {
      /* resposta sem corpo JSON */
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}