import { describe, it, expect } from 'vitest';
import { calculateDropsPerMinute, calculateFlowRateMlh } from './calculator';

describe('Calculator Logic', () => {
  describe('calculateDropsPerMinute', () => {
    it('should calculate correct drops for Solute (standard 20 drops/ml)', () => {
      // 100ml en 60min => (100 * 20) / 60 = 33.33 => 33
      expect(calculateDropsPerMinute(100, 60, 'solute')).toBe(33);

      // 500ml en 240min (4h) => (500 * 20) / 240 = 41.66 => 42
      expect(calculateDropsPerMinute(500, 240, 'solute')).toBe(42);
    });

    it('should calculate correct drops for Sang (standard 15 drops/ml)', () => {
      // 350ml en 90min => (350 * 15) / 90 = 58.33 => 58
      expect(calculateDropsPerMinute(350, 90, 'sang')).toBe(58);
    });

    it('should handle zero duration gracefully', () => {
      expect(calculateDropsPerMinute(100, 0, 'solute')).toBe(0);
    });
  });

  describe('calculateFlowRateMlh', () => {
    it('should calculate correct ml/h', () => {
      // 100ml en 30min => (100 / 30) * 60 = 200 ml/h
      expect(calculateFlowRateMlh(100, 30)).toBe(200);

      // 1000ml en 480min (8h) => (1000 / 480) * 60 = 125 ml/h
      expect(calculateFlowRateMlh(1000, 480)).toBe(125);
    });

    it('should handle zero duration gracefully', () => {
      expect(calculateFlowRateMlh(100, 0)).toBe(0);
    });
  });
});
