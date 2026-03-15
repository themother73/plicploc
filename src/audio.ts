import { Haptics } from './haptics';

/**
 * Gère le son et le timing du métronome.
 */
export class MetronomeEngine {
  private audioCtx: AudioContext | null = null;
  private intervalId: number | null = null;
  private onTick: () => void;

  constructor(onTick: () => void) {
    this.onTick = onTick;
  }

  /**
   * Initialise ou reprend le contexte audio.
   * Doit être appelé suite à une interaction utilisateur.
   */
  public async initAudio() {
    if (!this.audioCtx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
  }

  private playBeep() {
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.value = 880;

    const now = this.audioCtx.currentTime;
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  public start(dropsPerMinute: number) {
    this.stop(); // Sécurité

    if (dropsPerMinute <= 0) return;

    const intervalMs = (60 / dropsPerMinute) * 1000;

    // Premier tick immédiat
    this.tick();

    // Lancement de l'intervalle
    this.intervalId = window.setInterval(() => {
      this.tick();
    }, intervalMs);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick() {
    this.playBeep();
    this.onTick();
    // Vibration via web-haptics (iOS support)
    Haptics.tick();
  }
}
