import React, { useRef, useState } from 'react';
import { usePoster } from '../../context/PosterContext';

export default function StepPhoto() {
  const {
    photo,
    photoName,
    handlePhotoUpload,
    removePhoto,
    filter,
    setFilter,
    zoom,
    setZoom,
    photoFit,
    setPhotoFit,
    photoAspect,
    setPhotoAspect,
    setStep
  } = usePoster();

  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handlePhotoUpload(file);
  };

  const zoomPercent = ((zoom - 50) / (200 - 50)) * 100;

  return (
    <div className="step-panel active" data-panel="1">
      <div className="field">
        <div className="field-label">
          <span>Mugshot photograph</span>
        </div>
        <div
          className={`dropzone ${photo ? 'has-photo' : ''} ${isDragOver ? 'drag' : ''}`}
          id="dropzone"
          role="button"
          tabIndex={0}
          aria-label="Upload a photo for your poster"
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={handleDrop}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 16V4m0 0L7 9m5-5l5 5" />
            <path d="M4 20h16" />
          </svg>
          <strong id="dzTitle">
            {photo ? photoName : 'Drop your photo, or click to choose.'}
          </strong>
          <span id="dzSub">
            {photo
              ? 'On your poster — click to replace'
              : 'PNG, JPG or WebP · Stays on your device'}
          </span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          id="fileInput"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handlePhotoUpload(e.target.files[0]);
              e.target.value = '';
            }
          }}
        />
        <div className={`photo-actions ${photo ? 'show' : ''}`} id="photoActions">
          <button
            className="btn btn-ghost btn-sm"
            id="removePhoto"
            type="button"
            onClick={removePhoto}
          >
            Remove photo
          </button>
        </div>
      </div>

      {photo && (
        <>
          {/* Photo Fit Mode (Contain vs Cover) */}
          <div className="field">
            <div className="field-label">
              <span>Photo display framing</span>
              <span className="req">
                {photoFit === 'contain' ? 'Full photo visible (no cuts)' : 'Filled frame (cropped)'}
              </span>
            </div>
            <div className="segmented" role="radiogroup" aria-label="Photo fit mode">
              <button
                className={photoFit === 'contain' ? 'active' : ''}
                type="button"
                onClick={() => setPhotoFit('contain')}
              >
                Fit full photo
              </button>
              <button
                className={photoFit === 'cover' ? 'active' : ''}
                type="button"
                onClick={() => setPhotoFit('cover')}
              >
                Fill frame
              </button>
            </div>
          </div>

          {/* Frame Aspect Ratio */}
          <div className="field">
            <div className="field-label">
              <span>Poster photo frame ratio</span>
            </div>
            <div className="segmented" role="radiogroup" aria-label="Frame ratio">
              <button
                className={photoAspect === 'auto' ? 'active' : ''}
                type="button"
                onClick={() => setPhotoAspect('auto')}
                title="Automatically adapt frame to match your photo's proportions"
              >
                Auto (Image)
              </button>
              <button
                className={photoAspect === 'portrait' ? 'active' : ''}
                type="button"
                onClick={() => setPhotoAspect('portrait')}
                title="Classic 3:4 portrait mugshot ratio"
              >
                Portrait (3:4)
              </button>
              <button
                className={photoAspect === 'standard' ? 'active' : ''}
                type="button"
                onClick={() => setPhotoAspect('standard')}
                title="Standard wide ratio (79:50)"
              >
                Standard
              </button>
              <button
                className={photoAspect === 'story' ? 'active' : ''}
                type="button"
                onClick={() => setPhotoAspect('story')}
                title="Vertical phone ratio (9:16)"
              >
                9:16
              </button>
              <button
                className={photoAspect === 'square' ? 'active' : ''}
                type="button"
                onClick={() => setPhotoAspect('square')}
                title="1:1 square ratio"
              >
                1:1
              </button>
            </div>
          </div>
        </>
      )}

      {/* Look & Colour Grading */}
      <div className="field">
        <div className="field-label">
          <span>Look &amp; colour grading</span>
        </div>
        <div className="segmented" id="filterSeg" role="radiogroup" aria-label="Photo filter">
          <button
            className={filter === 'bw' ? 'active' : ''}
            type="button"
            data-filter="bw"
            onClick={() => setFilter('bw')}
          >
            Black &amp; white
          </button>
          <button
            className={filter === 'neon' ? 'active' : ''}
            type="button"
            data-filter="neon"
            onClick={() => setFilter('neon')}
          >
            Vice neon
          </button>
          <button
            className={filter === 'raw' ? 'active' : ''}
            type="button"
            data-filter="raw"
            onClick={() => setFilter('raw')}
          >
            Raw colour
          </button>
        </div>
      </div>

      {/* Scale Mugshot */}
      <div className="field">
        <div className="field-label">
          <span>Scale mugshot</span>
          <span className="val" id="zoomVal">
            {zoom}%
          </span>
        </div>
        <input
          className="range"
          id="zoomRange"
          type="range"
          min="50"
          max="200"
          value={zoom}
          aria-label="Photo zoom"
          style={{ '--fill': `${zoomPercent}%` }}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
      </div>

      <div className="step-nav">
        <span className="spacer"></span>
        <button
          className="btn btn-pink"
          type="button"
          data-goto="2"
          onClick={() => setStep(2)}
        >
          Next: Identity &rarr;
        </button>
      </div>
    </div>
  );
}
