import axios from 'axios';

// In local dev, Vite's proxy (see vite.config.js) forwards relative `/api`
// calls to the backend. In production, set VITE_API_URL to your deployed
// backend's base URL (e.g. https://your-backend.onrender.com/api) — or use
// the Vercel rewrites approach described in DEPLOYMENT.md instead, in which
// case you can leave this as the default relative path.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
