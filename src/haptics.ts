import { trigger } from 'web-haptics';

export const Haptics = {
  /**
   * Retour haptique léger pour les interactions mineures (boutons +/-)
   */
  light: () => {
    trigger('light');
  },

  /**
   * Retour haptique moyen pour les actions importantes (start/stop, tabs)
   */
  medium: () => {
    trigger('medium');
  },

  /**
   * Retour haptique pour chaque "goutte" du métronome.
   * On utilise 'light' ou un pattern personnalisé si besoin.
   */
  tick: () => {
    trigger('light');
  },

  /**
   * Succès (ex: fin du chrono si on ajoute cette feature)
   */
  success: () => {
    trigger('success');
  }
};
