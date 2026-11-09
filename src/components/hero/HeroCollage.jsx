import React from 'react';

export default function HeroCollage() {
  return (
    <div className="collage" aria-hidden="true">
      {/* Left Column (narrower): Overseas Highway & Miami Skyline */}
      <figure className="cp-1">
        <img
          src="/images/keys-highway.jpg"
          alt=""
          width="1400"
          height="934"
          data-drift="6"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </figure>
      <figure className="cp-5">
        <img
          src="/images/vice-skyline-dusk.jpg"
          alt=""
          width="2048"
          height="1365"
          data-drift="8"
          loading="eager"
          decoding="async"
        />
      </figure>

      {/* Center Column: Ocean Drive Sunset & Everglades Airboat */}
      <figure className="cp-2">
        <img
          src="/images/ocean-drive-sunset.jpg"
          alt=""
          width="2000"
          height="1300"
          data-drift="-8"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </figure>
      <figure className="cp-6">
        <img
          src="/images/everglades-airboat.jpg"
          alt=""
          width="1700"
          height="744"
          data-drift="-10"
          loading="eager"
          decoding="async"
        />
      </figure>

      {/* Right Column (narrower): Classic Convertible & Sunset Palms Silhouette */}
      <figure className="cp-3">
        <img
          src="/images/convertible-palms.jpg"
          alt=""
          width="1400"
          height="934"
          data-drift="10"
          loading="eager"
          decoding="async"
        />
      </figure>
      <figure className="cp-4">
        <img
          src="/images/sunset-palms.jpg"
          alt=""
          width="1200"
          height="797"
          data-drift="-6"
          loading="eager"
          decoding="async"
        />
      </figure>
    </div>
  );
}

