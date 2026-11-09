import React from 'react';
import { usePoster } from '../../context/PosterContext';
import StepTabs from './StepTabs';
import StepPhoto from './StepPhoto';
import StepIdentity from './StepIdentity';
import StepCrime from './StepCrime';
import PosterPreview from './PosterPreview';

export default function Studio() {
  const { step, downloadPoster, isDownloading, saveToWall } = usePoster();

  return (
    <section id="studio" aria-label="Poster studio">
      <div className="studio-bg" aria-hidden="true">
        <img
          id="studioBg"
          src="/images/sunset-palms.jpg"
          width="1200"
          height="797"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div className="studio-shade"></div>
      </div>
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">The Poster Studio</span>
          <h2>Print your file.</h2>
          <p>
            Three steps. The poster is live — every change prints instantly, and nothing is uploaded anywhere. Your photo never leaves this device.
          </p>
        </div>

        <div className="studio-grid">
          <div className="controls-col rv">
            <div className="studio-col-head">
              <span className="sch-title">Poster Workbench</span>
              <span className="sch-meta">
                Step <b>0{step}</b> / 03
              </span>
            </div>

            <div className="controls">
              <StepTabs />

              {step === 1 && <StepPhoto />}
              {step === 2 && <StepIdentity />}
              {step === 3 && <StepCrime />}

              <div className="studio-actions">
                <button
                  className="btn btn-pink"
                  type="button"
                  id="downloadBtn"
                  disabled={isDownloading}
                  onClick={downloadPoster}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 4v12m0 0l-5-5m5 5l5-5" />
                    <path d="M4 20h16" />
                  </svg>
                  {isDownloading ? 'Exporting poster…' : 'Download poster — PNG'}
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  id="pinToWallBtn"
                  onClick={saveToWall}
                  title="Pin this suspect to the Wanted Wall below"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="12" y1="17" x2="12" y2="22" />
                    <path d="M5 17h14v-2l-2-2V7a5 5 0 0 0-10 0v6l-2 2v2z" />
                    <circle cx="12" cy="4" r="1.5" />
                  </svg>
                  Pin to Wanted Wall
                </button>
              </div>
              <p className="field-hint" style={{ marginTop: '12px' }}>
                Exports at 1080px wide, print-sharp. Processed on this device only — there is no server.
              </p>
            </div>
          </div>

          <PosterPreview />
        </div>
      </div>
    </section>
  );
}

