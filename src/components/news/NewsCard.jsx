import React from 'react';

export default function NewsCard({ article }) {
  const isExternal = article.href && article.href.startsWith('http');
  return (
    <a
      className="news-card rv"
      href={article.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      <div className="nc-img">
        <img
          src={article.image}
          width={2000}
          height={1300}
          alt={article.alt}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="nc-body">
        <span className="nc-date">{article.date}</span>
        <h3>{article.title}</h3>
        <p>{article.snippet}</p>
      </div>
    </a>
  );
}

