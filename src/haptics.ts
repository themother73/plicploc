import { WebHaptics } from 'web-haptics';

const haptics = new WebHaptics();

export const Haptics = {
  /**
   * Démarre une séquence de vibrations pour le métronome.
   * On génère un pattern long pour tout le contenu afin que Safari iOS
   * l'accepte (déclenché par une action utilisateur).
   */
  startMetronome: (dropsPerMinute: number, durationSeconds: number) => {
    const intervalMs = (60 / dropsPerMinute) * 1000;
    const totalPulses = Math.ceil((durationSeconds * 1000) / intervalMs);
    const pattern = [];

    for (let i = 0; i < totalPulses; i++) {
      if (i === 0) {
        pattern.push({ duration: 15 });
      } else {
        pattern.push({ delay: intervalMs - 15, duration: 15 });
      }
    }

    haptics.trigger(pattern, { intensity: 0.4 });
  },

  /**
   * Arrête toutes les vibrations en cours.
   */
  stop: () => {
    haptics.cancel();
  },

  /**
   * Retour haptique pour les interactions mineures (boutons +/-)
   */
  light: () => {
    haptics.trigger([{ duration: 15 }], { intensity: 0.4 });
  },

  /**
   * Retour haptique moyen pour les actions importantes (start/stop, tabs)
   */
  medium: () => {
    haptics.trigger([{ duration: 25 }], { intensity: 0.7 });
  },

  /**
   * Succès
   */
  success: () => {
    haptics.trigger('success');
  }
};
