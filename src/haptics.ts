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
   * On utilise 'light' ou un pattern personnalisé si besoin.
   */
  tick: () => {
    haptics.trigger('light');
  },

  /**
   * Succès (ex: fin du chrono si on ajoute cette feature)
   */
  success: () => {
    haptics.trigger('success');
  }
};
