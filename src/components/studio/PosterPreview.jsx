import React from 'react';
import { usePoster } from '../../context/PosterContext';
import PosterStars from './PosterStars';
import PosterStamp from './PosterStamp';
import PosterBarcode from './PosterBarcode';
import { fmtMoney, levelWord } from '../../utils/formatters';

export default function PosterPreview() {
  const {
    name,
    alias,
    seen,
    charges,
    stars,
    reward,
    filter,
    zoom,
    photo,
    photoUrl,
    photoFit,
    photoAspect,
    photoAspectRatio,
    caseNo
  } = usePoster();

  const displayName = name.trim() || 'Unknown Suspect';
  const nameLen = displayName.length;
  const nameFontSize = nameLen > 20 ? '4.6cqw' : nameLen > 14 ? '5.4cqw' : '6.4cqw';
  const displayAlias = alias.trim() ? `\u201C${alias.trim()}\u201D` : '\u201CKnown by no other name\u201D';

  const filterClass =
    filter === 'bw' ? 'f-bw' : filter === 'neon' ? 'f-neon' : '';

  // Determine frame aspect ratio
  let frameRatio = 79 / 50;
  if (photoAspect === 'portrait') {
    frameRatio = 3 / 4;
  } else if (photoAspect === 'story') {
    frameRatio = 9 / 16;
  } else if (photoAspect === 'square') {
    frameRatio = 1 / 1;
  } else if (photoAspect === 'standard') {
    frameRatio = 79 / 50;
  } else if (photoAspect === 'auto') {
    if (photoUrl && photoAspectRatio) {
      frameRatio = Math.max(0.56, Math.min(1.85, photoAspectRatio));
    } else {
      frameRatio = 79 / 50;
    }
  }

  // Sizing: ensure vertical ratios (9:16, 3:4) stay nicely proportioned and centered
  const isTall = frameRatio < 1.05;
  const photoContainerStyle = {
    aspectRatio: `${frameRatio}`,
    width: isTall ? `min(100%, ${Math.round(58 * frameRatio)}cqw)` : '100%',
    margin: isTall ? '2.4cqw auto 0' : '2.4cqw 0 0',
  };

  return (
    <div className="preview-col rv">
      <div className="studio-col-head">
        <span className="sch-title">Live Preview</span>
        <span className="sch-meta">LCPD Archival Print &middot; 1080 px</span>
      </div>

      <div className="poster-wrap" id="posterReveal">
        <article className="poster" id="poster" aria-label="Your wanted poster preview">
          <p className="poster-dept">
            Leonida County Police Department — State of Leonida
          </p>
          <h3 className="poster-wanted">Wanted</h3>
          <div className="poster-rule"></div>
          <div className="poster-stars">
            <span className="lvl">Wanted level</span>
            <PosterStars stars={stars} />
            <span className="lvl">
              <b id="posterLevelText">
                {stars} / 6 — {levelWord(stars)}
              </b>
            </span>
          </div>

          <div className="poster-photo" style={photoContainerStyle}>
            {photoUrl ? (
              <img
                id="posterImg"
                src={photoUrl}
                alt="Your uploaded mugshot on the wanted poster"
                className={filterClass}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: photoFit || 'contain',
                  objectPosition: 'center center',
                  transform: `scale(${zoom / 100})`,
                }}
              />
            ) : (
              <div className="no-photo" id="noPhoto" style={{ display: 'flex' }}>
                <svg viewBox="0 0 200 130" aria-hidden="true">
                  <circle cx="100" cy="46" r="27" fill="#45413a" />
                  <path
                    d="M100 82c-34 0-58 16-70 48h140c-12-32-36-48-70-48z"
                    fill="#45413a"
                  />
                </svg>
                <span>No photo on file</span>
              </div>
            )}
          </div>

          <p className="poster-photo-cap" id="photoCap">
            Last known photograph — {seen}, Leonida
          </p>

          <h4
            className="poster-name"
            id="posterName"
            style={{ fontSize: nameFontSize }}
          >
            {displayName}
          </h4>
          <p className="poster-alias" id="posterAlias">
            {displayAlias}
          </p>

          <div className="poster-details">
            <div className="cell">
              <div className="k">Alias</div>
              <div className="v" id="dAlias">
                {alias.trim() || '—'}
              </div>
            </div>
            <div className="cell">
              <div className="k">Last seen</div>
              <div className="v" id="dSeen">
                {seen}
              </div>
            </div>
            <div className="cell">
              <div className="k">Case no.</div>
              <div className="v" id="dCase">
                {caseNo}
              </div>
            </div>
          </div>

          <div className="poster-mid">
            <div className="poster-charges">
              <div className="k">Charges</div>
              <ol id="posterCharges">
                {charges && charges.length > 0 ? (
                  charges.map((c, i) => (
                    <li key={c}>
                      <span className="n">0{i + 1}</span>
                      {c}
                    </li>
                  ))
                ) : (
                  <li className="none">No charges filed — yet</li>
                )}
              </ol>
            </div>
            <PosterStamp />
          </div>

          <div className="poster-reward">
            <div className="rk">Reward</div>
            <div className="rv" id="posterReward">
              {fmtMoney(reward)}
            </div>
            <div className="rs">For information leading to arrest</div>
          </div>

          <div className="poster-foot">
            <PosterBarcode caseNo={caseNo} />
            <div className="meta">
              <div className="case" id="footCase">
                Case {caseNo}
              </div>
              <div className="fan">
                Fan-made poster — not an official document
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

