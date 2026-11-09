import React from 'react';
import { usePoster } from '../../context/PosterContext';
import { REGION_NAMES } from '../../data/regions';

export default function StepIdentity() {
  const {
    name,
    setName,
    alias,
    setAlias,
    seen,
    setSeen,
    setStep
  } = usePoster();

  return (
    <div className="step-panel active" data-panel="2">
      <div className="field">
        <div className="field-label">
          <span>Full legal name</span>
          <span className="req">Printed bold</span>
        </div>
        <input
          className="text-input"
          id="nameInput"
          type="text"
          maxLength={28}
          value={name}
          placeholder="e.g. Jason Duval"
          autoComplete="off"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="field">
        <div className="field-label">
          <span>Street alias / moniker</span>
          <span className="req">Typeset in quotes</span>
        </div>
        <input
          className="text-input"
          id="aliasInput"
          type="text"
          maxLength={32}
          value={alias}
          placeholder="e.g. The Highway Ghost"
          autoComplete="off"
          onChange={(e) => setAlias(e.target.value)}
        />
      </div>

      <div className="field">
        <div className="field-label">
          <span>Last known jurisdiction</span>
        </div>
        <select
          className="select-input"
          id="seenSelect"
          value={seen}
          onChange={(e) => setSeen(e.target.value)}
        >
          {REGION_NAMES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="step-nav">
        <button
          className="btn btn-ghost"
          type="button"
          data-goto="1"
          onClick={() => setStep(1)}
        >
          Back
        </button>
        <span className="spacer"></span>
        <button
          className="btn btn-pink"
          type="button"
          data-goto="3"
          onClick={() => setStep(3)}
        >
          Next: Crime &rarr;
        </button>
      </div>
    </div>
  );
}

