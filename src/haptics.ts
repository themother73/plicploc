import { WebHaptics } from 'web-haptics';

const haptics = new WebHaptics();

export const Haptics = {
  /**
   * Initialise les haptiques sur une interaction utilisateur.
   * Indispensable pour iOS avant de pouvoir déclencher via un intervalle.
   */
  init: () => {
    haptics.trigger([{ duration: 1 }], { intensity: 0 });
  },

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
   * On utilise le pattern simple recommandé : 15ms avec intensité 0.4.
   */
  tick: () => {
    haptics.trigger([{ duration: 15 }], { intensity: 0.4 });
  },

  /**
   * Succès (ex: fin du chrono si on ajoute cette feature)
   */
  success: () => {
    haptics.trigger('success');
  }
};
