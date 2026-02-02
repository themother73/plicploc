/**
 * Formate un volume en ml ou L.
 * @param ml Volume en millilitres
 */
export const formatVolume = (ml: number): string => {
  if (ml < 1000) return `${ml} ml`;
  const l = ml / 1000;
  return `${l % 1 === 0 ? l : l.toFixed(1).replace('.', ',')} L`;
};

/**
 * Formate une durée en minutes ou heures/minutes.
 * @param min Durée en minutes
 */
export const formatDuration = (min: number): string => {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (m === 0) return `${h} h`;
  if (m === 30) return `${h}h30`;
  return `${h}h${m}`;
};
