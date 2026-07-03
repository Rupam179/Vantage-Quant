import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-bg">
        <p className="font-mono text-sm text-cream-dim">Loading…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
