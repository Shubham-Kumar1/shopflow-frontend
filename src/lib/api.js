const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

function handleUnauthorized() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }
}

async function request(method, path, body) {
  try {
    const options = {
      method,
      headers: getHeaders(),
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const res = await fetch(`${API_URL}${path}`, options);
    if (res.status === 401) {
      handleUnauthorized();
      return { data: null, error: 'Unauthorized' };
    }
    const data = await res.json();
    if (!res.ok) {
      return { data: null, error: data.message || data.error || 'Request failed' };
    }
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Network error' };
  }
}

const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
};

export default api;
