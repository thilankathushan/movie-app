import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ movie, userRating }) {
  const year = movie.release_date?.split('-')[0] || '—';
  const rating = Math.round(movie.vote_average * 10) / 10;

  return (
    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        transition: 'border-color 0.15s, transform 0.15s',
        cursor: 'pointer'
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Poster */}
        <div style={{ aspectRatio: '2/3', background: 'var(--surface2)', overflow: 'hidden' }}>
          {movie.poster_path ? (
            <img
              src={`${IMG_BASE}${movie.poster_path}`}
              alt={movie.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text2)', fontSize: '0.85rem'
            }}>
              No poster
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '0.85rem' }}>
          <p style={{
            fontWeight: 600, fontSize: '0.9rem',
            marginBottom: 4, color: 'var(--text)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {movie.title}
          </p>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>{year}</span>
            <span style={{
              fontSize: '0.8rem', fontWeight: 500,
              color: rating >= 7 ? 'var(--green)' : rating >= 5 ? 'var(--accent)' : 'var(--red)'
            }}>
              ★ {rating}
            </span>
          </div>
          {/* Show user's star rating if they reviewed this movie */}
          {userRating && (
            <div style={{ marginTop: 6 }}>
              <StarRating value={userRating} readonly />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}