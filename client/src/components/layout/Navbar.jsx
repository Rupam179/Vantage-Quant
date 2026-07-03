import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, TrendingUp } from 'lucide-react';
import Container from '../common/Container';
import Button from '../common/Button';
import { useAuth } from '../../context/useAuth';

const NAV_LINKS = [
  { href: '/#strategy', label: 'Strategy' },
  { href: '/#performance', label: 'Performance' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line-dark/70 bg-bg/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-cream">
          <TrendingUp className="h-5 w-5 text-marigold" aria-hidden="true" />
          Vantage Quant
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-cream-dim transition-colors hover:text-cream"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button as={Link} to="/dashboard" variant="secondary" className="px-4 py-2 text-sm">
                Dashboard
              </Button>
              <Button onClick={handleLogout} variant="primary" className="px-4 py-2 text-sm">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="secondary" className="px-4 py-2 text-sm">
                Log in
              </Button>
              <Button as={Link} to="/login?mode=signup" variant="primary" className="px-4 py-2 text-sm">
                Start free
              </Button>
            </>
          )}
        </div>

        <button
          className="text-cream md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-line-dark bg-bg md:hidden">
          <Container className="flex flex-col gap-4 py-5">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-cream-dim" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              {user ? (
                <>
                  <Button as={Link} to="/dashboard" variant="secondary" onClick={() => setOpen(false)}>
                    Dashboard
                  </Button>
                  <Button onClick={handleLogout} variant="primary">
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button as={Link} to="/login" variant="secondary" onClick={() => setOpen(false)}>
                    Log in
                  </Button>
                  <Button as={Link} to="/login?mode=signup" variant="primary" onClick={() => setOpen(false)}>
                    Start free
                  </Button>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
