/**
 * Tests unitaires pour taxiFareCalculator.
 * Équivalent JavaScript de test_taxi_fare_calculator.py (unittest → Vitest)
 */

import { describe, it, expect } from 'vitest';
import { calculateFare, Zone, PRISE_EN_CHARGE, TARIF_A, TARIF_B, TARIF_C } from '../src/taxiFareCalculator';

const DISTANCE = 10.5;
const DELTA = 0.01;

function assertApprox(expected, result, delta = DELTA) {
  expect(Math.abs(expected - result)).toBeLessThanOrEqual(delta);
}

describe('TaxiFareCalculator', () => {

  // ─── Zone urbaine ────────────────────────────────────────────────────────────

  describe('Zone urbaine', () => {

    it('Tarif A : Lundi-Samedi, 10h00-17h00', () => {
      // Lundi (1), 12h → TARIF_A
      const result = calculateFare(1, 12, Zone.URBAINE, DISTANCE, false);
      assertApprox(13.73, result);
    });

    it('Tarif B : Lundi-Samedi, 17h00-10h00 (nuit)', () => {
      // Mardi (2), 18h → TARIF_B
      const result = calculateFare(2, 18, Zone.URBAINE, DISTANCE, false);
      assertApprox(16.46, result);
    });

    it('Tarif B : Lundi-Samedi, avant 10h', () => {
      // Mercredi (3), 8h → TARIF_B
      const result = calculateFare(3, 8, Zone.URBAINE, DISTANCE, false);
      assertApprox(16.46, result);
    });

    it('Tarif B : Dimanche, 07h00-24h00', () => {
      // Dimanche (0), 12h → TARIF_B
      const result = calculateFare(0, 12, Zone.URBAINE, DISTANCE, false);
      assertApprox(16.46, result);
    });

    it('Tarif B : Jour férié, 00h00-24h00', () => {
      // Lundi (1) férié, 12h → TARIF_B
      const result = calculateFare(1, 12, Zone.URBAINE, DISTANCE, true);
      assertApprox(16.46, result);
    });

    it('Tarif C : Dimanche, 00h00-07h00', () => {
      // Dimanche (0), 5h → TARIF_C
      const result = calculateFare(0, 5, Zone.URBAINE, DISTANCE, false);
      assertApprox(19.19, result);
    });

    it('Tarif C : Dimanche férié, 00h00-07h00 (dimanche prime sur férié)', () => {
      // Dimanche (0) et férié, 5h → TARIF_C (dimanche 0h-7h prime)
      const result = calculateFare(0, 5, Zone.URBAINE, DISTANCE, true);
      assertApprox(19.19, result);
    });

    it('Tarif A : exactement à 10h', () => {
      const result = calculateFare(1, 10, Zone.URBAINE, DISTANCE, false);
      assertApprox(PRISE_EN_CHARGE + TARIF_A * DISTANCE, result);
    });

    it('Tarif B : exactement à 17h (fin du Tarif A)', () => {
      // 17h est hors plage A (condition < 17)
      const result = calculateFare(1, 17, Zone.URBAINE, DISTANCE, false);
      assertApprox(PRISE_EN_CHARGE + TARIF_B * DISTANCE, result);
    });

    it('Tarif B : Samedi à 16h (dans plage A)', () => {
      const result = calculateFare(6, 16, Zone.URBAINE, DISTANCE, false);
      assertApprox(PRISE_EN_CHARGE + TARIF_A * DISTANCE, result);
    });
  });

  // ─── Zone suburbaine ─────────────────────────────────────────────────────────

  describe('Zone suburbaine', () => {

    it('Tarif B : Lundi-Samedi, 07h00-19h00', () => {
      // Mercredi (3), 12h → TARIF_B
      const result = calculateFare(3, 12, Zone.SUBURBAINE, DISTANCE, false);
      assertApprox(16.46, result);
    });

    it('Tarif C : Lundi-Samedi, 19h00-07h00 (nuit)', () => {
      // Jeudi (4), 20h → TARIF_C
      const result = calculateFare(4, 20, Zone.SUBURBAINE, DISTANCE, false);
      assertApprox(19.19, result);
    });

    it('Tarif C : Lundi-Samedi, avant 07h', () => {
      // Vendredi (5), 6h → TARIF_C
      const result = calculateFare(5, 6, Zone.SUBURBAINE, DISTANCE, false);
      assertApprox(19.19, result);
    });

    it('Tarif C : Dimanche toute la journée', () => {
      // Dimanche (0), 12h → TARIF_C
      const result = calculateFare(0, 12, Zone.SUBURBAINE, DISTANCE, false);
      assertApprox(19.19, result);
    });

    it('Tarif C : Jour férié (lundi-samedi)', () => {
      // Lundi (1) férié, 12h → TARIF_C
      const result = calculateFare(1, 12, Zone.SUBURBAINE, DISTANCE, true);
      assertApprox(19.19, result);
    });

    it('Tarif B : exactement à 7h', () => {
      const result = calculateFare(2, 7, Zone.SUBURBAINE, DISTANCE, false);
      assertApprox(PRISE_EN_CHARGE + TARIF_B * DISTANCE, result);
    });

    it('Tarif C : exactement à 19h (fin du Tarif B)', () => {
      // 19h est hors plage B (condition < 19)
      const result = calculateFare(2, 19, Zone.SUBURBAINE, DISTANCE, false);
      assertApprox(PRISE_EN_CHARGE + TARIF_C * DISTANCE, result);
    });
  });

  // ─── Hors zone ───────────────────────────────────────────────────────────────

  describe('Hors zone', () => {

    it('Tarif C : toute heure, tous jours', () => {
      // Lundi (1), 12h → TARIF_C
      const result = calculateFare(1, 12, Zone.HORS_ZONE, DISTANCE, false);
      assertApprox(19.19, result);
    });

    it('Tarif C : dimanche nuit', () => {
      const result = calculateFare(0, 3, Zone.HORS_ZONE, DISTANCE, false);
      assertApprox(PRISE_EN_CHARGE + TARIF_C * DISTANCE, result);
    });

    it('Tarif C : vendredi midi', () => {
      const result = calculateFare(5, 12, Zone.HORS_ZONE, DISTANCE, false);
      assertApprox(PRISE_EN_CHARGE + TARIF_C * DISTANCE, result);
    });

    it('Tarif C : jour férié', () => {
      const result = calculateFare(3, 14, Zone.HORS_ZONE, DISTANCE, true);
      assertApprox(PRISE_EN_CHARGE + TARIF_C * DISTANCE, result);
    });
  });

  // ─── Prise en charge ─────────────────────────────────────────────────────────

  describe('Prise en charge', () => {

    it('La prise en charge (2,60 €) est incluse même à distance 0', () => {
      const result = calculateFare(1, 12, Zone.URBAINE, 0, false);
      assertApprox(PRISE_EN_CHARGE, result);
    });

    it('La prise en charge est appliquée quelle que soit la zone', () => {
      const distanceZero = 0;
      const resultUrbaine    = calculateFare(1, 12, Zone.URBAINE,    distanceZero, false);
      const resultSuburbaine = calculateFare(1, 12, Zone.SUBURBAINE, distanceZero, false);
      const resultHorsZone   = calculateFare(1, 12, Zone.HORS_ZONE,  distanceZero, false);

      assertApprox(PRISE_EN_CHARGE, resultUrbaine);
      assertApprox(PRISE_EN_CHARGE, resultSuburbaine);
      assertApprox(PRISE_EN_CHARGE, resultHorsZone);
    });
  });

  // ─── Cas limites ─────────────────────────────────────────────────────────────

  describe('Cas limites', () => {

    it('Distance décimale (10,5 km) : calcul correct', () => {
      const result = calculateFare(1, 12, Zone.URBAINE, 10.5, false);
      // 2.60 + 1.06 * 10.5 = 13.73
      assertApprox(13.73, result);
    });

    it('Grande distance : résultat proportionnel', () => {
      const result = calculateFare(1, 12, Zone.URBAINE, 100, false);
      assertApprox(PRISE_EN_CHARGE + TARIF_A * 100, result);
    });

    it('Heure 0 en zone urbaine un lundi : Tarif B', () => {
      const result = calculateFare(1, 0, Zone.URBAINE, DISTANCE, false);
      assertApprox(PRISE_EN_CHARGE + TARIF_B * DISTANCE, result);
    });

    it('Heure 23 en zone urbaine un lundi : Tarif B', () => {
      const result = calculateFare(1, 23, Zone.URBAINE, DISTANCE, false);
      assertApprox(PRISE_EN_CHARGE + TARIF_B * DISTANCE, result);
    });
  });
});
