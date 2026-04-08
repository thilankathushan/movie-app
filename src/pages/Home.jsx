import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const API_KEY = 'df5c3a6badad741d01fad5c0a30e4019';
const BASE = 'https://api.themoviedb.org/3';

// These are the different lists we can browse
const CATEGORIES = [
  { id: 'popular',     label: 'Popular'      },
  { id: 'top_rated',  label: 'Top rated'    },
  { id: 'now_playing',label: 'Now playing'  },
  { id: 'upcoming',   label: 'Upcoming'     },
];

export default function Home() {
  const [movies, setMovies]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [category, setCategory]   = useState('popular');
  const [search, setSearch]       = useState('');
  const [query, setQuery]         = useState('');
  const [reviews, setReviews]     = useState(
    JSON.parse(localStorage.getItem('movieReviews') || '{}')
  );

  // useEffect runs after the component renders
  // The dependency array [category, query] means:
  // re-run this effect whenever category or query changes
  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      try {
        // If user searched, use search endpoint — otherwise use category
        const url = query
          ? `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
          : `${BASE}/movie/${category}?api_key=${API_KEY}`;

        const res  = await fetch(url);
        const data = await res.json();
        setMovies(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, [category, query]);

  function handleSearch(e) {
    e.preventDefault();
    setQuery(search.trim());
  }

  function clearSearch() {
    setSearch('');
    setQuery('');
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{
        display: 'flex', gap: 8, marginBottom: '1.5rem'
      }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search movies..."
          style={{
            flex: 1, background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 8,
            padding: '0.65rem 1rem', fontSize: '0.95rem',
            color: 'var(--text)', outline: 'none'
          }}
        />
        <button type="submit" style={{
          background: 'var(--accent)', color: '#000',
          border: 'none', borderRadius: 8,
          padding: '0.65rem 1.25rem', fontWeight: 600, fontSize: '0.9rem'
        }}>
          Search
        </button>
        {query && (
          <button type="button" onClick={clearSearch} style={{
            background: 'var(--surface)', color: 'var(--text2)',
            border: '1px solid var(--border)', borderRadius: 8,
            padding: '0.65rem 1rem', fontSize: '0.9rem'
          }}>
            Clear
          </button>
        )}
      </form>

      {/* Category tabs — only show when not searching */}
      {!query && (
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                background: category === cat.id ? 'var(--accent-dim)' : 'var(--surface)',
                border: `1px solid ${category === cat.id ? 'var(--accent)' : 'var(--border)'}`,
                color: category === cat.id ? 'var(--accent)' : 'var(--text2)',
                borderRadius: 20, padding: '0.35rem 1rem',
                fontSize: '0.85rem', fontWeight: category === cat.id ? 500 : 400,
                transition: 'all 0.15s'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Results heading when searching */}
      {query && (
        <p style={{ color: 'var(--text2)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {movies.length} results for "{query}"
        </p>
      )}

      {/* Movie grid */}
      {loading ? <Loader /> : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '1rem'
        }}>
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              userRating={reviews[movie.id]?.rating}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && movies.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text2)' }}>
          No movies found.
        </div>
      )}
    </div>
  );
}