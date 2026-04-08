import { useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../components/StarRating';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

export default function MyReviews() {
  const [reviews, setReviews] = useState(
    JSON.parse(localStorage.getItem('movieReviews') || '{}')
  );

  const entries = Object.entries(reviews);

  function deleteReview(id) {
    const updated = { ...reviews };
    delete updated[id];
    localStorage.setItem('movieReviews', JSON.stringify(updated));
    setReviews(updated);
  }

  if (entries.length === 0) {
    return (
      <div className="container" style={{
        padding: '4rem 1.5rem', textAlign: 'center', color: 'var(--text2)'
      }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>No reviews yet.</p>
        <Link to="/" style={{
          color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 500
        }}>
          Discover movies →
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        My reviews
      </h1>
      <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '2rem' }}>
        {entries.length} movie{entries.length !== 1 ? 's' : ''} reviewed
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {entries
          .sort((a, b) => new Date(b[1].savedAt) - new Date(a[1].savedAt))
          .map(([id, review]) => (
          <div key={id} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1rem',
            display: 'flex', gap: '1rem', alignItems: 'flex-start'
          }}>
            {/* Poster thumbnail */}
            <Link to={`/movie/${id}`}>
              <div style={{
                width: 60, borderRadius: 6, overflow: 'hidden',
                border: '1px solid var(--border)', flexShrink: 0
              }}>
                {review.poster ? (
                  <img src={`${IMG_BASE}${review.poster}`} alt={review.title} />
                ) : (
                  <div style={{
                    aspectRatio: '2/3', background: 'var(--surface2)'
                  }}/>
                )}
              </div>
            </Link>

            {/* Review content */}
            <div style={{ flex: 1 }}>
              <Link to={`/movie/${id}`}>
                <p style={{
                  fontWeight: 600, fontSize: '1rem',
                  marginBottom: 6, color: 'var(--text)'
                }}>
                  {review.title}
                </p>
              </Link>
              <StarRating value={review.rating} readonly />
              {review.text && (
                <p style={{
                  color: 'var(--text2)', fontSize: '0.88rem',
                  marginTop: 8, lineHeight: 1.6
                }}>
                  {review.text}
                </p>
              )}
              <p style={{
                color: 'var(--text2)', fontSize: '0.78rem', marginTop: 8
              }}>
                {new Date(review.savedAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>

            <button onClick={() => deleteReview(id)} style={{
              background: 'none', border: 'none',
              color: 'var(--text2)', fontSize: '1.1rem',
              padding: '4px', flexShrink: 0
            }}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}