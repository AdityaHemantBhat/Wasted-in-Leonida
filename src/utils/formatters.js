export function fmtMoney(n) {
  if (typeof n !== 'number') n = Number(n) || 0;
  return "$" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function levelWord(stars) {
  if (stars >= 6) return "Most Wanted";
  if (stars >= 4) return "High Priority";
  if (stars >= 2) return "Wanted";
  return "Person of Interest";
}

