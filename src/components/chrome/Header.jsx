import React from 'react';

export default function Header({ isScrolled, onOpenDrawer }) {
  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`} id="nav">
      <div className="header-in">
        <a className="wordmark" href="#top">
          Wasted <em>in</em> Leonida
        </a>
        <div className="header-actions">
          <a className="hdr-cta" href="#studio">
            Make a poster
          </a>
          <button
            className="burger"
            id="burger"
            type="button"
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="drawer"
            onClick={onOpenDrawer}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

