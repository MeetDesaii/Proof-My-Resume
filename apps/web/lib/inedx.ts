export function fmtRef(ms: number) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;

  // Examples you gave:
  //  - 40 sec
  //  - 1 min 24 sec
  if (m === 0) return `${s} sec`;
  return `${m} min ${s} sec`;
}
