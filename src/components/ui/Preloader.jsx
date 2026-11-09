import React, { useEffect, useState } from 'react';

const LOAD_DURATION_MS = 10000; // Exactly 10 seconds of cinematic loading animation

// Exact typographic bold italic W + straight upright star seamlessly joined (Rockstar Games 1:1 boolean union)
const W_STAR_B64 = "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMzUgMTI4Ij48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMS44IiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2UtbGluZWNhcD0icm91bmQiIGQ9Ik0gMjIuOTYsMTYuMDAgTCA0Mi45MSwxNi4wMCBMIDQxLjc0LDUzLjk5IEwgNjAuNTgsMTYuMDAgTCA4MC40OCwxNi4wMCBMIDgyLjY1LDUzLjk5IEwgOTguMjAsMTYuMDAgTCAxMTguMDUsMTYuMDAgTCA5OS40Niw1OC4yMSBMIDEwNS41Miw3NS42NCBMIDEyOC40Myw3Ni4xMSBMIDExMC4xNyw4OS45NiBMIDExNi44MSwxMTEuODkgTCA5OC4wMCw5OC44MCBMIDc5LjE5LDExMS44OSBMIDg1LjgzLDg5Ljk2IEwgNzcuOTcsODQuMDAgTCA2Ny41MSw4NC4wMCBMIDY1LjAxLDQxLjE5IEwgNDMuNzIsODQuMDAgTCAyMy4xMiw4NC4wMCBMIDIyLjk2LDE2LjAwIFoiIC8+PC9zdmc+";
const W_STAR_MASK = `url('data:image/svg+xml;base64,${W_STAR_B64}')`;

export default function Preloader({ onReady }) {
  const [done, setDone] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const handleComplete = () => {
      setDone(true);
      document.body.classList.add('site-loaded');
      window.dispatchEvent(new CustomEvent('siteReady'));
      if (onReady) onReady();
      setTimeout(() => {
        setRemoved(true);
      }, 850);
    };

    // Preload critical hero assets in parallel with the 10-second timer
    const imagesToLoad = [
      '/images/ocean-drive-sunset.jpg',
      '/images/convertible-palms.jpg'
    ];

    const minTimePromise = new Promise((resolve) => setTimeout(resolve, LOAD_DURATION_MS));
    const imagesPromise = Promise.all(
      imagesToLoad.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = img.onerror = resolve;
            img.src = src;
          })
      )
    );

    Promise.all([minTimePromise, imagesPromise]).then(handleComplete);
  }, [onReady]);

  if (removed) return null;

  return (
    <div
      id="preloader"
      className={done ? 'done' : ''}
      aria-hidden="true"
    >
      <div className="w-loader-wrap">
        <div
          className="rstar-emblem-mask"
          style={{
            WebkitMaskImage: W_STAR_MASK,
            maskImage: W_STAR_MASK
          }}
        >
          <div className="rstar-beam" />
        </div>
        <div
          className="rstar-emblem-glow"
          style={{
            backgroundImage: W_STAR_MASK
          }}
        />
      </div>
    </div>
  );
}
