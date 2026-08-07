import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  signUpVendor,
  verifyEmailCode,
  uploadCip,
  saveVendorDetails,
} from '../utils/auth';
import { getCurrentPosition } from '../utils/geo';

// Inscription vendeur :
//  étape 1 : infos ; étape 2 : CIP + localisation + mot de passe ;
//  puis code email → upload CIP + enregistrement → écran « en vérification ».
function DevenirVendeur() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', whatsapp: '', password: '',
  });
  const [cipFile, setCipFile] = useState(null);
  const [cipPreview, setCipPreview] = useState('');
  const [coords, setCoords] = useState(null);
  const [locationLabel, setLocationLabel] = useState('');
  const [geoStatus, setGeoStatus] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const goStep2 = (e) => {
    e.preventDefault();
    setError('');
    setStep(2);
  };

  const onCip = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCipFile(file);
    setCipPreview(URL.createObjectURL(file));
  };

  const useMyLocation = async () => {
    setGeoStatus('loading');
    try {
      setCoords(await getCurrentPosition());
      setGeoStatus('ok');
    } catch (err) {
      setGeoStatus(err.message || 'error');
    }
  };

  const createAccount = async (e) => {
    e.preventDefault();
    setError('');
    if (!cipFile) {
      setError('Ajoutez une photo de votre CIP.');
      return;
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    setBusy(true);
    try {
      await signUpVendor({
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        whatsapp: form.whatsapp.trim(),
      });
      setStep('code');
    } catch (err) {
      setError(err.message || 'Inscription impossible.');
    } finally {
      setBusy(false);
    }
  };

  const verifyAndFinish = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = await verifyEmailCode(form.email.trim(), code.trim(), 'signup');
      const userId = data.user.id;
      const cipPath = await uploadCip(userId, cipFile);
      await saveVendorDetails(userId, { cipPath, coords, locationLabel: locationLabel.trim() });
      setStep('done');
    } catch (err) {
      setError(err.message || 'Code incorrect ou envoi impossible.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <i className="bx bxs-store"></i>
        <h1>Devenir vendeur</h1>
        <p>Vendez votre gaz sur GazExpress</p>
      </div>

      <div className="auth-card">
        {step !== 'done' && step !== 'code' && (
          <ol className="wizard-steps">
            <li className={step === 1 ? 'active' : 'done'}><span>1</span>Infos</li>
            <li className={step === 2 ? 'active' : ''}><span>2</span>Boutique</li>
          </ol>
        )}

        {step === 1 && (
          <form onSubmit={goStep2}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fn">Prénom</label>
                <input id="fn" type="text" value={form.firstName} onChange={set('firstName')} required />
              </div>
              <div className="form-group">
                <label htmlFor="ln">Nom</label>
                <input id="ln" type="text" value={form.lastName} onChange={set('lastName')} required />
              </div>
            </div>
            <label htmlFor="em">Email</label>
            <input id="em" type="email" value={form.email} onChange={set('email')} required />
            <label htmlFor="wa">Numéro WhatsApp</label>
            <input id="wa" type="tel" inputMode="tel" placeholder="+229 …" value={form.whatsapp} onChange={set('whatsapp')} required />
            <button type="submit" className="btn btn-primary btn-block">Continuer</button>
            <p className="auth-switch">
              Déjà vendeur ? <Link to="/login">Se connecter</Link>
            </p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={createAccount}>
            <label>Photo de votre CIP</label>
            <label className="cip-drop">
              <input type="file" accept="image/*" capture="environment" onChange={onCip} hidden />
              {cipPreview ? (
                <img src={cipPreview} alt="Aperçu CIP" className="cip-preview" />
              ) : (
                <span><i className="bx bx-camera"></i> Prendre / choisir une photo</span>
              )}
            </label>

            <label>Localisation de la boutique</label>
            <button type="button" className="btn btn-outline btn-block" onClick={useMyLocation}>
              <i className="bx bx-current-location"></i>
              {coords ? 'Position enregistrée' : 'Utiliser ma position'}
            </button>
            {geoStatus === 'loading' && <p className="form-hint">Localisation en cours…</p>}
            {geoStatus === 'ok' && <p className="form-hint ok"><i className="bx bx-check"></i> Position GPS captée.</p>}
            {geoStatus && geoStatus !== 'loading' && geoStatus !== 'ok' && <p className="form-error">{geoStatus}</p>}
            <input
              type="text"
              placeholder="Quartier / repère (optionnel)"
              value={locationLabel}
              onChange={(e) => setLocationLabel(e.target.value)}
            />

            <label htmlFor="pw">Mot de passe</label>
            <input id="pw" type="password" placeholder="Au moins 6 caractères" value={form.password} onChange={set('password')} required />

            {error && <p className="form-error">{error}</p>}
            <div className="wizard-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>Retour</button>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? 'Création…' : 'Créer mon compte'}
              </button>
            </div>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={verifyAndFinish}>
            <p className="auth-hint">
              Un code a été envoyé à <strong>{form.email}</strong>. Saisissez-le pour finaliser.
            </p>
            <label htmlFor="code">Code reçu par email</label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
              autoFocus
            />
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Validation…' : 'Finaliser mon inscription'}
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="vendor-done">
            <i className="bx bx-check-circle"></i>
            <h2>Compte créé !</h2>
            <p>
              Votre compte vendeur est <strong>en cours de vérification</strong>. Nous
              contrôlons votre CIP et votre boutique ; vous serez notifié dès l'activation.
            </p>
            <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/vendeur', { replace: true })}>
              Voir mon statut
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DevenirVendeur;
