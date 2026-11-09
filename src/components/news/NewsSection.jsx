import React from 'react';
import { NEWS_ARTICLES } from '../../data/news';
import NewsCard from './NewsCard';

export default function NewsSection() {
  return (
    <section id="news" aria-label="Featured news">
      <div className="wrap">
        <div className="sec-head rv">
          <span className="eyebrow">Featured News</span>
          <h2>Latest from Leonida.</h2>
        </div>
        <div className="news-grid">
          {NEWS_ARTICLES.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

