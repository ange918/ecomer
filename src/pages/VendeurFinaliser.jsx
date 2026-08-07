import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../lib/AuthContext';
import { uploadCip, saveVendorDetails, signOut } from '../utils/auth';
import { getCurrentPosition } from '../utils/geo';

// Onboarding vendeur (après connexion) : photo de CIP + localisation.
function VendeurFinaliser() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const [cipFile, setCipFile] = useState(null);
  const [cipPreview, setCipPreview] = useState('');
  const [coords, setCoords] = useState(null);
  const [locationLabel, setLocationLabel] = useState('');
  const [geoStatus, setGeoStatus] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

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

  const finish = async (e) => {
    e.preventDefault();
    setError('');
    if (!session?.user) return;
    if (!cipFile) {
      setError('Ajoutez une photo de votre CIP.');
      return;
    }
    setBusy(true);
    try {
      const cipPath = await uploadCip(session.user.id, cipFile);
      await saveVendorDetails(session.user.id, {
        cipPath,
        coords,
        locationLabel: locationLabel.trim(),
      });
      navigate('/vendeur', { replace: true });
    } catch (err) {
      setError(err.message || "Enregistrement impossible.");
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <AuthShell title="Finaliser ma boutique" subtitle="Dernière étape avant la vérification.">
      <form onSubmit={finish}>
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

          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Envoi…' : 'Terminer mon inscription'}
          </button>
        </form>

        <button type="button" className="btn btn-ghost btn-block logout" onClick={handleLogout}>
          <i className="bx bx-log-out"></i> Se déconnecter
        </button>
    </AuthShell>
  );
}

export default VendeurFinaliser;
