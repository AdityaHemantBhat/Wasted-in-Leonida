import React from 'react';
import StoryMedia from './StoryMedia';
import StoryCards from './StoryCards';
import RegionsStage from './RegionsStage';

export default function Story() {
  return (
    <section className="story" id="story" aria-label="The story">
      <StoryMedia />
      <StoryCards />
      <RegionsStage />
    </section>
  );
}

