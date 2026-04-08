import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';

const API_KEY = 'df5c3a6badad741d01fad5c0a30e4019';
const BASE    = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP = 'https://image.tmdb.org/t/p/w1280';

export default function MovieDetail() {
  const { id }       = useParams();    // gets the movie id from the URL
  const navigate     = useNavigate();
  const [movie, setMovie]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [reviews, setReviews]   = useState(
    JSON.parse(localStorage.getItem('movieReviews') || '{}')
  );
  const [rating, setRating]     = useState(reviews[id]?.rating || 0);
  const [reviewText, setReview] = useState(reviews[id]?.text   || '');
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    async function loadMovie() {
      try {
        const res  = await fetch(`${BASE}/movie/${id}?api_key=${API_KEY}`);
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [id]);

  function saveReview() {
    if (!rating) return;
    const updated = {
      ...reviews,
      [id]: {
        rating,
        text: reviewText,
        title: movie.title,
        poster: movie.poster_path,
        savedAt: new Date().toISOString()
      }
    };
    localStorage.setItem('movieReviews', JSON.stringify(updated));
    setReviews(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function deleteReview() {
    const updated = { ...reviews };
    delete updated[id];
    localStorage.setItem('movieReviews', JSON.stringify(updated));
    setReviews(updated);
    setRating(0);
    setReview('');
  }

  if (loading) return <Loader />;
  if (!movie)  return <p style={{ padding: '2rem', color: 'var(--text2)' }}>Movie not found.</p>;

  const year    = movie.release_date?.split('-')[0];
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '—';
  const hasReview = !!reviews[id];

  return (
    <div>
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div style={{
          height: 260, overflow: 'hidden',
          background: 'var(--surface)'
        }}>
          <img
            src={`${BACKDROP}${movie.backdrop_path}`}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }}
          />
        </div>
      )}

      <div className="container" style={{ padding: '2rem 1.5rem' }}>

        {/* Back button */}
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none',
          color: 'var(--text2)', fontSize: '0.9rem',
          marginBottom: '1.5rem', padding: 0
        }}>
          ← Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem' }}>

          {/* Poster */}
          <div style={{
            borderRadius: 'var(--radius)', overflow: 'hidden',
            border: '1px solid var(--border)', flexShrink: 0
          }}>
            {movie.poster_path ? (
              <img src={`${IMG_BASE}${movie.poster_path}`} alt={movie.title} />
            ) : (
              <div style={{
                aspectRatio: '2/3', background: 'var(--surface2)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'var(--text2)'
              }}>No poster</div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 8 }}>
              {movie.title}
            </h1>

            <div style={{ display: 'flex', gap: 16, marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{year}</span>
              <span style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{runtime}</span>
              <span style={{
                color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 500
              }}>★ {Math.round(movie.vote_average * 10) / 10}</span>
            </div>

            {/* Genres */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
              {movie.genres?.map(g => (
                <span key={g.id} style={{
                  background: 'var(--surface2)', color: 'var(--text2)',
                  fontSize: '0.78rem', padding: '3px 10px', borderRadius: 20
                }}>
                  {g.name}
                </span>
              ))}
            </div>

            <p style={{
              color: 'var(--text2)', fontSize: '0.95rem',
              lineHeight: 1.7, maxWidth: 560
            }}>
              {movie.overview}
            </p>
          </div>
        </div>

        {/* Review section */}
        <div style={{
          marginTop: '2.5rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
            {hasReview ? 'Your review' : 'Write a review'}
          </h2>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: 8 }}>
              Your rating
            </p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <textarea
            value={reviewText}
            onChange={e => setReview(e.target.value)}
            placeholder="What did you think? (optional)"
            rows={4}
            style={{
              width: '100%', background: 'var(--surface2)',
              border: '1px solid var(--border)', borderRadius: 8,
              padding: '0.75rem 1rem', color: 'var(--text)',
              fontSize: '0.9rem', fontFamily: 'inherit',
              resize: 'vertical', outline: 'none', marginBottom: '1rem'
            }}
          />

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={saveReview}
              disabled={!rating}
              style={{
                background: rating ? 'var(--accent)' : 'var(--surface2)',
                color: rating ? '#000' : 'var(--text2)',
                border: 'none', borderRadius: 8,
                padding: '0.65rem 1.25rem',
                fontWeight: 600, fontSize: '0.9rem',
                transition: 'all 0.15s'
              }}
            >
              {saved ? 'Saved!' : hasReview ? 'Update review' : 'Save review'}
            </button>

            {hasReview && (
              <button onClick={deleteReview} style={{
                background: 'none',
                border: '1px solid var(--border)',
                color: 'var(--red)', borderRadius: 8,
                padding: '0.65rem 1rem', fontSize: '0.9rem'
              }}>
                Delete
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}