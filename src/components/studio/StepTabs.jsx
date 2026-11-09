import React from 'react';
import { usePoster } from '../../context/PosterContext';

export default function StepTabs() {
  const { step, setStep } = usePoster();

  return (
    <>
      <div className="steps" role="tablist" aria-label="Poster steps">
        <button
          className={`step-tab ${step === 1 ? 'active' : ''}`}
          data-step="1"
          role="tab"
          aria-selected={step === 1}
          onClick={() => setStep(1)}
        >
          <span className="n">01</span> Photo
        </button>
        <button
          className={`step-tab ${step === 2 ? 'active' : ''}`}
          data-step="2"
          role="tab"
          aria-selected={step === 2}
          onClick={() => setStep(2)}
        >
          <span className="n">02</span> Identity
        </button>
        <button
          className={`step-tab ${step === 3 ? 'active' : ''}`}
          data-step="3"
          role="tab"
          aria-selected={step === 3}
          onClick={() => setStep(3)}
        >
          <span className="n">03</span> Crime
        </button>
      </div>
      <div className="step-progress" aria-hidden="true">
        <i
          id="stepProgressBar"
          style={{ width: `${(step / 3) * 100}%` }}
        ></i>
      </div>
    </>
  );
}

