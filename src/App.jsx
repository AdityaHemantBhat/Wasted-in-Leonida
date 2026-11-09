import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { PosterProvider } from './context/PosterContext';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import Preloader from './components/ui/Preloader';
import Toast from './components/ui/Toast';
import Chrome from './components/chrome/Chrome';
import Hero from './components/hero/Hero';
import Story from './components/story/Story';
import Statement from './components/statement/Statement';
import LinksGrid from './components/links/LinksGrid';
import Studio from './components/studio/Studio';
import WantedWall from './components/wall/WantedWall';
import NewsSection from './components/news/NewsSection';
import Footer from './components/footer/Footer';

function MainLayout() {
  useScrollAnimations();

  return (
    <>
      <Preloader />
      <Chrome />
      <main>
        <Hero />
        <Story />
        <Statement />
        <LinksGrid />
        <Studio />
        <WantedWall />
        <NewsSection />
      </main>
      <Footer />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <PosterProvider>
      <MainLayout />
      <Analytics />
    </PosterProvider>
  );
}

