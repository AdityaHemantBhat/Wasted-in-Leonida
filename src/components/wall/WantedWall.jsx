import React, { useState, useEffect, useMemo } from 'react';
import { getAllSuspects, deleteSuspect, UPDATE_EVENT } from '../../utils/suspectsStorage';
import { usePoster } from '../../context/PosterContext';
import MiniPosterCard from './MiniPosterCard';

export default function WantedWall() {
  const [suspects, setSuspects] = useState(() => getAllSuspects());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'most_wanted', 'vice_city'
  const { showToast } = usePoster();

  // Keep suspects in sync with localStorage updates
  useEffect(() => {
    const handleUpdate = () => {
      setSuspects(getAllSuspects());
    };
    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleDelete = (id) => {
    deleteSuspect(id);
    showToast('Suspect file unpinned from the wall.');
  };

  const filteredSuspects = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return suspects.filter((s) => {
      // Filter by tab
      if (filterTab === 'most_wanted' && (s.stars || 0) < 5) return false;
      if (filterTab === 'vice_city' && !s.seen?.toLowerCase().includes('vice')) return false;

      // Filter by search query
      if (!q) return true;
      const matchName = s.name?.toLowerCase().includes(q);
      const matchAlias = s.alias?.toLowerCase().includes(q);
      const matchSeen = s.seen?.toLowerCase().includes(q);
      const matchCharges = s.charges?.some((c) => c.toLowerCase().includes(q));
      return matchName || matchAlias || matchSeen || matchCharges;
    });
  }, [suspects, filterTab, searchQuery]);

  const scrollToStudio = () => {
    const studioEl = document.getElementById('studio');
    if (studioEl) {
      if (window.lenis) {
        window.lenis.scrollTo(studioEl, { duration: 1.2 });
      } else {
        studioEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="wall" aria-label="Example posters">
      <div className="wall-bg" aria-hidden="true">
        <img
          id="wallBg"
          src="/images/leonida-map-landscape.jpg"
          width="1920"
          height="1079"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div className="wall-shade"></div>
      </div>
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">Wanted Wall // LCPD Archive</span>
          <h2>Already on the wall.</h2>
          <p>
            Real suspect files pinned to the corkboard. Search suspects, look up your pinned friends, or open any file directly back into the Studio.
          </p>
        </div>

        {suspects.length > 0 && (
          /* LCPD Database Search & Filter Console */
          <div className="wall-console rv">
            <div className="wall-search-row">
              <div className="wall-search-box">
                <svg
                  className="ws-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className="wall-search-input"
                  placeholder="Search suspect name, alias, charge, or city…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search suspects and friends"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="ws-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    &times;
                  </button>
                )}
              </div>

              <div className="wall-counter">
                <span className="wc-num">{filteredSuspects.length}</span>
                <span className="wc-label">
                  {filteredSuspects.length === 1 ? 'Record on file' : 'Records on file'}
                </span>
              </div>
            </div>

            <div className="wall-filters">
              <button
                type="button"
                className={`wall-pill ${filterTab === 'all' ? 'active' : ''}`}
                onClick={() => setFilterTab('all')}
              >
                All Records ({suspects.length})
              </button>
              <button
                type="button"
                className={`wall-pill ${filterTab === 'most_wanted' ? 'active' : ''}`}
                onClick={() => setFilterTab('most_wanted')}
              >
                Most Wanted (5-6★)
              </button>
              <button
                type="button"
                className={`wall-pill ${filterTab === 'vice_city' ? 'active' : ''}`}
                onClick={() => setFilterTab('vice_city')}
              >
                Vice City
              </button>
            </div>
          </div>
        )}

        {/* Suspects Wall Grid */}
        {suspects.length === 0 ? (
          <div className="wall-empty rv" style={{ marginTop: '36px' }}>
            <div className="we-badge">LCPD ARCHIVE // NO ACTIVE FILES</div>
            <h3>The Wanted Wall is clear</h3>
            <p>
              No dummy placeholders. Only real wanted posters live here. Head up to the Poster Studio, customize your poster with your photo, and click <b>Pin to Wanted Wall</b> to post it to the board.
            </p>
            <div className="we-actions" style={{ marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-pink"
                onClick={scrollToStudio}
              >
                Create a Wanted Poster &uarr;
              </button>
            </div>
          </div>
        ) : filteredSuspects.length > 0 ? (
          <div className="wall-grid" id="wallGrid">
            {filteredSuspects.map((suspect) => (
              <MiniPosterCard
                key={suspect.id || suspect.name}
                suspect={suspect}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="wall-empty rv">
            <div className="we-badge">LCPD RECORDS // ZERO MATCHES</div>
            <h3>No suspect files found</h3>
            <p>
              No active records match &ldquo;<b>{searchQuery}</b>&rdquo;. Check your spelling or reset your filters.
            </p>
            <div className="we-actions" style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setSearchQuery('');
                  setFilterTab('all');
                }}
              >
                Reset search filters
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
