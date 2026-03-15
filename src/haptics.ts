import { WebHaptics } from 'web-haptics';

const haptics = new WebHaptics();

export const Haptics = {
  /**
   * Retour haptique léger pour les interactions mineures (boutons +/-)
   */
  light: () => {
    haptics.trigger('light');
  },

  /**
   * Retour haptique moyen pour les actions importantes (start/stop, tabs)
   */
  medium: () => {
    haptics.trigger('medium');
  },

  /**
   * Retour haptique pour chaque "goutte" du métronome.
   * On utilise un pattern à deux clics (ON puis OFF) pour s'assurer
   * que le switch iOS est réinitialisé pour le prochain tick.
   */
  tick: () => {
    haptics.trigger([
      { duration: 10, intensity: 1 },
      { delay: 10, duration: 10, intensity: 1 }
    ]);
  },

  /**
   * Succès (ex: fin du chrono si on ajoute cette feature)
   */
  success: () => {
    haptics.trigger('success');
  }
};
