export type Mode = 'solute' | 'sang';

export interface AppState {
  mode: Mode;
  volIndex: number;
  durIndex: number;
  currentDrops: number;
}
