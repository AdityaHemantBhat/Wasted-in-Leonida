import React from 'react';
import { usePoster } from '../../context/PosterContext';

export default function Footer() {
  const { randomize } = usePoster();

  const handleRandomFile = (e) => {
    e.preventDefault();
    randomize();
    const studioEl = document.getElementById('studio');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer>
      <div className="wrap">
        <p className="foot-lockup">
          <span className="row">Wasted</span>
          <span className="row">in Leonida</span>
        </p>
        <a className="news-bar" href="#studio">
          <span className="nb-text">Get Wasted in Leonida</span>
          <span className="nb-go">Make a poster</span>
        </a>
        <div className="socials">
          <a
            href="https://www.youtube.com/@WastedInLeonida"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Wasted in Leonida on YouTube"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8zM10 15.2V8.8L15.5 12 10 15.2z" />
            </svg>
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Wasted in Leonida on X"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.9 3H21l-6.8 7.8L22.2 21h-6.3l-4.9-6.4L5.4 21H2.2l7.3-8.3L2 3h6.4l4.4 5.9L17.9 3zm-1.1 16.1h1.7L7.4 4.8H5.6l11.2 14.3z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Wasted in Leonida on Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.9-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.1a6.7 6.7 0 1 0 0 13.4 6.7 6.7 0 0 0 0-13.4zm0 11a4.4 4.4 0 1 1 0-8.7 4.4 4.4 0 0 1 0 8.7zm6.9-11.3a1.6 1.6 0 1 0 0 3.1 1.6 1.6 0 0 0 0-3.1z" />
            </svg>
          </a>
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Wasted in Leonida on TikTok"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16.6 3c.4 2 1.8 3.6 3.9 3.9v3c-1.5 0-2.9-.5-3.9-1.3v6.1c0 3.5-2.6 5.8-5.9 5.8A5.7 5.7 0 0 1 5 14.7c0-3.2 2.6-5.7 5.9-5.7l1 .1v3.1a2.7 2.7 0 0 0-1-.2 2.6 2.6 0 0 0-2.6 2.7 2.6 2.6 0 0 0 2.7 2.6c1.6 0 2.8-1.1 2.8-2.9V3h2.8z" />
            </svg>
          </a>
        </div>
        <nav className="legal-links" aria-label="Legal">
          <a href="#studio">The Studio</a>
          <a href="#wall">Wanted Wall</a>
          <a href="#news">News</a>
          <a href="#studio" id="footRandom" onClick={handleRandomFile}>
            Random file
          </a>
        </nav>
        <p className="foot-legal" id="legal">
          <span className="fl-head">Fan-Made — Not Affiliated With Rockstar Games</span>
          Wasted in Leonida is an unofficial, fan-made project. It is not affiliated with, endorsed by, or connected to Rockstar Games or Take-Two Interactive. Grand Theft Auto, GTA and Vice City are trademarks of Take-Two Interactive. All photography is of real Miami and Florida locations. Wanted posters are generated entirely in your browser — your photos never leave your device.
        </p>
        <p className="foot-copy">
          &copy; 2026 Wasted in Leonida — Vice City never sleeps. Neither do we.
        </p>
      </div>
    </footer>
  );
}

