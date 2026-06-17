import { useState, useRef } from 'react';
import { calculateFare, Zone } from './taxiFareCalculator';
import './App.css';

// const ZONES = [
//   { value: Zone.URBAINE, label: 'Zone urbaine' },
//   { value: Zone.SUBURBAINE, label: 'Zone suburbaine' },
//   { value: Zone.HORS_ZONE, label: 'Hors zone suburbaine' },
// ];

export default function App() {
  const [form, setForm] = useState({
    date: '',
    time: '',
    zone: Zone.URBAINE,
    distance: '',
    estFerie: false,
  });

  // Déclaration des différentes références pour récupération des informations du formulaire
  const dateRef = useRef(null);
  const ferieRef = useRef(null);
  const timeRef = useRef(null);
  const distanceRef = useRef(null);
  const zoneUrbaineRef = useRef(null);
  const zoneSuburbaineRef = useRef(null);
  const horsZoneRef = useRef(null);

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  /**
   * Sur h
   * @param {*} e 
   */
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setResult(null);
    setError('');
  }

  /**
   * Fonction qui gérera l'action utilisateur de soumission du formulaire
   * @param {*} e L'évènement à gérer
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // vérification de completion du formulaire
    if (!form.date || !form.time || !form.distance) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    const dateObj = new Date(form.date);
    const jourSemaine = dateObj.getDay();
    const hour = parseInt(form.time.split(':')[0], 10);
    const distance = parseFloat(form.distance);

    if (isNaN(distance) || distance < 0) {
      setError('La distance doit être un nombre positif.');
      return;
    }

    const fare = calculateFare(jourSemaine, hour, form.zone, distance, form.estFerie);
    setResult(Math.round(fare * 100) / 100);
  }

  return (
    <div className="container">
      <h1>Calculateur de prix de course de taxi</h1>

      <section className="prices-info">
        <h2>Tarifs en vigueur</h2>
        <p><strong>Prise en charge :</strong> 2,60 €</p>
        <p><strong>Tarif A :</strong> 1,06 €/km</p>
        <p><strong>Tarif B :</strong> 1,32 €/km</p>
        <p><strong>Tarif C :</strong> 1,58 €/km</p>
      </section>

      <form id='form' onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="date">Date :</label>
          <input
            ref={dateRef}
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <div className="checkbox">
            <input
              ref={ferieRef}
              type="checkbox"
              id="estFerie"
              name="estFerie"
              checked={form.estFerie}
              onChange={handleChange}
            />
            <label htmlFor="estFerie">Jour férié</label>
          </div>
        </div>

        <div>
          <label htmlFor="time">Heure :</label>
          <input
            ref={timeRef}
            type="time"
            id="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />
        </div>

        <fieldset>
          <legend>Zone :</legend>
          <div className="radio-group">
            <label>
              <input
                ref={zoneUrbaineRef}
                type="radio"
                name="zone"
                value="URBAINE"
                checked={form.zone === Zone.URBAINE}
                onChange={handleChange}
              />
              Urbaine
            </label>
            <label>
              <input
                ref={zoneSuburbaineRef}
                type="radio"
                name="zone"
                value="SUBURBAINE"
                checked={form.zone === Zone.SUBURBAINE}
                onChange={handleChange}
              />
              Sub-urbaine
            </label>
            <label >
              <input
                ref={horsZoneRef}
                type="radio"
                name="zone"
                value="HORS_ZONE"
                checked={form.zone === Zone.HORS_ZONE}
                onChange={handleChange}
              />
              Hors-zone
            </label>
          </div>
        </fieldset>

        <div>

          <label htmlFor="distance">Distance (en km) :</label>
          <input
            ref={distanceRef}
            type="number"
            id="distance"
            name="distance"
            value={form.distance}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
          />
        </div>

        <button type="submit">Calculer</button>
      </form>

      {error && <div className="error">{error}</div>}

      {result !== null && (
        <div id="result">Estimation : {result.toFixed(2)} €</div>
      )}
    </div>
  );
}
