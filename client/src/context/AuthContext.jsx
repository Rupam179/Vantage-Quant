import { useEffect, useState } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContextValue';

export { AuthContext } from './AuthContextValue';

const TOKEN_KEY = 'vq_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => { localStorage.removeItem(TOKEN_KEY); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async function signup(name, email, password) {
    const res = await api.post('/auth/signup', { name, email, password });
    saveToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    saveToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function logout() {
    await api.post('/auth/logout');
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
