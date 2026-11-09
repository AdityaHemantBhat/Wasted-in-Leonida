import React, { useEffect, useRef } from 'react';

const STATEMENT_TEXT = "Jason and Lucia — two people with nothing left to lose, in a state that takes everything. From Ocean Drive at sunrise to the Grassrivers at midnight, Leonida is beautiful, broke and armed. Trust is the only currency left. This November, the whole state goes wanted.";

export default function Statement() {
  const containerRef = useRef(null);
  const words = STATEMENT_TEXT.split(/\s+/);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Start when top reaches 80% of window, end when bottom reaches 55%
      const start = windowHeight * 0.8;
      const end = windowHeight * 0.55;
      const total = start - end + rect.height;
      const current = start - rect.top;
      const progress = Math.max(0, Math.min(1, current / total));

      const spans = el.querySelectorAll('.w');
      const activeCount = Math.floor(progress * spans.length);
      spans.forEach((span, i) => {
        if (i < activeCount) {
          span.classList.add('on');
        } else {
          span.classList.remove('on');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="statement" aria-label="About Leonida" ref={containerRef}>
      <span className="eyebrow">The Stakes</span>
      <p id="statementText">
        {words.map((word, i) => (
          <React.Fragment key={i}>
            <span className="w">{word}</span>
            {i < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </p>
    </section>
  );
}

