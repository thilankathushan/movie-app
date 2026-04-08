import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '1rem 1.5rem'
      }}>
        <Link to="/" style={{
          fontSize: '1.2rem', fontWeight: 700,
          color: 'var(--accent)'
        }}>
          CineLog
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[['/', 'Discover'], ['/reviews', 'My Reviews']].map(([path, label]) => (
            <Link key={path} to={path} style={{
              fontSize: '0.9rem',
              color: isActive(path) ? 'var(--accent)' : 'var(--text2)',
              fontWeight: isActive(path) ? 500 : 400,
              transition: 'color 0.15s'
            }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}