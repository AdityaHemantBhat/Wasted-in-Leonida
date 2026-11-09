import React, { useMemo } from 'react';
import { generateBarcodeLines } from '../../utils/caseNumber';

export default function PosterBarcode({ caseNo }) {
  const bars = useMemo(() => {
    return generateBarcodeLines(caseNo || "LCPD-2026-000000");
  }, [caseNo]);

  return (
    <div className="barcode" id="barcode" aria-hidden="true">
      {bars.map((bar, idx) => (
        <i
          key={idx}
          className={bar.isSpace ? 's' : ''}
          style={{ width: `${bar.width}px` }}
        />
      ))}
    </div>
  );
}

