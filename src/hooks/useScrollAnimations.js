import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function useScrollAnimations() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'expo.out' });
    window.gsap = gsap;
    window.ScrollTrigger = ScrollTrigger;

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4
    });
    window.lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Smooth scroll for anchor clicks
    const handleAnchorClick = (e) => {
      const a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -70, duration: 1.15 });
    };
    document.addEventListener('click', handleAnchorClick);

    // Hero timeline pin
    const heroPinTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=55%',
        scrub: 1,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1
      }
    });
    heroPinTl
      .to('#heroDark', { opacity: 0.78, ease: 'none' }, 0)
      .to('.hero-stage', { scale: 0.965, ease: 'none' }, 0);

    // Parallax drifts
    gsap.utils.toArray('.collage [data-drift]').forEach((img) => {
      const d = +img.dataset.drift;
      gsap.fromTo(
        img,
        { yPercent: -d, scale: 1.18 },
        {
          yPercent: d,
          scale: 1.18,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );
    });

    // Link cards parallax drift
    gsap.utils.toArray('.link-card [data-drift]').forEach((img) => {
      const d = +img.dataset.drift;
      gsap.fromTo(
        img,
        { yPercent: -d, scale: 1.12 },
        {
          yPercent: d,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.link-card') || img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        }
      );
    });

    // Story character cards entrance from down (Rockstar Games GTA VI style)
    const storyCards = gsap.utils.toArray('.poster-card');
    if (storyCards.length) {
      const isMobile = window.innerWidth < 820;
      const startY = isMobile ? 120 : 220;

      // Set initial bottom position with subtle 3D fanning
      storyCards.forEach((card, idx) => {
        const fanAngle = isMobile ? 0 : (idx - 1) * 2.5; // -2.5deg (left), 0deg (center), +2.5deg (right)
        gsap.set(card, {
          y: startY,
          opacity: 0,
          scale: 0.9,
          rotateX: 10,
          rotateZ: fanAngle,
          transformPerspective: 1200,
          willChange: 'transform, opacity'
        });

        // Set card body text initial state
        const body = card.querySelector('.pc-body');
        if (body) {
          gsap.set(body, { y: 32, opacity: 0 });
        }
      });

      // Master entrance timeline triggered on scroll
      const cardsTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.poster-row',
          start: 'top 86%',
          toggleActions: 'play none none reverse',
        }
      });

      cardsTl
        .to(storyCards, {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          rotateZ: 0,
          duration: 1.35,
          stagger: 0.18,
          ease: 'power3.out',
          clearProps: 'transformPerspective,willChange',
        })
        .to(
          '.poster-card .pc-body',
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.18,
            ease: 'power2.out',
          },
          '-=0.9' // overlap smoothly as cards rise up
        );

      // Inner image parallax during scroll past
      storyCards.forEach((card) => {
        const img = card.querySelector('img');
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8, scale: 1.15 },
            {
              yPercent: 8,
              scale: 1.05,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2
              }
            }
          );
        }

        // Tactile hover lift on desktop
        if (!isMobile) {
          const handleMouseEnter = () => {
            gsap.to(card, {
              y: -12,
              scale: 1.025,
              duration: 0.35,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          };
          const handleMouseLeave = () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.35,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          };

          card.addEventListener('mouseenter', handleMouseEnter);
          card.addEventListener('mouseleave', handleMouseLeave);
        }
      });
    }

    gsap.fromTo(
      '#storyBg',
      { yPercent: -6 },
      {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: '.story-media',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      }
    );

    gsap.fromTo(
      '#studioBg',
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: '#studio',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      }
    );

    gsap.fromTo(
      '#wallBg',
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: '#wall',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      }
    );

    gsap.fromTo(
      '#pinBgImg',
      { scale: 1.06 },
      {
        scale: 1.16,
        ease: 'none',
        scrollTrigger: {
          trigger: '.pin-stage',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      }
    );

    // Batch reveals
    function batchReveal(selector, dur) {
      const els = gsap.utils.toArray(selector);
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y: 32, willChange: 'transform, opacity' });
      ScrollTrigger.batch(els, {
        start: 'top 85%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: dur,
            ease: 'expo.out',
            stagger: 0.1,
            overwrite: true,
            clearProps: 'will-change',
            onComplete: () => {
              gsap.set(batch, { clearProps: 'transform' });
            }
          });
        }
      });
    }

    batchReveal('.rv', 1.0);
    batchReveal('.rv-card', 1.05);
    batchReveal('.wall-grid .mini-poster', 0.95);

    // Poster reveal in studio
    gsap.set('#posterReveal', { willChange: 'transform, opacity' });
    gsap.fromTo(
      '#posterReveal',
      { opacity: 0, scale: 0.97, y: 28 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.1,
        ease: 'expo.out',
        clearProps: 'will-change,transform',
        scrollTrigger: {
          trigger: '.preview-col',
          start: 'top 85%',
          once: true
        }
      }
    );

    // Footer lockup reveal
    gsap.set('.foot-lockup .row', { willChange: 'transform, opacity' });
    gsap.fromTo(
      '.foot-lockup .row',
      { y: 32, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: 'footer',
          start: 'top 85%',
          once: true
        },
        clearProps: 'transform,opacity,will-change'
      }
    );

    // Refresh triggers after fonts and images load
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}

