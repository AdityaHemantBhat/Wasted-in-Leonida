import React, { useState, useRef, useEffect } from 'react';
import { usePoster } from '../../context/PosterContext';
import { fmtMoney } from '../../utils/formatters';

export default function MiniPosterCard({ suspect, onDelete }) {
  const { loadPreset } = usePoster();
  const [detectedRatio, setDetectedRatio] = useState(suspect.photoAspectRatio || null);
  const imgRef = useRef(null);

  // Check if image is already cached / loaded on mount or prop change
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth && imgRef.current.naturalHeight) {
      const realRatio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
      if (!detectedRatio || Math.abs(detectedRatio - realRatio) > 0.05) {
        setDetectedRatio(realRatio);
      }
    }
  }, [suspect.photoUrl, detectedRatio]);

  const handleOpen = () => {
    loadPreset(suspect);
    const studioEl = document.getElementById('studio');
    if (studioEl) {
      if (window.lenis) {
        window.lenis.scrollTo(studioEl, { duration: 1.2 });
      } else {
        studioEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const filterClass =
    suspect.filter === 'bw' ? 'f-bw' : suspect.filter === 'neon' ? 'f-neon' : '';

  // Determine frame aspect ratio matching Studio logic exactly
  let frameRatio = 79 / 50;
  const photoAspect = suspect.photoAspect || 'auto';
  if (photoAspect === 'portrait') {
    frameRatio = 3 / 4;
  } else if (photoAspect === 'story') {
    frameRatio = 9 / 16;
  } else if (photoAspect === 'square') {
    frameRatio = 1 / 1;
  } else if (photoAspect === 'standard') {
    frameRatio = 79 / 50;
  } else if (photoAspect === 'auto') {
    const effectiveRatio = detectedRatio || suspect.photoAspectRatio;
    if (effectiveRatio) {
      frameRatio = Math.max(0.56, Math.min(1.85, effectiveRatio));
    } else {
      frameRatio = 79 / 50;
    }
  }

  // Consistent visual height matching Studio:
  // Tall photos (frameRatio < 1.05) keep height at ~66% of card content width, centering width
  const isTall = frameRatio < 1.05;
  const photoContainerStyle = {
    aspectRatio: `${frameRatio}`,
    width: isTall ? `min(100%, ${Math.max(48, Math.round(72 * frameRatio))}%)` : '100%',
    margin: isTall ? '14px auto 0' : '14px 0 0',
    background: suspect.photoUrl ? '#1b1916' : undefined,
  };

  return (
    <article className="mini-poster is-friend">
      {onDelete && (
        <button
          className="mp-unpin"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(suspect.id);
          }}
          title="Unpin file from Wanted Wall"
          aria-label={`Unpin ${suspect.name}`}
        >
          &times;
        </button>
      )}

      <div className="mp-topline">
        <p className="mp-dept">Leonida County Police Dept.</p>
        <span className="mp-badge">Friend on file</span>
      </div>

      <div className="mp-wanted">Wanted</div>

      <div className="mp-stars">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <svg key={i} viewBox="0 0 100 100" aria-hidden="true">
            <path
              className={i <= suspect.stars ? 'on' : 'off'}
              d="M50 4 L63 37 L98 37 L70 59 L80 94 L50 72 L20 94 L30 59 L2 37 L37 37 Z"
            />
          </svg>
        ))}
      </div>

      <div className="mp-photo" style={photoContainerStyle}>
        {suspect.photoUrl ? (
          <img
            ref={imgRef}
            src={suspect.photoUrl}
            alt={suspect.name}
            className={filterClass}
            loading="lazy"
            onLoad={(e) => {
              if (e.target.naturalWidth && e.target.naturalHeight) {
                const realRatio = e.target.naturalWidth / e.target.naturalHeight;
                if (!detectedRatio || Math.abs(detectedRatio - realRatio) > 0.05) {
                  setDetectedRatio(realRatio);
                }
              }
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: suspect.photoFit || 'contain',
              objectPosition: 'center center',
              transform: `scale(${(suspect.zoom || 100) / 100})`,
              transformOrigin: 'center center',
              display: 'block'
            }}
          />
        ) : (
          <svg viewBox="0 0 200 130" aria-hidden="true">
            <circle cx="100" cy="46" r="27" fill="#45413a" />
            <path
              d="M100 82c-34 0-58 16-70 48h140c-12-32-36-48-70-48z"
              fill="#45413a"
            />
          </svg>
        )}
      </div>

      <div className="mp-name">{suspect.name}</div>
      <div className="mp-alias">&ldquo;{suspect.alias}&rdquo;</div>
      <div className="mp-where">Last seen &mdash; {suspect.seen}</div>

      {suspect.charges && suspect.charges.length > 0 && (
        <div className="mp-charges">
          {suspect.charges.slice(0, 2).join(' \u00B7 ')}
        </div>
      )}

      <div className="mp-reward">
        <small>Reward</small>
        {fmtMoney(suspect.reward)}
      </div>

      <button className="mini-use" type="button" onClick={handleOpen}>
        Open in the Studio &rarr;
      </button>
    </article>
  );
}
