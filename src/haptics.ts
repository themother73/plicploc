import { WebHaptics } from 'web-haptics';

const haptics = new WebHaptics();

export const Haptics = {
  /**
   * Retour haptique léger pour les interactions mineures (boutons +/-)
   */
  light: () => {
    haptics.trigger([{ duration: 15 }], { intensity: 0.8 });
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
