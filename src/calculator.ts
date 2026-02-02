export type Mode = 'solute' | 'sang';

export const DROPS_PER_ML_SOLUTE = 20;
export const DROPS_PER_ML_SANG = 15;

/**
 * Calcule le débit en gouttes par minute.
 * @param volumeMl Volume en ml
 * @param durationMin Durée en minutes
 * @param mode Mode 'solute' (20 gttes/ml) ou 'sang' (15 gttes/ml)
 * @returns Le nombre de gouttes par minute (arrondi à l'entier le plus proche)
 */
export function calculateDropsPerMinute(volumeMl: number, durationMin: number, mode: Mode): number {
  if (durationMin <= 0) return 0; // Éviter division par zéro
  const factor = mode === 'sang' ? DROPS_PER_ML_SANG : DROPS_PER_ML_SOLUTE;
  return Math.round((volumeMl * factor) / durationMin);
}

/**
 * Calcule le débit en ml par heure.
 * @param volumeMl Volume en ml
 * @param durationMin Durée en minutes
 * @returns Le débit en ml/h (arrondi à l'entier le plus proche)
 */
export function calculateFlowRateMlh(volumeMl: number, durationMin: number): number {
  if (durationMin <= 0) return 0;
  return Math.round((volumeMl / durationMin) * 60);
}
