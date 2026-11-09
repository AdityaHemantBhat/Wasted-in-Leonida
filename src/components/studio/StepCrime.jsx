import React from 'react';
import { usePoster } from '../../context/PosterContext';
import { CHARGES, STAR_HINTS } from '../../data/charges';
import { fmtMoney, levelWord } from '../../utils/formatters';

export default function StepCrime() {
  const {
    charges,
    toggleCharge,
    stars,
    setStars,
    reward,
    setReward,
    setStep,
    randomize
  } = usePoster();

  const rewardPercent = ((reward - 10000) / (1000000 - 10000)) * 100;

  return (
    <div className="step-panel active" data-panel="3">
      <div className="field">
        <div className="field-label">
          <span>Charges on file</span>
          <span className={`count ${charges.length >= 3 ? 'full' : ''}`} id="chargesCount">
            {charges.length} of 3 selected
          </span>
        </div>
        <div className="charges-grid" id="chargesGrid">
          {CHARGES.map((c) => (
            <button
              key={c}
              type="button"
              className={`charge-chip ${charges.includes(c) ? 'active' : ''}`}
              data-charge={c}
              onClick={() => toggleCharge(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="field wanted-classification-field">
        <div className="field-label">
          <span>Wanted Level Classification</span>
          <span className="threat-pill" data-level={stars} id="starsVal">
            {stars} / 6 &bull; {levelWord(stars)}
          </span>
        </div>

        <div className="threat-console">
          {/* Tactical Star Gauge Bar */}
          <div
            className="threat-gauge"
            id="starPicker"
            role="radiogroup"
            aria-label="Select criminal wanted level"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                type="button"
                className={`gauge-star-btn ${n <= stars ? 'lit' : ''}`}
                data-stars={n}
                role="radio"
                aria-checked={stars === n}
                aria-label={`${n} ${n === 1 ? 'star' : 'stars'}: ${STAR_HINTS[n]}`}
                onClick={() => setStars(n)}
              >
                <span className="star-icon-wrap">
                  <svg viewBox="0 0 100 100" aria-hidden="true">
                    <path
                      d="M50 4 L63 37 L98 37 L70 59 L80 94 L50 72 L20 94 L30 59 L2 37 L37 37 Z"
                      className="star-path"
                    />
                  </svg>
                </span>
                <span className="star-num">{n}</span>
              </button>
            ))}
          </div>

          {/* Real-time Police Dispatch Teletype */}
          <div className="dispatch-readout" data-stars={stars}>
            <div className="dispatch-hdr">
              <span className={`dispatch-beacon beacon-${stars}`}></span>
              <span className="dispatch-title">LCPD Dispatch Advisory</span>
              <span className="dispatch-code">
                {stars >= 5 ? 'CODE 99 // RED' : stars >= 3 ? 'CODE 10-33 // AMBER' : 'CODE 10-4 // CLEAR'}
              </span>
            </div>
            <p className="dispatch-chatter" id="starsHint">
              &ldquo;{STAR_HINTS[stars]}&rdquo;
            </p>
            <div className="dispatch-meta">
              <span>Prints directly on archival file</span>
              <span className="dispatch-stars-preview" aria-hidden="true">
                {'★'.repeat(stars)}{'☆'.repeat(6 - stars)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="field">
        <div className="field-label">
          <span>Bounty / reward</span>
          <span className="val" id="rewardVal">
            {fmtMoney(reward)}
          </span>
        </div>
        <input
          className="range"
          id="rewardRange"
          type="range"
          min="10000"
          max="1000000"
          value={reward}
          step="5000"
          aria-label="Reward amount"
          style={{ '--fill': `${rewardPercent}%` }}
          onChange={(e) => setReward(Number(e.target.value))}
        />
        <div className="reward-quick" id="rewardQuick">
          {[10000, 50000, 250000, 1000000].map((amt) => (
            <button
              key={amt}
              className={`chip ${reward === amt ? 'active' : ''}`}
              type="button"
              data-reward={amt}
              onClick={() => setReward(amt)}
            >
              ${amt >= 1000000 ? '1M' : amt / 1000 + 'K'}
            </button>
          ))}
        </div>
      </div>

      <div className="step-nav">
        <button
          className="btn btn-ghost"
          type="button"
          data-goto="2"
          onClick={() => setStep(2)}
        >
          Back
        </button>
        <span className="spacer"></span>
        <button
          className="btn btn-ghost"
          type="button"
          id="randomBtn"
          onClick={randomize}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
          Randomise
        </button>
      </div>
    </div>
  );
}

