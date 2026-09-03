import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getBrands,
  getContenances,
  getPrice,
  formatXOF,
} from '../utils/catalog';
import { getAddresses, getDefaultAddress, addAddress, updateAddress } from '../utils/addresses';
import { getCurrentPosition, estimateDistanceKm, computeDeliveryFee } from '../utils/geo';
import { createOrder } from '../utils/orders';
import oryxImg from '../assets/products/oryx.png';
import progazImg from '../assets/products/progaz.png';
import beninPetroImg from '../assets/products/benin-petro.png';

// Paiement à la livraison (espèces ou Mobile Money) : pas de règlement en ligne.
const STEPS = ['Produit', 'Adresse', 'Récap'];
const PAYMENT_ON_DELIVERY = 'livraison';

// Photo par marque (bouteille détourée).
const BRAND_IMAGES = {
  oryx: oryxImg,
  progaz: progazImg,
  'benin-petro': beninPetroImg,
};

function NewOrder() {
  const navigate = useNavigate();
  const brands = getBrands();

  const [step, setStep] = useState(0);
  const [brandId, setBrandId] = useState(brands[0].id);
  const [kg, setKg] = useState(getContenances(brands[0].id)[0].kg);
  const [type, setType] = useState('echange');

  const [addresses, setAddresses] = useState(() => getAddresses());
  const [addressId, setAddressId] = useState(() => getDefaultAddress()?.id ?? null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedAddress = addresses.find((a) => a.id === addressId) ?? null;

  const productPrice = getPrice(brandId, kg, type);
  const distance = estimateDistanceKm(selectedAddress?.coords);
  const deliveryFee = computeDeliveryFee(distance);
  const total = productPrice + deliveryFee;

  const canContinue =
    (step === 0 && brandId && kg && type) ||
    (step === 1 && !!selectedAddress?.coords) ||
    step === 2;

  const handleConfirm = async () => {
    setError('');
    setSubmitting(true);
    try {
      const order = await createOrder({
        brandId,
        kg,
        type,
        address: selectedAddress,
        paymentId: PAYMENT_ON_DELIVERY,
      });
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
          {/* Type d'opération : ajuste les prix affichés. */}
          <div className="type-toggle">
            <button
              type="button"
              className={`type-toggle-btn ${type === 'echange' ? 'active' : ''}`}
              onClick={() => setType('echange')}
            >
              <i className="bx bx-transfer"></i>
              <span>
                <strong>Échange</strong>
                <em>Bouteille vide → pleine</em>
              </span>
            </button>
            <button
              type="button"
              className={`type-toggle-btn ${type === 'neuf' ? 'active' : ''}`}
              onClick={() => setType('neuf')}
            >
              <i className="bx bx-purchase-tag"></i>
              <span>
                <strong>Achat neuf</strong>
                <em>Bouteille + consigne</em>
              </span>
            </button>
          </div>

          {/* Catalogue par marque : photo + quantités avec prix. */}
          <div className="brand-catalog">
            {brands.map((b) => (
              <article className="brand-block" key={b.id}>
                <header className="brand-block-head">
                  <div className="brand-block-photo">
                    <img src={BRAND_IMAGES[b.id]} alt={b.name} />
                  </div>
                  <div className="brand-block-name">
                    <span className="brand-dot" style={{ background: b.color }}></span>
                    <strong>{b.name}</strong>
                  </div>
                </header>
                <div className="qty-options">
                  {getContenances(b.id).map((c) => {
                    const price = type === 'neuf' ? c.neuf : c.echange;
                    const active = brandId === b.id && kg === c.kg;
                    return (
                      <button
                        key={c.kg}
                        type="button"
                        className={`qty-card ${active ? 'active' : ''}`}
                        onClick={() => {
                          setBrandId(b.id);
                          setKg(c.kg);
                        }}
                      >
                        {active && <i className="bx bx-check qty-check"></i>}
                        <strong>{c.kg} kg</strong>
                        <span className="qty-price">{formatXOF(price)}</span>
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
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
          onUpdated={() => setAddresses(getAddresses())}
        />
      )}

      {step === 2 && (
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
              <dd>À la livraison</dd>
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

          <p className="recap-pay-note">
            <i className="bx bx-wallet"></i> Vous payez à la livraison (espèces ou Mobile Money).
          </p>
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
        {step < 2 ? (
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

// Sous-composant : sélection / ajout d'adresse. La position GPS est obligatoire
// (nécessaire à la livraison) : pas d'adresse enregistrée sans coordonnées.
function AddressStep({ addresses, addressId, onSelect, onAdded, onUpdated }) {
  const [adding, setAdding] = useState(addresses.length === 0);
  const [label, setLabel] = useState('');
  const [details, setDetails] = useState('');
  const [coords, setCoords] = useState(null);
  const [geoStatus, setGeoStatus] = useState('');
  const [fixStatus, setFixStatus] = useState('');

  const selected = addresses.find((a) => a.id === addressId) ?? null;

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

  // Capte et attache la position GPS à une adresse déjà enregistrée sans coords.
  const captureForSelected = async () => {
    if (!selected) return;
    setFixStatus('loading');
    try {
      const pos = await getCurrentPosition();
      updateAddress(selected.id, { coords: pos });
      onUpdated?.();
      setFixStatus('ok');
    } catch (err) {
      setFixStatus(err.message || 'error');
    }
  };

  const save = (e) => {
    e.preventDefault();
    if (!coords) return; // position obligatoire
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
      <p className="form-hint">
        <i className="bx bx-info-circle"></i> La position GPS est nécessaire pour vous livrer.
      </p>

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
                {a.coords ? (
                  <small className="ok"><i className="bx bx-check"></i> Position GPS enregistrée</small>
                ) : (
                  <small className="warn"><i className="bx bx-error-circle"></i> Position GPS manquante</small>
                )}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Adresse sélectionnée sans position : la capter avant de continuer. */}
      {selected && !selected.coords && (
        <div className="geo-required">
          <p>
            <i className="bx bx-error-circle"></i> Position GPS requise pour livrer à «&nbsp;
            {selected.label}&nbsp;».
          </p>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={captureForSelected}
            disabled={fixStatus === 'loading'}
          >
            <i className="bx bx-current-location"></i>
            {fixStatus === 'loading' ? 'Localisation…' : 'Capter ma position'}
          </button>
          {fixStatus && fixStatus !== 'loading' && fixStatus !== 'ok' && (
            <p className="form-error">
              Impossible d'obtenir la position. Autorisez la localisation puis réessayez.
            </p>
          )}
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
          <button
            type="button"
            className={`btn btn-block ${coords ? 'btn-outline' : 'btn-primary'}`}
            onClick={useMyLocation}
            disabled={geoStatus === 'loading'}
          >
            <i className="bx bx-current-location"></i>
            {coords
              ? 'Position enregistrée ✓'
              : geoStatus === 'loading'
                ? 'Localisation…'
                : 'Utiliser ma position (obligatoire)'}
          </button>
          {geoStatus === 'ok' && coords && (
            <p className="form-hint ok"><i className="bx bx-check"></i> Position GPS captée.</p>
          )}
          {geoStatus && geoStatus !== 'loading' && geoStatus !== 'ok' && (
            <p className="form-error">
              Impossible d'obtenir la position. Autorisez la localisation puis réessayez.
            </p>
          )}
          <div className="wizard-actions inline">
            {addresses.length > 0 && (
              <button type="button" className="btn btn-ghost" onClick={() => setAdding(false)}>
                Annuler
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={!coords}>
              Enregistrer l'adresse
            </button>
          </div>
        </form>
      ) : (
        <button type="button" className="btn btn-block address-add" onClick={() => setAdding(true)}>
          <i className="bx bx-plus"></i> Ajouter une adresse
        </button>
      )}
    </section>
  );
}

export default NewOrder;
