import { useState } from 'react';

export default function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          onClick={() => !readonly && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          style={{
            fontSize: readonly ? '1rem' : '1.4rem',
            cursor: readonly ? 'default' : 'pointer',
            color: star <= (hovered || value) ? 'var(--accent)' : 'var(--surface2)',
            transition: 'color 0.1s',
            userSelect: 'none'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}