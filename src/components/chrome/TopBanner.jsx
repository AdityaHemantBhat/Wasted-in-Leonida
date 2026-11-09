import React from 'react';

export default function TopBanner() {
  return (
    <div className="top-banner" aria-hidden="true">
      <svg className="palm left" viewBox="0 0 100 110" fill="currentColor" aria-hidden="true">
        <path d="M47 110c-1-26 0-48 4-68l5 1c-3 19-4 41-3 67h-6zM52 44C41 28 25 20 8 22c14 4 28 12 40 24l4-2zM53 42c3-17 14-29 30-35C72 16 62 27 57 42h-4zM54 46c14-8 29-9 42-3-13 2-26 6-38 12l-4-9zM50 47C37 40 21 40 8 46c13 1 26 4 38 10l4-9zM55 52c12-2 24 1 33 8-11-1-22-1-32-2l-1-6z"/>
      </svg>
      <span className="tb-text">Pre-Load Begins November 10</span>
      <svg className="palm right" viewBox="0 0 100 110" fill="currentColor" aria-hidden="true">
        <path d="M47 110c-1-26 0-48 4-68l5 1c-3 19-4 41-3 67h-6zM52 44C41 28 25 20 8 22c14 4 28 12 40 24l4-2zM53 42c3-17 14-29 30-35C72 16 62 27 57 42h-4zM54 46c14-8 29-9 42-3-13 2-26 6-38 12l-4-9zM50 47C37 40 21 40 8 46c13 1 26 4 38 10l4-9zM55 52c12-2 24 1 33 8-11-1-22-1-32-2l-1-6z"/>
      </svg>
    </div>
  );
}

