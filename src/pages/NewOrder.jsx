import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getBrands,
  getContenances,
  getPrice,
  PAYMENT_METHODS,
  formatXOF,
} from '../utils/catalog';
import { getAddresses, getDefaultAddress, addAddress } from '../utils/addresses';
import { getCurrentPosition, estimateDistanceKm, computeDeliveryFee } from '../utils/geo';
import { createOrder } from '../utils/orders';

const STEPS = ['Produit', 'Adresse', 'Paiement', 'Récap'];

function NewOrder() {
  const navigate = useNavigate();
  const brands = getBrands();

  const [step, setStep] = useState(0);
  const [brandId, setBrandId] = useState(brands[0].id);
  const [kg, setKg] = useState(getContenances(brands[0].id)[0].kg);
  const [type, setType] = useState('echange');

  const [addresses, setAddresses] = useState(() => getAddresses());
  const [addressId, setAddressId] = useState(() => getDefaultAddress()?.id ?? null);

  const [paymentId, setPaymentId] = useState(PAYMENT_METHODS[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const contenances = useMemo(() => getContenances(brandId), [brandId]);
  const selectedAddress = addresses.find((a) => a.id === addressId) ?? null;

  const productPrice = getPrice(brandId, kg, type);
  const distance = estimateDistanceKm(selectedAddress?.coords);
  const deliveryFee = computeDeliveryFee(distance);
  const total = productPrice + deliveryFee;

  // Réaligner la contenance si elle n'existe pas pour la nouvelle marque.
  const handleBrandChange = (id) => {
    setBrandId(id);
    const options = getContenances(id);
    if (!options.some((c) => c.kg === kg)) {
      setKg(options[0].kg);
    }
  };

  const canContinue =
    (step === 0 && brandId && kg && type) ||
    (step === 1 && !!selectedAddress) ||
    (step === 2 && !!paymentId) ||
    step === 3;

  const handleConfirm = async () => {
    setError('');
    setSubmitting(true);
    try {
      const order = await createOrder({ brandId, kg, type, address: selectedAddress, paymentId });
      navigate(`/suivi/${order.id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Commande impossible. Réessayez.');
      setSubmitting(false);
    }
  };

  return (
    <div className="page new-order">
      <h1 className="page-title">Nouvelle commande</h1>

      <ol className="wizard-steps">
        {STEPS.map((label, i) => (
          <li key={label} className={i === step ? 'active' : i < step ? 'done' : ''}>
            <span>{i + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section className="wizard-panel">
          <h2>Marque</h2>
          <div className="brand-grid">
            {brands.map((b) => (
              <button
                key={b.id}
                type="button"
                className={`brand-chip ${brandId === b.id ? 'active' : ''}`}
                onClick={() => handleBrandChange(b.id)}
              >
                <span className="brand-dot" style={{ background: b.color }}></span>
                {b.name}
              </button>
            ))}
          </div>

          <h2>Contenance</h2>
          <div className="option-row">
            {contenances.map((c) => (
              <button
                key={c.kg}
                type="button"
                className={`pill ${kg === c.kg ? 'active' : ''}`}
                onClick={() => setKg(c.kg)}
              >
                {c.kg} kg
              </button>
            ))}
          </div>

          <h2>Type d'opération</h2>
          <div className="type-cards">
            <button
              type="button"
              className={`type-card ${type === 'echange' ? 'active' : ''}`}
              onClick={() => setType('echange')}
            >
              <i className="bx bx-transfer"></i>
              <strong>Échange</strong>
              <span>Bouteille vide reprise contre une pleine</span>
              <em>{formatXOF(getPrice(brandId, kg, 'echange'))}</em>
            </button>
            <button
              type="button"
              className={`type-card ${type === 'neuf' ? 'active' : ''}`}
              onClick={() => setType('neuf')}
            >
              <i className="bx bx-purchase-tag"></i>
              <strong>Achat neuf</strong>
              <span>Bouteille pleine + consigne</span>
              <em>{formatXOF(getPrice(brandId, kg, 'neuf'))}</em>
            </button>
          </div>
        </section>
      )}

      {step === 1 && (
        <AddressStep
          addresses={addresses}
          addressId={addressId}
          onSelect={setAddressId}
          onAdded={(entry) => {
            setAddresses(getAddresses());
            setAddressId(entry.id);
          }}
        />
      )}

      {step === 2 && (
        <section className="wizard-panel">
          <h2>Mode de paiement</h2>
          <div className="payment-list">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`payment-option ${paymentId === m.id ? 'active' : ''}`}
                onClick={() => setPaymentId(m.id)}
              >
                <i className={`bx ${m.icon}`}></i>
                <span>{m.name}</span>
                {paymentId === m.id && <i className="bx bx-check check"></i>}
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="wizard-panel recap">
          <h2>Récapitulatif</h2>
          <dl className="recap-list">
            <div>
              <dt>Produit</dt>
              <dd>
                {brands.find((b) => b.id === brandId)?.name} {kg} kg ·{' '}
                {type === 'neuf' ? 'Achat neuf' : 'Échange'}
              </dd>
            </div>
            <div>
              <dt>Adresse</dt>
              <dd>
                {selectedAddress?.label}
                {selectedAddress?.details ? ` — ${selectedAddress.details}` : ''}
              </dd>
            </div>
            <div>
              <dt>Paiement</dt>
              <dd>{PAYMENT_METHODS.find((m) => m.id === paymentId)?.name}</dd>
            </div>
          </dl>

          <div className="recap-amounts">
            <div>
              <span>Gaz</span>
              <span>{formatXOF(productPrice)}</span>
            </div>
            <div>
              <span>Livraison (~{Math.round(distance)} km)</span>
              <span>{formatXOF(deliveryFee)}</span>
            </div>
            <div className="recap-total">
              <span>Total</span>
              <span>{formatXOF(total)}</span>
            </div>
          </div>
        </section>
      )}

      <div className="wizard-actions">
        {step > 0 && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setStep((s) => s - 1)}
          >
            Retour
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={!canContinue}
            onClick={() => setStep((s) => s + 1)}
          >
            Continuer
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            disabled={submitting}
            onClick={handleConfirm}
          >
            {submitting ? 'Envoi…' : 'Confirmer la commande'}
          </button>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

// Sous-composant : sélection / ajout d'adresse (avec géolocalisation navigateur).
function AddressStep({ addresses, addressId, onSelect, onAdded }) {
  const [adding, setAdding] = useState(addresses.length === 0);
  const [label, setLabel] = useState('');
  const [details, setDetails] = useState('');
  const [coords, setCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState('');

  const useMyLocation = async () => {
    setGeoStatus('loading');
    try {
      const pos = await getCurrentPosition();
      setCoords(pos);
      setGeoStatus('ok');
    } catch (err) {
      setGeoStatus(err.message || 'error');
    }
  };

  const save = (e) => {
    e.preventDefault();
    if (!label.trim() && !details.trim()) return;
    const entry = addAddress({
      label: label.trim() || 'Domicile',
      details: details.trim(),
      coords,
    });
    onAdded(entry);
    setAdding(false);
    setLabel('');
    setDetails('');
    setCoords(null);
    setGeoStatus('');
  };

  return (
    <section className="wizard-panel">
      <h2>Adresse de livraison</h2>

      {addresses.length > 0 && (
        <div className="address-list">
          {addresses.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`address-option ${addressId === a.id ? 'active' : ''}`}
              onClick={() => onSelect(a.id)}
            >
              <i className="bx bx-map"></i>
              <span>
                <strong>{a.label}</strong>
                {a.details && <em>{a.details}</em>}
                {a.coords && <small>Position GPS enregistrée</small>}
              </span>
            </button>
          ))}
        </div>
      )}

      {adding ? (
        <form className="address-form" onSubmit={save}>
          <label htmlFor="addr-label">Nom de l'adresse</label>
          <input
            id="addr-label"
            type="text"
            placeholder="Domicile, Bureau…"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <label htmlFor="addr-details">Précisions</label>
          <input
            id="addr-details"
            type="text"
            placeholder="Quartier, rue, repère…"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <button type="button" className="btn btn-outline btn-block" onClick={useMyLocation}>
            <i className="bx bx-current-location"></i>
            {coords ? 'Position enregistrée' : 'Utiliser ma position'}
          </button>
          {geoStatus === 'loading' && <p className="form-hint">Localisation en cours…</p>}
          {geoStatus === 'ok' && (
            <p className="form-hint ok">
              <i className="bx bx-check"></i> Position GPS captée.
            </p>
          )}
          {geoStatus && geoStatus !== 'loading' && geoStatus !== 'ok' && (
            <p className="form-error">{geoStatus}</p>
          )}
          <div className="wizard-actions inline">
            {addresses.length > 0 && (
              <button type="button" className="btn btn-ghost" onClick={() => setAdding(false)}>
                Annuler
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              Enregistrer l'adresse
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="btn btn-outline btn-block" onClick={() => setAdding(true)}>
          <i className="bx bx-plus"></i> Ajouter une adresse
        </button>
      )}
    </section>
  );
}

export default NewOrder;
