import React from 'react';

const LINKS = [
  {
    eyebrow: "The Studio",
    title: "Make a Poster",
    desc: "Your photograph, your charges, your six stars — printed like a real LCPD archival file and exported at 1080px, straight from your browser.",
    cta: "Open the Studio",
    ctaClass: "btn pill-peach",
    href: "#studio",
    image: "/images/convertible-palms.jpg",
    alt: "Classic convertible under palm trees on Ocean Drive at sunset",
    flip: false,
    drift: 4
  },
  {
    eyebrow: "Media — Nov 5, 2026",
    title: "The Launch Gallery",
    desc: "Thirty-nine frames from the launch gallery — the convertible shot, the skyline, the coast. Check out the official Rockstar Games collection.",
    cta: "Launch Gallery ↗",
    ctaClass: "btn pill-lime",
    href: "https://www.rockstargames.com/VI/launch-gallery",
    external: true,
    image: "/images/vice-skyline-dusk.jpg",
    alt: "Miami skyline glowing purple and pink at dusk across the bay",
    flip: true,
    drift: -4
  },
  {
    eyebrow: "Regions — Nov 1, 2026",
    title: "Day 1 in Leonida",
    desc: "One highway in, one highway out. From Vice Beach to the backwater chop-shops of Port Gellhorn, know the roads before they set the roadblocks.",
    cta: "Explore the Map",
    ctaClass: "btn pill-coral",
    href: "#regions",
    image: "/images/keys-highway.jpg",
    alt: "The Overseas Highway crossing turquoise water toward the Leonida Keys",
    flip: false,
    drift: 4
  },
  {
    eyebrow: "World — Oct 28, 2026",
    title: "Only in Leonida",
    desc: "Airboats, strip-mall motels, neon diners and the loudest sky in the country. The state is a character, and it doesn't give a damn about you.",
    cta: "Read the Dossier",
    ctaClass: "btn pill-cyan",
    href: "#story",
    image: "/images/everglades-airboat.jpg",
    alt: "An airboat crossing the Everglades at sunset, lily pads stretching toward a golden horizon",
    flip: true,
    drift: -4
  }
];

export default function LinksGrid() {
  return (
    <section className="links" aria-label="Explore">
      <div className="wrap" style={{ width: 'min(1240px, calc(100% - 56px))' }}>
        {LINKS.map((link) => (
          <article
            key={link.title}
            className={`link-card ${link.flip ? 'flip' : ''} rv-card`}
          >
            <img
              className="bg"
              src={link.image}
              width={1400}
              height={934}
              alt={link.alt}
              data-drift={link.drift}
              loading="lazy"
              decoding="async"
            />
            <div className="lc-shade"></div>
            <div className="lc-body">
              <span className="eyebrow">{link.eyebrow}</span>
              <h3>{link.title}</h3>
              <p>{link.desc}</p>
              <a
                className={link.ctaClass}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
              >
                {link.cta}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

