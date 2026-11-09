export function getCaseNumber(name, alias) {
  const s = ((name || "") + "|" + (alias || "")).toUpperCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h * 31) + s.charCodeAt(i)) >>> 0;
  }
  const digits = String(100000 + (h % 900000));
  return "LCPD-2026-" + digits;
}

export function generateBarcodeLines(seedStr) {
  let seed = 7;
  for (let i = 0; i < seedStr.length; i++) {
    seed = ((seed * 31) + seedStr.charCodeAt(i)) >>> 0;
  }
  function rnd() {
    seed = ((seed * 1103515245) + 12345) >>> 0;
    return seed / 4294967296;
  }
  const bars = [];
  let x = 0;
  while (x < 105) {
    const w = 1 + Math.floor(rnd() * 3.4);
    const gap = 1 + Math.floor(rnd() * 2.6);
    bars.push({ width: w, isSpace: false });
    bars.push({ width: gap, isSpace: true });
    x += w + gap;
  }
  return bars;
}

