import React, { useEffect } from 'react';

export default function Drawer({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`drawer ${isOpen ? 'open' : ''}`}
      id="drawer"
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label="Site menu"
    >
      <div className="drawer-visual" aria-hidden="true">
        <img
          src="/images/ocean-drive-sunset.jpg"
          width="2000"
          height="1300"
          alt=""
          loading="eager"
          decoding="async"
        />
        <span className="big-w">W</span>
      </div>
      <div className="drawer-panel">
        <button
          className="drawer-close"
          id="drawerClose"
          type="button"
          aria-label="Close menu"
          onClick={onClose}
        >
          &times;
        </button>
        <nav aria-label="Menu">
          <a href="#top" onClick={onClose}>
            <small>01</small>Home
          </a>
          <a href="#story" onClick={onClose}>
            <small>02</small>Watch
          </a>
          <a href="#regions" onClick={onClose}>
            <small>03</small>Only in Leonida
          </a>
          <a href="#studio" onClick={onClose}>
            <small>04</small>Make a Poster
          </a>
          <a
            href="https://www.rockstargames.com/VI/launch-gallery"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            <small>05</small>Launch Gallery ↗
          </a>
        </nav>
        <p className="drawer-foot">
          Wasted in Leonida
          <br />
          Fan-made — not affiliated with Rockstar Games
          <br />
          Coming November 19, 2026
        </p>
      </div>
    </div>
  );
}
