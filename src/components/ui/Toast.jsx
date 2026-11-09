import React from 'react';
import { usePoster } from '../../context/PosterContext';

export default function Toast() {
  const { toastMessage } = usePoster();

  return (
    <div
      className={`toast ${toastMessage ? 'show' : ''}`}
      id="toast"
      role="status"
      aria-live="polite"
    >
      {toastMessage}
    </div>
  );
}

