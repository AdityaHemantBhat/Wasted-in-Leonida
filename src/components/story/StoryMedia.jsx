import React from 'react';

export default function StoryMedia() {
  return (
    <div className="story-media">
      <img
        className="bg"
        id="storyBg"
        src="/images/ocean-drive-sunset.jpg"
        width="2000"
        height="1300"
        alt="Ocean Drive, Miami Beach at sunset — palm trees and neon-lit art deco hotels under a pink sky"
        loading="lazy"
        decoding="async"
      />
      <div className="shade"></div>
      <div className="story-copy">
        <span className="eyebrow rv">The Story</span>
        <h2 className="rv">Vice City, USA.</h2>
        <p className="rv">
          Jason Duval wants an easy life, but things just keep getting harder. Lucia Caminos walked out of Leonida State Penitentiary with nothing but a plan. When a simple score goes sideways, the two of them are pulled into a conspiracy across the whole state — every mile of it watched, every road out of it closing.
        </p>
      </div>
    </div>
  );
}

