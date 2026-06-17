/**
 * Calculateur de tarifs de taxi.
 *
 * Règles tarifaires :
 * - Tarif A (1,06 €/km) : Zone urbaine, Lundi-Samedi 10h-17h
 * - Tarif B (1,32 €/km) : Zone urbaine (Lun-Sam 17h-10h, Dim 7h-24h, Jours fériés),
 *                         Zone suburbaine (Lun-Sam 7h-19h)
 * - Tarif C (1,58 €/km) : Zone urbaine (Dim y compris fériés 0h-7h),
 *                         Zone suburbaine (Lun-Sam 19h-7h, Dim y compris fériés 0h-24h),
 *                         Hors zone (toujours)
 * - Prise en charge : 2,60 € pour toutes les courses
 */


/**
 * Utilisation de "Object.freeze()" pour déclarer l'enum.
 * Cette méthode permetant de créer un objet immuable (ne pouvant être modifié).
 */
export const Zone = Object.freeze({
  URBAINE: 'URBAINE',
  SUBURBAINE: 'SUBURBAINE',
  HORS_ZONE: 'HORS_ZONE',
});

export const PRISE_EN_CHARGE = 2.60;
export const TARIF_A = 1.06;
export const TARIF_B = 1.32;
export const TARIF_C = 1.58;

/**
 * Calcule le prix d'une course de taxi.
 *
 * @param {number} jourSemaine - Jour de la semaine (0 = dimanche, 1 = lundi, ..., 6 = samedi)
 * @param {number} hour        - Heure de la course (0-23)
 * @param {string} zone        - Zone de la course (Zone.URBAINE | Zone.SUBURBAINE | Zone.HORS_ZONE)
 * @param {number} distance    - Distance de la course en km
 * @param {boolean} estFerie   - True si la course a lieu un jour férié
 * @returns {number} Le prix total de la course en euros.
 */
export function calculateFare(jourSemaine, hour, zone, distance, estFerie) {
  const estDimanche = jourSemaine === 0;
  const estLundiSamedi = jourSemaine >= 1 && jourSemaine <= 6;

  let tarif;

  if (zone === Zone.URBAINE) {
    // Tarif C : dimanche (y compris fériés) entre 0h et 7h
    if (estDimanche && hour < 7) {
      tarif = TARIF_C;
    // Tarif B : jour férié (hors dimanche 0h-7h)
    } else if (estFerie) {
      tarif = TARIF_B;
    // Tarif B : dimanche de 7h à 24h
    } else if (estDimanche && hour >= 7) {
      tarif = TARIF_B;
    // Tarif A : lundi-samedi de 10h à 17h (heure strictement < 17)
    } else if (estLundiSamedi && hour >= 10 && hour < 17) {
      tarif = TARIF_A;
    // Tarif B : lundi-samedi hors 10h-17h
    } else {
      tarif = TARIF_B;
    }
  } else if (zone === Zone.SUBURBAINE) {
    // Tarif C : dimanche (y compris fériés) toute la journée
    if (estDimanche || estFerie) {
      tarif = TARIF_C;
    // Tarif B : lundi-samedi de 7h à 19h
    } else if (estLundiSamedi && hour >= 7 && hour < 19) {
      tarif = TARIF_B;
    // Tarif C : lundi-samedi de 19h à 7h
    } else {
      tarif = TARIF_C;
    }
  } else {
    // Hors zone : toujours tarif C
    tarif = TARIF_C;
  }

  return PRISE_EN_CHARGE + tarif * distance;
}
