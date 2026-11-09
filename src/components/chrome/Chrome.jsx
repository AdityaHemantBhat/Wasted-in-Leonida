import React, { useState, useEffect } from 'react';
import TopBanner from './TopBanner';
import Header from './Header';
import Drawer from './Drawer';

export default function Chrome() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChromeUp, setIsChromeUp] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || 0;
      const up = y > 90;
      const sc = y > 40;
      setIsChromeUp(up);
      setIsScrolled(sc);
      if (up) {
        document.body.classList.add('chrome-up');
      } else {
        document.body.classList.remove('chrome-up');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.classList.remove('chrome-up');
    };
  }, []);

  return (
    <>
      <div className={`chrome ${isChromeUp ? 'chrome-up' : ''}`}>
        <TopBanner />
        <Header
          isScrolled={isScrolled}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />
      </div>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}

