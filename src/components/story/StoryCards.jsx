import React from 'react';

const ROCKSTAR_GALLERY_URL = "https://www.rockstargames.com/VI/launch-gallery";

const CHARACTERS = [
  {
    idx: "01 — The Driver",
    name: "Jason Duval",
    desc: "Grew up around grifters and crooks. Did a stint in the Army to outrun it. It didn't take.",
    image: "/images/jason-duval.png",
    alt: "Official character portrait of Jason Duval from Grand Theft Auto VI in Leonida",
    accent: "#ff9f68",
    drift: 6,
    imgPosition: "center top",
    galleryUrl: ROCKSTAR_GALLERY_URL
  },
  {
    idx: "02 — The Runner",
    name: "Lucia Caminos",
    desc: "Her family moved from Liberty City so she could learn to fight. Prison taught her the rest.",
    image: "/images/lucia-caminos.png",
    alt: "Official character portrait of Lucia Caminos from Grand Theft Auto VI in Leonida",
    accent: "#c084fc",
    drift: -6,
    imgPosition: "center top",
    galleryUrl: ROCKSTAR_GALLERY_URL
  },
  {
    idx: "03 — The State",
    name: "Leonida",
    desc: "One highway in, one highway out. The biggest, most immersive state ever built — and it's hunting both of them.",
    image: "/images/leonida-google-map-clean.png",
    alt: "High-resolution Google Maps satellite view of the Leonida peninsula, Vice City, and Florida Keys",
    accent: "#38bdf8",
    drift: 6,
    imgPosition: "center center",
    galleryUrl: ROCKSTAR_GALLERY_URL
  }
];

export default function StoryCards() {
  return (
    <>
      <div className="poster-row" id="storyCardsRow">
        {CHARACTERS.map((char, index) => (
          <a
            key={char.name}
            href={char.galleryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="poster-card"
            data-card-idx={index}
            tabIndex={0}
            aria-label={`${char.idx}: ${char.name} — Open Rockstar Launch Gallery`}
          >
            <div className="pc-img-wrap">
              <img
                src={char.image}
                width={1400}
                height={934}
                alt={char.alt}
                data-drift={char.drift}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: char.imgPosition }}
              />
            </div>
            <div className="pc-shade"></div>
            <div className="pc-top-badge" aria-hidden="true">
              <span style={{ borderColor: `${char.accent}55`, color: char.accent }}>
                Gallery ↗
              </span>
            </div>
            <div className="pc-body">
              <span className="pc-idx" style={{ color: char.accent }}>
                {char.idx}
              </span>
              <h3>{char.name}</h3>
              <p>{char.desc}</p>
              <span className="pc-action-hint" style={{ color: char.accent }}>
                Launch Gallery <span className="arrow">&rarr;</span>
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="poster-cta-row">
        <a
          href={ROCKSTAR_GALLERY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-launch-gallery"
          aria-label="View official Grand Theft Auto VI Launch Gallery on Rockstar Games"
        >
          <span className="blg-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </span>
          <span className="blg-label">View Official GTA VI Launch Gallery</span>
          <span className="blg-sub">39 Official 4K Frames • rockstargames.com ↗</span>
        </a>
      </div>
    </>
  );
}
