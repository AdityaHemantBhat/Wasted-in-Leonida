import React from 'react';

export default function PosterStars({ stars }) {
  return (
    <span className="stars-row" id="posterStars" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <svg key={i} viewBox="0 0 100 100" aria-hidden="true">
          <path
            className={i <= stars ? 'on' : 'off'}
            d="M50 4 L63 37 L98 37 L70 59 L80 94 L50 72 L20 94 L30 59 L2 37 L37 37 Z"
          />
        </svg>
      ))}
    </span>
  );
}

