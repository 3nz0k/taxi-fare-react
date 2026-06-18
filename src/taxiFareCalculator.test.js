/**
 * Tests unitaires pour taxiFareCalculator.
 */
import { describe, it, expect } from 'vitest';
import { calculateFare, Zone } from '../src/taxiFareCalculator';

describe('TaxiFareCalculator', () => {

  /**
   * Test prenant en compte la zone urbaine
   */
  describe('Zone urbaine', () => {

    it('Tarif A : Lundi-Samedi, 10h00-17h00', () => {
      // Lundi (1), 12h → TARIF_A
      const result = calculateFare(1, 12, Zone.URBAINE, 10.5, false);

      expect(result).toBeCloseTo(13.73);
    });

    it('Tarif B : Lundi-Samedi, 17h00-10h00 (nuit)', () => {
      // Mardi (2), 18h → TARIF_B
      const result = calculateFare(2, 18, Zone.URBAINE, 10.5, false); 7

      expect(result).toBeCloseTo(16.46);
    });

    it('Tarif B : Lundi-Samedi, avant 10h', () => {
      // Mercredi (3), 8h → TARIF_B
      const result = calculateFare(3, 8, Zone.URBAINE, 10.5, false);

      expect(result).toBeCloseTo(16.46);
    });

    it('Tarif B : Dimanche, 07h00-24h00', () => {
      // Dimanche (0), 12h → TARIF_B
      const result = calculateFare(0, 12, Zone.URBAINE, 10.5, false);
      expect(result).toBeCloseTo(16.46);
    });

    it('Tarif B : Jour férié, 00h00-24h00', () => {
      // Lundi (1) férié, 12h → TARIF_B
      const result = calculateFare(1, 12, Zone.URBAINE, 10.5, true);
      expect(result).toBeCloseTo(16.46);
    });

    it('Tarif C : Dimanche, 00h00-07h00', () => {
      // Dimanche (0), 5h → TARIF_C
      const result = calculateFare(0, 5, Zone.URBAINE, 10.5, false);
      expect(result).toBeCloseTo(19.19);
    });

    it('Tarif C : Dimanche férié, 00h00-07h00 (dimanche prime sur férié)', () => {
      // Dimanche (0) et férié, 5h → TARIF_C (dimanche 0h-7h prime)
      const result = calculateFare(0, 5, Zone.URBAINE, 10.5, true);
      expect(result).toBeCloseTo(19.19);
    });

    it('Tarif A : exactement à 10h', () => {
      const result = calculateFare(1, 10, Zone.URBAINE, 10.5, false);

      expect(result).toBeCloseTo(13.73);
    });

    it('Tarif B : exactement à 17h (fin du Tarif A)', () => {
      // 17h est hors plage A (condition < 17)
      const result = calculateFare(1, 17, Zone.URBAINE, 10.5, false);

      expect(result).toBeCloseTo(16.46);
    });

    it('Tarif B : Samedi à 16h (dans plage A)', () => {
      const result = calculateFare(6, 16, Zone.URBAINE, 10.5, false);

      expect(result).toBeCloseTo(13.73);
    });
  });

  /**
   * Test prenant en compte la zone sub-urbaine
   */
  describe('Zone suburbaine', () => {

    it('Tarif B : Lundi-Samedi, 07h00-19h00', () => {
      // Mercredi (3), 12h → TARIF_B
      const result = calculateFare(3, 12, Zone.SUBURBAINE, 10.5, false);
      expect(result).toBeCloseTo(16.46);
    });

    it('Tarif C : Lundi-Samedi, 19h00-07h00 (nuit)', () => {
      // Jeudi (4), 20h → TARIF_C
      const result = calculateFare(4, 20, Zone.SUBURBAINE, 10.5, false);
      expect(result).toBeCloseTo(19.19);
    });

    it('Tarif C : Lundi-Samedi, avant 07h', () => {
      // Vendredi (5), 6h → TARIF_C
      const result = calculateFare(5, 6, Zone.SUBURBAINE, 10.5, false);
      expect(result).toBeCloseTo(19.19);
    });

    it('Tarif C : Dimanche toute la journée', () => {
      // Dimanche (0), 12h → TARIF_C
      const result = calculateFare(0, 12, Zone.SUBURBAINE, 10.5, false);

      expect(result).toBeCloseTo(19.19);
    });

    it('Tarif C : Jour férié (lundi-samedi)', () => {
      // Lundi (1) férié, 12h → TARIF_C
      const result = calculateFare(1, 12, Zone.SUBURBAINE, 10.5, true);
      expect(result).toBeCloseTo(19.19);
    });

    it('Tarif B : exactement à 7h', () => {
      const result = calculateFare(2, 7, Zone.SUBURBAINE, 10.5, false);

      expect(result).toBeCloseTo(16.46);
    });

    it('Tarif C : exactement à 19h (fin du Tarif B)', () => {
      // 19h est hors plage B (condition < 19)
      const result = calculateFare(2, 19, Zone.SUBURBAINE, 10.5, false);
      expect(result).toBeCloseTo(19.19);
    });
  });

  /**
   * TODO Tests prenant en compte la "Hors Zone"
   * 
   * Attention, le jeu de test doit comporter des heures et des distances variées afin que le jeu de test soit complet.
   */
  describe('Hors Zone', () => {

    it('Tarif C : Lundi-Dimanche, 00h00-23h59', () => {
      // Mercredi (3), 12h → TARIF_C
      const result = calculateFare(3, 12, Zone.HORS_ZONE, 10.5, false);
      expect(result).toBeCloseTo(19.19);
    });

    it('Tarif C: Mardi, 6h', () => {
      const result = calculateFare(2, 6, Zone.HORS_ZONE, 13, false);
      expect(result).toBeCloseTo(23.14)
    });
  });

  /**
   * Test en prenant en compte la prise en charge
   */
  describe('Prise en charge', () => {

    it('La prise en charge (2,60 €) est incluse même à distance 0', () => {
      const result = calculateFare(1, 12, Zone.URBAINE, 0, false);

      expect(result).toBeCloseTo(2.6)
    });

    it('La prise en charge est appliquée quelle que soit la zone', () => {
      const resultUrbaine = calculateFare(1, 12, Zone.URBAINE, 0, false);
      const resultSuburbaine = calculateFare(1, 12, Zone.SUBURBAINE, 0, false);
      const resultHorsZone = calculateFare(1, 12, Zone.HORS_ZONE, 0, false);

      expect(resultUrbaine).toBeCloseTo(2.6)
      expect(resultSuburbaine).toBeCloseTo(2.6)
      expect(resultHorsZone).toBeCloseTo(2.6)
    });
  });

  /**
   * Cas limites : avec des nombres décimaux
   */
  describe('Cas limites', () => {

    it('Distance décimale (10,5 km) : calcul correct', () => {
      const result = calculateFare(1, 12, Zone.URBAINE, 10.5, false);

      expect(result).toBeCloseTo(13.73)
    });

    it('Grande distance', () => {
      const result = calculateFare(1, 12, Zone.URBAINE, 100, false);

      expect(result).toBeCloseTo(108.6)
    });

    it('Heure 0 en zone urbaine un lundi : Tarif B', () => {
      const result = calculateFare(1, 0, Zone.URBAINE, 10.5, false);
      expect(result).toBeCloseTo(16.46)
    });

    it('Heure 23 en zone urbaine un lundi : Tarif B', () => {
      const result = calculateFare(1, 23, Zone.URBAINE, 10.5, false);

      expect(result).toBeCloseTo(16.46)
    });
  });
});