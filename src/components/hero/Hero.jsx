import React from 'react';
import HeroCollage from './HeroCollage';

export default function Hero() {
  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="hero-stage">
        <div className="hero-stage-aura" aria-hidden="true"></div>
        <div className="hero-stage-beam-wrap" aria-hidden="true">
          <div className="hero-shimmer-sweep"></div>
        </div>
        <HeroCollage />
        <div className="hero-lockup">
          <div className="hero-lockup-glow" aria-hidden="true"></div>
          <h1>
            <span className="row row-1">Wasted</span>
            <span className="row row-2">in Leonida</span>
          </h1>
        </div>
      </div>
      <div className="hero-dark" id="heroDark"></div>
      <div className="hero-foot">
        <div className="hero-meta left">
          <span className="k">Coming</span>
          <span className="v">November 19, 2026</span>
        </div>
        <div className="cta-cell">
          <a
            className="btn btn-peach"
            href="#studio"
          >
            Make a poster
          </a>
        </div>
        <div className="hero-meta right">
          <span className="k">Dossier</span>
          <a className="v link-subtle" href="#story">
            Read the story &rarr;
          </a>
        </div>
      </div>
      <div className="hero-scroll-cue" aria-hidden="true">
        <span className="cue-line"></span>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}
