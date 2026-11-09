import React from 'react';
import { REGIONS } from '../../data/regions';

export default function RegionsStage() {
  return (
    <div className="pin-stage" id="regions">
      <div className="pin-bg" aria-hidden="true">
        <img
          id="pinBgImg"
          src="/images/leonida-map-landscape.jpg"
          width="1920"
          height="1079"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div className="pin-shade"></div>
      </div>
      <div className="stack-cards">
        <article className="big-card sunset rv-card">
          <img
            className="card-palms"
            src="/images/sunset-palms.jpg"
            width="1200"
            height="797"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
          <span className="eyebrow">The Poster Studio</span>
          <h3>
            Become
            <br />
            Wanted
          </h3>
          <p className="lede">
            Skip the cutscene. Put your own face on the file — your photo, your charges, your six stars — typeset like a real LCPD archival print and exported in true HD.
          </p>
          <div className="bc-actions">
            <a className="btn btn-cream" href="#studio">
              Make your poster
            </a>
            <a className="btn btn-ghost" href="#wall">
              See the Wanted Wall
            </a>
          </div>
        </article>

        <article className="big-card neon rv-card">
          <span className="eyebrow">The State</span>
          <h3>
            Only in
            <br />
            Leonida
          </h3>
          <p className="lede">
            Six regions. Six tempers. Every one of them will be your last known location sooner or later.
          </p>
          <div className="region-grid">
            {REGIONS.map((r) => (
              <div key={r.name} className="region">
                <h4>{r.name}</h4>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

