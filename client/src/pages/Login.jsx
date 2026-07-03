import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import { useAuth } from '../context/useAuth';

export default function Login() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState(params.get('mode') === 'signup' ? 'signup' : 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signup(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid-paper flex min-h-[calc(100vh-4rem)] items-center justify-center bg-bg py-16">
      <Container className="flex justify-center">
        <div className="w-full max-w-sm rounded-md border border-line-dark bg-surface p-8">
          <Link to="/" className="flex items-center justify-center gap-2 font-display text-lg font-semibold text-cream">
            <TrendingUp className="h-5 w-5 text-marigold" /> Vantage Quant
          </Link>

          <div className="mt-6 flex rounded-sm border border-line-dark bg-surface-2 p-1">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 rounded-sm py-2 text-sm font-medium transition-colors ${
                mode === 'login' ? 'bg-marigold text-ink' : 'text-cream-dim'
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-sm py-2 text-sm font-medium transition-colors ${
                mode === 'signup' ? 'bg-marigold text-ink' : 'text-cream-dim'
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'signup' && (
              <Input
                label="Full name"
                type="text"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                required
              />
            )}
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => setForm((f) => ({ ...f, password: v }))}
              required
              minLength={8}
            />

            {error && <p className="text-sm text-loss">{error}</p>}

            <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
              {submitting ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-cream-dim">
            By continuing you agree this is an educational template — algo trading carries real
            financial risk.
          </p>
        </div>
      </Container>
    </div>
  );
}

function Input({ label, type, value, onChange, required, minLength }) {
  return (
    <label className="block">
      <span className="block font-mono text-[11px] uppercase tracking-wide text-cream-dim">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        minLength={minLength}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-sm border border-line-dark bg-surface-2 px-3 py-2.5 text-sm text-cream outline-none focus:border-marigold"
      />
    </label>
  );
}
