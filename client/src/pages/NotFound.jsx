import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-bg text-center">
      <p className="font-mono text-sm text-teal">404</p>
      <h1 className="mt-2 font-display text-3xl font-medium text-cream">Page not found</h1>
      <p className="mt-2 text-cream-dim">That route doesn't exist in this ledger.</p>
      <Button as={Link} to="/" variant="primary" className="mt-6">
        Back home
      </Button>
    </div>
  );
}
